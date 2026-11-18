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
import { ROUTES } from '../layout.mjs';

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

/* Pages the importer offers, parents before children. Slugs and parents
   give the Tab 2 permalinks (ROUTES in layout.mjs). Adding draft: true makes
   a page import as a draft; Contact had it until its form was tested
   (16 Oct 2026). */
const PAGES = [
    { file: 'wht-home.json', title: 'Home', slug: 'home', front: true },
    { file: 'wht-electrical.json', title: 'Electrical', slug: 'electrical' },
    { file: 'wht-fault.json', title: 'Fault Finding & Repairs', slug: 'fault-finding-repairs', parent: 'electrical' },
    { file: 'wht-coc.json', title: 'Electrical COCs', slug: 'coc', parent: 'electrical' },
    { file: 'wht-gate.json', title: 'Gate Motors & Electric Fencing', slug: 'gate-motors-electric-fencing', parent: 'electrical' },
    { file: 'wht-solar.json', title: 'Solar & Backup Power', slug: 'solar-backup-power' },
    { file: 'wht-plumbing.json', title: 'Plumbing', slug: 'plumbing' },
    { file: 'wht-maintenance.json', title: 'Property Maintenance', slug: 'property-maintenance' },
    { file: 'wht-about.json', title: 'About', slug: 'about' },
    { file: 'wht-contact.json', title: 'Contact', slug: 'contact' },
    { file: 'wht-privacy.json', title: 'Privacy Policy', slug: 'privacy-policy' },
    { file: 'wht-terms.json', title: 'Terms', slug: 'terms' },
];

