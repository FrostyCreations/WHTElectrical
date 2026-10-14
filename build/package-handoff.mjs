/* =========================================================
   WHT ELECTRICAL — developer hand-off package

       node build/build.mjs --wp && node build/package-handoff.mjs

   Splits the generated dist-wp pages into the pieces an Elementor
   developer actually pastes: one header template, one footer template,
   one file per page holding only what goes inside <main>, and the head
   metadata and JSON-LD separately. Nothing here is hand-maintained —
   rerun it after any build and the package is current.
   ========================================================= */
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist-wp');
const out = join(root, 'handoff', 'WHT-Electrical-Handoff');

if (!existsSync(join(dist, 'index.html'))) {
    console.error('dist-wp is missing. Run: node build/build.mjs --wp');
    process.exit(1);
}

/* Order here is the order the developer should build them, parents first,
   because the child pages cannot be nested until their parent exists. */
const PAGES = [
    { n: '01', slug: '',                                file: 'index.html',                                        wpTitle: 'Home',                             parent: '',            url: '/' },
    { n: '02', slug: 'electrical',                      file: 'electrical/index.html',                             wpTitle: 'Electrical',                       parent: '',            url: '/electrical/' },
    { n: '03', slug: 'fault-finding-repairs',           file: 'electrical/fault-finding-repairs/index.html',       wpTitle: 'Fault Finding & Repairs',          parent: 'electrical',  url: '/electrical/fault-finding-repairs/' },
    { n: '04', slug: 'coc',                             file: 'electrical/coc/index.html',                         wpTitle: 'Electrical COCs',                  parent: 'electrical',  url: '/electrical/coc/' },
    { n: '05', slug: 'gate-motors-electric-fencing',    file: 'electrical/gate-motors-electric-fencing/index.html', wpTitle: 'Gate Motors & Electric Fencing',  parent: 'electrical',  url: '/electrical/gate-motors-electric-fencing/' },
    { n: '06', slug: 'solar-backup-power',              file: 'solar-backup-power/index.html',                     wpTitle: 'Solar & Backup Power',             parent: '',            url: '/solar-backup-power/' },
    { n: '07', slug: 'plumbing',                        file: 'plumbing/index.html',                               wpTitle: 'Plumbing',                         parent: '',            url: '/plumbing/' },
    { n: '08', slug: 'property-maintenance',            file: 'property-maintenance/index.html',                   wpTitle: 'Property Maintenance',             parent: '',            url: '/property-maintenance/' },
    { n: '09', slug: 'about',                           file: 'about/index.html',                                  wpTitle: 'About WHT',                        parent: '',            url: '/about/' },
    { n: '10', slug: 'contact',                         file: 'contact/index.html',                                wpTitle: 'Contact',                          parent: '',            url: '/contact/' },
    { n: '11', slug: 'privacy-policy',                  file: 'privacy-policy/index.html',                         wpTitle: 'Privacy Policy',                   parent: '',            url: '/privacy-policy/' },
    { n: '12', slug: 'terms',                           file: 'terms/index.html',                                  wpTitle: 'Terms',                            parent: '',            url: '/terms/' },
];

const between = (s, start, end, label, file) => {
    const a = s.indexOf(start);
    if (a < 0) throw new Error(`${file}: could not find ${label} start`);
    const b = s.indexOf(end, a + start.length);
    if (b < 0) throw new Error(`${file}: could not find ${label} end`);
    return s.slice(a + start.length, b);
};

const tag = (s, re, label, file) => {
    const m = s.match(re);
    if (!m) throw new Error(`${file}: no ${label}`);
    return m[1];
};

/* ---------- read and split every page ---------- */
const parsed = PAGES.map((p) => {
    const html = readFileSync(join(dist, p.file), 'utf8');
    const body = html.slice(html.indexOf('<div class="wht-site">'));
    return {
        ...p,
        title: tag(html, /<title>([\s\S]*?)<\/title>/, '<title>', p.file),
        description: tag(html, /<meta name="description" content="([\s\S]*?)">/, 'meta description', p.file),
        canonical: tag(html, /<link rel="canonical" href="([^"]+)">/, 'canonical', p.file),
        schema: [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1].trim()),
        sprite: between(body, '<div class="wht-site">', '<header', 'icon sprite', p.file).trim(),
        header: '<header' + between(body, '<header', '</header>', '<header>', p.file) + '</header>',
        main: between(body, '<main id="wht-main">', '</main>', '<main>', p.file),
        tail: between(body, '</main>', '\n</div>', 'footer block', p.file).trim(),
    };
});

/* ---------- the shared blocks must really be shared ----------
   The header and the drawer nav mark the current page with aria-current and an
   is-section class, so they are compared with those stripped. One shared
   Elementor template cannot carry a per-page marker; step 8 of START-HERE.md
   deals with it. Anything differing beyond that would mean the block is not
   safely shareable, so it stops the package rather than shipping a header that
   is silently wrong on some pages. */
