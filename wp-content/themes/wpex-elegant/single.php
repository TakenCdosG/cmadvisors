<?php
/**
 * The Template for displaying all single posts.
 *
 * @package WordPress
 * @subpackage Elegant WPExplorer Theme
 * @since Elegant 1.0
 */
get_header();
?>
<div id="top-header" class="top-header">
    <div class="content-area site-main clr container">
        <h3 class="post-title"><?php echo get_the_title(36); ?></h3>
        <div class="clr container">
            <div class="top-content-box">
                <?php $excerpt = get_field('excerpt', 36); ?>
                <p><?php echo $excerpt; ?></p>
            </div>
        </div>
    </div>
</div>
<div id="main" class="site-main clr home-header">
    <div class="container">
        <?php while (have_posts()) : the_post(); ?>
            <div id="primary" class="content-area clr">
                <div id="content" class="site-content left-content clr" role="main">
                    <article>
                        <?php
                        if (!post_password_required()) {
                            get_template_part('content', get_post_format());
                        }
                        ?>
                        <header class="page-header clr">
                            <h1 class="page-header-title"><?php the_title(); ?></h1>
                            <?php
                            // Display post meta
                            // See functions/commons.php
                            wpex_post_meta();
                            ?>
                        </header><!-- .page-header -->
                        <div class="entry clr">
                            <?php the_content(); ?>
                        </div><!-- .entry -->
                        <footer class="entry-footer">
                            <?php edit_post_link(__('Edit Post', 'wpex'), '<span class="edit-link clr">', '</span>'); ?>
                        </footer><!-- .entry-footer -->
                    </article>
                    <?php
                    // Display author bio
                    // See functions/commons.php
                    wpex_post_author();
                    ?>
                    <?php comments_template(); ?>
                    <?php wp_link_pages(array('before' => '<div class="page-links clr">', 'after' => '</div>', 'link_before' => '<span>', 'link_after' => '</span>')); ?>
                </div><!-- #content -->
                <?php get_sidebar(); ?>
            </div><!-- #primary -->
        <?php endwhile; ?>
    </div><!-- #main-content -->
</div>
<?php get_footer(); ?>