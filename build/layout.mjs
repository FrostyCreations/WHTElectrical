/* =========================================================
   WHT ELECTRICAL — shared layout
   Header, footer, drawer, icon sprite, structured data and the
   reusable section builders from Build Pack Tab 11.
   Edit here once; every page picks it up on the next build.
   ========================================================= */

export const SITE = {
    name: 'WHT Electrical',
    tagline: 'Problems Found. Solutions Delivered.',
    phone1: '083 306 1267', tel1: '+27833061267',
    phone2: '083 952 2925', tel2: '+27839522925',
    wa: '27833061267',
    email: 'info@whtelectrical.co.za',
    domain: 'https://www.whtelectrical.co.za',
    street: '32 Webb Street', suburb: 'Northmead', town: 'Benoni', region: 'Gauteng',
    founded: '2010',
};

/* Page key → local preview filename and final WordPress permalink (Tab 2). */
export const ROUTES = {
    home:        { file: 'index.html',                                   wp: '/' },
    electrical:  { file: 'electrical.html',                              wp: '/electrical/' },
    fault:       { file: 'electrical-fault-finding-repairs.html',        wp: '/electrical/fault-finding-repairs/' },
    coc:         { file: 'electrical-coc.html',                          wp: '/electrical/coc/' },
    gate:        { file: 'electrical-gate-motors-electric-fencing.html', wp: '/electrical/gate-motors-electric-fencing/' },
    solar:       { file: 'solar-backup-power.html',                      wp: '/solar-backup-power/' },
    plumbing:    { file: 'plumbing.html',                                wp: '/plumbing/' },
    maintenance: { file: 'property-maintenance.html',                    wp: '/property-maintenance/' },
    about:       { file: 'about.html',                                   wp: '/about/' },
    contact:     { file: 'contact.html',                                 wp: '/contact/' },
};

/* Set by build.mjs before rendering: false = clickable local files, true = WordPress permalinks. */
export const MODE = { wp: false };

export const href = (key, hash = '') => {
    const r = ROUTES[key];
    if (!r) throw new Error(`Unknown route: ${key}`);
    return (MODE.wp ? r.wp : r.file) + hash;
};
export const asset = (p) => (MODE.wp ? '/assets/' : 'assets/') + p;
export const canonical = (key) => SITE.domain + ROUTES[key].wp;

export const esc = (s) => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* Plain text for JSON-LD: strip tags, decode the entities used in the copy. */
export const plain = (s) => String(s).replace(/<[^>]+>/g, '')
    .replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘').replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–').replace(/&hellip;/g, '…').replace(/&middot;/g, '·')
    .replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

export const ic = (name, cls = '') => `<svg${cls ? ` class="${cls}"` : ''} aria-hidden="true"><use href="#wi-${name}"/></svg>`;

const waHref = (msg) => `https://wa.me/${SITE.wa}` + (msg ? `?text=${encodeURIComponent(msg)}` : '');

/* ---------- Buttons (Tab 8 CTA labels) ---------- */
export const btn = {
    quote: (label = 'Request a Quote', target = 'contact') =>
        `<a class="wht-btn wht-btn--primary" href="${href(target)}" data-wht-event="quote_start">${label} ${ic('arrow', 'wht-icon')}</a>`,
    wa: (label = 'WhatsApp WHT', msg = "Hi WHT Electrical, I'd like help with the following:") =>
        `<a class="wht-btn wht-btn--wa" href="${waHref(msg)}" target="_blank" rel="noopener" data-wht-event="click_whatsapp">${ic('wa', 'wht-icon')} ${label}</a>`,
    call: (label = 'Call WHT', cls = 'wht-btn--ondark') =>
        `<a class="wht-btn ${cls}" href="tel:${SITE.tel1}" data-wht-event="click_call">${ic('phone', 'wht-icon')} ${label}</a>`,
    ghost: (label, target, hash = '') =>
        `<a class="wht-btn wht-btn--ghost" href="${href(target, hash)}">${label} ${ic('arrow', 'wht-icon')}</a>`,
    ondark: (label, target, hash = '') =>
        `<a class="wht-btn wht-btn--ondark" href="${href(target, hash)}">${label} ${ic('arrow', 'wht-icon')}</a>`,
};
export const arrow = (label, target, hash = '') =>
    `<a class="wht-arrow" href="${href(target, hash)}">${label} ${ic('arrow')}</a>`;

