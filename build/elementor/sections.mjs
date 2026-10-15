/* =========================================================
   WHT ELECTRICAL — section patterns shared by the Elementor pages

   Every helper emits native Elementor widgets wherever the content has
   words in it, so Wayne can edit copy in the editor. Only genuinely
   decorative markup goes into an HTML widget.

   FREE WIDGETS ONLY. Elementor Pro cannot be installed in WordPress
   Playground (it is licensed, not in the plugin repo), so anything
   built with Pro widgets could not be tested before hand-over. The
   two Pro pieces — Theme Builder header/footer and the contact form —
   are set up in the editor instead, and formSlot() marks where.
   ========================================================= */
import { box, heading, text, button, html, image, accordion, dims } from './lib.mjs';
import { SITE, href } from '../layout.mjs';
import { CARD, PROCESS_GENERAL, PHOTO, pages } from '../pages.mjs';

/* A page's crumbs and FAQs, straight from pages.mjs, so the two builds
   cannot disagree about them. */
export const pageData = (key) => {
    const p = pages.find((x) => x.key === key);
    if (!p) throw new Error(`no page "${key}" in pages.mjs`);
    return p;
};

export const waHref = (msg) =>
    `https://wa.me/${SITE.wa}` + (msg ? `?text=${encodeURIComponent(msg)}` : '');

/* ---------------------------------------------------------
   Inner page hero. Ten of the twelve pages use this.
   The bolt watermark is decorative, so it stays as markup;
   the breadcrumb is links, so it stays as markup too — it is
   navigation, not copy anyone edits.
   --------------------------------------------------------- */
export function pageHero({ h1, question = '', lead = [], crumbs = [], cta = null }) {
    const crumbMarkup = `<nav class="wht-breadcrumb" aria-label="Breadcrumb"><div class="wht-container"><ol>${
        crumbs.map((c, i) => i === crumbs.length - 1
            ? `<li><span aria-current="page">${c.label}</span></li>`
            : `<li><a href="${href(c.key)}">${c.label}</a></li>`).join('')
    }</ol></div></nav>`;

    return box({ cls: 'wht-pagehero', tag: 'section', label: 'Page hero' }, [
        html(`<div class="wht-pagehero__bolt" aria-hidden="true"></div>${crumbMarkup}`,
            { label: 'Bolt watermark + breadcrumb' }),

        box({
            cls: 'wht-container wht-pagehero__inner', label: 'Page hero inner',
            pad: dims(44, 22, 84, 22), padT: dims(36, 22, 70, 22), padM: dims(30, 22, 56, 22),
        }, [
            box({ cls: 'wht-pagehero__content', label: 'Page hero copy' }, [
                heading(h1, { tag: 'h1', anchor: 'wht-h1', label: 'Page heading' }),
                question ? text(`<p>${question}</p>`, { cls: 'wht-pagehero__q', label: 'Question line' }) : null,
                ...lead.map((p, i) => text(`<p>${p}</p>`, { label: `Lead paragraph ${i + 1}` })),
                cta,
            ].filter(Boolean)),
        ]),
    ]);
}

/* ---------------------------------------------------------
   Section heading block: eyebrow, H2, optional lead.
   --------------------------------------------------------- */
export function sectionHead({ eyebrow, h2, lead = [], center = false, id: anchor }) {
    return box({ cls: `wht-head${center ? ' wht-head--center' : ''}`, label: 'Section heading' }, [
        eyebrow ? heading(eyebrow, { tag: 'span', cls: 'wht-eyebrow', label: 'Eyebrow' }) : null,
        heading(h2, { tag: 'h2', cls: 'wht-title', anchor, label: 'Heading' }),
        ...[].concat(lead).filter(Boolean).map((p, i) => text(`<p>${p}</p>`, { cls: 'wht-lead', label: `Lead ${i + 1}` })),
    ].filter(Boolean));
}

