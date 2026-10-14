<?php
/**
 * WHT Electrical — WordPress Playground test harness.
 *
 * TEST SANDBOX ONLY. Never install this on a real site: it imports
 * templates as user 1 with HTML filtering switched off.
 *
 * Visit /?wht_import=1 to import every dist-elementor/*.json through
 * Elementor's own template importer and build the pages from them.
 * Visit /?wht_info=1 to see the Elementor version and whether Pro is present.
 */

/* ---------------------------------------------------------------
   Load the generated chrome plugin — the real artifact that ships —
   rather than duplicating its enqueue and header/footer output here.
   --------------------------------------------------------------- */
require_once '/wordpress/wp-content/wht/dist-plugin/wht-chrome/wht-chrome.php';

/* ---------------------------------------------------------------
   Serve /assets/... from the mount.

   The templates reference assets root-relative (/assets/photos/...),
   which is correct for the live site where they sit in public_html.
   Here the project is mounted under wp-content, so those URLs would
   404 and the hero video and poster would silently not load. This
   makes the sandbox match production rather than quietly differ.
   --------------------------------------------------------------- */
add_action('init', function () {
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?: '';
    if (strpos($uri, '/assets/') !== 0) return;

    $rel  = ltrim(substr($uri, strlen('/assets/')), '/');
    if ($rel === '' || strpos($rel, '..') !== false) return;
    $file = '/wordpress/wp-content/wht/assets/' . $rel;
    if (!file_exists($file)) return;

    $ext  = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    $mime = [
        'css' => 'text/css', 'js' => 'application/javascript', 'mp4' => 'video/mp4',
        'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png',
        'svg' => 'image/svg+xml', 'webp' => 'image/webp',
    ][$ext] ?? 'application/octet-stream';

    header('Content-Type: ' . $mime);
    header('Content-Length: ' . filesize($file));
    header('Accept-Ranges: bytes');
    readfile($file);
    exit;
}, 1);

/* ---------------------------------------------------------------
   What is this Elementor?
   --------------------------------------------------------------- */
add_action('init', function () {
    if (!isset($_GET['wht_info'])) return;
    $types = [];
    if (did_action('elementor/loaded')) {
        foreach (\Elementor\Plugin::$instance->widgets_manager->get_widget_types() as $w) {
            $types[] = $w->get_name();
        }
        sort($types);
    }
    wp_send_json([
        'elementor' => defined('ELEMENTOR_VERSION') ? ELEMENTOR_VERSION : null,
        'pro'       => defined('ELEMENTOR_PRO_VERSION'),
        'theme'     => get_stylesheet(),
        'widgets'   => $types,
    ]);
});

/* ---------------------------------------------------------------
   Import
   --------------------------------------------------------------- */
add_action('init', function () {
    if (!isset($_GET['wht_import'])) return;
    if (!did_action('elementor/loaded')) wp_send_json(['error' => 'Elementor not loaded']);

    /* The header template carries a 37-icon SVG sprite. WordPress strips
       every <svg> unless the importing user has unfiltered_html, and the
       failure is silent — the icons simply vanish. This is the single
       most likely way a real import goes wrong. */
    wp_set_current_user(1);
    kses_remove_filters();

    $dir = '/wordpress/wp-content/wht/dist-elementor';
    $out = [];

    /* Pages first, then the chrome, so the front page exists before
       the templates are assigned to it. */
    $files = [
        'wht-home.json'    => ['title' => 'Home',    'slug' => 'home',    'front' => true],
        'wht-contact.json' => ['title' => 'Contact', 'slug' => 'contact', 'front' => false],
        'wht-home-launch.json' => ['title' => 'Home (launch)', 'slug' => 'home-launch', 'front' => false],
        'wht-header.json'  => ['chrome' => true],
        'wht-footer.json'  => ['chrome' => true],
    ];

    foreach ($files as $file => $opt) {
        $path = "$dir/$file";
        if (!file_exists($path)) { $out[$file] = 'MISSING'; continue; }

        $res = \Elementor\Plugin::$instance->templates_manager->import_template([
            'fileData' => base64_encode(file_get_contents($path)),
            'fileName' => $file,
        ]);
        if (is_wp_error($res)) { $out[$file] = 'ERROR: ' . $res->get_error_message(); continue; }

        $tpl  = is_array($res) && isset($res[0]['template_id']) ? $res[0]['template_id'] : null;
        $data = $tpl ? get_post_meta($tpl, '_elementor_data', true) : null;

        if (!empty($opt['chrome'])) {
            $out[$file] = ['template_id' => $tpl, 'type' => get_post_meta($tpl, '_elementor_template_type', true)];
            continue;
        }

        /* Build a real page from the imported template. */
        $page = wp_insert_post([
            'post_title'  => $opt['title'],
            'post_name'   => $opt['slug'],
            'post_status' => 'publish',
            'post_type'   => 'page',
        ]);
        update_post_meta($page, '_elementor_data', wp_slash($data));
        update_post_meta($page, '_elementor_edit_mode', 'builder');
        update_post_meta($page, '_wp_page_template', 'elementor_canvas');
        if (defined('ELEMENTOR_VERSION')) update_post_meta($page, '_elementor_version', ELEMENTOR_VERSION);

        if (!empty($opt['front'])) {
            update_option('show_on_front', 'page');
            update_option('page_on_front', $page);
        }

        $out[$file] = [
            'template_id' => $tpl,
            'page_id'     => $page,
            'url'         => get_permalink($page),
            'edit'        => admin_url("post.php?post=$page&action=elementor"),
            'svg_in_data' => substr_count((string) $data, '<svg'),
        ];
    }

    \Elementor\Plugin::$instance->files_manager->clear_cache();

    wp_send_json([
        'elementor' => defined('ELEMENTOR_VERSION') ? ELEMENTOR_VERSION : null,
        'pro'       => defined('ELEMENTOR_PRO_VERSION'),
        'results'   => $out,
    ]);
});
