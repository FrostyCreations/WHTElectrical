/* =========================================================
   Render an Elementor template as the HTML Elementor itself would
   output it — wrapper divs and all — so the styling can be checked
   against the static build before anything touches WordPress.

   Not a general Elementor renderer. It covers the widgets the WHT
   templates use and throws on anything else, so an unsupported widget
   cannot silently render as nothing and flatter the comparison.
   ========================================================= */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/* The icon sprite, lifted from the built site so <use href="#wi-..."> resolves
   in the simulation exactly as it will on the page. */
function sprite() {
    const f = join(root, 'dist-wp', 'index.html');
    if (!existsSync(f)) return '';
    const html = readFileSync(f, 'utf8');
    const a = html.indexOf('<svg width="0" height="0"');
    if (a < 0) return '';
    return html.slice(a, html.indexOf('</svg>', a) + 6);
}

const cls = (...xs) => xs.filter(Boolean).join(' ');

/* Elementor wraps every widget: the outer .elementor-element carries the
   widget's CSS classes, then .elementor-widget-container, then the real
   element. That nesting is the whole reason this file exists. */
const wrapWidget = (el, type, inner) => {
    const extra = el.settings?._css_classes || '';
    const id = el.settings?._element_id ? ` id="${el.settings._element_id}"` : '';
    return `<div class="${cls('elementor-element', `elementor-element-${el.id}`, extra, 'elementor-widget', `elementor-widget-${type}`)}"${id} data-element_type="widget" data-widget_type="${type}.default">
<div class="elementor-widget-container">
${inner}
</div>
</div>`;
};