/* ---------------------------------------------------------
   Form slot. Elementor Pro's Form widget cannot be generated and
   tested here, so this is where the developer drops it in the
   editor. The heading above it is native so the copy stays editable.
   --------------------------------------------------------- */
export function formSlot() {
    return box({ cls: 'wht-form', label: 'Enquiry form', pad: dims(0) }, [
        heading('How Can WHT Help?', { tag: 'h2', cls: 'wht-form__title', label: 'Form heading' }),
        html(`<!--
  REPLACE THIS WIDGET WITH AN ELEMENTOR FORM.

  Delete this HTML widget, drag in Elementor Pro's Form widget, and
  rebuild the Tab 8 fields:

    Name*            text, required
    Mobile Number*   tel, required
    Email            email
    Area / Suburb*   text, required
    Service needed*  select - Electrical, Solar & Backup Power, Plumbing,
                     Property Maintenance, Not sure
    What is happening?*  textarea, required
    Photo            file upload, optional

  Actions After Submit: Email (to ${SITE.email}) + Redirect or Message.
  Under Additional Options, set the form name so the lead is identifiable.

  Tracking: fire quote_submit and generate_lead on the form's success
  event so the dataLayer events in wht.js stay consistent.
-->
<p class="wht-note" style="padding:22px;border:2px dashed var(--wht-line);border-radius:var(--wht-radius)">
  The enquiry form is added here in Elementor. Until then, please call
  <a href="tel:${SITE.tel1}">${SITE.phone1}</a> or
  <a href="${waHref("Hi WHT Electrical, I'd like help with the following:")}" target="_blank" rel="noopener">WhatsApp WHT</a>.
</p>`, { label: 'Form placeholder — replace with Elementor Form' }),
    ]);
}

/* ---------------------------------------------------------
   Contact details. The icons come from the sprite in the static
   build; here each row is markup because the icon and the label
   belong together, but the whole block is one widget the developer
   can swap for an Icon List if Wayne needs to edit it often.
   --------------------------------------------------------- */
export function contactDetails() {
    const row = (icon, label, body) =>
        `<li>${icon}<span><strong>${label}</strong>${body}</span></li>`;
    const i = (n) => `<svg aria-hidden="true"><use href="#wi-${n}"/></svg>`;

    return html(`<ul class="wht-contact__list">
${row(i('phone'), 'Call WHT', `<a href="tel:${SITE.tel1}" data-wht-event="click_call">${SITE.phone1}</a><br><a href="tel:${SITE.tel2}" data-wht-event="click_call">${SITE.phone2}</a>`)}
${row(i('wa'), 'WhatsApp', `<a href="https://wa.me/${SITE.wa}" target="_blank" rel="noopener" data-wht-event="click_whatsapp">WhatsApp WHT</a>`)}
${row(i('mail'), 'Email', `<a href="mailto:${SITE.email}" data-wht-event="click_email">${SITE.email}</a>`)}
${row(i('globe'), 'Website', 'www.whtelectrical.co.za')}
${row(i('pin'), 'Visit', `<address>${SITE.street}<br>${SITE.suburb}<br>${SITE.town}<br>${SITE.region}</address>`)}
${row(i('building'), 'Service Area', 'Based in Benoni and serving clients throughout Gauteng, with national project capability.')}
</ul>
<!-- BUSINESS HOURS: Tab 12 lists hours as still to be confirmed by WHT.
     Add a row here once confirmed, and openingHoursSpecification to the schema. -->`,
        { label: 'Contact details' });
}

/* =========================================================
   Inner-page builders — the Elementor side of bullets, slist,
   steps, related, callout, faqSection and ctaBand in layout.mjs.
   Same arguments where possible, so a page module reads like its
   pages.mjs entry.

   The same rule as above: anything with words in it is a native
   widget. Icons stay as markup because they are decorative.
   ========================================================= */
