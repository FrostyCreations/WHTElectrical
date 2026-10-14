/* =========================================================
   WHT site chrome as a plain WordPress plugin.

       node build/elementor/plugin.mjs

   Elementor's Theme Builder needs Pro. This does the same job without
   it: a small plugin that enqueues the stylesheets and script, adds the
   .wht-site body class, and prints the header and footer on the
   wp_body_open and wp_footer hooks.

   Those hooks fire on the Elementor Canvas page template, which is what
   the WHT pages use — Canvas skips the theme's own header and footer but
   still fires both hooks, so the WHT chrome lands in the right place with
   nothing from the theme competing with it.

   Markup is lifted from the generated dist-wp page, so it cannot drift
   from the static build. Rerun this after any build.
   ========================================================= */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SRC = join(root, 'dist-wp', 'index.html');

if (!existsSync(SRC)) {
    console.error('dist-wp/index.html is missing. Run: node build/build.mjs --wp --prod');
    process.exit(1);
}

const html = readFileSync(SRC, 'utf8');
const body = html.slice(html.indexOf('<div class="wht-site">'));

const between = (s, start, end, label) => {
    const a = s.indexOf(start);
    if (a < 0) throw new Error(`could not find ${label} start`);
    const b = s.indexOf(end, a + start.length);
    if (b < 0) throw new Error(`could not find ${label} end`);
    return s.slice(a + start.length, b);
};

const skipAndSprite = between(body, '<div class="wht-site">', '<header', 'icon sprite').trim();
const header = '<header' + between(body, '<header', '</header>', 'header') + '</header>';
const footer = between(body, '</main>', '\n</div>', 'footer block').trim();

/* Nowdoc, so nothing in the markup is interpolated or needs escaping.
   Guard against the terminator appearing in the markup itself. */
for (const [name, markup] of [['HEADER', skipAndSprite + '\n' + header], ['FOOTER', footer]]) {
    if (new RegExp(`^WHT_${name}_HTML;`, 'm').test(markup)) {
        throw new Error(`markup contains the ${name} nowdoc terminator`);
    }
}

