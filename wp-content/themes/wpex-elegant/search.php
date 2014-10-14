<?php
/**
 * The template for displaying Search Results pages.
 *
 * @package WordPress
 * @subpackage Elegant WPExplorer Theme
 * @since Elegant 1.0
 */
get_header();
?>
<div id="main" class="site-main clr home-header">
    <div class="container">
        <div id="primary" class="content-area clr">
            <div id="content" class="site-content" role="main">
                <header class="page-header">
                    <div id="header-widgets-search" class="clr">
                        <div class="header-search">
                            <?php dynamic_sidebar('header'); ?>
                        </div><!-- .header-search-box -->
                    </div><!-- #header-search-widgets -->
                    <h1 class="page-header-title"><?php printf(__('Search Results for: %s', 'wpex'), get_search_query()); ?></h1>
                </header>
                <?php if (have_posts()) { ?>
                    <div id="blog-wrap" class="clr">
                        <?php while (have_posts()) : the_post(); ?>
                            <?php get_template_part('content', 'search'); ?>
                        <?php endwhile; ?>
                    </div><!-- #clr -->
                    <?php wpex_pagination(); ?>
                <?php } else { ?>
                    <?php get_template_part('content', 'none'); ?>
                <?php } ?>
            </div><!-- #content -->
            <?php //get_sidebar(); ?>
        </div><!-- #primary -->
    </div>
</div><!-- #main-content -->
<?php get_footer(); ?>