/* ---------- Icon sprite ---------- */
const ICONS = {
    bolt: '<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>',
    phone: '<path d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.7.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.7.1.4 0 .8-.3 1z"/>',
    wa: '<path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm5.3 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1a11 11 0 0 1-5.2-4.6c-.4-.6-.9-1.5-.9-2.9 0-1.3.7-2 1-2.3.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2 0 .4 0 .5l-.4.6-.3.3c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.2.5.1.6 0l.9-1c.2-.3.4-.2.6-.1l2 .9c.2.1.4.2.4.3.1.2.1.7 0 1z"/>',
    mail: '<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v.4l8 5 8-5V6H4zm16 2.9-7.5 4.7a1 1 0 0 1-1 0L4 8.9V18h16V8.9z"/>',
    pin: '<path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>',
    clock: '<path fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16z"/><path d="M11 6.5h2v5.9l3.6 2.1-1 1.7-4.6-2.7z"/>',
    globe: '<path fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 9h-3a15 15 0 0 0-1.2-5.6A8 8 0 0 1 18.9 11zM12 4.1c.9 1.2 1.8 3.5 2 6.9h-4c.2-3.4 1.1-5.7 2-6.9zM9.3 5.4A15 15 0 0 0 8.1 11h-3a8 8 0 0 1 4.2-5.6zM5.1 13h3a15 15 0 0 0 1.2 5.6A8 8 0 0 1 5.1 13zm6.9 6.9c-.9-1.2-1.8-3.5-2-6.9h4c-.2 3.4-1.1 5.7-2 6.9zm2.7-1.3a15 15 0 0 0 1.2-5.6h3a8 8 0 0 1-4.2 5.6z"/>',
    menu: '<path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/>',
    close: '<path d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4z"/>',
    search: '<path d="M10 2a8 8 0 1 0 4.9 14.3l5.4 5.4 1.4-1.4-5.4-5.4A8 8 0 0 0 10 2zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12z"/>',
    check: '<path d="M9.5 16.2 4.8 11.5l-1.4 1.4 6.1 6.1L21 7.5l-1.4-1.4z"/>',
    arrow: '<path d="M4 11h12.2l-5.6-5.6L12 4l8 8-8 8-1.4-1.4 5.6-5.6H4z"/>',
    star: '<path d="m12 2 3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z"/>',
    chevron: '<path d="M12 15.4 5.6 9 7 7.6l5 5 5-5L18.4 9z"/>',
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm-1 7V3.5L18.5 9zM8 13h8v2H8zm0 4h8v2H8z"/>',
    gate: '<path d="M3 4h2v16H3zm16 0h2v16h-2zM6 9h5v11H6zm7 0h5v11h-5zM6 6h12v2H6z"/>',
    fence: '<path d="M6 2 3 5v17h4V8h4v14h4V8h4v14h2V5l-3-3-3 3-3-3-3 3z"/>',
    droplet: '<path d="M12 2S5 10.2 5 14.5a7 7 0 0 0 14 0C19 10.2 12 2 12 2zm0 17a4.5 4.5 0 0 1-4.5-4.5h2A2.5 2.5 0 0 0 12 17z"/>',
    battery: '<path d="M15.7 4H14V2h-4v2H8.3A2.3 2.3 0 0 0 6 6.3v13.4A2.3 2.3 0 0 0 8.3 22h7.4a2.3 2.3 0 0 0 2.3-2.3V6.3A2.3 2.3 0 0 0 15.7 4zM13 8v4h2.5L11 19v-4H8.5z"/>',
    solar: '<path d="M4 3h16l2 11H2zm3 13h10l1 5H6zM11 0h2v2h-2zM3.5 1.8 5 3.2 3.6 4.6 2.2 3.2zM19 3.2l1.4-1.4 1.4 1.4-1.4 1.4z"/>',
    paint: '<path d="M18 3H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V9h1V5a2 2 0 0 0-2-2zm-6 12a3 3 0 0 0-3 3v3h2v-3a1 1 0 0 1 2 0v3h2v-3a3 3 0 0 0-3-3z"/>',
    tools: '<path d="M21.7 18.3 13.4 10a5.5 5.5 0 0 0-6.7-7L9.9 6.2 6.2 9.9 3 6.7a5.5 5.5 0 0 0 7 6.7l8.3 8.3a1 1 0 0 0 1.4 0l2-2a1 1 0 0 0 0-1.4z"/>',
    home: '<path d="M12 3 2 12h3v9h6v-6h2v6h6v-9h3z"/>',
    building: '<path d="M3 21V7l7-4v4l7-3v17zM6 9v2h2V9zm0 4v2h2v-2zm0 4v2h2v-2zm7-4v2h2v-2zm0 4v2h2v-2zm0-8v2h2V9z"/>',
    factory: '<path d="M2 22V10l6 4V10l6 4V6h2l1-4h3l1 4v16zM6 16v3h3v-3zm6 0v3h3v-3zm6 0v3h3v-3z"/>',
    plug: '<path d="M16 7V3h-2v4h-4V3H8v4a2 2 0 0 0-2 2v4a6 6 0 0 0 5 5.9V22h2v-3.1a6 6 0 0 0 5-5.9V9a2 2 0 0 0-2-2z"/>',
    grid: '<path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v6h6V5zm8 0v6h6V5zm-8 8v6h6v-6zm8 0v6h6v-6z"/>',
    cable: '<path d="M20 5V3h-2v2h-1a1 1 0 0 0-1 1v4h6V6a1 1 0 0 0-1-1zM4 14v4a3 3 0 0 0 6 0V6a1 1 0 0 1 2 0v12a3 3 0 0 0 6 0v-6h-2v6a1 1 0 0 1-2 0V6a3 3 0 0 0-6 0v12a1 1 0 0 1-2 0v-4H2z"/>',
    generator: '<path d="M4 7h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zm7 2-3 5h2v3l3-5h-2z"/>',
    roof: '<path d="M12 3 1 11l1.2 1.6L4 11.3V21h16v-9.7l1.8 1.3L23 11zm-4 16v-5h8v5z"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7zm-8.6 9.3L12 15.6l8.6-4.3L22 12l-10 5-10-5zm0 5L12 20.6l8.6-4.3L22 17l-10 5-10-5z"/>',
    inspect: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h6.3a6 6 0 0 1-.3-2 6 6 0 0 1 8-5.7V8zm-1 7V3.5L18.5 9zm5 6a4 4 0 1 0 2.3 7.3l1.3 1.3 1.4-1.4-1.3-1.3A4 4 0 0 0 18 15zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>',
    users: '<path d="M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3.3 0-7 1.6-7 4v2h14v-2c0-2.4-3.7-4-7-4zm7.5-2a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm1.3 2.1c1.9.6 4.2 1.8 4.2 3.9v2h-4v-2c0-1.5-.8-2.9-2.2-3.9z"/>',
    camera: '<path d="M9 3 7.2 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.2L15 3zm3 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>',
    fb: '<path d="M14 9h3l.5-3H14V4.5c0-.8.3-1.5 1.5-1.5H17V.2A20 20 0 0 0 14.7 0C12.3 0 10.5 1.5 10.5 4.2V6H8v3h2.5v9H14z"/>',
    ig: '<path d="M12 2c2.7 0 3 0 4.1.1 1.1 0 1.8.2 2.5.5.7.3 1.2.6 1.8 1.2.6.6.9 1.1 1.2 1.8.3.7.5 1.4.5 2.5C22 9.7 22 10 22 12s0 2.3-.1 3.4c0 1.1-.2 1.8-.5 2.5a5 5 0 0 1-1.2 1.8 5 5 0 0 1-1.8 1.2c-.7.3-1.4.5-2.5.5-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-1.1 0-1.8-.2-2.5-.5a5 5 0 0 1-1.8-1.2 5 5 0 0 1-1.2-1.8c-.3-.7-.5-1.4-.5-2.5C2 14.3 2 14 2 12s0-2.3.1-3.4c0-1.1.2-1.8.5-2.5A5 5 0 0 1 3.8 4.3 5 5 0 0 1 5.6 3c.7-.3 1.4-.5 2.5-.5C9.2 2 9.5 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm5.3-2.9a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"/>',
    up: '<path d="m12 4 8 8-1.4 1.4L13 7.8V20h-2V7.8L5.4 13.4 4 12z"/>',
};
export const ICON_NAMES = Object.keys(ICONS);

