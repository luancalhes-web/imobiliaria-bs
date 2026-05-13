<?php get_header(); ?>

<?php while (have_posts()) : the_post();
  $id         = get_the_ID();
  $preco      = get_post_meta($id, '_imovel_preco',     true);
  $area       = get_post_meta($id, '_imovel_area',      true);
  $quartos    = get_post_meta($id, '_imovel_quartos',   true);
  $banheiros  = get_post_meta($id, '_imovel_banheiros', true);
  $vagas      = get_post_meta($id, '_imovel_vagas',     true);
  $endereco   = get_post_meta($id, '_imovel_endereco',  true);
  $maps_url   = get_post_meta($id, '_imovel_maps_url',  true);
  $whatsapp   = get_post_meta($id, '_imovel_whatsapp',  true) ?: get_option('imob_whatsapp');
  $codigo     = get_post_meta($id, '_imovel_codigo',    true);
  $finalidade = get_post_meta($id, '_imovel_finalidade', true) ?: 'venda';
  $wpp_numero = preg_replace('/\D/', '', $whatsapp);
  $wpp_msg    = urlencode('Olá! Vi o imóvel "' . get_the_title() . '" (cód. ' . $codigo . ') no site e gostaria de mais informações.');
  $wpp_link   = $wpp_numero ? 'https://wa.me/55' . $wpp_numero . '?text=' . $wpp_msg : '#';
  $tipos      = wp_get_post_terms($id, 'tipo_imovel',   ['fields' => 'names']);
  $cidades    = wp_get_post_terms($id, 'cidade_imovel', ['fields' => 'names']);

  // Galeria: imagem destacada + imagens da galeria do post
  $thumb_id   = get_post_thumbnail_id($id);
  $gallery_ids = get_post_meta($id, '_imovel_gallery', true); // CSV de IDs (via importação)
  $all_images  = [];
  if ($thumb_id) $all_images[] = $thumb_id;
  if ($gallery_ids) {
      foreach (explode(',', $gallery_ids) as $gid) {
          $gid = intval(trim($gid));
          if ($gid && $gid !== $thumb_id) $all_images[] = $gid;
      }
  }
?>

<!-- Schema markup do imóvel -->
<script type="application/ld+json">
<?php
echo wp_json_encode([
    '@context'    => 'https://schema.org',
    '@type'       => 'RealEstateListing',
    'name'        => get_the_title(),
    'description' => get_the_excerpt() ?: wp_trim_words(get_the_content(), 30),
    'url'         => get_permalink(),
    'image'       => $thumb_id ? wp_get_attachment_image_url($thumb_id, 'large') : '',
    'offers'      => [
        '@type'         => 'Offer',
        'price'         => $preco,
        'priceCurrency' => 'BRL',
        'availability'  => 'https://schema.org/InStock',
    ],
    'address' => [
        '@type'           => 'PostalAddress',
        'streetAddress'   => $endereco,
        'addressLocality' => !empty($cidades) ? $cidades[0] : '',
        'addressRegion'   => 'SP',
        'addressCountry'  => 'BR',
    ],
]);
?>
</script>

