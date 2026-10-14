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

const PAGES = [
    { slug: 'home', module: './home.mjs' },
    { slug: 'contact', module: './contact.mjs' },
];

const census = (content) => {
    const n = {};
    (function walk(els) {
        for (const e of els || []) { n[e.widgetType || e.elType] = (n[e.widgetType || e.elType] || 0) + 1; walk(e.elements); }
    })(content);
    return n;
};

let failed = false;

for (const { slug, module } of PAGES) {
    let page;
    try { page = await import(module); }
    catch (e) { console.log(`  skip ${slug}: ${e.message.split('\n')[0]}`); continue; }

    /* Ids are derived from the page slug, so rebuilding does not churn
       every id in every file and the diffs stay readable. */
    resetIds(`wht-${slug}`);
    const content = page.build();

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

console.log(`\n→ dist-elementor/*.json   (Elementor → Templates → Import)`);
console.log(`→ _elementor-sim-*.html   (serve the project root to view)`);
process.exit(failed ? 1 : 0);