const sprite = () => `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
${Object.entries(ICONS).map(([id, p]) => `        <symbol id="wi-${id}" viewBox="0 0 24 24">${p}</symbol>`).join('\n')}
    </svg>`;

/* ---------- Structured data ---------- */
const BUSINESS_ID = `${SITE.domain}/#business`;
const AREAS = [
    { '@type': 'AdministrativeArea', name: 'Gauteng' },
    { '@type': 'Country', name: 'South Africa' },
];

const businessSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'Electrician',
    '@id': BUSINESS_ID,
    name: SITE.name,
    slogan: SITE.tagline,
    description: 'Electrical, solar, plumbing and property maintenance for residential, commercial and industrial clients. Based in Benoni, serving Gauteng with national project capability.',
    url: SITE.domain + '/',
    image: `${SITE.domain}/assets/og-image.jpg`,
    foundingDate: SITE.founded,
    telephone: [SITE.tel1, SITE.tel2],
    email: SITE.email,
    address: {
        '@type': 'PostalAddress',
        streetAddress: SITE.street,
        addressLocality: `${SITE.suburb}, ${SITE.town}`,
        addressRegion: SITE.region,
        addressCountry: 'ZA',
    },
    areaServed: AREAS,
});

const breadcrumbSchema = (crumbs) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem', position: i + 1, name: plain(c.label), item: canonical(c.key),
    })),
});

