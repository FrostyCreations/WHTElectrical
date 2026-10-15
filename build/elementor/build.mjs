/* =========================================================
   Build the WHT Elementor templates.

       node build/elementor/build.mjs

   Writes one .json per page into dist-elementor/, ready for
   Elementor -> Templates -> Saved Templates -> Import Templates.
   Also writes a DOM simulation of each so the styling can be checked
   in a browser before anything touches WordPress.
   ========================================================= */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MODE } from '../layout.mjs';
import { resetIds } from './lib.mjs';
import { renderPage } from './simulate.mjs';

MODE.wp = true;   // absolute /assets/... paths, as WordPress serves them

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const outDir = join(root, 'dist-elementor');
mkdirSync(outDir, { recursive: true });

/* slug is both the template file name and the pages.mjs key. `pick`
   names the export when one module holds more than one page. */
const PAGES = [
    { slug: 'home', module: './home.mjs' },
    { slug: 'electrical', module: './electrical.mjs' },
    { slug: 'fault', module: './fault.mjs' },
    { slug: 'coc', module: './coc.mjs' },
    { slug: 'gate', module: './gate.mjs' },
    { slug: 'solar', module: './solar.mjs' },
    { slug: 'plumbing', module: './plumbing.mjs' },
    { slug: 'maintenance', module: './maintenance.mjs' },
    { slug: 'about', module: './about.mjs' },
    { slug: 'contact', module: './contact.mjs' },
    { slug: 'privacy', module: './legal.mjs', pick: 'privacy' },
    { slug: 'terms', module: './legal.mjs', pick: 'terms' },
];

/* Theme Builder templates. Elementor keys these off the template `type`,
   so they land under Templates -> Theme Builder rather than Saved Templates. */
const CHROME = [
    { slug: 'header', build: 'buildHeader', title: 'headerTitle', type: 'headerType' },
    { slug: 'footer', build: 'buildFooter', title: 'footerTitle', type: 'footerType' },
];

const census = (content) => {
    const n = {};
    (function walk(els) {
        for (const e of els || []) { n[e.widgetType || e.elType] = (n[e.widgetType || e.elType] || 0) + 1; walk(e.elements); }
    })(content);
    return n;
};

let failed = false;
const built = {};

for (const { slug, module, pick } of PAGES) {
    let page;
    try { page = await import(module); if (pick) page = page[pick]; }
    catch (e) { console.error(`  FAIL ${slug}: ${e.message.split('\n')[0]}`); failed = true; continue; }

    /* Ids are derived from the page slug, so rebuilding does not churn
       every id in every file and the diffs stay readable. */
    resetIds(`wht-${slug}`);
    const content = page.build();
    built[slug] = content;

    const template = { content, page_settings: {}, version: '0.4', title: page.title, type: 'page' };
    writeFileSync(join(outDir, `wht-${slug}.json`), JSON.stringify(template, null, 2));

    /* The simulation throws on any widget it does not know, so an
       unsupported widget cannot quietly render as nothing. */
    try {
        writeFileSync(join(root, `_elementor-sim-${slug}.html`), renderPage(content, page.title));
    } catch (e) {
        console.error(`  FAIL ${slug}: ${e.message}`);
        failed = true;
    }

    const c = census(content);
    const editable = Object.entries(c)
        .filter(([k]) => k !== 'container' && k !== 'html')
        .reduce((n, [, v]) => n + v, 0);
    console.log(`  ${slug.padEnd(10)} ${String(editable).padStart(3)} editable widgets, ${c.html || 0} html, ${c.container || 0} containers`);
}

/* ---------- header and footer ---------- */
const chrome = await import('./chrome.mjs');
for (const c of CHROME) {
    resetIds(`wht-${c.slug}`);
    const content = chrome[c.build]();
    built[c.slug] = content;
    writeFileSync(join(outDir, `wht-${c.slug}.json`), JSON.stringify({
        content, page_settings: {}, version: '0.4',
        title: chrome[c.title], type: chrome[c.type],
    }, null, 2));
    const c2 = census(content);
    console.log(`  ${c.slug.padEnd(10)} ${String(c2.html || 0).padStart(3)} html widget(s)  → Theme Builder (${chrome[c.type]})`);
}

/* A full-page simulation: header + page + footer, which is what the live page
   actually is. Checking the page on its own would miss the chrome entirely. */
for (const { slug } of PAGES) {
    if (!built[slug] || !built.header || !built.footer) continue;
    const whole = [...built.header, ...built[slug], ...built.footer];
    writeFileSync(join(root, `_elementor-sim-full-${slug}.html`), renderPage(whole, `full ${slug}`));
}
console.log(`  full-*     header + page + footer, ${PAGES.length} pages`);

/* Every piece of approved copy on the static page must reach the template,
   and nothing may appear in the template that the static page lacks. */
const { checkCopy } = await import('./check-copy.mjs');
if (!checkCopy(PAGES.map((p) => p.slug), built)) failed = true;

console.log(`\n→ dist-elementor/*.json   (Elementor → Templates → Import)`);
console.log(`→ _elementor-sim-*.html   (serve the project root to view)`);
process.exit(failed ? 1 : 0);
