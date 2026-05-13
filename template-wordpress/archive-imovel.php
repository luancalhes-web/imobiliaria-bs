<?php get_header(); ?>

<main class="busca-page">
  <div class="container">

    <h1 style="margin-bottom:1.5rem">Imóveis disponíveis</h1>

    <!-- Filtros -->
    <div class="filtros-bar">
      <form class="filtros-grid" id="form-filtros" method="get">
        <div class="search-field">
          <label for="f-tipo">Tipo</label>
          <select name="tipo" id="f-tipo">
            <option value="">Todos os tipos</option>
            <?php
            $tipos = get_terms(['taxonomy' => 'tipo_imovel', 'hide_empty' => false]);
            foreach ($tipos as $t) :
              $sel = (isset($_GET['tipo']) && $_GET['tipo'] === $t->slug) ? 'selected' : '';
              echo '<option value="' . esc_attr($t->slug) . '" ' . $sel . '>' . esc_html($t->name) . '</option>';
            endforeach;
            ?>
          </select>
        </div>
        <div class="search-field">
          <label for="f-cidade">Cidade</label>
          <select name="cidade" id="f-cidade">
            <option value="">Todas as cidades</option>
            <?php
            $cidades = get_terms(['taxonomy' => 'cidade_imovel', 'hide_empty' => false]);
            foreach ($cidades as $c) :
              $sel = (isset($_GET['cidade']) && $_GET['cidade'] === $c->slug) ? 'selected' : '';
              echo '<option value="' . esc_attr($c->slug) . '" ' . $sel . '>' . esc_html($c->name) . '</option>';
            endforeach;
            ?>
          </select>
        </div>
        <div class="search-field">
          <label for="f-finalidade">Finalidade</label>
          <select name="finalidade" id="f-finalidade">
            <option value="">Venda e Aluguel</option>
            <option value="venda"   <?php selected($_GET['finalidade'] ?? '', 'venda'); ?>>Venda</option>
            <option value="aluguel" <?php selected($_GET['finalidade'] ?? '', 'aluguel'); ?>>Aluguel</option>
          </select>
        </div>
        <div class="search-field">
          <label for="f-preco">Preço máximo</label>
          <select name="preco_max" id="f-preco">
            <option value="">Qualquer valor</option>
            <?php
            $precos = [200000 => 'R$ 200 mil', 300000 => 'R$ 300 mil', 400000 => 'R$ 400 mil', 500000 => 'R$ 500 mil', 600000 => 'R$ 600 mil'];
            foreach ($precos as $val => $label) :
              $sel = (isset($_GET['preco_max']) && intval($_GET['preco_max']) === $val) ? 'selected' : '';
              echo '<option value="' . $val . '" ' . $sel . '>Até ' . $label . '</option>';
            endforeach;
            ?>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          Filtrar
        </button>
      </form>
    </div><!-- .filtros-bar -->

    <?php
    // Monta query com filtros GET
    $args = [
        'post_type'      => 'imovel',
        'posts_per_page' => 12,
        'paged'          => get_query_var('paged', 1),
    ];

    $tax_query = [];
    if (!empty($_GET['tipo'])) {
        $tax_query[] = ['taxonomy' => 'tipo_imovel', 'field' => 'slug', 'terms' => sanitize_text_field($_GET['tipo'])];
    }
    if (!empty($_GET['cidade'])) {
        $tax_query[] = ['taxonomy' => 'cidade_imovel', 'field' => 'slug', 'terms' => sanitize_text_field($_GET['cidade'])];
    }
    if ($tax_query) $args['tax_query'] = $tax_query;

    if (!empty($_GET['finalidade'])) {
        $args['meta_query'][] = ['key' => '_imovel_finalidade', 'value' => sanitize_text_field($_GET['finalidade'])];
    }
    if (!empty($_GET['preco_max'])) {
        $args['meta_query'][] = ['key' => '_imovel_preco', 'value' => intval($_GET['preco_max']), 'compare' => '<=', 'type' => 'NUMERIC'];
    }

    $query = new WP_Query($args);
    ?>

    <!-- Cabeçalho de resultados -->
    <div class="resultados-header">
      <p class="resultados-count"><?php echo $query->found_posts; ?> imóvel(is) encontrado(s)</p>
    </div>

    <!-- Grid -->
    <div class="imoveis-grid">
      <?php if ($query->have_posts()) : ?>
        <?php while ($query->have_posts()) : $query->the_post();
          $id         = get_the_ID();
          $preco      = get_post_meta($id, '_imovel_preco',     true);
          $quartos    = get_post_meta($id, '_imovel_quartos',   true);
          $vagas      = get_post_meta($id, '_imovel_vagas',     true);
          $area       = get_post_meta($id, '_imovel_area',      true);
          $finalidade = get_post_meta($id, '_imovel_finalidade', true) ?: 'venda';
          $cidades    = wp_get_post_terms($id, 'cidade_imovel', ['fields' => 'names']);
          $tipos      = wp_get_post_terms($id, 'tipo_imovel',   ['fields' => 'names']);
        ?>
        <a href="<?php the_permalink(); ?>" class="card-imovel">
          <div class="card-thumb">
            <?php if (has_post_thumbnail()) : ?>
              <?php the_post_thumbnail('medium_large'); ?>
            <?php else : ?>
              <img src="<?php echo get_template_directory_uri(); ?>/assets/images/placeholder.jpg" alt="<?php the_title(); ?>">
            <?php endif; ?>
            <span class="card-badge <?php echo esc_attr($finalidade); ?>"><?php echo esc_html(ucfirst($finalidade)); ?></span>
          </div>
          <div class="card-body">
            <?php if ($preco) : ?>
              <p class="card-preco"><?php echo imob_formata_preco($preco); ?></p>
            <?php endif; ?>
            <h3 class="card-titulo"><?php the_title(); ?></h3>
            <p class="card-local">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <?php echo !empty($cidades) ? esc_html($cidades[0]) : '—'; ?>
              <?php echo !empty($tipos) ? ' · ' . esc_html($tipos[0]) : ''; ?>
            </p>
            <div class="card-specs">
              <?php if ($quartos) : ?>
              <span class="card-spec">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                <?php echo esc_html($quartos); ?> qts
              </span>
              <?php endif; ?>
              <?php if ($vagas) : ?>
              <span class="card-spec">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                <?php echo esc_html($vagas); ?> vaga<?php echo $vagas > 1 ? 's' : ''; ?>
              </span>
              <?php endif; ?>
              <?php if ($area) : ?>
              <span class="card-spec">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="15,3 21,3 21,9"/><polyline points="9,21 3,21 3,15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                <?php echo esc_html($area); ?> m²
              </span>
              <?php endif; ?>
            </div>
          </div>
        </a>
        <?php endwhile; wp_reset_postdata(); ?>
      <?php else : ?>
        <p style="grid-column:1/-1;text-align:center;color:var(--texto-suave);padding:4rem 0">
          Nenhum imóvel encontrado com esses filtros. <a href="<?php echo get_post_type_archive_link('imovel'); ?>" style="color:var(--azul-claro)">Ver todos</a>
        </p>
      <?php endif; ?>
    </div><!-- .imoveis-grid -->

    <!-- Paginação -->
    <?php if ($query->max_num_pages > 1) : ?>
    <div class="paginacao">
      <?php
      $paged = get_query_var('paged', 1);
      for ($p = 1; $p <= $query->max_num_pages; $p++) :
        $url = add_query_arg(array_merge($_GET, ['paged' => $p]));
      ?>
        <a href="<?php echo esc_url($url); ?>">
          <button class="<?php echo $p === $paged ? 'ativo' : ''; ?>"><?php echo $p; ?></button>
        </a>
      <?php endfor; ?>
    </div>
    <?php endif; ?>

  </div><!-- .container -->
</main>

<?php get_footer(); ?>