/* Every permalink must match the static build's, or links between pages break. */
for (const p of PAGES) {
    const key = p.file.replace(/^wht-|\.json$/g, '');
    const want = ROUTES[key].wp;
    const got = p.front ? '/' : `/${p.parent ? p.parent + '/' : ''}${p.slug}/`;
    if (want !== got) throw new Error(`${p.file}: importer would create ${got}, the site links to ${want}`);
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
    /* jquery: wht.js listens for Elementor Pro's jQuery submit_success event. */
    wp_enqueue_script('wht', "$base/wht.js", ['jquery'], $v('wht.js'), true);
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

   The markup is lifted from the static homepage, so it arrives with
   Home marked as the current page. wht_chrome_mark_current() moves
   that mark to whichever page is being served.
   --------------------------------------------------------------- */
function wht_chrome_mark_current($html) {
    $html = str_replace(' aria-current="page"', '', $html);
    $path = is_front_page() ? '/' : trailingslashit(wp_parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/');

    /* Nav and drawer links only, as in the static build: plain links and
       the indented service children, never the logo or a CTA button. */
    $html = preg_replace_callback('/<a\\b[^>]*>/', function ($m) use ($path) {
        $tag = $m[0];
        if (strpos($tag, 'href="' . $path . '"') === false) return $tag;
        if (preg_match('/class="([^"]*)"/', $tag, $c) && strpos($c[1], '__child') === false) return $tag;
        return substr($tag, 0, -1) . ' aria-current="page">';
    }, $html);

    /* The Services toggle shows the section as current on any service page. */
    foreach (['/electrical/', '/solar-backup-power/', '/plumbing/', '/property-maintenance/'] as $s) {
        if (strpos($path, $s) === 0) {
            $html = str_replace('class="wht-nav__toggle"', 'class="wht-nav__toggle is-section"', $html);
            break;
        }
    }
    return $html;
}

add_action('wp_body_open', function () {
    if (is_admin()) return;
    $html = <<<'WHT_HEADER_HTML'
${skipAndSprite}
${header}
WHT_HEADER_HTML;
    echo wht_chrome_mark_current($html);
}, 5);

add_action('wp_footer', function () {
    if (is_admin()) return;
    $html = <<<'WHT_FOOTER_HTML'
${footer}
WHT_FOOTER_HTML;
    echo wht_chrome_mark_current($html);
}, 5);

/* ---------------------------------------------------------------
   One-click page import.

   Tools -> WHT Pages. Imports each bundled Elementor template through
   Elementor's own importer, builds the page from it at its Tab 2
   permalink, and sets the Elementor Canvas template.

   Doing it here rather than through Templates -> Import matters for
   one reason: the header carries an inline SVG sprite of 37 icons, and
   WordPress strips every <svg> from anyone without unfiltered_html.
   This checks the capability up front and says so, instead of
   importing successfully and silently losing every icon.

   Re-importing a page REPLACES its content, so any edits made to it in
   Elementor are lost. "Import all new pages" therefore only touches
   pages that do not exist yet; a page that does exist has to be
   re-imported on purpose, from its own button.
   --------------------------------------------------------------- */
function wht_chrome_pages() {
    return json_decode(<<<'WHT_PAGES_JSON'
${JSON.stringify(PAGES, null, 1)}
WHT_PAGES_JSON, true);
}

add_action('admin_menu', function () {
    /* Slug kept from the homepage-only version, so old links still work. */
    add_management_page('WHT Pages', 'WHT Pages', 'manage_options', 'wht-homepage', 'wht_chrome_admin_page');
});

/* The page at this entry's permalink, whatever its status. */
function wht_chrome_find($p) {
    return get_page_by_path((!empty($p['parent']) ? $p['parent'] . '/' : '') . $p['slug'], OBJECT, 'page');
}

function wht_chrome_admin_page() {
    if (!current_user_can('manage_options')) wp_die('Not allowed.');
    $pages = wht_chrome_pages();
    $dir   = plugin_dir_path(__FILE__);
    echo '<div class="wrap"><h1>WHT Pages</h1>';

    if (!did_action('elementor/loaded')) {
        echo '<div class="notice notice-error"><p>Elementor is not active.</p></div></div>';
        return;
    }

    if ((isset($_POST['wht_import_one']) || isset($_POST['wht_import_new'])) && check_admin_referer('wht_import')) {
        $todo = [];
        if (isset($_POST['wht_import_one'])) {
            $f = sanitize_file_name(wp_unslash($_POST['wht_import_one']));
            foreach ($pages as $p) if ($p['file'] === $f) $todo[] = $p;
        } else {
            foreach ($pages as $p) if (empty($p['front']) && !wht_chrome_find($p)) $todo[] = $p;
        }
        if (!$todo) echo '<div class="notice notice-info"><p>Nothing to import: every page already exists.</p></div>';
        foreach ($todo as $p) {
            echo '<div class="notice notice-info"><p>' . esc_html(wht_chrome_import($p, $dir . $p['file'])) . '</p></div>';
        }
    }

    if (!current_user_can('unfiltered_html')) {
        echo '<div class="notice notice-warning"><p><strong>Warning:</strong> your user lacks the '
           . '<code>unfiltered_html</code> capability. WordPress will strip the 37-icon SVG sprite '
           . 'and every icon on the site will be invisible. On multisite only Super Admin has it; '
           . 'some security plugins remove it. Fix that before importing.</p></div>';
    }

    echo '<p>Each page is built from the WHT template with the Elementor Canvas layout. '
       . '<strong>Re-importing a page replaces its content</strong>, including any edits made in Elementor.</p>';
    echo '<form method="post">';
    wp_nonce_field('wht_import');
    echo '<table class="widefat striped" style="max-width:900px"><thead><tr><th>Page</th><th>Address</th><th>Status</th><th></th></tr></thead><tbody>';
    foreach ($pages as $p) {
        $page = wht_chrome_find($p);
        $path = '/' . (!empty($p['parent']) ? $p['parent'] . '/' : '') . $p['slug'] . '/';
        if (!empty($p['front'])) $path = '/';
        $status = $page ? esc_html($page->post_status) . (get_post_meta($page->ID, '_elementor_data', true) ? '' : ' (not built with Elementor)') : 'not created';
        $missing = !file_exists($dir . $p['file']);
        echo '<tr><td>' . esc_html($p['title']) . (!empty($p['draft']) ? ' <em>(imports as a draft)</em>' : '') . '</td>'
           . '<td><code>' . esc_html($path) . '</code></td><td>' . $status . '</td><td>';
        if ($missing) echo 'template file missing';
        else echo '<button class="button" name="wht_import_one" value="' . esc_attr($p['file']) . '"'
           . ($page ? ' onclick="return confirm(\\'Replace the content of ' . esc_js($p['title']) . '? Edits made in Elementor will be lost.\\')"' : '')
           . '>' . ($page ? 'Re-import' : 'Import') . '</button>';
        echo '</td></tr>';
    }
    echo '</tbody></table>';
    submit_button('Import all new pages', 'primary', 'wht_import_new');
    echo '<p class="description">Creates the pages that do not exist yet. Never touches the homepage or a page that already exists.</p>';
    echo '</form></div>';
}

function wht_chrome_import($p, $file) {
    $res = \\Elementor\\Plugin::$instance->templates_manager->import_template([
        'fileData' => base64_encode(file_get_contents($file)),
        'fileName' => basename($file),
    ]);
    if (is_wp_error($res)) return $p['title'] . ': import failed: ' . $res->get_error_message();

    $tpl = is_array($res) && isset($res[0]['template_id']) ? $res[0]['template_id'] : null;
    if (!$tpl) return $p['title'] . ': import returned no template id.';
    $data = get_post_meta($tpl, '_elementor_data', true);

    $parent = 0;
    if (!empty($p['parent'])) {
        $pp = get_page_by_path($p['parent'], OBJECT, 'page');
        if (!$pp) return $p['title'] . ': import its parent page first (' . $p['parent'] . ').';
        $parent = $pp->ID;
    }

    /* Reuse the page if it exists, so repeated runs do not leave
       duplicates. WordPress ships a draft at /privacy-policy/, which
       this picks up and publishes. */
    $status   = !empty($p['draft']) ? 'draft' : 'publish';
    $existing = wht_chrome_find($p);
    if ($existing) {
        $page = $existing->ID;
        if ($existing->post_status !== 'publish') {
            wp_update_post(['ID' => $page, 'post_status' => $status, 'post_title' => $p['title']]);
        }
    } else {
        $page = wp_insert_post([
            'post_title'  => $p['title'],
            'post_name'   => $p['slug'],
            'post_parent' => $parent,
            'post_status' => $status,
            'post_type'   => 'page',
        ]);
    }

    update_post_meta($page, '_elementor_data', wp_slash($data));
    update_post_meta($page, '_elementor_edit_mode', 'builder');
    update_post_meta($page, '_wp_page_template', 'elementor_canvas');
    if (defined('ELEMENTOR_VERSION')) update_post_meta($page, '_elementor_version', ELEMENTOR_VERSION);

    if (!empty($p['front'])) {
        update_option('show_on_front', 'page');
        update_option('page_on_front', $page);
    }

    \\Elementor\\Plugin::$instance->files_manager->clear_cache();

    $svg = substr_count((string) $data, '<svg');
    return sprintf('%s: imported as page #%d (%s), %d SVG elements%s',
        $p['title'], $page, get_post_status($page), $svg,
        ($svg || strpos(file_get_contents($file), '<svg') === false) ? '.' : ' - expected some; that is the unfiltered_html problem.');
}
`;

const outDir = join(root, 'dist-plugin', 'wht-chrome');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'wht-chrome.php'), php);
/* The templates travel inside the plugin, so the import needs no file upload. */
for (const p of PAGES) {
    writeFileSync(join(outDir, p.file), readFileSync(join(root, 'dist-elementor', p.file), 'utf8'));
}

const count = (s, re) => (s.match(re) || []).length;
console.log('wrote dist-plugin/wht-chrome/wht-chrome.php\n');
console.log(`  icon sprite symbols : ${count(skipAndSprite, /<symbol/g)}`);
console.log(`  header svg          : ${count(header, /<svg/g)}`);
console.log(`  footer svg          : ${count(footer, /<svg/g)}`);
console.log(`  footer parts        : ${['wht-footer', 'wht-search', 'wht-drawer', 'wht-mobilebar']
    .filter((c) => footer.includes(c)).join(', ')}`);
console.log(`  size                : ${(php.length / 1024).toFixed(1)} KB`);
