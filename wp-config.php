<?php

define('ADMIN_COOKIE_PATH', '/');
define('COOKIE_DOMAIN', '');
define('COOKIEPATH', '');
define('SITECOOKIEPATH', '');
/** * The base configurations of the WordPress. * * This file has the following configurations: MySQL settings, Table Prefix, * Secret Keys, WordPress Language, and ABSPATH. You can find more information * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing * wp-config.php} Codex page. You can get the MySQL settings from your web host. * * This file is used by the wp-config.php creation script during the * installation. You don't have to use the web site, you can just copy this file * to "wp-config.php" and fill in the values. * * @package WordPress */
define('WP_HOME', 'http://carlmarksadvisors.com/');
define('WP_SITEURL', 'http://carlmarksadvisors.com/'); // ** MySQL settings - You can get this info from your web host ** ///** The name of the database for WordPress */
define('DB_NAME', 'cmadviso_tcgwp');
/** MySQL database username */
define('DB_USER', 'cmadviso_dbuse1');
/** MySQL database password */
define('DB_PASSWORD', 'fHI-)=u50wev'); //
/** MySQL hostname */
define('DB_HOST', 'localhost');
/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');
define('ALLOW_UNFILTERED_UPLOADS', true); /* * #@+ * Authentication Unique Keys and Salts. * * Change these to different unique phrases! * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service} * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again. * * @since 2.6.0 */
define('AUTH_KEY', 'q,s]AtIn/rS jmq6+ZE*6i2|F$cc%>5N9J(l5c$@h{xPRFfX|3y$O` #CTw#|S8H');
define('SECURE_AUTH_KEY', '?fD6Y3I=.klv+zl)WmeW$-& |fDxFqbgY!e>!8f :mZw+{_AYFdx=hHv_0nO=N4z');
define('LOGGED_IN_KEY', 'c%86rO8?_Zt`^RE1r-~%m.oG9R-ACJ8@K;iFu<!C5(x3V8wJl0O+|7>~9T?hcTF0');
define('NONCE_KEY', '4)c1~.+eV_O=CWQr91KYr,1n@:,&:o%OzlF, f- ;|fn|VYjwyij6qFJP3lYox*B');
define('AUTH_SALT', 'f7YBQ5z+}!9:FGxU,=pWxhS`-lL)H|:Ld7sC#aH>9p/:u_>_[nl{p1aag&P[<h<w');
define('SECURE_AUTH_SALT', '>dHO~Hb`#=l&Z.f6T2`!+$sgmrXn)7iJ}KRcW&gDWiLO(?I(%37KGfH?ye546e_n');
define('LOGGED_IN_SALT', '1.3l J83!3bvx|X //!yAtvV-f*C|)3*+o<wKe1Cv1Q{@^]uNs67tc9#Ljxb3jK3');
define('NONCE_SALT', '.4+sm&WZ~E,<IQ4nDd4cRMqXV[./M]8]V9FXeEu>Ttb,b}L3Px/0rhM6,-5f1`3~'); /* * #@- *//** * WordPress Database Table prefix. * * You can have multiple installations in one database if you give each a unique * prefix. Only numbers, letters, and underscores please! */
$table_prefix = 'wp_';/** * WordPress Localized Language, defaults to English. * * Change this to localize WordPress. A corresponding MO file for the chosen * language must be installed to wp-content/languages. For example, install * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German * language support. */
define('WPLANG', '');/** * For developers: WordPress debugging mode. * * Change this to true to enable the display of notices during development. * It is strongly recommended that plugin and theme developers use WP_DEBUG * in their development environments. */
define('WP_DEBUG', false); /* That's all, stop editing! Happy blogging. *//** Absolute path to the WordPress directory. */
if (!defined('ABSPATH'))
    define('ABSPATH', dirname(__FILE__) . '/');/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
