<?php

/**
 * Define sidebars for use in this theme
 * @package WordPress
 * @subpackage Elegant WPExplorer Theme
 * @since Elegant 1.0
 */
// Header
register_sidebar(array(
    'name' => __('Header', 'wpex'),
    'id' => 'header',
    'description' => __('Widgets in this area are used in the header region.', 'wpex'),
    'before_widget' => '<div class="header-widget %2$s clr">',
    'after_widget' => '</div>',
    'before_title' => '<h6 class="widget-title"><span>',
    'after_title' => '</span></h6>',
));
// Sidebar
register_sidebar(array(
    'name' => __('Sidebar', 'wpex'),
    'id' => 'sidebar',
    'description' => __('Widgets in this area are used in the sidebar region.', 'wpex'),
    'before_widget' => '<div class="sidebar-widget %2$s clr">',
    'after_widget' => '</div>',
    'before_title' => '<h5 class="widget-title"><span>',
    'after_title' => '<span></h5>',
));
// Footer 1
register_sidebar(array(
    'name' => __('Footer 1', 'wpex'),
    'id' => 'footer-one',
    'description' => __('Widgets in this area are used in the first footer region.', 'wpex'),
    'before_widget' => '<div class="footer-widget %2$s clr">',
    'after_widget' => '</div>',
    'before_title' => '<h6 class="widget-title"><span>',
    'after_title' => '</span></h6>',
));
// Footer 2
register_sidebar(array(
    'name' => __('Footer 2', 'wpex'),
    'id' => 'footer-two',
    'description' => __('Widgets in this area are used in the second footer region.', 'wpex'),
    'before_widget' => '<div class="footer-widget %2$s clr">',
    'after_widget' => '</div>',
    'before_title' => '<h6 class="widget-title"><span>',
    'after_title' => '</span></h6>',
));
// Footer 3
register_sidebar(array(
    'name' => __('Footer 3', 'wpex'),
    'id' => 'footer-three',
    'description' => __('Widgets in this area are used in the third footer region.', 'wpex'),
    'before_widget' => '<div class="footer-widget %2$s clr">',
    'after_widget' => '</div>',
    'before_title' => '<h6 class="widget-title"><span>',
    'after_title' => '</span></h6>',
));