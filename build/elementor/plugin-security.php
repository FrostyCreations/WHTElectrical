<?php
/* ---------------------------------------------------------------
   Security hardening.

   Source: build/elementor/plugin-security.php, appended to
   wht-chrome.php by plugin.mjs. Edit the source, not the plugin.

   The server half (security headers, XML-RPC blocked, readme files
   and uploads/*.php refused) is in build/server/htaccess-security.txt,
   which the deploy merges into .htaccess. This half covers what only
   WordPress can do, and repeats the XML-RPC switch-off in case the
   .htaccess rules ever go missing.

   Every item has a switch. To turn one off, from a mu-plugin
   (plugins load before the theme, so functions.php is too late for
   file_edit; it works for the rest):

       add_filter('wht_sec_xmlrpc', '__return_false');

   Switches: versions, xmlrpc, rest_users, author_scan, login_errors,
   file_edit, comments, noopener.
   --------------------------------------------------------------- */

function wht_sec($what) {
    return (bool) apply_filters('wht_sec_' . $what, true);
}

/* No Plugins and Themes file editor in wp-admin. Anyone who gets into
   an admin account can otherwise write PHP straight onto the server. */
if (!defined('DISALLOW_FILE_EDIT') && wht_sec('file_edit')) {
    define('DISALLOW_FILE_EDIT', true);
}

/* Remove HTML comments, except IE conditional comments, and leave
   <script>, <style> and <textarea> contents alone. */
function wht_sec_strip_comments($html) {
    $parts = preg_split('#(<(script|style|textarea)\b[^>]*>.*?</\2\s*>)#is', $html, -1, PREG_SPLIT_DELIM_CAPTURE);
    if (!is_array($parts)) return $html;
    $out = '';
    for ($i = 0, $n = count($parts); $i < $n; $i++) {
        if ($i % 3 === 0) $out .= preg_replace('/<!--(?!\[if|<!|>)[\s\S]*?-->/', '', $parts[$i]);
        elseif ($i % 3 === 1) $out .= $parts[$i];
        /* $i % 3 === 2 is the tag name captured by the inner group: skip it. */
    }
    return $out;
}

/* ---------- Version numbers ----------
   WordPress, Elementor and Yoast each print their version in <head>,
   and every stylesheet and script URL ends in ?ver=<version>. The meta
   tags and comments go; each ?ver= is swapped for a short hash of
   itself, so a new version still gets a new URL (caches still refresh)
   without saying which version it is.

   This is a speed bump, not a wall: plugin files can still be
   fingerprinted, and Elementor's own script config carries its version
   because it needs it to load its chunks. Updating promptly is the real
   protection. */
add_action('init', function () {
    if (!wht_sec('versions')) return;
    remove_action('wp_head', 'wp_generator');
    add_filter('the_generator', '__return_empty_string');
    add_filter('wpseo_debug_markers', '__return_false');
});

add_action('wp_head', function () {
    if (wht_sec('versions') && !is_admin()) ob_start();
}, -999999);
add_action('wp_head', function () {
    if (!wht_sec('versions') || is_admin()) return;
    $head = ob_get_clean();
    if ($head === false) return;
    $head = preg_replace('#<meta\s+name=["\']generator["\'][^>]*>\s*#i', '', $head);
    echo wht_sec_strip_comments($head);
}, 999999);

function wht_sec_ver($src) {
    if (is_admin() || !wht_sec('versions') || !is_string($src) || strpos($src, 'ver=') === false) return $src;
    $ver = null;
    $query = wp_parse_url($src, PHP_URL_QUERY);
    if ($query) {
        parse_str($query, $args);
        $ver = $args['ver'] ?? null;
    }
    if (!is_string($ver) || $ver === '') return $src;
    return add_query_arg('ver', substr(wp_hash('wht-ver-' . $ver), 0, 8), $src);
}
add_filter('style_loader_src', 'wht_sec_ver', 9999);
add_filter('script_loader_src', 'wht_sec_ver', 9999);