const faqSchema = (faqs) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([q, a]) => ({
        '@type': 'Question', name: plain(q),
        acceptedAnswer: { '@type': 'Answer', text: plain([].concat(a).join(' ')) },
    })),
});

const serviceSchema = (page) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: plain(page.service),
    serviceType: plain(page.service),
    url: canonical(page.key),
    provider: { '@id': BUSINESS_ID },
    areaServed: AREAS,
});

const ld = (obj) => `    <script type="application/ld+json">\n${JSON.stringify(obj, null, 2).replace(/^/gm, '    ')}\n    </script>`;

/* ---------- <head> ---------- */
export const head = (page) => {
    const blocks = [ld(businessSchema())];
    if (page.crumbs) blocks.push(ld(breadcrumbSchema(page.crumbs)));
    if (page.service) blocks.push(ld(serviceSchema(page)));
    if (page.faqs && page.faqs.length) blocks.push(ld(faqSchema(page.faqs)));

    return `<!DOCTYPE html>
<html lang="en-ZA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- ${plain(page.label)} (${ROUTES[page.key].wp}) — generated by build/build.mjs. Edit build/pages.mjs, not this file. -->
    <title>${esc(page.title)}</title>
    <meta name="description" content="${esc(page.description)}">
    <link rel="canonical" href="${canonical(page.key)}">
    <meta name="theme-color" content="#1E2F4D">

    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${SITE.name}">
    <meta property="og:title" content="${esc(page.title)}">
    <meta property="og:description" content="${esc(page.description)}">
    <meta property="og:image" content="${SITE.domain}/assets/og-image.jpg">
    <meta property="og:url" content="${canonical(page.key)}">
    <meta name="twitter:card" content="summary_large_image">

    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%231E2F4D'/%3E%3Cpath d='M17 4 8 18h6l-2 10 10-15h-6z' fill='%23FFC72C'/%3E%3C/svg%3E">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
${page.preload ? `    <link rel="preload" as="image" href="${page.preload}" fetchpriority="high">\n` : ''}    <link rel="stylesheet" href="${asset('wht.css')}">

${blocks.join('\n')}
</head>
<body>
`;
};

/* ---------- Header ---------- */
export const SUB = [
    { key: 'electrical', label: 'Electrical' },
    { key: 'fault', label: 'Fault Finding &amp; Repairs', child: true },
    { key: 'coc', label: 'Electrical COCs', child: true },
    { key: 'gate', label: 'Gate Motors &amp; Electric Fencing', child: true },
    { key: 'solar', label: 'Solar &amp; Backup Power' },
    { key: 'plumbing', label: 'Plumbing' },
    { key: 'maintenance', label: 'Property Maintenance' },
];
const SERVICE_KEYS = SUB.map((s) => s.key);
const cur = (page, key) => (page.key === key ? ' aria-current="page"' : '');

