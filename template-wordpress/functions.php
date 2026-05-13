<?php
// ─── Configurações do tema ────────────────────────────────────────────────────

function imob_setup() {
    load_theme_textdomain('imobiliaria-bs', get_template_directory() . '/languages');
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'comment-form', 'gallery', 'caption']);
    add_theme_support('custom-logo', [
        'height'      => 80,
        'width'       => 200,
        'flex-height' => true,
        'flex-width'  => true,
    ]);

    register_nav_menus([
        'primary' => 'Menu Principal',
        'footer'  => 'Menu Rodapé',
    ]);
}
add_action('after_setup_theme', 'imob_setup');

// ─── Enqueue de scripts e estilos ────────────────────────────────────────────

function imob_enqueue_assets() {
    wp_enqueue_style('imob-main', get_template_directory_uri() . '/assets/css/main.css', [], '1.0.0');
    wp_enqueue_script('imob-main', get_template_directory_uri() . '/assets/js/main.js', [], '1.0.0', true);

    // Passa dados do WordPress para o JS (AJAX URL, nonce)
    wp_localize_script('imob-main', 'imobAjax', [
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce'   => wp_create_nonce('imob_nonce'),
    ]);
}
add_action('wp_enqueue_scripts', 'imob_enqueue_assets');

// ─── Custom Post Type: Imóvel ─────────────────────────────────────────────────

function imob_register_post_types() {
    register_post_type('imovel', [
        'labels' => [
            'name'               => 'Imóveis',
            'singular_name'      => 'Imóvel',
            'add_new'            => 'Adicionar Imóvel',
            'add_new_item'       => 'Adicionar Novo Imóvel',
            'edit_item'          => 'Editar Imóvel',
            'new_item'           => 'Novo Imóvel',
            'view_item'          => 'Ver Imóvel',
            'search_items'       => 'Buscar Imóveis',
            'not_found'          => 'Nenhum imóvel encontrado',
        ],
        'public'       => true,
        'has_archive'  => true,
        'rewrite'      => ['slug' => 'imoveis'],
        'menu_icon'    => 'dashicons-building',
        'supports'     => ['title', 'editor', 'thumbnail', 'excerpt'],
        'show_in_rest' => true,
    ]);
}
add_action('init', 'imob_register_post_types');

// ─── Taxonomias: Tipo e Cidade ────────────────────────────────────────────────

function imob_register_taxonomies() {
    register_taxonomy('tipo_imovel', 'imovel', [
        'labels'       => ['name' => 'Tipos', 'singular_name' => 'Tipo'],
        'hierarchical' => true,
        'rewrite'      => ['slug' => 'tipo'],
        'show_in_rest' => true,
    ]);

    register_taxonomy('cidade_imovel', 'imovel', [
        'labels'       => ['name' => 'Cidades', 'singular_name' => 'Cidade'],
        'hierarchical' => true,
        'rewrite'      => ['slug' => 'cidade'],
        'show_in_rest' => true,
    ]);
}
add_action('init', 'imob_register_taxonomies');

// ─── Meta fields do imóvel (sem ACF — usa register_meta) ─────────────────────

function imob_register_meta_fields() {
    $fields = [
        '_imovel_preco'      => ['label' => 'Preço (R$)', 'type' => 'number'],
        '_imovel_area'       => ['label' => 'Área (m²)',  'type' => 'number'],
        '_imovel_quartos'    => ['label' => 'Quartos',    'type' => 'integer'],
        '_imovel_banheiros'  => ['label' => 'Banheiros',  'type' => 'integer'],
        '_imovel_vagas'      => ['label' => 'Vagas',      'type' => 'integer'],
        '_imovel_endereco'   => ['label' => 'Endereço',   'type' => 'string'],
        '_imovel_maps_url'   => ['label' => 'Google Maps embed URL', 'type' => 'string'],
        '_imovel_whatsapp'   => ['label' => 'WhatsApp (corretor)', 'type' => 'string'],
        '_imovel_codigo'     => ['label' => 'Código do Imóvel', 'type' => 'string'],
        '_imovel_finalidade' => ['label' => 'Finalidade (venda/aluguel)', 'type' => 'string'],
    ];

    foreach ($fields as $key => $config) {
        register_post_meta('imovel', $key, [
            'show_in_rest'  => true,
            'single'        => true,
            'type'          => $config['type'],
            'auth_callback' => fn() => current_user_can('edit_posts'),
        ]);
    }
}
add_action('init', 'imob_register_meta_fields');