<main class="imovel-page">
  <div class="container">

    <!-- Breadcrumb -->
    <nav class="imovel-breadcrumb" aria-label="breadcrumb">
      <a href="<?php echo home_url('/'); ?>">Home</a>
      <span>›</span>
      <a href="<?php echo get_post_type_archive_link('imovel'); ?>">Imóveis</a>
      <?php if (!empty($cidades)) : ?>
        <span>›</span>
        <a href="<?php echo get_post_type_archive_link('imovel'); ?>?cidade=<?php echo esc_attr(sanitize_title($cidades[0])); ?>"><?php echo esc_html($cidades[0]); ?></a>
      <?php endif; ?>
      <span>›</span>
      <span><?php the_title(); ?></span>
    </nav>

    <div class="imovel-layout">

      <!-- COLUNA PRINCIPAL -->
      <div class="imovel-main">

        <!-- Galeria -->
        <?php if (!empty($all_images)) : ?>
        <div class="galeria-principal" id="galeria-principal">
          <img
            id="galeria-img-principal"
            src="<?php echo esc_url(wp_get_attachment_image_url($all_images[0], 'large')); ?>"
            alt="<?php the_title(); ?>"
          >
        </div>
        <?php if (count($all_images) > 1) : ?>
        <div class="galeria-thumbs">
          <?php foreach ($all_images as $i => $img_id) : ?>
            <div class="galeria-thumb <?php echo $i === 0 ? 'ativo' : ''; ?>"
                 data-src="<?php echo esc_url(wp_get_attachment_image_url($img_id, 'large')); ?>"
                 data-index="<?php echo $i; ?>">
              <img src="<?php echo esc_url(wp_get_attachment_image_url($img_id, 'thumbnail')); ?>"
                   alt="Foto <?php echo $i + 1; ?>">
            </div>
          <?php endforeach; ?>
        </div>
        <?php endif; ?>
        <?php else : ?>
        <div class="galeria-principal">
          <img src="<?php echo get_template_directory_uri(); ?>/assets/images/placeholder.jpg" alt="<?php the_title(); ?>">
        </div>
        <?php endif; ?>

        <!-- Cabeçalho do imóvel -->
        <div class="imovel-header">
          <?php if (!empty($tipos)) : ?>
            <p class="imovel-tipo"><?php echo esc_html($tipos[0]); ?><?php if (!empty($cidades)) echo ' · ' . esc_html($cidades[0]); ?></p>
          <?php endif; ?>
          <h1 class="imovel-titulo"><?php the_title(); ?></h1>
          <?php if ($endereco) : ?>
            <p class="imovel-local">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <?php echo esc_html($endereco); ?>
            </p>
          <?php endif; ?>
        </div>

        <!-- Preço -->
        <div class="imovel-preco-box">
          <p class="imovel-preco"><?php echo $preco ? imob_formata_preco($preco) : 'Consulte o preço'; ?></p>
          <p class="imovel-finalidade">Para <?php echo esc_html($finalidade); ?><?php echo $codigo ? ' · Cód: ' . esc_html($codigo) : ''; ?></p>
        </div>

        <!-- Specs -->
        <div class="imovel-specs">
          <?php if ($area) : ?>
          <div class="spec-box">
            <p class="valor"><?php echo esc_html($area); ?></p>
            <p class="legenda">m² de área</p>
          </div>
          <?php endif; ?>
          <?php if ($quartos) : ?>
          <div class="spec-box">
            <p class="valor"><?php echo esc_html($quartos); ?></p>
            <p class="legenda">Quartos</p>
          </div>
          <?php endif; ?>
          <?php if ($banheiros) : ?>
          <div class="spec-box">
            <p class="valor"><?php echo esc_html($banheiros); ?></p>
            <p class="legenda">Banheiros</p>
          </div>
          <?php endif; ?>
          <?php if ($vagas) : ?>
          <div class="spec-box">
            <p class="valor"><?php echo esc_html($vagas); ?></p>
            <p class="legenda">Vagas</p>
          </div>
          <?php endif; ?>
        </div>

        <!-- Descrição -->
        <div class="imovel-descricao">
          <h3>Sobre este imóvel</h3>
          <?php the_content(); ?>
        </div>

        <!-- Mapa (só aparece no mobile abaixo da descrição) -->
        <?php if ($maps_url) : ?>
        <div class="imovel-mapa" style="margin-top:2rem;display:none" id="mapa-mobile">
          <h3 style="margin-bottom:1rem">Localização</h3>
          <iframe src="<?php echo esc_url($maps_url); ?>" width="100%" height="280" style="border:0;border-radius:8px" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Localização do imóvel"></iframe>
        </div>
        <?php endif; ?>

      </div><!-- .imovel-main -->

      <!-- SIDEBAR -->
      <aside class="imovel-sidebar">

        <!-- Card de contato -->
        <div class="contact-card">
          <h3>Interesse neste imóvel?</h3>
          <a href="<?php echo esc_url($wpp_link); ?>" class="btn btn-whatsapp" target="_blank" rel="noopener">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Falar no WhatsApp
          </a>
          <?php if ($tel = get_option('imob_telefone')) : ?>
          <a href="tel:<?php echo preg_replace('/\D/', '', $tel); ?>" class="btn btn-secondary">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <?php echo esc_html($tel); ?>
          </a>
          <?php endif; ?>
          <p style="font-size:.8rem;color:var(--texto-suave);text-align:center;margin-top:.75rem">Atendimento em até 2 horas</p>
        </div>

        <!-- Mapa (desktop) -->
        <?php if ($maps_url) : ?>
        <div class="imovel-mapa" id="mapa-desktop">
          <h3 style="margin-bottom:.75rem">Localização</h3>
          <iframe
            src="<?php echo esc_url($maps_url); ?>"
            width="100%"
            height="260"
            style="border:0;border-radius:8px"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Localização do imóvel">
          </iframe>
        </div>
        <?php endif; ?>

      </aside><!-- .imovel-sidebar -->
    </div><!-- .imovel-layout -->

  </div><!-- .container -->
</main>

<?php endwhile; ?>
<?php get_footer(); ?>