const php = `<?php
/**
 * Plugin Name: WHT Electrical — site chrome
 * Description: Header, footer, drawer, search overlay and mobile bar for the WHT site, plus the stylesheets and script. Does the job Elementor Theme Builder would, without needing Elementor Pro.
 * Version:     1.0.0
 * Author:      Big On Digital
 *
 * GENERATED FILE — do not edit.
 * Rebuild with: node build/elementor/plugin.mjs
 *
 * Remove this plugin if you later move the header and footer into
 * Elementor Pro's Theme Builder, or you will get two of each.
 */

if (!defined('ABSPATH')) exit;

/* ---------------------------------------------------------------
   Stylesheets and script.

   wht-elementor.css MUST load after wht.css. It re-aims three things
   at the DOM Elementor renders — buttons, card grids and heading
   colours. Without it headings come out Elementor blue and every grid
   collapses to a single column.
   --------------------------------------------------------------- */
add_action('wp_enqueue_scripts', function () {
    $base = '/assets';
    $dir  = untrailingslashit(ABSPATH) . '/assets';
    $v    = function ($f) use ($dir) { return file_exists("$dir/$f") ? filemtime("$dir/$f") : null; };

    wp_enqueue_style('wht-fonts',
        'https://fonts.googleapis.com/css2?family=Exo+2:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap',
        [], null);
    wp_enqueue_style('wht', "$base/wht.css", [], $v('wht.css'));
    wp_enqueue_style('wht-elementor', "$base/wht-elementor.css", ['wht'], $v('wht-elementor.css'));
    wp_enqueue_script('wht', "$base/wht.js", [], $v('wht.js'), true);
}, 20);

/* Every rule in wht.css is scoped to .wht-site. Without this class the
   site renders completely unstyled. */
add_filter('body_class', function ($classes) {
    $classes[] = 'wht-site';
    return $classes;
});

/* ---------------------------------------------------------------
   Header and footer.

   wp_body_open and wp_footer both fire on the Elementor Canvas page
   template, which skips the theme's own header and footer. So the WHT
   chrome appears with nothing from the theme competing with it.
   --------------------------------------------------------------- */
add_action('wp_body_open', function () {
    if (is_admin()) return;
    echo <<<'WHT_HEADER_HTML'
${skipAndSprite}
${header}
WHT_HEADER_HTML;
}, 5);

add_action('wp_footer', function () {
    if (is_admin()) return;
    echo <<<'WHT_FOOTER_HTML'
${footer}
WHT_FOOTER_HTML;
}, 5);

/* ---------------------------------------------------------------
   One-click homepage import.

   Tools -> WHT Homepage. Imports the bundled Elementor template
   through Elementor's own importer, builds a page from it, sets the
   Elementor Canvas template and makes it the front page.

   Doing it here rather than through Templates -> Import matters for
   one reason: the header carries an inline SVG sprite of 37 icons, and
   WordPress strips every <svg> from anyone without unfiltered_html.
   This checks the capability up front and says so, instead of
   importing successfully and silently losing every icon.
   --------------------------------------------------------------- */
add_action('admin_menu', function () {
    add_management_page('WHT Homepage', 'WHT Homepage', 'manage_options', 'wht-homepage', 'wht_chrome_admin_page');
});

function wht_chrome_admin_page() {
    if (!current_user_can('manage_options')) wp_die('Not allowed.');

    $tpl_file = plugin_dir_path(__FILE__) . 'wht-home-launch.json';
    echo '<div class="wrap"><h1>WHT Homepage</h1>';

    if (isset($_POST['wht_do_import']) && check_admin_referer('wht_import')) {
        echo '<div class="notice notice-info"><p>' . esc_html(wht_chrome_import($tpl_file)) . '</p></div>';
    }

    if (!did_action('elementor/loaded')) {
        echo '<div class="notice notice-error"><p>Elementor is not active.</p></div></div>';
        return;
    }
    if (!file_exists($tpl_file)) {
        echo '<div class="notice notice-error"><p>Template file missing: ' . esc_html($tpl_file) . '</p></div></div>';
        return;
    }
    if (!current_user_can('unfiltered_html')) {
        echo '<div class="notice notice-warning"><p><strong>Warning:</strong> your user lacks the '
           . '<code>unfiltered_html</code> capability. WordPress will strip the 37-icon SVG sprite '
           . 'and every icon on the site will be invisible. On multisite only Super Admin has it; '
           . 'some security plugins remove it. Fix that before importing.</p></div>';
    }

    echo '<p>Imports the homepage template, creates the page with the Elementor Canvas '
       . 'layout and sets it as the front page. Safe to run again &mdash; it updates the same page.</p>';
    echo '<form method="post">';
    wp_nonce_field('wht_import');
    submit_button('Import the homepage', 'primary', 'wht_do_import');
    echo '</form></div>';
}

function wht_chrome_import($file) {
    $res = \\Elementor\\Plugin::$instance->templates_manager->import_template([
        'fileData' => base64_encode(file_get_contents($file)),
        'fileName' => basename($file),
    ]);
    if (is_wp_error($res)) return 'Import failed: ' . $res->get_error_message();

    $tpl = is_array($res) && isset($res[0]['template_id']) ? $res[0]['template_id'] : null;
    if (!$tpl) return 'Import returned no template id.';
    $data = get_post_meta($tpl, '_elementor_data', true);

    /* Reuse the page if this has been run before, so repeated runs do not
       leave a trail of duplicate home pages. */
    $existing = get_page_by_path('home');
    $page = $existing ? $existing->ID : wp_insert_post([
        'post_title'  => 'Home',
        'post_name'   => 'home',
        'post_status' => 'publish',
        'post_type'   => 'page',
    ]);

    update_post_meta($page, '_elementor_data', wp_slash($data));
    update_post_meta($page, '_elementor_edit_mode', 'builder');
    update_post_meta($page, '_wp_page_template', 'elementor_canvas');
    if (defined('ELEMENTOR_VERSION')) update_post_meta($page, '_elementor_version', ELEMENTOR_VERSION);

    update_option('show_on_front', 'page');
    update_option('page_on_front', $page);

    \\Elementor\\Plugin::$instance->files_manager->clear_cache();

    $svg = substr_count((string) $data, '<svg');
    return sprintf(
        'Imported. Template #%d, page #%d, now the front page. %d SVG elements survived%s',
        $tpl, $page, $svg,
        $svg ? '.' : ' - that is the unfiltered_html problem; fix the capability and run again.'
    );
}
`;

const outDir = join(root, 'dist-plugin', 'wht-chrome');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'wht-chrome.php'), php);
/* The template travels inside the plugin, so the import needs no file upload. */
writeFileSync(join(outDir, 'wht-home-launch.json'),
    readFileSync(join(root, 'dist-elementor', 'wht-home-launch.json'), 'utf8'));

const count = (s, re) => (s.match(re) || []).length;
console.log('wrote dist-plugin/wht-chrome/wht-chrome.php\n');
console.log(`  icon sprite symbols : ${count(skipAndSprite, /<symbol/g)}`);
console.log(`  header svg          : ${count(header, /<svg/g)}`);
console.log(`  footer svg          : ${count(footer, /<svg/g)}`);
console.log(`  footer parts        : ${['wht-footer', 'wht-search', 'wht-drawer', 'wht-mobilebar']
    .filter((c) => footer.includes(c)).join(', ')}`);
console.log(`  size                : ${(php.length / 1024).toFixed(1)} KB`);
