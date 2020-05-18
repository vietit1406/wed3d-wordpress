<?php
if (version_compare($GLOBALS['wp_version'], '4.7-alpha', '<')) {
    require 'inc/back-compat.php';
    return;
}
if (is_admin()) {
    require get_theme_file_path('inc/admin/class-admin.php');
}

require get_theme_file_path('inc/tgm-plugins.php');
require get_theme_file_path('inc/template-tags.php');
require get_theme_file_path('inc/template-functions.php');
require get_theme_file_path('inc/class-main.php');
require get_theme_file_path('inc/starter-settings.php');

if (!class_exists('AurosCore')) {
    if (auros_is_woocommerce_activated()) {
        require get_theme_file_path('inc/vendors/woocommerce/woocommerce-template-functions.php');
        require get_theme_file_path('inc/vendors/woocommerce/class-woocommerce.php');
        require get_theme_file_path('inc/vendors/woocommerce/woocommerce-template-hooks.php');
    }
    // Blog Sidebar
    require get_theme_file_path('inc/class-sidebar.php');
}

function upload_3ds($mime_types){
    $mime_types['3ds'] = 'application/x-3ds';
    $mime_types['glb'] = 'model/gltf-binary';
    return $mime_types;
}
add_filter('upload_mimes', 'upload_3ds', 1, 1);

/* Adds scripts */
add_action( 'wp_enqueue_scripts', 'add_scripts' );
function add_scripts() {
    wp_enqueue_script( 'three', get_theme_file_uri( 'assets/js/three.js' ), array(), '20201005', true );
    wp_enqueue_script( 'GLTFLoader', get_theme_file_uri( 'assets/js/GLTFLoader.js' ), array(), '20201005', true );
    wp_enqueue_script( 'gsap', get_theme_file_uri( 'assets/js/gsap.min.js' ), array(), '20201005', true );
    wp_enqueue_script( 'OrbitControls', get_theme_file_uri( 'assets/js/OrbitControls.js' ), array(), '20201005', true );
    wp_enqueue_script( 'mythree', get_theme_file_uri( 'assets/js/mythree.js' ), array(), '20201005', true );
}
