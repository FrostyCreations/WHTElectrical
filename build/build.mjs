/* =========================================================
   WHT ELECTRICAL — static page generator

   node build/build.mjs        → clickable local preview files in the project root
   node build/build.mjs --wp   → dist-wp/<permalink>/index.html with WordPress URLs

   After writing, every page is checked for broken internal links,
   missing icons, duplicate ids and heading problems. The build
   fails (exit 1) if anything is wrong.
   ========================================================= */
import { writeFileSync, readFileSync, mkdirSync, copyFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MODE, SITE, ROUTES, ICON_NAMES, head, header, footer, fontFaces } from './layout.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
MODE.wp = process.argv.includes('--wp');
/* --prod builds the real site. Without it you get the review build, whose
   robots.txt disallows everything — shipping that live would delist WHT. */
MODE.prod = process.argv.includes('--prod');
if (MODE.prod && !MODE.wp) {
    console.error('--prod only makes sense with --wp. Run: node build/build.mjs --wp --prod');
    process.exit(1);
}

const { pages } = await import('./pages.mjs');
const outDir = MODE.wp ? join(root, 'dist-wp') : root;

/* Every internal link now resolves to a generated page, so nothing is skipped. */
const EXTERNAL_PLACEHOLDERS = new Set();

/* The deployed stylesheets are minified; the source in assets/ keeps its
   comments. Deliberately conservative: comments go, strings (the data: URI
   icons) are kept byte for byte, runs of whitespace collapse, and spaces are
   dropped only around { } ; , and > — never around : + or -, where a space
   changes a selector (".a :hover") or breaks calc(). */
const minifyCss = (css) => {
    const squeeze = (t) => t.replace(/\s+/g, ' ').replace(/\s*([{};,>])\s*/g, '$1').replace(/;}/g, '}');
    /* Split into code and strings; a comment becomes a space in the code. */
    const parts = [''];
    let last = 0;
    for (const m of css.matchAll(/\/\*[\s\S]*?\*\/|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/g)) {
        parts[parts.length - 1] += css.slice(last, m.index);
        if (m[0].startsWith('/*')) parts[parts.length - 1] += ' ';
        else parts.push(m[0], '');
        last = m.index + m[0].length;
    }
    parts[parts.length - 1] += css.slice(last);
    return parts.map((p, i) => (i % 2 ? p : squeeze(p))).join('').trim() + '\n';
};

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
    /* wht-elementor.css only matters on the WordPress build, but it is
       harmless elsewhere and shipping it always keeps the two in step. */
    for (const f of ['wht.css', 'wht.js', 'wht-elementor.css']) {
        const from = join(root, 'assets', f);
        if (!existsSync(from)) continue;
        if (f.endsWith('.css')) writeFileSync(join(outDir, 'assets', f), minifyCss(readFileSync(from, 'utf8')));
        else copyFileSync(from, join(outDir, 'assets', f));
    }
    /* Photographs, fonts and the logo files travel with the build. */
    for (const dir of ['photos', 'img', 'video', 'fonts']) {
        const from = join(root, 'assets', dir);
        if (!existsSync(from)) continue;
        mkdirSync(join(outDir, 'assets', dir), { recursive: true });
        /* Notes for us, not for the web server. */
        for (const f of readdirSync(from)) {
            if (/^readme/i.test(f)) continue;
            copyFileSync(join(from, f), join(outDir, 'assets', dir, f));
        }
    }
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

    // 3b. Every local image actually exists. A wrong filename is otherwise silent.
    for (const m of body.matchAll(/(?:src|href)="((?!https?:|data:|#|mailto:|tel:)[^"]*assets\/[^"]+)"/g)) {
        const rel = m[1].replace(/^\//, '');
        if (!existsSync(join(root, rel))) fail(page, `missing file: ${m[1]}`);
    }

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
if (MODE.wp && MODE.prod) {
    /* The real site: crawlable, with the sitemap the old site never had
       (its only one was generated by an external tool back in 2023). */
    writeFileSync(join(outDir, 'robots.txt'),
        `User-agent: *\nAllow: /\n\nSitemap: ${SITE.domain}/sitemap.xml\n`);

    const today = new Date().toISOString().slice(0, 10);
    const urls = Object.keys(ROUTES).map((k) => {
        /* Home first, then service pages, then the rest. Priority is a hint only;
           Google ignores it, but other crawlers and AI indexers still read it. */
        const priority = k === 'home' ? '1.0'
            : ['privacy', 'terms'].includes(k) ? '0.3'
                : ['about', 'contact'].includes(k) ? '0.7' : '0.8';
        return `  <url>\n    <loc>${SITE.domain}${ROUTES[k].wp}</loc>\n` +
            `    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
    });
    writeFileSync(join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);

    console.log(`  ✓ ./${MODE.wp ? 'dist-wp' : '.'}/robots.txt (crawlable)\n  ✓ ./dist-wp/sitemap.xml (${urls.length} URLs)`);
}

if (MODE.wp) {
    if (!MODE.prod) {
        /* Keep the review site out of Google. It shares its copy and titles with the real
           whtelectrical.co.za, and two indexed copies would compete with each other.
           vercel.json also sends X-Robots-Tag: noindex on every response. */
        writeFileSync(join(outDir, 'robots.txt'),
            '# Client review deployment - not the live WHT Electrical website.\nUser-agent: *\nDisallow: /\n');
    }

    /* Friendly 404. On the real site this is what an old blog-post URL lands on if a
       redirect is ever missed, so it has to read like part of the site, not like a note
       to a reviewer. */
    const title404 = MODE.prod ? 'Page not found | WHT Electrical' : 'Page not part of this review | WHT Electrical';
    const h1_404 = MODE.prod ? 'We couldn&rsquo;t find that page' : 'This page is not part of the review';
    const body404 = MODE.prod
        ? 'The page may have moved, or the address may be slightly off. Start from the home page, or tell WHT what you need and we&rsquo;ll point you to the right place.'
        : 'The review site covers the 12 launch pages.';
    writeFileSync(join(outDir, '404.html'), `<!DOCTYPE html>
<html lang="en-ZA">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title404}</title>
<meta name="robots" content="noindex">
<style>${fontFaces()}</style>
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
      <h1>${h1_404}</h1>
      <p>${body404}</p>
      <a class="wht-btn wht-btn--primary" href="/">Back to the home page</a>
    </div>
  </main>
</div>
</body>
</html>
`);
    console.log(`  ✓ ./dist-wp/404.html${MODE.prod ? '' : '\n  ✓ ./dist-wp/robots.txt (noindex — review build)'}`);
}
