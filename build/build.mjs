/* =========================================================
   WHT ELECTRICAL — static page generator

   node build/build.mjs        → clickable local preview files in the project root
   node build/build.mjs --wp   → dist-wp/<permalink>/index.html with WordPress URLs

   After writing, every page is checked for broken internal links,
   missing icons, duplicate ids and heading problems. The build
   fails (exit 1) if anything is wrong.
   ========================================================= */
import { writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MODE, ROUTES, ICON_NAMES, head, header, footer } from './layout.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
MODE.wp = process.argv.includes('--wp');

const { pages } = await import('./pages.mjs');
const outDir = MODE.wp ? join(root, 'dist-wp') : root;

/* Links that intentionally point at pages outside the 10-page launch build. */
const EXTERNAL_PLACEHOLDERS = new Set(['/privacy-policy/', '/terms/']);

const outPath = (key) => MODE.wp
    ? join(outDir, ROUTES[key].wp, 'index.html')
    : join(outDir, ROUTES[key].file);

const errors = [];
const fail = (page, msg) => errors.push(`${ROUTES[page.key].file}: ${msg}`);

/* ---------- Render ---------- */
const rendered = [];
const seen = new Set();
for (const page of pages) {
    if (!ROUTES[page.key]) throw new Error(`Page has unknown key: ${page.key}`);
    if (seen.has(page.key)) throw new Error(`Duplicate page key: ${page.key}`);
    seen.add(page.key);

    const html = head(page) + header(page) + page.body(page) + footer(page);
    const file = outPath(page.key);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
    rendered.push({ page, html, file });
}

const missing = Object.keys(ROUTES).filter((k) => !seen.has(k));
if (missing.length) errors.push(`ROUTES with no page: ${missing.join(', ')}`);

if (MODE.wp) {
    mkdirSync(join(outDir, 'assets'), { recursive: true });
    for (const f of ['wht.css', 'wht.js']) copyFileSync(join(root, 'assets', f), join(outDir, 'assets', f));
}

/* ---------- Verify ---------- */
for (const { page, html, file } of rendered) {
    const body = html.slice(html.indexOf('<body>'));

    // 1. Exactly one <h1>
    const h1s = (body.match(/<h1[\s>]/g) || []).length;
    if (h1s !== 1) fail(page, `expected 1 <h1>, found ${h1s}`);

    // 2. No skipped heading levels on the way down (h2 → h4 etc.)
    let prev = 1;
    for (const m of body.matchAll(/<h([1-6])[\s>]/g)) {
        const lvl = Number(m[1]);
        if (lvl > prev + 1) { fail(page, `heading jumps from h${prev} to h${lvl}`); break; }
        prev = lvl;
    }

    // 3. Duplicate id attributes (sprite symbols are checked separately)
    const ids = [...body.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const dupes = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
    if (dupes.length) fail(page, `duplicate ids: ${dupes.join(', ')}`);

    // 4. Every icon used exists in the sprite
    const used = new Set([...body.matchAll(/href="#wi-([a-z0-9-]+)"/g)].map((m) => m[1]));
    for (const name of used) if (!ICON_NAMES.includes(name)) fail(page, `unknown icon #wi-${name}`);

    // 5. Internal links resolve to a generated file; in-page anchors resolve to an id
    for (const m of body.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
        const url = m[1];
        if (/^(https?:|tel:|mailto:)/.test(url) || EXTERNAL_PLACEHOLDERS.has(url)) continue;
        const [path, hash] = url.split('#');
        const targetKey = path === ''
            ? page.key
            : Object.keys(ROUTES).find((k) => (MODE.wp ? ROUTES[k].wp : ROUTES[k].file) === path);
        if (!targetKey) { fail(page, `broken link: ${url}`); continue; }
        if (hash) {
            const target = rendered.find((r) => r.page.key === targetKey);
            if (target && !target.html.includes(`id="${hash}"`)) fail(page, `anchor not found: ${url}`);
        }
    }

    // 6. Every image has an alt attribute (empty is fine for decorative/placeholder)
    const noAlt = [...body.matchAll(/<img\b(?![^>]*\salt=)[^>]*>/g)].length;
    if (noAlt) fail(page, `${noAlt} <img> without alt`);

    // 7. Visible FAQ count matches the FAQPage schema
    const visibleFaqs = (body.match(/<details class="wht-faq">/g) || []).length;
    const schemaFaqs = page.faqs ? page.faqs.length : 0;
    if (visibleFaqs !== schemaFaqs) fail(page, `FAQ mismatch: ${visibleFaqs} visible vs ${schemaFaqs} in schema`);

    // 8. Unfilled template expressions
    if (/\$\{|undefined|\[object Object\]/.test(body)) fail(page, 'unrendered template value in output');

    console.log(`  ✓ ${file.replace(root, '.').replace(/\\/g, '/')}`);
}

if (errors.length) {
    console.error(`\n✗ ${errors.length} problem(s):\n  - ${errors.join('\n  - ')}`);
    process.exit(1);
}
console.log(`\n${rendered.length} pages built and verified (${MODE.wp ? 'WordPress permalinks → dist-wp/' : 'local preview'}).`);
if (!existsSync(join(root, 'assets', 'wht.css'))) console.warn('warning: assets/wht.css not found');

/* ---------- Extras for the Vercel review deployment (--wp only) ---------- */
if (MODE.wp) {
    /* Keep the review site out of Google. It shares its copy and titles with the real
       whtelectrical.co.za, and two indexed copies would compete with each other.
       vercel.json also sends X-Robots-Tag: noindex on every response. */
    writeFileSync(join(outDir, 'robots.txt'),
        '# Client review deployment - not the live WHT Electrical website.\nUser-agent: *\nDisallow: /\n');

    /* Friendly 404. The footer links to /privacy-policy/ and /terms/, which are not part
       of the 10-page launch build, so a reviewer clicking them lands here. */
    writeFileSync(join(outDir, '404.html'), `<!DOCTYPE html>
<html lang="en-ZA">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Page not part of this review | WHT Electrical</title>
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/wht.css">
<style>
  .wht-404 { min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 40px 22px; background: var(--wht-navy); }
  .wht-404 h1 { color: #fff; font-size: clamp(26px, 4vw, 40px); }
  .wht-404 p { color: #D5DEEE; max-width: 520px; margin-left: auto; margin-right: auto; }
  .wht-404 .wht-btn { margin-top: 10px; }
</style>
</head>
<body>
<div class="wht-site">
  <main class="wht-404">
    <div>
      <h1>This page is not part of the review</h1>
      <p>The review site covers the 10 launch pages. Privacy Policy and Terms have not been written yet.</p>
      <a class="wht-btn wht-btn--primary" href="/">Back to the home page</a>
    </div>
  </main>
</div>
</body>
</html>
`);
    console.log('  ✓ ./dist-wp/robots.txt\n  ✓ ./dist-wp/404.html');
}
