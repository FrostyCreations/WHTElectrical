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
import { box, heading, text, button, html, dims } from './lib.mjs';
import { SITE, href } from '../layout.mjs';

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