export const header = (page) => `<div class="wht-site">
    <a class="wht-skip" href="#wht-main">Skip to content</a>

    ${sprite()}

    <header class="wht-header" id="wht-top">
        <div class="wht-container wht-header__inner">
            <a href="${href('home')}" class="wht-logo" aria-label="WHT Electrical — home">
                ${ic('bolt')}
                WHT <span>Electrical</span>
            </a>

            <ul class="wht-nav" role="list">
                <li><a href="${href('home')}"${cur(page, 'home')}>Home</a></li>
                <li>
                    <button class="wht-nav__toggle${SERVICE_KEYS.includes(page.key) ? ' is-section' : ''}" type="button" aria-expanded="false" aria-controls="wht-submenu-services" data-sub-toggle>
                        Services ${ic('chevron')}
                    </button>
                    <ul class="wht-sub" id="wht-submenu-services" role="list">
${SUB.map((s) => `                        <li><a${s.child ? ' class="wht-sub__child"' : ''} href="${href(s.key)}"${cur(page, s.key)}>${s.label}</a></li>`).join('\n')}
                    </ul>
                </li>
                <li><a href="${href('about')}"${cur(page, 'about')}>About</a></li>
                <li><a href="${href('contact')}"${cur(page, 'contact')}>Contact</a></li>
            </ul>

            <div class="wht-header__actions">
                <a class="wht-header__phone" href="tel:${SITE.tel1}" data-wht-event="click_call">
                    ${ic('phone')} ${SITE.phone1}
                </a>
                <button class="wht-search-toggle" type="button" aria-label="Open search" aria-expanded="false" aria-controls="wht-search" data-search-open>
                    ${ic('search')}
                </button>
                <a class="wht-header__cta" href="${href('contact')}" data-wht-event="quote_start">Request a Quote ${ic('arrow')}</a>
                <button class="wht-burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="wht-drawer" data-drawer-open>
                    ${ic('menu')}
                </button>
            </div>
        </div>
    </header>

    <main id="wht-main">
`;

/* ---------- Inner page hero: breadcrumb + H1 + intro + CTAs ---------- */
export const pageHero = (page, { h1, question = '', lead = [], cta = '' }) => `
        <section class="wht-pagehero" aria-labelledby="wht-h1">
            <div class="wht-pagehero__bolt" aria-hidden="true"></div>
            <nav class="wht-breadcrumb" aria-label="Breadcrumb">
                <div class="wht-container">
                    <ol>
${page.crumbs.map((c, i) => i === page.crumbs.length - 1
        ? `                        <li><span aria-current="page">${c.label}</span></li>`
        : `                        <li><a href="${href(c.key)}">${c.label}</a></li>`).join('\n')}
                    </ol>
                </div>
            </nav>
            <div class="wht-container wht-pagehero__inner">
                <div class="wht-pagehero__content">
                    <h1 id="wht-h1">${h1}</h1>
${question ? `                    <p class="wht-pagehero__q">${question}</p>\n` : ''}${lead.map((p) => `                    <p>${p}</p>`).join('\n')}
${cta ? `                    <div class="wht-pagehero__cta">\n                        ${cta}\n                    </div>` : ''}
                </div>
            </div>
        </section>
`;

/* ---------- Section heading ---------- */
export const sectionHead = ({ eyebrow, h2, lead, center = false, id = '' }) => `
                <div class="wht-head${center ? ' wht-head--center' : ''}">
${eyebrow ? `                    <span class="wht-eyebrow">${eyebrow}</span>\n` : ''}                    <h2 class="wht-title"${id ? ` id="${id}"` : ''}>${h2}</h2>
${lead ? [].concat(lead).map((p) => `                    <p class="wht-lead">${p}</p>`).join('\n') : ''}
                </div>`;

/* ---------- Checklist ---------- */
export const bullets = (items, { dark = false, one = false } = {}) =>
    `<ul class="wht-bullets${dark ? ' wht-bullets--dark' : ''}${one ? ' wht-bullets--1' : ''}">
${items.map((t) => `                    <li>${ic('check')} <span>${t}</span></li>`).join('\n')}
                </ul>`;

/* ---------- Service list grid: [icon, title, description] ---------- */
export const slist = (items) => `<div class="wht-slist">
${items.map(([icon, h3, p]) => `                    <article class="wht-sitem">
                        <div class="wht-sitem__icon">${ic(icon)}</div>
                        <div><h3>${h3}</h3><p>${p}</p></div>
                    </article>`).join('\n')}
                </div>`;

