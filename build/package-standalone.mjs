/* =========================================================
   WHT ELECTRICAL — standalone single-file pages

       node build/build.mjs && node build/package-standalone.mjs

   Takes the local preview build and folds the stylesheet, the script and
   every photograph into each page, so one .html file opens correctly on
   its own with no assets folder beside it. Links between the 12 pages stay
   relative, so they still work when the files sit in one folder together.

   Two things are deliberately NOT inlined:

   - Google Fonts. Inlining latin + latin-ext costs ~975 KB per page, which
     is 11.7 MB across twelve files. The CDN link stays; without a connection
     the pages fall back to the Segoe UI / system stack already in the font
     declarations.
   - The hero video, which would be over a megabyte once base64-encoded. The
     poster photograph is inlined and the video streams from the review
     deployment. If that is ever taken down, the hero shows the still.
   ========================================================= */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'standalone');
const VIDEO_URL = 'https://wht-electrical.vercel.app/assets/video/wht-hero.mp4';

const PAGES = [
    'index.html', 'electrical.html', 'electrical-fault-finding-repairs.html',
    'electrical-coc.html', 'electrical-gate-motors-electric-fencing.html',
    'solar-backup-power.html', 'plumbing.html', 'property-maintenance.html',
    'about.html', 'contact.html', 'privacy-policy.html', 'terms.html',
];

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };

const missing = PAGES.filter((p) => !existsSync(join(root, p)));
if (missing.length) {
    console.error(`Missing pages: ${missing.join(', ')}\nRun: node build/build.mjs`);
    process.exit(1);
}

/* Read each asset once; the same photo appears on several pages. */
const cache = new Map();
const dataUri = (rel) => {
    if (cache.has(rel)) return cache.get(rel);
    const file = join(root, rel);
    if (!existsSync(file)) throw new Error(`asset referenced but not on disk: ${rel}`);
    const mime = MIME[extname(rel).toLowerCase()];
    if (!mime) throw new Error(`no MIME type known for: ${rel}`);
    const uri = `data:${mime};base64,${readFileSync(file).toString('base64')}`;
    cache.set(rel, uri);
    return uri;
};

const GOOGLE_FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
    + '    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
    + '    <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">';

const css = readFileSync(join(root, 'assets', 'wht.css'), 'utf8');
const js = readFileSync(join(root, 'assets', 'wht.js'), 'utf8');

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const rows = [];

for (const page of PAGES) {
    let html = readFileSync(join(root, page), 'utf8');
    const before = Buffer.byteLength(html);
    let images = 0;

    /* 1. Stylesheet. </style> cannot appear in CSS, so a plain inline is safe. */
    html = html.replace(
        '<link rel="stylesheet" href="assets/wht.css">',
        `<style>\n${css}\n    </style>`);

    /* 2. Script. It sits at the end of <body>, so everything it queries is
          already parsed and dropping `defer` changes nothing. */
    html = html.replace(
        '<script src="assets/wht.js" defer></script>',
        `<script>\n${js}\n</script>`);

    /* 3. Preload and preconnect hints. The hero is a data URI now, so
          preloading it would download the same bytes twice. */
    html = html.replace(/\s*<link rel="preload" as="image"[^>]*>/g, '');

    /* 4. The hero video streams; the photo under it is inlined below. One
          image each, so the responsive srcset copies are dropped. */
    html = html.replace(/data-src="assets\/video\/wht-hero\.mp4"/g, `src="${VIDEO_URL}"`);
    html = html.replace(/\s(?:data-src-webm|srcset|sizes)="[^"]*"/g, '');

    /* 4b. Fonts. The self-hosted files are not embedded (they would add
           ~120 KB to every page), so a standalone page asks Google instead. */
    html = html.replace(/\s*<link rel="preload" as="font"[^>]*>/g, '');
    html = html.replace(/<style>@font-face[^<]*<\/style>/, GOOGLE_FONTS);

    /* 5. Every remaining local image. */
    html = html.replace(/(src|poster)="(assets\/(?:photos|img)\/[^"]+)"/g, (m, attr, rel) => {
        images++;
        return `${attr}="${dataUri(rel)}"`;
    });

    /* 6. Nothing local may be left pointing at the assets folder. */
    const leftover = [...html.matchAll(/(?:src|href|data-src)="(assets\/[^"]+)"/g)].map((m) => m[1]);
    if (leftover.length) throw new Error(`${page}: still references ${[...new Set(leftover)].join(', ')}`);

    html = html.replace('<!DOCTYPE html>',
`<!DOCTYPE html>
<!-- WHT Electrical - standalone page. Stylesheet, script and photographs are
     embedded; this file opens on its own with no assets folder.
     Fonts load from Google and the hero video streams from the review site,
     so both need a connection; without one the page falls back to system
     fonts and the still photograph. Links to the other 11 pages work when
     all twelve files sit in the same folder. -->`);

    writeFileSync(join(out, page), html);
    rows.push({ page, images, kb: +(Buffer.byteLength(html) / 1024).toFixed(0), wasKb: +(before / 1024).toFixed(0) });
}

const total = rows.reduce((n, r) => n + r.kb, 0);
const w = Math.max(...rows.map((r) => r.page.length));
console.log(`Standalone pages written to standalone/\n`);
console.log(`  ${'page'.padEnd(w)}   images   size`);
for (const r of rows) {
    console.log(`  ${r.page.padEnd(w)}   ${String(r.images).padStart(6)}   ${String(r.kb).padStart(5)} KB`);
}
console.log(`  ${''.padEnd(w)}            ${String(total).padStart(5)} KB total`);
console.log(`\n${cache.size} distinct assets embedded. No page references the assets folder.`);