// ─── Meta boxes no admin ──────────────────────────────────────────────────────

function imob_add_meta_boxes() {
    add_meta_box('imovel_dados', 'Dados do Imóvel', 'imob_render_meta_box', 'imovel', 'normal', 'high');
}
add_action('add_meta_boxes', 'imob_add_meta_boxes');

function imob_render_meta_box($post) {
    wp_nonce_field('imob_save_meta', 'imob_meta_nonce');
    $fields = [
        '_imovel_codigo'     => 'Código',
        '_imovel_preco'      => 'Preço (R$)',
        '_imovel_area'       => 'Área (m²)',
        '_imovel_quartos'    => 'Quartos',
        '_imovel_banheiros'  => 'Banheiros',
        '_imovel_vagas'      => 'Vagas de Garagem',
        '_imovel_finalidade' => 'Finalidade',
        '_imovel_endereco'   => 'Endereço completo',
        '_imovel_maps_url'   => 'Google Maps embed src',
        '_imovel_whatsapp'   => 'WhatsApp do Corretor',
    ];
    echo '<table class="form-table">';
    foreach ($fields as $key => $label) {
        $value = get_post_meta($post->ID, $key, true);
        $type  = ($key === '_imovel_finalidade') ? 'text' : 'text';
        printf(
            '<tr><th><label for="%s">%s</label></th><td><input type="%s" id="%s" name="%s" value="%s" class="regular-text" /></td></tr>',
            esc_attr($key), esc_html($label), $type,
            esc_attr($key), esc_attr($key), esc_attr($value)
        );
    }
    echo '</table>';
}

