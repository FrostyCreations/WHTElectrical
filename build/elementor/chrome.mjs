/* =========================================================
   Header and footer as Elementor Theme Builder templates.

   These stay as HTML widgets, deliberately. The header carries the icon
   sprite and the search/burger controls; the footer carries the search
   overlay, the mobile drawer and the sticky contact bar. All of it is
   driven by wht.js through specific class names and data- attributes,
   and none of it is copy Wayne edits day to day. Rebuilding it from
   native widgets would mean reimplementing the drawer and overlay, and
   would break the hooks the script looks for.

   The one thing worth converting later is the nav itself, to Elementor's
   Nav Menu widget. Until then wht.js sets the current-page marker.

   Markup is lifted from the generated dist-wp pages, so it cannot drift
   from the static build.
   ========================================================= */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { box, html } from './lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SRC = join(root, 'dist-wp', 'index.html');

function source() {
    if (!existsSync(SRC)) {
        throw new Error('dist-wp/index.html is missing. Run: node build/build.mjs --wp --prod');
    }
    return readFileSync(SRC, 'utf8');
}

const between = (s, start, end, label) => {
    const a = s.indexOf(start);
    if (a < 0) throw new Error(`chrome.mjs: could not find ${label} start`);
    const b = s.indexOf(end, a + start.length);
    if (b < 0) throw new Error(`chrome.mjs: could not find ${label} end`);
    return s.slice(a + start.length, b);
};

/* ---------- header: skip link + icon sprite + <header> ---------- */
export const headerTitle = 'WHT — Header';
export const headerType = 'header';

export function buildHeader() {
    const s = source();
    const body = s.slice(s.indexOf('<div class="wht-site">'));
    const spriteAndSkip = between(body, '<div class="wht-site">', '<header', 'icon sprite').trim();
    const header = '<header' + between(body, '<header', '</header>', '<header>') + '</header>';

    return [
        box({ label: 'Header' }, [
            html(`${spriteAndSkip}\n${header}`, {
                label: 'Icon sprite + header — paste as Administrator (see note)',
            }),
        ]),
    ];
}

/* ---------- footer: footer + search overlay + drawer + mobile bar ---------- */
export const footerTitle = 'WHT — Footer';
export const footerType = 'footer';

export function buildFooter() {
    const s = source();
    const body = s.slice(s.indexOf('<div class="wht-site">'));
    const tail = between(body, '</main>', '\n</div>', 'footer block').trim();

    return [
        box({ label: 'Footer' }, [
            html(tail, { label: 'Footer, search overlay, drawer and mobile bar — keep together' }),
        ]),
    ];
}