const WIDGETS = {
    heading(el) {
        const s = el.settings;
        const tag = s.header_size || 'h2';
        return wrapWidget(el, 'heading',
            `<${tag} class="elementor-heading-title elementor-size-default">${s.title}</${tag}>`);
    },

    'text-editor'(el) {
        return wrapWidget(el, 'text-editor', el.settings.editor);
    },

    button(el) {
        const s = el.settings;
        const target = s.link?.is_external === 'on' ? ' target="_blank" rel="noopener"' : '';
        return wrapWidget(el, 'button',
            `<div class="elementor-button-wrapper">
<a class="elementor-button elementor-button-link elementor-size-${s.size || 'md'}" href="${s.link?.url || '#'}"${target}>
<span class="elementor-button-content-wrapper"><span class="elementor-button-text">${s.text}</span></span>
</a>
</div>`);
    },

    image(el) {
        const im = el.settings.image || {};
        const alt = (im.alt || '').replace(/"/g, '&quot;');
        const img = `<img src="${im.url || ''}" alt="${alt}" loading="lazy" decoding="async">`;
        /* A custom caption makes Elementor wrap the image in a figure. */
        return wrapWidget(el, 'image', el.settings.caption_source === 'custom'
            ? `<figure class="wp-caption">${img}<figcaption class="widget-image-caption wp-caption-text">${el.settings.caption}</figcaption></figure>`
            : img);
    },

    html(el) {
        return wrapWidget(el, 'html', el.settings.html);
    },

    'icon-list'(el) {
        const s = el.settings;
        const items = (s.icon_list || []).map((it) => {
            const body = it.link?.url
                ? `<a href="${it.link.url}"><span class="elementor-icon-list-text">${it.text}</span></a>`
                : `<span class="elementor-icon-list-text">${it.text}</span>`;
            return `<li class="elementor-icon-list-item">${body}</li>`;
        }).join('\n');
        return wrapWidget(el, 'icon-list',
            `<ul class="elementor-icon-list-items${s.view === 'inline' ? ' elementor-inline-items' : ''}">\n${items}\n</ul>`);
    },

    'nested-accordion'(el) {
        const items = (el.settings.items || []).map((it, i) => {
            const child = el.elements?.[i];
            const body = child ? (child.elements || []).map(render).join('\n') : '';
            return `<details class="e-n-accordion-item">
<summary class="e-n-accordion-item-title"><span class="e-n-accordion-item-title-text">${it.item_title}</span></summary>
<div class="e-con">${body}</div>
</details>`;
        }).join('\n');
        return wrapWidget(el, 'nested-accordion', `<div class="e-n-accordion">\n${items}\n</div>`);
    },

    shortcode(el) {
        /* A shortcode renders to nothing without WordPress. Shown as a visible
           placeholder so a form slot is obvious in the comparison. */
        return wrapWidget(el, 'shortcode',
            `<div style="padding:18px;border:2px dashed #C3CDDC;border-radius:6px;color:#55606E;font-size:14px">shortcode slot (renders in WordPress)</div>`);
    },
};

export function render(el) {
    if (el.elType === 'container') {
        const s = el.settings || {};
        const boxed = s.content_width === 'boxed';
        const dir = s.flex_direction === 'row' ? 'e-con-row' : '';
        const id = s._element_id ? ` id="${s._element_id}"` : '';
        const tag = s.html_tag || 'div';
        const kids = (el.elements || []).map(render).join('\n');
        const inner = boxed ? `<div class="e-con-inner">\n${kids}\n</div>` : kids;
        return `<${tag} class="${cls('elementor-element', `elementor-element-${el.id}`, 'e-flex', dir, boxed ? 'e-con-boxed' : 'e-con-full', 'e-con', 'e-parent', s.css_classes)}"${id} data-element_type="container">
${inner}
</${tag}>`;
    }
    if (el.elType === 'widget') {
        const fn = WIDGETS[el.widgetType];
        if (!fn) throw new Error(`simulate.mjs does not know widget "${el.widgetType}" — add it rather than letting it render empty`);
        return fn(el);
    }
    throw new Error(`unknown elType: ${el.elType}`);
}

/* Elementor turns an element's padding/margin/gap SETTINGS into generated
   per-element CSS, at a specificity that beats ordinary class rules. Without
   this the simulation only reflects CSS classes, so anything set through the
   Elementor settings is invisible and the comparison under-reports. */
const dimsToCss = (d) => d && typeof d === 'object' && d.top !== undefined
    ? `${d.top}${d.unit} ${d.right}${d.unit} ${d.bottom}${d.unit} ${d.left}${d.unit}` : null;

export function generatedCss(content) {
    const out = [];
    (function walk(els) {
        for (const el of els || []) {
            const s = el.settings || {};
            const decls = [];
            const pad = dimsToCss(s.padding);
            const mar = dimsToCss(s.margin);
            if (pad) decls.push(`padding:${pad}`);
            if (mar) decls.push(`margin:${mar}`);
            if (s.flex_gap && s.flex_gap.column !== undefined) {
                decls.push(`gap:${s.flex_gap.column}${s.flex_gap.unit || 'px'}`);
            }
            if (decls.length) {
                out.push(`.elementor-element.elementor-element-${el.id}{${decls.join(';')}}`);
            }
            walk(el.elements);
        }
    })(content);
    return out.join('\n');
}

/* Elementor's own baseline styles that affect what is being compared.
   Only the handful that touch containers, headings, text and buttons. */
const ELEMENTOR_BASE = `
.e-con { display: flex; flex-direction: column; position: relative; }
.e-con.e-con-row { flex-direction: row; }
.elementor-widget-container > p:last-child { margin-bottom: 0; }
.elementor-heading-title { margin: 0; line-height: 1; }
.elementor-button { display: inline-block; text-decoration: none; }
.elementor-button-wrapper { display: inline-block; }
.elementor-icon-list-items { list-style: none; margin: 0; padding: 0; }
`;

export function renderPage(content, title) {
    const body = content.map(render).join('\n');
    /* The header template carries the sprite itself. Inject it only when the
       content has none, or a full-page simulation ends up with two sets of
       the same symbol ids. */
    const needsSprite = !body.includes('<symbol');
    return `<!DOCTYPE html>
<html lang="en-ZA">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Elementor DOM simulation — ${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/wht.css">
<style>${ELEMENTOR_BASE}</style>
<link rel="stylesheet" href="/assets/wht-elementor.css">
<!-- Elementor's generated per-element CSS, which beats class rules. Last, as Elementor loads it. -->
<style>${generatedCss(content)}</style>
</head>
<body class="wht-site">
${needsSprite ? sprite() : ''}
${body}
<script src="/assets/wht.js" defer></script>
</body>
</html>
`;
}
