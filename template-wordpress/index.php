<?php
// Fallback — o WordPress usa page-home.php, archive-imovel.php e single-imovel.php
get_header();
?>
<main class="container">
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
        <article>
            <h1><?php the_title(); ?></h1>
            <?php the_content(); ?>
        </article>
    <?php endwhile; endif; ?>
</main>
<?php
get_footer();
