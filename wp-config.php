<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'web3d' );

/** MySQL database username */
define( 'DB_USER', 'root' );

/** MySQL database password */
define('DB_PASSWORD', '');

/** MySQL hostname */
define('DB_HOST', 'localhost:3306');

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );
define('WP_HOME', 'http://ww.ww');
define('WP_SITEURL', 'http://ww.ww');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '/Vy+kI.>4A:Q:5<fgXK8L=yZCYM-lJNCA((`.Sbwga^V@-_}14*.i^D5)hRs@[C2' );
define( 'SECURE_AUTH_KEY',  'JhZkb0;3]x<i?JVQqv_>!j,/tgp/ 1IxhSI{_Rwf>x[TNTCuN>^,d 2`kWeggpOs' );
define( 'LOGGED_IN_KEY',    '[<6.$HdDb^dww[jc2(a-`;sb}zgAgs8kD*0%b>K~P$df.bhiGKF:[jg6;_=^tdC]' );
define( 'NONCE_KEY',        '@wg0`V$ uVBM2Pa&G{T^olNx;9Z1k[IMgt;>rfIV=| @V5pv-/]/!iDZ#ZFh[KBo' );
define( 'AUTH_SALT',        'wgP~5M!}I901Y7Wh$82$&VOZju6A-e7S]NK.Z*6yQHc#Aw,I$RR[2>4]i>&wO1ht' );
define( 'SECURE_AUTH_SALT', 'GFd5^UmF}|$$Yx?>=7,h{^;Sx}:Q#UfAu<t }6LC1%Ey7X/P?D6=p^H5,z&7T8s&' );
define( 'LOGGED_IN_SALT',   '3+uGdTX8]& (yYklYemuM|{uKS%,[H?+xl4:QF#MCD@K^fbMA6lp$HFjXEjbwwjO' );
define( 'NONCE_SALT',       'L[])<.<Wl{`gEO[iztav3T!pLQ`YzsG+>|[;<@mn-1nq2Pf?Lj8P&HM2-}>nrlU$' );
define('ALLOW_UNFILTERED_UPLOADS', true);
/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