export { CARD, PROCESS_GENERAL };

export const ic = (n) => `<svg aria-hidden="true"><use href="#wi-${n}"/></svg>`;

/* Plain text for editor labels. */
const plain = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&')
    .replace(/&rsquo;/g, '\'').replace(/&[a-z]+;/g, '');

/* Section padding as Elementor settings. One place, because it is the
   value most likely to need retuning against the real import. */
export const PAD = { pad: dims(88, 22, 88, 22), padM: dims(56, 22, 56, 22) };
const PAD_TIGHT = { pad: dims(66, 22, 66, 22), padM: dims(40, 22, 40, 22) };

/* A page section and its .wht-container. grid: true makes the container
   the two-column .wht-grid-2 the static build uses; top aligns it to the top. */
export function section({ anchor, alt, tight, extra, label, grid, top }, children) {
    const cls = ['wht-section', tight && 'wht-section--tight', alt && 'wht-section--alt', extra].filter(Boolean).join(' ');
    const inner = ['wht-container', grid && 'wht-grid-2', grid && top && 'wht-grid-2--top'].filter(Boolean).join(' ');
    return box({ cls, anchor, tag: 'section', label, ...(tight ? PAD_TIGHT : PAD) },
        [box({ cls: inner, label: grid ? 'Two columns' : 'Container' }, children)]);
}

/* A column or card whose spacing comes from its children's margins, as in
   the static build. gap: 0 so Elementor's widget spacing does not add to it. */
export const col = (o, children) => box({ gap: 0, ...o }, children);

export const eyebrow = (t) => heading(t, { tag: 'span', cls: 'wht-eyebrow', label: 'Eyebrow' });
export const h2 = (t, { id, ...o } = {}) => heading(t, { tag: 'h2', anchor: id, label: 'Heading', ...o });
export const h3 = (t, o = {}) => heading(t, { tag: 'h3', label: 'Heading', ...o });
export const iconTile = (cls, icon) => html(`<div class="${cls}">${ic(icon)}</div>`, { label: 'Icon' });

/* Paragraphs for ONE Text Editor, so consecutive paragraphs keep the
   p + p spacing wht.css gives them. A [cls, text] pair adds a class. */
export const paras = (items) => [].concat(items)
    .map((p) => Array.isArray(p) ? `<p class="${p[0]}">${p[1]}</p>` : `<p>${p}</p>`).join('');
export const prose = (items, o = {}) => text(paras(items), { label: 'Text', ...o });

/* ---------- Buttons ---------- */
const WA_DEFAULT = "Hi WHT Electrical, I'd like help with the following:";
export const quoteBtn = (label = 'Request a Quote', target = 'contact') =>
    button(label, href(target), { cls: 'wht-btn wht-btn--primary', label: plain(label) });
export const waBtn = (label = 'WhatsApp WHT', msg = WA_DEFAULT) =>
    button(label, waHref(msg), { cls: 'wht-btn wht-btn--wa', external: true, label: plain(label) });
export const callBtn = (label = 'Call WHT') =>
    button(label, `tel:${SITE.tel1}`, { cls: 'wht-btn wht-btn--ondark', label: plain(label) });
export const ghostBtn = (label, target, hash = '') =>
    button(label, href(target, hash), { cls: 'wht-btn wht-btn--ghost', label: plain(label) });
export const ondarkBtn = (label, target, hash = '') =>
    button(label, href(target, hash), { cls: 'wht-btn wht-btn--ondark', label: plain(label) });

/* A row of buttons. cls is the static build's wrapper class. */
export const btnRow = (cls, buttons) =>
    box({ cls, row: true, wrap: true, keepRowM: true, gap: 14, label: 'Buttons' }, buttons);

/* A lone button the static build wraps in a <p>: restate that margin. */
export const btnBlock = (btn, top = 0) => box({ margin: dims(top, 0, 20, 0), label: 'Button' }, [btn]);

