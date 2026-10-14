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
`;

const outDir = join(root, 'dist-plugin', 'wht-chrome');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'wht-chrome.php'), php);

const count = (s, re) => (s.match(re) || []).length;
console.log('wrote dist-plugin/wht-chrome/wht-chrome.php\n');
console.log(`  icon sprite symbols : ${count(skipAndSprite, /<symbol/g)}`);
console.log(`  header svg          : ${count(header, /<svg/g)}`);
console.log(`  footer svg          : ${count(footer, /<svg/g)}`);
console.log(`  footer parts        : ${['wht-footer', 'wht-search', 'wht-drawer', 'wht-mobilebar']
    .filter((c) => footer.includes(c)).join(', ')}`);
console.log(`  size                : ${(php.length / 1024).toFixed(1)} KB`);