/* ---------- Process steps: [title | null, text] ---------- */
export const steps = (items) => {
    const mod = { 2: ' wht-steps--2', 3: ' wht-steps--3', 4: ' wht-steps--4' }[items.length] || '';
    return `<ol class="wht-steps${mod}">
${items.map(([h3, p], i) => `                    <li class="wht-step">
                        <div class="wht-step__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</div>
                        ${h3 ? `<h3>${h3}</h3>\n                        <p>${p}</p>` : `<p class="wht-step__lead">${p}</p>`}
                    </li>`).join('\n')}
                </ol>`;
};

/* ---------- Related / linked cards: [icon, routeKey, title, text | text[], linkLabel, hash?] ---------- */
export const related = (items, { level = 'h3' } = {}) => `<div class="wht-related">
${items.map(([icon, key, title, p, link, hash = '']) => `                    <article class="wht-relcard">
                        <${level}>${ic(icon)} ${title}</${level}>
${[].concat(p).map((t) => `                        <p>${t}</p>`).join('\n')}
                        ${arrow(link, key, hash)}
                    </article>`).join('\n')}
                </div>`;

/* ---------- Callout card ---------- */
export const callout = ({ eyebrow, h2, id = '', body, cta }) => `<div class="wht-callout">
                    <div>
${eyebrow ? `                        <span class="wht-eyebrow">${eyebrow}</span>\n` : ''}                        <h2${id ? ` id="${id}"` : ''}>${h2}</h2>
${body.map((p) => `                        <p>${p}</p>`).join('\n')}
                    </div>
                    <div>${cta}</div>
                </div>`;

/* ---------- FAQs — visible markup and FAQPage schema come from the same array ---------- */
export const faqSection = (faqs, { h2 = 'Frequently Asked Questions', alt = true } = {}) => `
        <section id="faqs" class="wht-section${alt ? ' wht-section--alt' : ''}" aria-labelledby="wht-faq-title">
            <div class="wht-container">
${sectionHead({ eyebrow: 'FAQs', h2, center: true, id: 'wht-faq-title' })}
                <div class="wht-faqs">
${faqs.map(([q, a]) => `                    <details class="wht-faq">
                        <summary>${q}</summary>
                        <div class="wht-faq__body">${[].concat(a).map((p) => `<p>${p}</p>`).join('')}</div>
                    </details>`).join('\n')}
                </div>
            </div>
        </section>
`;

/* ---------- Final CTA band ---------- */
export const ctaBand = ({ h2, body = [], buttons, phones = false }) => `
        <section class="wht-ctaband wht-section" aria-labelledby="wht-cta-title">
            <div class="wht-container">
                <h2 id="wht-cta-title">${h2}</h2>
${body.map((p) => `                <p>${p}</p>`).join('\n')}
                <div class="wht-ctaband__btns">
                    ${buttons}
                </div>
${phones ? `                <div class="wht-ctaband__phones">
                    <a href="tel:${SITE.tel1}" data-wht-event="click_call">${ic('phone')} ${SITE.phone1}</a>
                    <a href="tel:${SITE.tel2}" data-wht-event="click_call">${ic('phone')} ${SITE.phone2}</a>
                </div>\n` : ''}            </div>
        </section>
`;

