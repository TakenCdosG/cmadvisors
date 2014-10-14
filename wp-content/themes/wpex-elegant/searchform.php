<?php
/**
 * The template for displaying search forms.
 *
 * @package WordPress
 * @subpackage Elegant WPExplorer Theme
 * @since Elegant 1.0
 */
?>

<form method="get" id="searchform" class="searchform" action="<?php echo esc_url(home_url('/')); ?>" role="search">
    <input type="search" class="field field-search" name="s" value="<?php //echo esc_attr(get_search_query());    ?>" id="s" placeholder="" />
    <input type="submit" class="field-submit .btn-search" value="" >
</form>