const home = parsed[0];
const normalise = (s) => s.replace(/ aria-current="page"/g, '').replace(/ is-section/g, '');
const differs = (key) => parsed
    .filter((p) => normalise(p[key]) !== normalise(home[key]))
    .map((p) => p.wpTitle);
const markedCount = (key) => parsed.filter((p) => p[key] !== home[key]).length;

for (const [key, label] of [['sprite', 'icon sprite'], ['header', 'header'], ['tail', 'footer block']]) {
    const d = differs(key);
    if (d.length) throw new Error(`${label} differs beyond the current-page marker on: ${d.join(', ')}`);
}

/* ---------- write the package ---------- */
rmSync(join(root, 'handoff'), { recursive: true, force: true });
const dir = (...p) => { const d = join(out, ...p); mkdirSync(d, { recursive: true }); return d; };

cpSync(join(root, 'assets'), dir('assets'), { recursive: true });

const el = dir('elementor');
const pagesDir = dir('elementor', 'pages');
const seoDir = dir('elementor', 'seo');
const schemaDir = dir('elementor', 'seo', 'schema');

const note = (lines) => `<!--\n${lines.map((l) => '    ' + l).join('\n')}\n-->\n`;

/* Sitewide <head> code */
writeFileSync(join(el, '00-sitewide-head.html'),
    note([
        'WHT Electrical - sitewide head code',
        '',
        'Elementor -> Custom Code, Location: <head>, Include: Entire Site.',
        'Every page depends on these three. Load them once, not per page.',
        '',
        'Adjust the two /assets/ paths if you upload the folder somewhere',
        'other than the web root.',
    ]) +
`<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/wht.css">
<meta name="theme-color" content="#1E2F4D">
`);

/* Sitewide footer code */
writeFileSync(join(el, '00-sitewide-footer-code.html'),
    note([
        'WHT Electrical - sitewide footer code',
        '',
        'Elementor -> Custom Code, Location: </body> - End, Include: Entire Site.',
        'Drives the mobile drawer, the search overlay, the sticky header shadow,',
        'the FAQ accordions and the dataLayer click tracking.',
    ]) +
'<script src="/assets/wht.js" defer></script>\n');

/* The body class that every style hangs off */
writeFileSync(join(el, '00-body-class-snippet.php'),
`<?php
/**
 * WHT Electrical - required body class.
 *
 * Every rule in wht.css is scoped to .wht-site, and the colour, spacing and
 * font custom properties are declared on it. Without this class the site
 * renders unstyled.
 *
 * Add via WPCode (PHP snippet, run everywhere) or the child theme functions.php.
 * Do NOT wrap the header, content and footer blocks in three separate
 * .wht-site divs instead - on mobile that applies the sticky-bar padding
 * three times and leaves a gap at the bottom of every page.
 */
add_filter( 'body_class', function ( $classes ) {
    $classes[] = 'wht-site';
    return $classes;
} );
`);

/* Header template */
writeFileSync(join(el, '01-header-template.html'),
    note([
        'WHT Electrical - header template',
        '',
        'Elementor -> Templates -> Theme Builder -> Header, one HTML widget,',
        'full width, no padding. Display Conditions: Entire Site.',
        '',
        'Two blocks below: the icon sprite, then the header itself.',
        'The sprite defines all 37 icons used across the site and must load',
        'once per page - every <use href="#wi-..."> elsewhere points at it.',
        '',
        'IMPORTANT: paste this while logged in as an Administrator with the',
        'unfiltered_html capability, or WordPress strips every <svg> and the',
        'icons vanish sitewide. See START-HERE.md step 6.',
        '',
        'The current-page highlight (aria-current / is-section) cannot be static',
        'in a shared header - see START-HERE.md step 8.',
    ]) + home.sprite + '\n\n' + home.header + '\n');

/* Footer template */
writeFileSync(join(el, '02-footer-template.html'),
    note([
        'WHT Electrical - footer template',
        '',
        'Elementor -> Templates -> Theme Builder -> Footer, one HTML widget,',
        'full width, no padding. Display Conditions: Entire Site.',
        '',
        'Contains four things, all of which the script expects to find:',
        'the footer, the search overlay, the mobile drawer, and the sticky',
        'mobile contact bar. Keep them together and in this order.',
    ]) + home.tail + '\n');