/* ---------- Footer, overlays, closing tags ---------- */
export const footer = (page) => `    </main>

    <footer class="wht-footer">
        <div class="wht-container">
            <div class="wht-footer__grid">
                <div>
                    <div class="wht-logo">${ic('bolt')} WHT <span>Electrical</span></div>
                    <p class="wht-footer__tag">${SITE.tagline}</p>
                    <p>Electrical, solar, plumbing and property maintenance for residential, commercial and industrial clients.</p>
                    <div class="wht-socials">
                        <a href="https://www.facebook.com/REPLACE" aria-label="WHT Electrical on Facebook" target="_blank" rel="noopener">${ic('fb')}</a>
                        <a href="https://www.instagram.com/REPLACE" aria-label="WHT Electrical on Instagram" target="_blank" rel="noopener">${ic('ig')}</a>
                    </div>
                </div>
                <nav aria-labelledby="wht-foot-services">
                    <h2 id="wht-foot-services">Services</h2>
                    <ul>
${SUB.map((s) => `                        <li><a href="${href(s.key)}">${s.label}</a></li>`).join('\n')}
                    </ul>
                </nav>
                <nav aria-labelledby="wht-foot-links">
                    <h2 id="wht-foot-links">Quick Links</h2>
                    <ul>
                        <li><a href="${href('about')}">About</a></li>
                        <li><a href="${href('contact')}">Contact</a></li>
                        <li><a href="${href('contact')}" data-wht-event="quote_start">Request a Quote</a></li>
                        <li><a href="/privacy-policy/">Privacy Policy</a></li>
                        <li><a href="/terms/">Terms</a></li>
                    </ul>
                </nav>
                <div>
                    <h2>Contact</h2>
                    <ul>
                        <li><a href="tel:${SITE.tel1}" data-wht-event="click_call">${SITE.phone1}</a></li>
                        <li><a href="tel:${SITE.tel2}" data-wht-event="click_call">${SITE.phone2}</a></li>
                        <li><a href="mailto:${SITE.email}" data-wht-event="click_email">${SITE.email}</a></li>
                    </ul>
                    <address style="margin-top:14px">
                        ${SITE.street}<br>${SITE.suburb}, ${SITE.town}<br>${SITE.region}
                    </address>
                    <p style="margin-top:14px"><strong>Service Area</strong><br>Gauteng Based &middot; National Capability</p>
                </div>
            </div>
            <div class="wht-footer__bar">
                <span>&copy; <span id="wht-year">2026</span> WHT Electrical. All rights reserved.</span>
                <span>Benoni &middot; Gauteng &middot; South Africa</span>
            </div>
        </div>
    </footer>

    <div class="wht-search" id="wht-search" role="dialog" aria-modal="true" aria-label="Search this site" hidden>
        <button class="wht-search__close" type="button" aria-label="Close search" data-search-close>
            ${ic('close')}
        </button>
        <form role="search" method="get" action="/">
            <label class="wht-sr" for="wht-search-input">Search</label>
            <input id="wht-search-input" type="search" name="s" placeholder="Search the site&hellip;" autocomplete="off">
            <button class="wht-search__submit" type="submit" aria-label="Submit search">${ic('search')}</button>
        </form>
    </div>

    <div class="wht-overlay" data-drawer-close hidden></div>
    <div class="wht-drawer" id="wht-drawer" role="dialog" aria-modal="true" aria-label="Site menu" hidden>
        <div class="wht-drawer__head">
            <span class="wht-logo">${ic('bolt')} WHT <span>Electrical</span></span>
            <button class="wht-drawer__close" type="button" aria-label="Close menu" data-drawer-close>
                ${ic('close')}
            </button>
        </div>
        <nav class="wht-drawer__nav" aria-label="Mobile">
            <a href="${href('home')}"${cur(page, 'home')} data-drawer-close>Home</a>
${SUB.map((s) => `            <a${s.child ? ' class="wht-drawer__child"' : ''} href="${href(s.key)}"${cur(page, s.key)} data-drawer-close>${s.label}</a>`).join('\n')}
            <a href="${href('about')}"${cur(page, 'about')} data-drawer-close>About</a>
            <a href="${href('contact')}"${cur(page, 'contact')} data-drawer-close>Contact</a>
        </nav>
        <div class="wht-drawer__contact">
            <a href="tel:${SITE.tel1}" data-wht-event="click_call">${ic('phone')} ${SITE.phone1}</a>
            <a href="tel:${SITE.tel2}" data-wht-event="click_call">${ic('phone')} ${SITE.phone2}</a>
            <a href="https://wa.me/${SITE.wa}" target="_blank" rel="noopener" data-wht-event="click_whatsapp">${ic('wa')} WhatsApp WHT</a>
            <a href="mailto:${SITE.email}" data-wht-event="click_email">${ic('mail')} ${SITE.email}</a>
        </div>
    </div>

    <!-- Sticky mobile bar — CALL | WHATSAPP | QUOTE, in the order Tab 8 specifies -->
    <nav class="wht-mobilebar" aria-label="Quick contact">
        <a href="tel:${SITE.tel1}" data-wht-event="click_call">${ic('phone')} Call</a>
        <a class="wht-mobilebar__wa" href="https://wa.me/${SITE.wa}" target="_blank" rel="noopener" data-wht-event="click_whatsapp">${ic('wa')} WhatsApp</a>
        <a class="wht-mobilebar__quote" href="${href('contact')}" data-wht-event="quote_start">${ic('bolt')} Quote</a>
    </nav>

    <button class="wht-totop" type="button" aria-label="Back to top" data-totop>
        ${ic('up')}
    </button>
</div>

<script src="${asset('wht.js')}" defer></script>
</body>
</html>
`;