function imob_save_meta_box($post_id) {
    if (!isset($_POST['imob_meta_nonce']) || !wp_verify_nonce($_POST['imob_meta_nonce'], 'imob_save_meta')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    $fields = ['_imovel_codigo','_imovel_preco','_imovel_area','_imovel_quartos',
               '_imovel_banheiros','_imovel_vagas','_imovel_finalidade',
               '_imovel_endereco','_imovel_maps_url','_imovel_whatsapp'];

    foreach ($fields as $key) {
        if (isset($_POST[$key])) {
            update_post_meta($post_id, $key, sanitize_text_field($_POST[$key]));
        }
    }
}
add_action('save_post_imovel', 'imob_save_meta_box');

// ─── AJAX: busca de imóveis ───────────────────────────────────────────────────

function imob_ajax_buscar() {
    check_ajax_referer('imob_nonce', 'nonce');

    $args = [
        'post_type'      => 'imovel',
        'posts_per_page' => 12,
        'paged'          => max(1, intval($_POST['pagina'] ?? 1)),
    ];

    // Filtros por taxonomia
    $tax_query = [];
    if (!empty($_POST['tipo'])) {
        $tax_query[] = ['taxonomy' => 'tipo_imovel', 'field' => 'slug', 'terms' => sanitize_text_field($_POST['tipo'])];
    }
    if (!empty($_POST['cidade'])) {
        $tax_query[] = ['taxonomy' => 'cidade_imovel', 'field' => 'slug', 'terms' => sanitize_text_field($_POST['cidade'])];
    }
    if ($tax_query) $args['tax_query'] = $tax_query;

    // Filtro por faixa de preço
    if (!empty($_POST['preco_max'])) {
        $args['meta_query'] = [
            ['key' => '_imovel_preco', 'value' => intval($_POST['preco_max']), 'compare' => '<=', 'type' => 'NUMERIC'],
        ];
    }

    $query = new WP_Query($args);
    $imoveis = [];

    while ($query->have_posts()) {
        $query->the_post();
        $id = get_the_ID();
        $imoveis[] = [
            'id'        => $id,
            'titulo'    => get_the_title(),
            'link'      => get_permalink(),
            'thumb'     => get_the_post_thumbnail_url($id, 'medium') ?: get_template_directory_uri() . '/assets/images/placeholder.jpg',
            'preco'     => get_post_meta($id, '_imovel_preco', true),
            'area'      => get_post_meta($id, '_imovel_quartos', true),
            'quartos'   => get_post_meta($id, '_imovel_quartos', true),
            'vagas'     => get_post_meta($id, '_imovel_vagas', true),
            'cidade'    => wp_get_post_terms($id, 'cidade_imovel', ['fields' => 'names'])[0] ?? '',
            'tipo'      => wp_get_post_terms($id, 'tipo_imovel', ['fields' => 'names'])[0] ?? '',
        ];
    }
    wp_reset_postdata();

    wp_send_json_success([
        'imoveis'    => $imoveis,
        'total'      => $query->found_posts,
        'max_pagina' => $query->max_num_pages,
    ]);
}
add_action('wp_ajax_imob_buscar', 'imob_ajax_buscar');
add_action('wp_ajax_nopriv_imob_buscar', 'imob_ajax_buscar');

// ─── Helper: formata preço ────────────────────────────────────────────────────

function imob_formata_preco($valor) {
    return 'R$ ' . number_format(floatval($valor), 0, ',', '.');
}

// ─── Schema markup LocalBusiness ─────────────────────────────────────────────

function imob_schema_local_business() {
    if (!is_front_page()) return;
    $schema = [
        '@context'        => 'https://schema.org',
        '@type'           => 'RealEstateAgent',
        'name'            => get_bloginfo('name'),
        'description'     => get_bloginfo('description'),
        'url'             => home_url(),
        'telephone'       => get_option('imob_telefone', ''),
        'address'         => [
            '@type'           => 'PostalAddress',
            'addressLocality' => get_option('imob_cidade', 'Santos'),
            'addressRegion'   => 'SP',
            'addressCountry'  => 'BR',
        ],
    ];
    echo '<script type="application/ld+json">' . wp_json_encode($schema) . '</script>' . "\n";
}
add_action('wp_head', 'imob_schema_local_business');

// ─── Opções do tema no admin ──────────────────────────────────────────────────

function imob_register_settings() {
    register_setting('imob_options', 'imob_telefone');
    register_setting('imob_options', 'imob_whatsapp');
    register_setting('imob_options', 'imob_cidade');
    register_setting('imob_options', 'imob_endereco');
    register_setting('imob_options', 'imob_maps_embed');
    register_setting('imob_options', 'imob_creci');
    register_setting('imob_options', 'imob_instagram');
    register_setting('imob_options', 'imob_facebook');
}
add_action('admin_init', 'imob_register_settings');

function imob_options_page() {
    add_theme_page('Configurações da Imobiliária', 'Imobiliária', 'manage_options', 'imob-options', 'imob_render_options_page');
}
add_action('admin_menu', 'imob_options_page');

function imob_render_options_page() {
    ?>
    <div class="wrap">
        <h1>Configurações da Imobiliária</h1>
        <form method="post" action="options.php">
            <?php settings_fields('imob_options'); ?>
            <table class="form-table">
                <?php
                $opts = [
                    'imob_telefone'   => 'Telefone',
                    'imob_whatsapp'   => 'WhatsApp (com DDD, só números)',
                    'imob_cidade'     => 'Cidade principal',
                    'imob_endereco'   => 'Endereço completo',
                    'imob_creci'      => 'Número CRECI',
                    'imob_instagram'  => 'Instagram (URL)',
                    'imob_facebook'   => 'Facebook (URL)',
                ];
                foreach ($opts as $key => $label) {
                    printf(
                        '<tr><th><label for="%s">%s</label></th><td><input type="text" id="%s" name="%s" value="%s" class="regular-text" /></td></tr>',
                        $key, $label, $key, $key, esc_attr(get_option($key))
                    );
                }
                ?>
                <tr>
                    <th><label for="imob_maps_embed">Google Maps embed src</label></th>
                    <td><textarea id="imob_maps_embed" name="imob_maps_embed" class="large-text" rows="3"><?php echo esc_textarea(get_option('imob_maps_embed')); ?></textarea></td>
                </tr>
            </table>
            <?php submit_button('Salvar Configurações'); ?>
        </form>
    </div>
    <?php
}
