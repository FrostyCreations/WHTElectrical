<?php
/* ---------------------------------------------------------------
   Page speed.

   Source: build/elementor/plugin-perf.php. plugin.mjs appends this
   to wht-chrome.php and fills in the JSON placeholder from the build
   (fonts, hero markup, meta descriptions), so none of it is typed
   twice. Edit the source, not the generated plugin.

   Every optimisation has a switch. To turn one off without a
   redeploy, put this in a mu-plugin or the theme's functions.php:

       add_filter('wht_perf_jquery_footer', '__return_false');

   Switches: meta_description, fonts, inline_css, theme_css,
   elementor_inline_css, jquery_footer, pro_scripts, hero, webp.
   --------------------------------------------------------------- */

function wht_perf($what) {
    return (bool) apply_filters('wht_perf_' . $what, true);
}

function wht_perf_data() {
    static $data = null;
    if ($data === null) {
        $data = json_decode(<<<'WHT_PERF_JSON'
__WHT_PERF_DATA__
WHT_PERF_JSON, true);
    }
    return $data;
}

/* A visitor-facing page: not wp-admin, AJAX, REST, the Customizer or
   Elementor's editor preview, which all need the stock behaviour. */
function wht_perf_front() {
    static $front = null;
    if ($front !== null) return $front;
    $front = !is_admin() && !wp_doing_ajax() && !(defined('REST_REQUEST') && REST_REQUEST)
        && !is_customize_preview() && !isset($_GET['elementor-preview']);
    if ($front && class_exists('\Elementor\Plugin') && isset(\Elementor\Plugin::$instance->preview)
        && \Elementor\Plugin::$instance->preview->is_preview_mode()) {
        $front = false;
    }
    return $front;
}