export const arrowLink = (label, key, hash = '') =>
    html(`<a class="wht-arrow" href="${href(key, hash)}">${label} ${ic('arrow')}</a>`, { label: `Link — ${plain(label)}` });

/* ---------- Photos ---------- */
export const photo = (key, { alt, caption, cls, label = 'Photo' } = {}) => {
    const [file, , , defaultAlt] = PHOTO[key];
    return image(`${SITE.domain}/assets/photos/${file}`, alt ?? defaultAlt, { cls, caption, label });
};

/* A single captioned photograph across the content column. */
export const photoFigure = (key, caption) =>
    section({ tight: true, label: 'Photo' }, [photo(key, { caption, cls: 'wht-figure' })]);

/* ---------- Checklists ----------
   A Text Editor holding a plain <ul>, so the list is edited as a list.
   The ticks are drawn by wht-elementor.css; the static build's inline
   SVG would not survive the editor. */
export const bullets = (items, { one = false, dark = false, margin, label = 'Checklist' } = {}) =>
    text(`<ul>${items.map((t) => `<li>${t}</li>`).join('')}</ul>`, {
        cls: ['wht-bullets', one && 'wht-bullets--1', dark && 'wht-bullets--dark'].filter(Boolean).join(' '),
        margin, label,
    });

/* The four-point list on dark bands. */
export const points = (items) =>
    text(`<ul>${items.map((t) => `<li>${t}</li>`).join('')}</ul>`, { cls: 'wht-brand__points', label: 'Points' });

/* ---------- Service list grid: [icon, title, description] ---------- */
export const slist = (items) => box({ cls: 'wht-slist', label: 'Service list' }, items.map(([icon, title, p]) =>
    box({ cls: 'wht-sitem', tag: 'article', row: true, keepRowM: true, align: 'flex-start', gap: 16, label: plain(title) }, [
        iconTile('wht-sitem__icon', icon),
        col({ cls: 'wht-sitem__body', label: 'Text' }, [h3(title), text(`<p>${p}</p>`, { label: 'Description' })]),
    ])));

/* ---------- Process steps: [title | null, text] ---------- */
export const steps = (items) => {
    const mod = { 2: ' wht-steps--2', 3: ' wht-steps--3', 4: ' wht-steps--4' }[items.length] || '';
    return box({ cls: `wht-steps${mod}`, label: 'Steps' }, items.map(([title, p], i) =>
        col({ cls: 'wht-step', label: `Step ${i + 1}` }, [
            html(`<div class="wht-step__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</div>`, { label: 'Number' }),
            title ? h3(title, { label: 'Step heading' }) : null,
            text(`<p>${p}</p>`, { cls: title ? undefined : 'wht-step__lead', label: 'Step text' }),
        ])));
};

export const processSection = ({ h2: title = 'What Happens When You Contact WHT?', items = PROCESS_GENERAL, alt = false, eyebrow: eb = 'How it works' } = {}) =>
    section({ anchor: 'process', alt, label: 'Process' }, [
        sectionHead({ eyebrow: eb, h2: title, center: true, id: 'wht-process-title' }),
        steps(items),
    ]);

/* ---------- Linked cards: [icon, routeKey, title, text | text[], linkLabel, hash?] ----------
   The icon sits beside the heading rather than inside it, so the heading
   stays plain text in the editor. */
export const related = (items, { level = 'h3' } = {}) => box({ cls: 'wht-related', label: 'Linked cards' },
    items.map(([icon, key, title, p, link, hash = '']) => box({ cls: 'wht-relcard', tag: 'article', label: plain(title) }, [
        box({ cls: `wht-relcard__title wht-relcard__title--${level}`, row: true, keepRowM: true, align: 'center', gap: 10, label: 'Title' }, [
            html(ic(icon), { label: 'Icon' }),
            heading(title, { tag: level, label: 'Heading' }),
        ]),
        /* One widget per paragraph: the card is a flex column with a gap, and
           the static build spaces its paragraphs with that gap. */
        ...[].concat(p).map((t, i) => text(`<p>${t}</p>`, { label: `Text ${i + 1}` })),
        arrowLink(link, key, hash),
    ])));