/* One file per page */
for (const p of parsed) {
    writeFileSync(join(pagesDir, `${p.n}-${p.slug || 'home'}.html`),
        note([
            `WHT Electrical - ${p.wpTitle}`,
            '',
            `WordPress page title : ${p.wpTitle}`,
            `Slug                 : ${p.slug || '(front page)'}`,
            `Parent page          : ${p.parent || '(none)'}`,
            `Final URL            : ${p.url}`,
            '',
            'Page Attributes -> Template: Elementor Canvas',
            'One HTML widget holding everything below, full width, no padding.',
            '',
            'Keep the <main id="wht-main"> wrapper. The "Skip to content" link in',
            'the header template points at that id, and it is also what gives the',
            'section anchors somewhere to land.',
            '',
            'SEO title and meta description: see seo/page-meta.csv',
            `Structured data (${p.schema.length} block${p.schema.length === 1 ? '' : 's'}): see seo/schema/${p.slug || 'home'}.html`,
        ]) + '<main id="wht-main">\n' + p.main.trim() + '\n</main>\n');

    /* Paste-ready: the full <script> tags, not bare JSON, because that is what
       goes into WPCode. Each block is parsed first so a malformed one cannot
       reach the developer. */
    for (const block of p.schema) {
        try { JSON.parse(block); }
        catch (e) { throw new Error(`${p.file}: JSON-LD does not parse — ${e.message}`); }
    }
    writeFileSync(join(schemaDir, `${p.slug || 'home'}.html`),
        note([
            `Structured data for: ${p.wpTitle}  (${p.url})`,
            '',
            'WPCode -> Add Snippet -> HTML, Location: Site Wide Header,',
            'then set Smart Conditional Logic to this page only.',
            '',
            'If Yoast or Rank Math also outputs LocalBusiness/Organization schema,',
            'turn one of the two off. Two copies compete and neither is trusted.',
        ]) +
        p.schema.map((b) => `<script type="application/ld+json">\n${b}\n</script>`).join('\n\n') + '\n');
}

/* SEO sheet.
   Titles and descriptions are decoded to plain text: these get typed into Yoast
   or Rank Math, which escape for themselves, so a literal "&amp;" would show up
   on the search result. */
const ENTITIES = {
    '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'",
    '&apos;': "'", '&nbsp;': ' ', '&mdash;': '—', '&ndash;': '–',
    '&rsquo;': '’', '&lsquo;': '‘', '&ldquo;': '“',
    '&rdquo;': '”', '&middot;': '·', '&hellip;': '…',
};
const decode = (s) => {
    const out = String(s).replace(/&[a-z#0-9]+;/gi, (e) => {
        if (e in ENTITIES) return ENTITIES[e];
        throw new Error(`page-meta.csv: unhandled HTML entity ${e}`);
    });
    if (/&[a-z#0-9]+;/i.test(out)) throw new Error(`page-meta.csv: entity survived decoding in: ${out}`);
    return out;
};
const csvCell = (v) => `"${decode(v).replace(/"/g, '""')}"`;
writeFileSync(join(seoDir, 'page-meta.csv'),
    ['Order,WordPress page,Slug,Parent,URL,SEO title,Meta description,Canonical,Schema blocks']
        .concat(parsed.map((p) => [
            p.n, p.wpTitle, p.slug || '(front page)', p.parent || '(none)', p.url,
            p.title, p.description, p.canonical, p.schema.length,
        ].map(csvCell).join(',')))
        .join('\n') + '\n');

/* The guide. Lives in build/ so it is version-controlled with everything else. */
cpSync(join(root, 'build', 'handoff-guide.md'), join(out, 'START-HERE.md'));

/* Source, so the site can be regenerated rather than hand-edited */
const src = dir('source');
cpSync(join(root, 'build'), join(src, 'build'), { recursive: true });
for (const f of ['package.json', 'README.md', 'WORDPRESS-ELEMENTOR-SETUP.md']) {
    if (existsSync(join(root, f))) cpSync(join(root, f), join(src, f));
}

/* ---------- report ---------- */
console.log(`Package written to handoff/WHT-Electrical-Handoff\n`);
console.log('  assets/                      css, js, 10 photos, logo, hero video');
console.log('  elementor/00-*               sitewide head, footer and body-class snippets');
console.log('  elementor/01-header-template.html');
console.log('  elementor/02-footer-template.html');
console.log(`  elementor/pages/             ${parsed.length} files, <main> content only`);
console.log(`  elementor/seo/page-meta.csv  titles, descriptions, slugs, parents`);
console.log(`  elementor/seo/schema/        ${parsed.reduce((n, p) => n + p.schema.length, 0)} JSON-LD blocks`);
console.log('  source/                      the generator, so pages can be rebuilt\n');
console.log(`Icon sprite, header and footer verified identical across all ${parsed.length} pages,`);
console.log(`apart from the current-page marker: header carries it on ${markedCount('header')} page(s),`);
console.log(`drawer nav on ${markedCount('tail')}. Step 8 of START-HERE.md restores it in WordPress.`);
