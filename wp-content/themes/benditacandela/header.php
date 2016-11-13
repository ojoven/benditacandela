<?php
/**
 * The header for our theme.
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Bendita_Candela
 */

global $templateUrl;

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="http://gmpg.org/xfn/11">

	<?php wp_head(); ?>

	<!-- CSS -->
	<link rel="stylesheet" href='<?php echo $templateUrl; ?>/css/style.css?v=1' type='text/css'

	<!-- EXTERNAL FONTS -->
	<link href='https://fonts.googleapis.com/css?family=Ubuntu:300,400,700,500' rel='stylesheet' type='text/css'>
</head>

<body <?php body_class(); ?>>
<div id="page" class="site">
	<a class="skip-link srt" href="#content"><?php esc_html_e('Skip to content', 'benditacandela'); ?></a>

	<header id="masthead" class="site-header" role="banner">
		<div class="site-branding">
			<?php
			if (is_front_page() && is_home()) : ?>
				<h1 class="site-title"><a href="<?php echo esc_url(home_url('/')); ?>"
										  rel="home"><?php bloginfo('name'); ?></a></h1>
			<?php else : ?>
				<p class="site-title"><a href="<?php echo esc_url(home_url('/')); ?>"
										 rel="home"><?php bloginfo('name'); ?></a></p>
			<?php
			endif;

			$description = get_bloginfo('description', 'display');
			if ($description || is_customize_preview()) : ?>
				<p class="site-description"><?php echo $description; /* WPCS: xss ok. */ ?></p>
			<?php
			endif; ?>
		</div>
		<!-- .site-branding -->

		<nav id="site-navigation" class="main-navigation" role="navigation">
			<button class="menu-toggle" aria-controls="primary-menu"
					aria-expanded="false"><?php esc_html_e('Primary Menu', 'benditacandela'); ?></button>
			<?php wp_nav_menu(array('theme_location' => 'primary', 'menu_id' => 'primary-menu')); ?>
		</nav>
		<!-- #site-navigation -->
	</header>
	<!-- #masthead -->

	<div id="content" class="site-content">