export const relatedSection = ({ keys, h2: title = 'Related Services', eyebrow: eb = 'Related services', alt = false }) =>
    section({ label: 'Related services', alt }, [
        sectionHead({ eyebrow: eb, h2: title, id: 'wht-related-title' }),
        related(keys.map((k) => CARD[k])),
    ]);

/* ---------- Callout card ---------- */
export const callout = ({ eyebrow: eb, h2: title, id, body, cta }) => box({ cls: 'wht-callout', label: 'Callout' }, [
    col({ label: 'Callout copy' }, [
        eb ? eyebrow(eb) : null,
        h2(title, { id }),
        prose(body),
    ]),
    box({ label: 'Callout CTA' }, [cta]),
]);

/* Tab 4 "Project / proof". Points at the homepage Recent Work section
   until individual project pages exist. */
export const proofSection = ({ alt = false } = {}) => section({ tight: true, alt, label: 'Recent work' }, [
    callout({
        eyebrow: 'Recent work', h2: 'Recent WHT Projects', id: 'wht-proof-title',
        body: [
            'Real work tells the story better than generic claims.',
            'Explore examples of problems WHT has investigated, systems installed and property work completed for clients across Gauteng and South Africa.',
        ],
        cta: ghostBtn('View Recent Work', 'home', '#work'),
    }),
]);

/* ---------- FAQs ----------
   Elementor's Nested Accordion prints the FAQPage schema itself, from
   the same questions, so there is nothing to keep in step by hand. */
export const faqSection = (faqs, { h2: title = 'Frequently Asked Questions', alt = true } = {}) =>
    section({ anchor: 'faqs', alt, label: 'FAQs' }, [
        sectionHead({ eyebrow: 'FAQs', h2: title, center: true, id: 'wht-faq-title' }),
        box({ cls: 'wht-faqs', label: 'FAQ accordion' }, [
            accordion(faqs.map(([q, a]) => ({ q, a: [].concat(a).join('</p><p>') })), { label: 'Questions' }),
        ]),
    ]);

/* ---------- Final CTA band ---------- */
export const ctaBand = ({ h2: title, body = [], buttons = [], phones = false }) =>
    box({ cls: 'wht-ctaband wht-section', tag: 'section', label: 'Final CTA', ...PAD }, [
        box({ cls: 'wht-container', label: 'Container' }, [
            h2(title, { id: 'wht-cta-title' }),
            body.length ? prose(body) : null,
            btnRow('wht-ctaband__btns', buttons),
            phones ? html(`<div class="wht-ctaband__phones">
    <a href="tel:${SITE.tel1}" data-wht-event="click_call">${ic('phone')} ${SITE.phone1}</a>
    <a href="tel:${SITE.tel2}" data-wht-event="click_call">${ic('phone')} ${SITE.phone2}</a>
</div>`, { label: 'Phone numbers' }) : null,
        ]),
    ]);

/* ---------- Two-column intro: heading and lead left, list right ---------- */
export const splitList = ({ anchor, alt, label, eyebrow: eb, h2: title, id, lead, items, one = false, note }) =>
    section({ anchor, alt, label, grid: true, top: true }, [
        col({ label: 'Heading' }, [
            eyebrow(eb),
            h2(title, { id, cls: 'wht-title' }),
            text(`<p>${lead}</p>`, { cls: 'wht-lead', label: 'Lead' }),
        ]),
        col({ label: 'List' }, [
            bullets(items, { one }),
            note ? text(`<p>${note}</p>`, { cls: 'wht-note', label: 'Note' }) : null,
        ]),
    ]);
