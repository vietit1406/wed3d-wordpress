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

add_action('acf/save_post', 'my_acf_save_post');
function my_acf_save_post($post_id)
{

    // Get newly saved values.
    $values = get_fields($post_id);

    // Check the new value of a specific field.
    $product_3d_model = get_field('product_3d_model', $post_id);
    if ($product_3d_model) {
        $value = get_field("product_3d_model", $post_id);
        $my_file_dir = get_home_path() . str_replace(get_site_url(), '', $value['url']);
        $zip = new ZipArchive;
        $res = $zip->open($my_file_dir);
        if ($res === TRUE) {
            $test = $zip->extractTo(get_home_path() . '/public/uploads/unzip_3ds_file/' . $value['ID'] . '/' . $value['name']);
            $zip->close();
        } else {
        }
    }
}

// add the action
add_action('woocommerce_update_product', 'action_woocommerce_update_product', 10, 1);

// Fixing Wordpress MIME checking system
function fix_wp_csv_mime_bug( $data, $file, $filename, $mimes ) {
    $wp_filetype = wp_check_filetype( $filename, $mimes );
    $ext = $wp_filetype['ext'];
    $type = $wp_filetype['type'];
    $proper_filename = $data['proper_filename'];
    return compact( 'ext', 'type', 'proper_filename' );
}
add_filter( 'wp_check_filetype_and_ext', 'fix_wp_csv_mime_bug', 10, 4 );

// Adding custom MIME types
function custom_upload_mimes ( $existing_mimes=array() ) {
    $existing_mimes['3ds'] = 'application/x-3ds';
    $existing_mimes['gltf'] = 'image/gltf';
    $existing_mimes['glb'] = 'image/glb';
    return $existing_mimes;
}
add_filter('upload_mimes', 'custom_upload_mimes');

/* Adds scripts */
add_action( 'wp_enqueue_scripts', 'add_scripts' );
function add_scripts() {
    wp_enqueue_script( 'three', get_theme_file_uri( 'assets/js/three.js' ), array(), '20201005', true );
    wp_enqueue_script( 'GLTFLoader', get_theme_file_uri( 'assets/js/GLTFLoader.js' ), array(), '20201005', true );
    wp_enqueue_script('TDSLoader', get_theme_file_uri('assets/js/TDSLoader.js'), array(), '20201005', true);
    wp_enqueue_script( 'gsap', get_theme_file_uri( 'assets/js/gsap.min.js' ), array(), '20201005', true );
    wp_enqueue_script( 'OrbitControls', get_theme_file_uri( 'assets/js/OrbitControls.js' ), array(), '20201005', true );
    wp_enqueue_script( 'DragControls', get_theme_file_uri( 'assets/js/DragControls.js' ), array(), '20201005', true );
    wp_enqueue_script( 'mythree', get_theme_file_uri( 'assets/js/mythree.js' ), array(), '20201005', true );
    wp_enqueue_style('three-styles', get_template_directory_uri() . '/assets/css/three-style.css', array(), filemtime(get_template_directory() . '/assets/css/three-style.css'), false);
    wp_localize_script( 'three', 'wpApiSettings', array(
        'current_user' => wp_get_current_user()->data->ID,
        'root' => esc_url_raw( rest_url() ),
        'nonce' => wp_create_nonce( 'wp_rest')  )
    );

}
function wpdocs_theme_name_scripts() {
//    wp_enqueue_style( 'style-name', get_stylesheet_uri('assets/css/three-style.css') );
//    wp_enqueue_style( 'three-style', get_stylesheet_uri( 'assets/css/three-style.css' ), array(), '20201005', true );
}
add_action( 'rest_api_init', 'add_custom_fields' );
function add_custom_fields() {
    register_rest_field(
        'user',
        'product_design_json', //New Field Name in JSON RESPONSEs
        array(
            'get_callback'    => 'add_custom_user_field', // custom function name
            'update_callback' => 'post_user_product_design_json_api',
            'schema'          => null,
        )
    );
}
function add_custom_user_field() {
    $userData = WP_User::get_data_by('id', wp_get_current_user()->data->ID);
    return $userData->product_design_json;
}