/* PHP announces itself in an X-Powered-By header; .htaccess removes it
   too, but not every server setup lets it. */
add_action('send_headers', function () {
    if (function_exists('header_remove') && !headers_sent()) header_remove('X-Powered-By');
});

/* ---------- XML-RPC ----------
   Blocked by .htaccess before PHP even starts; this is the fallback,
   plus the RSD link and X-Pingback header that advertise it. */
add_action('init', function () {
    if (!wht_sec('xmlrpc')) return;
    add_filter('xmlrpc_enabled', '__return_false');
    add_filter('xmlrpc_methods', '__return_empty_array');
    remove_action('wp_head', 'rsd_link');
    add_filter('wp_headers', function ($headers) {
        unset($headers['X-Pingback']);
        return $headers;
    });
});

/* ---------- Usernames ----------
   WordPress hands out login names three ways: the REST API's user list,
   /?author=1 (which redirects to /author/<login>/), and the author
   fields in oEmbed data. All three are closed to visitors who are not
   logged in. wp-admin, Elementor and Yoast use the REST API while
   logged in, so they are unaffected. The REST API itself stays on
   (Elementor and Yoast need it), but its address is no longer printed
   in every page's <head> and headers. */
add_filter('rest_endpoints', function ($endpoints) {
    if (!wht_sec('rest_users') || is_user_logged_in()) return $endpoints;
    foreach (array_keys($endpoints) as $route) {
        if (preg_match('#^/wp/v2/users(/|$)#', $route)) unset($endpoints[$route]);
    }
    return $endpoints;
});

add_action('init', function () {
    if (!wht_sec('rest_users')) return;
    remove_action('wp_head', 'rest_output_link_wp_head', 10);
    remove_action('template_redirect', 'rest_output_link_header', 11);
    remove_action('wp_head', 'wp_oembed_add_discovery_links');
});

add_filter('oembed_response_data', function ($data) {
    if (!wht_sec('rest_users')) return $data;
    unset($data['author_name'], $data['author_url']);
    return $data;
});

/* Before WordPress's own canonical redirect (priority 10), which would
   put the login name in the Location header. The site has no blog, so
   author archives have nothing to show anyway. */
add_action('template_redirect', function () {
    if (!wht_sec('author_scan') || is_user_logged_in()) return;
    if (isset($_GET['author']) || is_author()) {
        wp_safe_redirect(home_url('/'), 301);
        exit;
    }
}, 1);

/* "The password you entered for the username X is incorrect" confirms X
   is a real account. One message for every failure. */
add_filter('login_errors', function ($message) {
    if (!wht_sec('login_errors')) return $message;
    return '<strong>Error:</strong> the username or password is incorrect.';
});

/* ---------- Page content ----------
   Developer notes left in Elementor HTML widgets come out (the header
   and footer markup is already stripped when the plugin is built), and
   every link that opens a new tab gets rel="noopener", which Elementor's
   buttons do not add. */
add_filter('the_content', function ($html) {
    if (is_admin() || !is_string($html) || $html === '' || isset($_GET['elementor-preview'])) return $html;
    if (wht_sec('comments') && strpos($html, '<!--') !== false) $html = wht_sec_strip_comments($html);
    if (wht_sec('noopener') && class_exists('WP_HTML_Tag_Processor') && stripos($html, '_blank') !== false) {
        $tags = new WP_HTML_Tag_Processor($html);
        while ($tags->next_tag('a')) {
            if (strtolower((string) $tags->get_attribute('target')) !== '_blank') continue;
            $rel = preg_split('/\s+/', trim((string) $tags->get_attribute('rel')), -1, PREG_SPLIT_NO_EMPTY);
            if (!in_array('noopener', array_map('strtolower', $rel), true)) $rel[] = 'noopener';
            $tags->set_attribute('rel', implode(' ', $rel));
        }
        $html = $tags->get_updated_html();
    }
    return $html;
}, 21);