/* The page's permalink path, the key the meta descriptions use. */
function wht_perf_path() {
    if (is_front_page()) return '/';
    return trailingslashit(wp_parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/');
}

/* An SEO plugin writes its own description; never print a second one. */
function wht_perf_seo_plugin() {
    return defined('WPSEO_VERSION') || defined('RANK_MATH_VERSION') || defined('AIOSEO_VERSION')
        || defined('SEOPRESS_VERSION') || defined('THE_SEO_FRAMEWORK_VERSION');
}

/* ---------- <head>: description, hero preload, fonts ----------
   Priority 1 puts these above every stylesheet, so the browser asks
   for the hero photo and the two font files first. */
add_action('wp_head', function () {
    if (!wht_perf_front()) return;
    $d = wht_perf_data();

    if (wht_perf('meta_description') && !wht_perf_seo_plugin()) {
        $desc = $d['descriptions'][wht_perf_path()] ?? '';
        if ($desc !== '') echo '<meta name="description" content="' . esc_attr($desc) . "\">\n";
    }
    if (wht_perf('hero') && is_front_page()) echo $d['heroPreload'] . "\n";
    if (wht_perf('fonts')) {
        foreach ($d['fontPreloads'] as $link) echo $link . "\n";
        echo '<style id="wht-fonts">' . $d['fontFaces'] . "</style>\n";
    }
}, 1);

/* The fonts above replace the Google Fonts request, and Elementor's
   own kit fonts (Roboto) are never seen: the WHT bridge CSS
   redeclares the kit's font variables (wht-elementor.css §19). */
add_filter('elementor/frontend/print_google_fonts', function ($print) {
    return (wht_perf_front() && wht_perf('fonts')) ? false : $print;
});

/* Elementor's per-page CSS (post-N.css, one per page plus the kit)
   printed in <head> instead of linked, which is Elementor's own
   "Internal Embedding" setting. wp-admin still shows the real value. */
add_filter('pre_option_elementor_css_print_method', function ($value) {
    return (wht_perf_front() && wht_perf('elementor_inline_css')) ? 'internal' : $value;
});

/* ---------- Stylesheets inlined where they stand ----------
   wht.css and wht-elementor.css are small (minified at build), as are
   Hello's reset and Elementor's per-widget files. Each is swapped for
   a <style> of the same contents in the same place, so the cascade
   order every bridge rule depends on does not change; only the
   network round trip goes. Anything that is not a readable local
   .css file, or would need rewriting beyond its url()s, keeps its
   <link>. */
function wht_perf_inline_handle($handle) {
    return in_array($handle, ['wht', 'wht-elementor'], true)
        || strpos($handle, 'hello-elementor') === 0
        || strpos($handle, 'widget-') === 0;
}

function wht_perf_local_css($href, $limit) {
    $path = wp_parse_url($href, PHP_URL_PATH);
    $host = wp_parse_url($href, PHP_URL_HOST);
    if (!$path || substr($path, -4) !== '.css') return null;
    if ($host && $host !== wp_parse_url(site_url(), PHP_URL_HOST)) return null;

    $base = wp_parse_url(trailingslashit(site_url()), PHP_URL_PATH) ?: '/';
    if (strpos($path, $base) !== 0) return null;
    $root = realpath(ABSPATH);
    $file = realpath(ABSPATH . substr($path, strlen($base)));
    if (!$root || !$file || strpos($file, $root . DIRECTORY_SEPARATOR) !== 0) return null;
    if (!is_readable($file) || filesize($file) > $limit) return null;

    $css = file_get_contents($file);
    if ($css === false || stripos($css, '</style') !== false || stripos($css, '@import') !== false) return null;

    /* Relative url()s were relative to the file; make them root-relative. */
    $dir = trailingslashit(dirname($path));
    return preg_replace_callback('/url\(\s*([\'"]?)(?!data:|[a-z]+:|\/|#)([^\'")]+)\1\s*\)/i',
        function ($m) use ($dir) { return 'url(' . $m[1] . $dir . $m[2] . $m[1] . ')'; }, $css);
}

add_filter('style_loader_tag', function ($tag, $handle, $href, $media) {
    if (!wht_perf_front() || !wht_perf('inline_css') || !wht_perf_inline_handle($handle)) return $tag;
    if ($media && $media !== 'all') return $tag;
    $ours = in_array($handle, ['wht', 'wht-elementor'], true);
    $css = wht_perf_local_css($href, $ours ? 200000 : 20000);
    if ($css === null) return $tag;
    return '<style id="' . esc_attr($handle) . '-css">' . $css . "</style>\n";
}, 10, 4);

/* Hello Elementor's theme and header/footer styles dress the theme's own
   header, footer, titles and comments. Elementor Canvas pages, which
   every WHT page is, print none of those. Hello's reset.css stays (it
   is inlined above): the bridge CSS was matched against it. */
add_action('wp_enqueue_scripts', function () {
    if (!wht_perf_front() || !wht_perf('theme_css')) return;
    if (!is_singular() || get_page_template_slug() !== 'elementor_canvas') return;
    wp_dequeue_style('hello-elementor-theme-style');
    wp_dequeue_style('hello-elementor-header-footer');
}, 99);

/* ---------- jQuery out of <head> ----------
   jQuery and jQuery Migrate were the only render-blocking scripts.
   Marking them for the footer is safe for everything enqueued the
   WordPress way: if any script that must run in <head> depends on
   jQuery, WordPress still prints jQuery in <head> ahead of it. Migrate
   only shims jQuery 1.x APIs; Elementor does not need it. The one
   thing this cannot see is raw <script>jQuery(…)</script> printed
   into the page by some other plugin; if one appears, switch this off
   (wht_perf_jquery_footer). */
add_action('wp_enqueue_scripts', function () {
    if (!wht_perf_front() || !wht_perf('jquery_footer')) return;
    $scripts = wp_scripts();
    if (isset($scripts->registered['jquery'])) {
        $scripts->registered['jquery']->deps = array_values(
            array_diff($scripts->registered['jquery']->deps, ['jquery-migrate']));
    }
    foreach (['jquery', 'jquery-core', 'jquery-migrate'] as $h) $scripts->add_data($h, 'group', 1);
}, 1);

/* ---------- Elementor Pro's scripts only where Pro is used ----------
   Pro's frontend.min.js, elements-handlers.min.js (285 KB) and its
   webpack runtime load on every page, but the only Pro widget on the
   site is the Contact form. They are dropped from any page whose
   Elementor content holds no Pro widget. Pro widgets are recognised by
   their class living in Pro's namespace, so a Pro widget added later
   keeps its scripts without anyone updating a list here. Theme Builder
   popups or templates are not looked for: the site uses none. If that
   changes, switch this off (wht_perf_pro_scripts). */
function wht_perf_page_uses_pro() {
    if (!is_singular()) return true;
    $data = get_post_meta(get_queried_object_id(), '_elementor_data', true);
    if (!is_string($data) || $data === '') return true;
    if (!class_exists('\Elementor\Plugin')) return true;
    if (!preg_match_all('/"widgetType":"([^"]+)"/', $data, $m)) return false;
    $manager = \Elementor\Plugin::$instance->widgets_manager;
    foreach (array_unique($m[1]) as $type) {
        $widget = $manager->get_widget_types($type);
        if (!$widget) return true;
        if (stripos(get_class($widget), 'ElementorPro\\') === 0) return true;
    }
    return false;
}

add_action('wp_print_footer_scripts', function () {
    if (!wht_perf_front() || !wht_perf('pro_scripts') || !defined('ELEMENTOR_PRO_VERSION')) return;
    if (wht_perf_page_uses_pro()) return;
    foreach (['elementor-pro-frontend', 'pro-elements-handlers', 'elementor-pro-webpack-runtime'] as $h) {
        wp_dequeue_script($h);
    }
}, 1);

/* ---------- Page content: hero and photos ----------
   Runs on the page HTML after Elementor has built it, so it also fixes
   pages imported before these changes without re-importing them.

   Hero: an older import has the video with the JPEG as its poster and
   no <img>. It is swapped for the current markup (WebP photo the
   browser fetches first, video on top that waits until it plays).
   Markup that already has the photo is left alone.

   Photos: the importer copied each photo into the media library as a
   JPEG (/wp-content/uploads/2026/10/plumbing-tanks-2.jpg and its
   -768x512 sizes). Each one whose WebP exists in /assets/photos is
   pointed there instead, with the 480px copy for phones. */
add_filter('the_content', 'wht_perf_content', 20);

function wht_perf_content($html) {
    if (!wht_perf_front() || !is_string($html) || $html === '') return $html;
    $d = wht_perf_data();

    if (wht_perf('hero') && strpos($html, 'wht-hero__video') !== false && strpos($html, 'wht-hero__poster') === false) {
        $html = preg_replace('#<video\s+class="wht-hero__video"[^>]*>\s*</video>#', $d['heroMedia'], $html, 1);
    }

    if (!class_exists('WP_HTML_Tag_Processor') || strpos($html, '<img') === false) return $html;
    $front = is_front_page();
    $tags = new WP_HTML_Tag_Processor($html);
    while ($tags->next_tag('img')) {
        if (strpos((string) $tags->get_attribute('class'), 'wht-hero__poster') !== false) {
            /* The LCP image: never lazy, always first in the queue. */
            $tags->remove_attribute('loading');
            $tags->set_attribute('fetchpriority', 'high');
            continue;
        }
        if (!wht_perf('webp')) continue;
        $src = $tags->get_attribute('src');
        $photo = is_string($src) ? wht_perf_photo($src) : null;
        if (!$photo) continue;
        $tags->set_attribute('src', $photo['src']);
        $tags->set_attribute('srcset', $photo['srcset']);
        $tags->set_attribute('sizes', '(max-width: 600px) 100vw, ' . $photo['w'] . 'px');
        $tags->set_attribute('width', (string) $photo['w']);
        $tags->set_attribute('height', (string) $photo['h']);
        $tags->set_attribute('decoding', 'async');
        if ($front) {
            /* Everything below the hero is below the fold on the home page,
               and WordPress's guess would mark the first card as the
               priority image, competing with the hero. */
            $tags->set_attribute('loading', 'lazy');
            $tags->remove_attribute('fetchpriority');
        }
    }
    return $tags->get_updated_html();
}

/* The /assets/photos WebP for a photo URL, or null. Accepts the media
   library's copies: a -2 style duplicate suffix and a -768x512 style
   size suffix are both stripped before looking. */
function wht_perf_photo($src) {
    static $cache = [];
    $path = wp_parse_url($src, PHP_URL_PATH);
    if (!$path || !preg_match('#^(?:.*/wp-content/uploads/.*|/assets/photos)/([a-z0-9-]+)\.(?:jpe?g|png)$#i', $path, $m)) return null;
    $name = preg_replace('/-\d+x\d+$/', '', $m[1]);
    if (array_key_exists($name, $cache)) return $cache[$name];

    $dir = untrailingslashit(ABSPATH) . '/assets/photos/';
    $found = null;
    foreach (array_unique([$name, preg_replace('/-\d+$/', '', $name)]) as $base) {
        if (!is_readable("$dir$base.webp") || !is_readable("$dir$base-480.webp")) continue;
        $size = @getimagesize("$dir$base.webp");
        if (!$size) continue;
        $found = [
            'src'    => "/assets/photos/$base.webp",
            'srcset' => "/assets/photos/$base-480.webp 480w, /assets/photos/$base.webp {$size[0]}w",
            'w'      => $size[0],
            'h'      => $size[1],
        ];
        break;
    }
    return $cache[$name] = $found;
}