function post_user_product_design_json_api()
{
    try{

//Prepare params
        if(!empty($_POST['product_design_json']) AND !empty($_POST['user_id'])){
            $productDesignJson = json_encode($_POST['product_design_json']);
            $userId = $_POST['user_id'];
        }else{
            throw new Exception('Invalid input params');
        }

//Excute query
        global $wpdb;
        $sql = "UPDATE wp_users SET product_design_json='".$productDesignJson."'"." WHERE id=".$userId;
        $results = $wpdb->get_results($sql);

    }catch (Exception $e){
        echo json_encode(array('status' => -1, 'msg' => "Error ".$e));
    }
        echo json_encode(array('status' => 1, 'msg' => "Success"));
    exit;
}



add_filter('woocommerce_get_price_html', 'fbs_woocommerce_get_price_html', 100, 2);
 
function fbs_woocommerce_get_price_html($price, $product)
{
    if ($product->price <= 0)
    {
        //remove_action('woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10);
        //remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30);
        return 'Call for Price';
    } else
    {
        return $price;
    }
}

//add_action('woocommerce_add_to_cart', function () {
//    // your code
//    global $woocommerce;
//
//    $product_id = $_POST['assessories'];
//    $found = false;
//
//    //check if product already in cart
//    if ( sizeof( WC()->cart->get_cart() ) > 0 ) {
//        foreach ( WC()->cart->get_cart() as $cart_item_key => $values ) {
//            $_product = $values['data'];
//            if ( $_product->id == $product_id )
//                $found = true;
//        }
//        // if product not found, add it
//        if ( ! $found )
//            WC()->cart->add_to_cart( $product_id );
//    } else {
//        // if no products in cart, add it
//        WC()->cart->add_to_cart( $product_id );
//    }
//}, 10, 1);


function namespace_force_individual_cart_items( $cart_item_data, $product_id ) {
    $product_design_json=$_POST['product_design'];
    if(!empty($product_design_json)){ //Check Flat Design product
        $unique_cart_item_key = md5( microtime() . rand() );
        $cart_item_data['unique_key'] = $unique_cart_item_key;
        $cart_item_data[$unique_cart_item_key] = 'asdasd';
        $cart_item_data['product_design'] = $product_design_json;
    }
    return $cart_item_data;
}
add_filter( 'woocommerce_add_cart_item_data', 'namespace_force_individual_cart_items', 10, 2 );

add_action( 'woocommerce_before_calculate_totals', 'misha_recalc_price' );

function misha_recalc_price( $cart_object ) {
    foreach ( $cart_object->get_cart() as $hash => $value ) {
// Check design product
        if(!empty($value['product_design'])){
            $value['data']->set_price( 0 );
        }
    }
}

add_action('woocommerce_checkout_update_order_meta', 'custom_meta_to_order', 20, 1);
function custom_meta_to_order( $order_id ) {
    $cart=WC()->cart->get_cart();
    // get an instance of the WC_Order object
    $order = wc_get_order( $order_id );
    foreach($cart as $key => $value){

        if(!empty($value['product_design'])){
            $order->update_meta_data($value['unique_key'], $value['product_design']);
        }
    }
    // Save the order data and meta data
    $order->save();
}
add_action( 'woocommerce_new_order_item', 'wc_order_item_added',  1, 3 );
function wc_order_item_added( $item_id, $item, $order_id){
    $order = wc_get_order( $order_id );
    $cart=WC()->cart->get_cart();
    global $wpdb;
    $start=1;
    $lengthFor=count($order->get_items());
    foreach($cart as $key => $value){
        if($start == $lengthFor){
            if(!empty($value['product_design'])){
                $sql = "UPDATE wp_woocommerce_order_items SET product_design_json='".$value['product_design']."'"." WHERE order_item_id=".$item_id;
            }
            if(!empty($sql)){
                $results = $wpdb->get_results($sql);
            }
//        return empty($results) ? false:true;
        }
        $start++;
    }
    return true;

}


//add_action('wp_enqueue_scripts', 'override_woo_frontend_scripts');
//function override_woo_frontend_scripts() {
//    wp_deregister_script('wc-add-to-cart');
//    wp_enqueue_script('wc-add-to-cart', get_template_directory_uri() . '/assets/js/add-to-cart.js', array('jquery', 'woocommerce', 'wc-country-select', 'wc-address-i18n'), null, true);
//}