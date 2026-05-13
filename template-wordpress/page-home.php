<?php
/*
 * Template Name: Home
 */
get_header();

$whatsapp   = get_option('imob_whatsapp');
$wpp_numero = preg_replace('/\D/', '', $whatsapp);
$wpp_link   = $wpp_numero ? 'https://wa.me/55' . $wpp_numero . '?text=' . urlencode('Olá! Vi o site e gostaria de informações sobre imóveis.') : '#';
?>

<!-- ═══ HERO ═══════════════════════════════════════════════════════════════ -->
<section class="hero">
  <?php if (has_post_thumbnail(get_the_ID())) : ?>
    <div class="hero-bg" style="background-image:url('<?php echo get_the_post_thumbnail_url(get_the_ID(), 'full'); ?>')"></div>
  <?php endif; ?>

  <div class="container">
    <div class="hero-content">
      <span class="hero-badge">Baixada Santista</span>
      <h1><?php echo esc_html(get_bloginfo('name')); ?><br>Encontre seu imóvel ideal</h1>
      <p>Apartamentos, casas e terrenos em <?php echo esc_html(get_option('imob_cidade', 'Santos')); ?> e região. Atendimento personalizado com corretores especializados.</p>

      <!-- Buscador -->
      <div class="search-box">
        <form class="search-box-grid" id="form-busca" method="get" action="<?php echo get_post_type_archive_link('imovel'); ?>">
          <div class="search-field">
            <label for="tipo">Tipo de Imóvel</label>
            <select name="tipo" id="tipo">
              <option value="">Todos</option>
              <?php
              $tipos = get_terms(['taxonomy' => 'tipo_imovel', 'hide_empty' => false]);
              foreach ($tipos as $t) {
                  echo '<option value="' . esc_attr($t->slug) . '">' . esc_html($t->name) . '</option>';
              }
              ?>
            </select>
          </div>
          <div class="search-field">
            <label for="cidade">Cidade</label>
            <select name="cidade" id="cidade">
              <option value="">Todas</option>
              <?php
              $cidades = get_terms(['taxonomy' => 'cidade_imovel', 'hide_empty' => false]);
              foreach ($cidades as $c) {
                  echo '<option value="' . esc_attr($c->slug) . '">' . esc_html($c->name) . '</option>';
              }
              ?>
            </select>
          </div>
          <div class="search-field">
            <label for="preco_max">Valor máximo</label>
            <select name="preco_max" id="preco_max">
              <option value="">Qualquer</option>
              <option value="200000">Até R$ 200 mil</option>
              <option value="300000">Até R$ 300 mil</option>
              <option value="400000">Até R$ 400 mil</option>
              <option value="500000">Até R$ 500 mil</option>
              <option value="600000">Até R$ 600 mil</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            Buscar
          </button>
        </form>
      </div><!-- .search-box -->
    </div><!-- .hero-content -->
  </div>
</section>

<!-- ═══ IMÓVEIS EM DESTAQUE ════════════════════════════════════════════════ -->
<section class="imoveis-section">
  <div class="container">
    <div class="section-header">
      <h2>Imóveis em Destaque</h2>
      <p>Selecionamos as melhores oportunidades para você</p>
    </div>

    <?php
    $destaques = new WP_Query([
        'post_type'      => 'imovel',
        'posts_per_page' => 6,
        'orderby'        => 'date',
        'order'          => 'DESC',
    ]);
    ?>

    <div class="imoveis-grid" id="imoveis-grid">
      <?php if ($destaques->have_posts()) : ?>
        <?php while ($destaques->have_posts()) : $destaques->the_post();
          $id         = get_the_ID();
          $preco      = get_post_meta($id, '_imovel_preco', true);
          $quartos    = get_post_meta($id, '_imovel_quartos', true);
          $vagas      = get_post_meta($id, '_imovel_vagas', true);
          $area       = get_post_meta($id, '_imovel_area', true);
          $finalidade = get_post_meta($id, '_imovel_finalidade', true) ?: 'venda';
          $cidades    = wp_get_post_terms($id, 'cidade_imovel', ['fields' => 'names']);
          $tipos      = wp_get_post_terms($id, 'tipo_imovel',   ['fields' => 'names']);
        ?>
        <a href="<?php the_permalink(); ?>" class="card-imovel">
          <div class="card-thumb">
            <?php if (has_post_thumbnail()) : ?>
              <?php the_post_thumbnail('medium_large'); ?>
            <?php else : ?>
              <img src="<?php echo get_template_directory_uri(); ?>/assets/images/placeholder.jpg" alt="Imóvel">
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
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
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
        <p style="color:var(--texto-suave);text-align:center;grid-column:1/-1;padding:3rem 0">
          Nenhum imóvel cadastrado ainda. <a href="<?php echo admin_url('post-new.php?post_type=imovel'); ?>" style="color:var(--azul-claro)">Adicionar imóvel</a>
        </p>
      <?php endif; ?>
    </div><!-- .imoveis-grid -->

    <div style="text-align:center;margin-top:2.5rem">
      <a href="<?php echo get_post_type_archive_link('imovel'); ?>" class="btn btn-outline">Ver todos os imóveis</a>
    </div>
  </div>
</section>

<!-- ═══ DIFERENCIAIS ═══════════════════════════════════════════════════════ -->
<section class="diferenciais-section" id="sobre">
  <div class="container">
    <div class="section-header">
      <h2>Por que escolher a <?php bloginfo('name'); ?>?</h2>
      <p>Expertise local e atendimento personalizado para você realizar o sonho do imóvel próprio</p>
    </div>

    <div class="diferenciais-grid">
      <div class="diferencial-item">
        <div class="diferencial-icon">
          <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
        </div>
        <h3>Atendimento Ágil</h3>
        <p>Respondemos em até 2 horas no WhatsApp. Seu tempo vale muito.</p>
      </div>
      <div class="diferencial-item">
        <div class="diferencial-icon">
          <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        <h3>Especialistas na Região</h3>
        <p>Conhecemos cada bairro da Baixada Santista. Indicamos o melhor para seu perfil.</p>
      </div>
      <div class="diferencial-item">
        <div class="diferencial-icon">
          <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
        </div>
        <h3>Segurança Jurídica</h3>
        <p>Toda documentação verificada. Corretores credenciados CRECI-SP.</p>
      </div>
      <div class="diferencial-item">
        <div class="diferencial-icon">
          <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <h3>Melhores Condições</h3>
        <p>Negociamos as melhores condições e ajudamos com financiamento bancário.</p>
      </div>
    </div>
  </div>
</section>

<!-- ═══ CTA BANNER ═════════════════════════════════════════════════════════ -->
<section class="cta-banner">
  <div class="container">
    <h2>Pronto para encontrar seu imóvel?</h2>
    <p>Fale agora com um corretor especializado na Baixada Santista</p>
    <div class="btn-group">
      <a href="<?php echo esc_url($wpp_link); ?>" class="btn btn-whatsapp" target="_blank" rel="noopener">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Falar no WhatsApp
      </a>
      <a href="<?php echo get_post_type_archive_link('imovel'); ?>" class="btn btn-outline" style="border-color:rgba(255,255,255,.6);color:#fff">
        Ver imóveis
      </a>
    </div>
  </div>
</section>

<?php get_footer(); ?>
