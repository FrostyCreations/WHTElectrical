/* =========================================================
   Homepage as an Elementor template.
   Copy is the approved Tab 5 copy, taken from build/pages.mjs.

   Card grids are built as containers of native widgets rather than one
   HTML block, so every heading, paragraph and link is editable. Only
   three things stay as markup: the hero backdrop (clip-path + SVG edge
   + video), the icon badges, and the review stars — all decorative.
   ========================================================= */
import { box, heading, text, button, html, image, accordion, dims } from './lib.mjs';
import { sectionHead, waHref } from './sections.mjs';
import { SITE, href } from '../layout.mjs';

export const title = 'WHT — Home';

const ic = (n, cls = '') => `<svg${cls ? ` class="${cls}"` : ''} aria-hidden="true"><use href="#wi-${n}"/></svg>`;

/* An "arrow" link. Elementor's Button widget carries the WHT button look
   through the bridge CSS; this is the quieter inline link style instead. */
const arrowLink = (label, key, hash = '') =>
    html(`<a class="wht-arrow" href="${href(key, hash)}">${label} ${ic('arrow')}</a>`,
        { label: `Link — ${label}` });

/* Section wrapper with the standard vertical rhythm. */
const section = (o, children) => box({
    cls: `wht-section${o.alt ? ' wht-section--alt' : ''}${o.extra ? ' ' + o.extra : ''}`,
    anchor: o.anchor, tag: 'section', label: o.label,
    pad: dims(88, 22, 88, 22), padM: dims(56, 22, 56, 22),
}, [box({ cls: 'wht-container', label: 'Container' }, children)]);

/* ---------- the four service cards and eight problem cards ---------- */
const CARD = {
    fault:    ['bolt', 'fault', 'Power Keeps Tripping?', 'Recurring trips, earth leakage problems or another electrical fault?', 'Get Electrical Help'],
    coc:      ['doc', 'coc', 'Need an Electrical COC?', 'Need an inspection, compliance work or certification for a property?', 'Electrical COCs'],
    gate:     ['gate', 'gate', 'Gate Won&rsquo;t Open?', 'Gate motor stopped working or giving you trouble?', 'Gate Motor Repairs'],
    fence:    ['fence', 'gate', 'Electric Fence Problem?', 'Repairs, extensions and electric fence compliance services.', 'Electric Fencing'],
    hotwater: ['droplet', 'plumbing', 'No Hot Water?', 'The issue could involve the geyser, plumbing or electrical supply.', 'Plumbing &amp; Geysers'],
    backup:   ['battery', 'solar', 'Need Backup Power?', 'Solar, inverter and battery systems designed around the way your property uses power.', 'Explore Backup Power'],
    property: ['paint', 'maintenance', 'Property Needs Attention?', 'Painting, ceilings, drywall and general repairs.', 'Property Maintenance'],
    unsure:   ['tools', 'contact', 'Not Sure Which Service to Choose?', 'Describe the problem in your own words and WHT can help identify which service is relevant.', 'Tell Us What&rsquo;s Happening'],
};

const SERVICES = [
    ['electrical', 'bolt', 'electrical', 'Electrical', 'From everyday electrical repairs and installations to DB boards, rewiring, fault finding, generator connections and COCs.', 'Explore Electrical', 'electrical-technician.jpg', 800, 533, 'A WHT electrician beside a newly installed surface conduit run with isolators and junction boxes'],
    ['solar', 'solar', 'solar', 'Solar &amp; Backup Power', 'Solar installations, inverters, battery backup, hybrid systems and off-grid power solutions.', 'Explore Solar &amp; Backup Power', 'solar-inverter-battery.jpg', 800, 534, 'Wall-mounted inverter and two lithium battery units installed under a thatched roof'],
    ['plumbing', 'droplet', 'plumbing', 'Plumbing', 'Leaks, burst pipes, geysers, kitchen and bathroom plumbing and general repairs.', 'Explore Plumbing', 'plumbing-tanks.jpg', 800, 534, 'Three JoJo water storage tanks plumbed together on a paved base against a boundary wall'],
    ['maintenance', 'paint', 'maintenance', 'Property Maintenance', 'Painting, ceilings, drywall, tiling, flooring and general building maintenance.', 'Explore Property Maintenance', 'maintenance-ceiling.jpg', 800, 533, 'A curved bulkhead ceiling with recessed downlights and a concealed LED strip'],
];

const PROCESS = [
    ['Tell Us About the Problem', 'Explain what is happening, what service you need and where the property is located.'],
    ['Assessment', 'The relevant system, installation or project requirements are assessed.'],
    ['Recommended Solution', 'WHT explains what has been identified and what work is recommended.'],
    ['Approved Work', 'Once the work has been agreed, the repair, installation or maintenance is carried out.'],
    ['Testing &amp; Documentation', 'Completed work is checked and applicable documentation is provided where required.'],
];

const FAQS = [
    ['What services does WHT Electrical provide?', 'WHT provides general electrical work, fault finding, COCs, gate motors, electric fencing, generator connections, solar and battery backup, plumbing and property maintenance.'],
    ['Where is WHT Electrical based?', 'WHT Electrical is based in Northmead, Benoni, Gauteng.'],
    ['Which areas does WHT Electrical service?', 'WHT serves clients across Gauteng and undertakes projects nationally.'],
    ['Does WHT work with businesses and property managers?', 'Yes. WHT works across residential, commercial and industrial environments and supports businesses, property managers, complexes, landlords and other managed properties.'],
    ['Can WHT help if I do not know what is causing the problem?', 'Yes. Many clients only know the symptom they are experiencing. Explain what is happening and WHT can advise on the appropriate next step.'],
];

const accordionFaqs = (items) =>
    accordion(items.map(([q, a]) => ({ q, a })), { label: 'Common questions' });

const quoteBtn = (label = 'Request a Quote', target = 'contact', cls = 'wht-btn wht-btn--primary') =>
    button(label, href(target), { cls, label });

const waBtn = () =>
    button('WhatsApp WHT', waHref("Hi WHT Electrical, I'd like help with the following:"),
        { cls: 'wht-btn wht-btn--wa', external: true, label: 'WhatsApp WHT' });

/* ---------- the page ---------- */
export const build = () => [

    /* SECTION 2 — HERO. The backdrop is one HTML widget so the clip-path,
       the SVG stroke and the video stay byte-identical to the static build. */
    box({ cls: 'wht-hero', anchor: 'home', tag: 'section', label: 'Hero' }, [
        html(`<div class="wht-hero__media">
    <video class="wht-hero__video" data-src="/assets/video/wht-hero.mp4"
        poster="/assets/photos/hero-solar-roof.jpg"
        autoplay muted loop playsinline preload="none" aria-hidden="true"></video>
</div>
<div class="wht-hero__panel" aria-hidden="true"></div>
<svg class="wht-hero__edge" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path d="M 68 0 L 56 48 L 66 48 L 46 100" vector-effect="non-scaling-stroke"/>
</svg>`, { label: 'Hero backdrop — video, bolt panel, yellow edge' }),

        box({
            cls: 'wht-container wht-hero__inner', label: 'Hero inner',
            pad: dims(100, 22, 140, 22), padT: dims(80, 22, 110, 22), padM: dims(60, 22, 84, 22),
        }, [
            box({ cls: 'wht-hero__content', label: 'Hero copy' }, [
                heading(SITE.tagline, { tag: 'span', cls: 'wht-hero__brandline', label: 'Brandline' }),
                heading('Electrical, Solar, Plumbing &amp; Maintenance Across Gauteng', { tag: 'h1', anchor: 'wht-h1', label: 'Headline' }),
                text('<p>Power tripping? Gate stuck? No hot water? Planning solar or backup power?</p>', { cls: 'wht-hero__q', label: 'Question line' }),
                text('<p>WHT Electrical helps homeowners, businesses and property managers find practical solutions to the problems that interrupt everyday life.</p>', { label: 'Lead paragraph' }),
                text('<p>Based in Benoni and serving clients throughout Gauteng, with national project capability.</p>', { cls: 'wht-hero__base', label: 'Location line' }),
                box({ cls: 'wht-hero__cta', row: true, wrap: true, keepRowM: true, gap: 14, label: 'Hero buttons' }, [quoteBtn(), waBtn()]),
            ]),
        ]),
    ]),

    /* SECTION 3 — TRUST STRIP. Four fixed facts with icons; one widget. */
    box({ cls: 'wht-trustbar', tag: 'section', label: 'Trust strip' }, [
        box({ cls: 'wht-container', label: 'Container' }, [
            html(`<ul>
    <li>${ic('clock')} Established 2010</li>
    <li>${ic('building')} Residential &middot; Commercial &middot; Industrial</li>
    <li>${ic('doc')} Electrical &amp; Electric Fence COCs</li>
    <li>${ic('pin')} Gauteng Based &middot; National Capability</li>
</ul>`, { label: 'Trust facts' }),
        ]),
    ]),

    /* SECTION 4 — PROBLEM NAVIGATION */
    section({ anchor: 'problems', label: 'Problem navigation' }, [
        sectionHead({
            eyebrow: 'Start here', h2: 'What Problem Can We Help You Solve?', id: 'wht-problems-title',
            lead: 'Sometimes you know exactly what service you need. Other times, you simply know something has stopped working. Choose the problem that sounds familiar and we&rsquo;ll point you in the right direction.',
        }),
        box({ cls: 'wht-problems', label: 'Problem cards' },
            ['fault', 'coc', 'gate', 'fence', 'hotwater', 'backup', 'property', 'unsure'].map((k) => {
                const [icon, key, h3, p, link] = CARD[k];
                return box({ cls: 'wht-problem', tag: 'article', label: h3.replace(/&[a-z]+;/g, "'") }, [
                    html(`<div class="wht-problem__icon">${ic(icon)}</div>`, { label: 'Icon' }),
                    heading(h3, { tag: 'h3', label: 'Card heading' }),
                    text(`<p>${p}</p>`, { label: 'Card text' }),
                    arrowLink(link, key),
                ]);
            })),
    ]),

    /* SECTION 5 — MAIN SERVICES */
    section({ anchor: 'services', alt: true, label: 'Main services' }, [
        sectionHead({
            eyebrow: 'Our services', h2: 'Practical Solutions Across Your Property', id: 'wht-services-title',
            lead: 'WHT provides electrical, power, plumbing and maintenance services for homes, businesses and managed properties.',
        }),
        box({ cls: 'wht-services', label: 'Service cards' },
            SERVICES.map(([, icon, key, h3, p, link, file, w, h, alt]) =>
                box({ cls: 'wht-service', tag: 'article', label: h3.replace(/&[a-z]+;/g, '&') }, [
                    box({ cls: 'wht-service__media', label: 'Card image' }, [
                        image(`${SITE.domain}/assets/photos/${file}`, alt, { label: 'Photo' }),
                        html(`<span class="wht-service__badge">${ic(icon)}</span>`, { label: 'Badge' }),
                    ]),
                    box({ cls: 'wht-service__body', label: 'Card body' }, [
                        heading(h3, { tag: 'h3', label: 'Card heading' }),
                        text(`<p>${p}</p>`, { label: 'Card text' }),
                        arrowLink(link, key),
                    ]),
                ])),
        ),
    ]),

    /* SECTION 6 — PROBLEM-SOLVING / APPROACH */
    section({ anchor: 'approach', extra: 'wht-brand', label: 'Our approach' }, [
        box({ cls: 'wht-grid-2', label: 'Approach grid' }, [
            box({ label: 'Approach copy' }, [
                heading('Our approach', { tag: 'span', cls: 'wht-eyebrow', label: 'Eyebrow' }),
                heading('Problems Found. Solutions Delivered.', { tag: 'h2', anchor: 'wht-approach-title', label: 'Heading' }),
                text('<p>A recurring fault can be frustrating, especially when the cause is hidden.</p>', { label: 'Paragraph 1' }),
                text('<p>WHT approaches the job by understanding what is happening, assessing the relevant system and identifying what needs attention before recommending the appropriate solution.</p>', { label: 'Paragraph 2' }),
                text('<p>That approach applies across electrical work, backup power, gate motors, plumbing and general property maintenance.</p>', { label: 'Paragraph 3' }),
                text('<p>The goal is simple: help you understand the problem and get things working properly again.</p>', { cls: 'wht-emph', label: 'Emphasis line' }),
                /* The static build wraps this button in a <p>, which carries the
                   1.25rem paragraph margin. Restated as a container margin. */
                box({ margin: dims(0, 0, 20, 0), label: 'CTA' }, [quoteBtn('Tell Us What&rsquo;s Happening')]),
            ]),
            box({ label: 'Approach points' }, [
                html(`<ul class="wht-brand__points">
    <li>${ic('check')} Listen to the problem.</li>
    <li>${ic('check')} Assess what is happening.</li>
    <li>${ic('check')} Explain the recommended solution.</li>
    <li>${ic('check')} Do the work with care.</li>
</ul>`, { label: 'Four points' }),
            ]),
        ]),
    ]),

    /* SECTION 7 — PROCESS */
    section({ anchor: 'process', label: 'How it works' }, [
        sectionHead({ eyebrow: 'How it works', h2: 'What Happens When You Contact WHT?', center: true, id: 'wht-process-title' }),
        /* The class is wht-steps, with no modifier: wht-steps--5 does not exist
           in wht.css. The number is a div.wht-step__num — wht-step__n was a typo
           that left it unstyled and every step row about 34px short. */
        box({ cls: 'wht-steps', label: 'Process steps' },
            PROCESS.map(([h3, p], i) => box({ cls: 'wht-step', label: `Step ${i + 1}` }, [
                html(`<div class="wht-step__num">${i + 1}</div>`, { label: 'Number' }),
                heading(h3, { tag: 'h3', label: 'Step heading' }),
                text(`<p>${p}</p>`, { label: 'Step text' }),
            ]))),
    ]),

    /* SECTION 8 — COC FEATURE */
    section({ anchor: 'coc', alt: true, label: 'COC feature' }, [
        box({ cls: 'wht-callout', label: 'Callout' }, [
            box({ label: 'Callout copy' }, [
                heading('Compliance', { tag: 'span', cls: 'wht-eyebrow', label: 'Eyebrow' }),
                heading('Need an Electrical COC?', { tag: 'h2', anchor: 'wht-coc-title', label: 'Heading' }),
                text('<p>Whether you are selling a property, checking an installation or dealing with a compliance requirement, WHT can assist with electrical inspections, remedial work and Certificates of Compliance.</p>', { label: 'Paragraph 1' }),
                text('<p>Electric fence compliance is also available as a separate service.</p>', { label: 'Paragraph 2' }),
            ]),
            box({ label: 'Callout CTA' }, [quoteBtn('Ask About a COC', 'coc')]),
        ]),
    ]),

    /* SECTION 9 — MARKETS SERVED */
    section({ anchor: 'markets', label: 'Markets served' }, [
        sectionHead({ eyebrow: 'Who we work with', h2: 'Support for Homes, Businesses &amp; Properties', id: 'wht-markets-title' }),
        box({ cls: 'wht-markets', label: 'Market cards' }, [
            ['home', 'Residential', 'Electrical repairs, solar, plumbing, security systems and maintenance for the places people call home.'],
            ['building', 'Commercial', 'Practical electrical, power and property support that helps businesses keep operating.'],
            ['factory', 'Industrial', 'Electrical and power services for larger installations and operational environments.'],
        ].map(([icon, h3, p]) => box({ cls: 'wht-market', tag: 'article', label: h3 }, [
            html(`<div class="wht-market__icon">${ic(icon)}</div>`, { label: 'Icon' }),
            heading(h3, { tag: 'h3', label: 'Heading' }),
            text(`<p>${p}</p>`, { label: 'Text' }),
        ]))),
        text('<p>WHT also works with property managers, landlords, complexes, estates, body corporates and facilities teams.</p>',
            { cls: 'wht-markets-note', label: 'Markets note' }),
    ]),

    /* SECTION 10 — RECENT WORK.
       Real WHT photographs with factual labels. The per-project write-ups
       (location, problem, work completed) are out until WHT supplies real
       job details — Tab 10 template. */
    section({ anchor: 'work', alt: true, label: 'Recent work' }, [
        sectionHead({
            eyebrow: 'Recent work', h2: 'Recent WHT Projects', id: 'wht-work-title',
            lead: 'Real work tells the story better than generic claims. Explore examples of problems WHT has investigated, systems installed and property work completed for clients across Gauteng and South Africa.',
        }),
        box({ cls: 'wht-projects', label: 'Project cards' }, [
            ['fault-finding-meter.jpg', 'A clamp meter taking a current reading during electrical fault finding', 'Electrical Fault Finding', 'fault'],
            ['project-backup-power.jpg', 'An inverter and two lithium batteries mounted on a wall beside the distribution board', 'Inverter &amp; Battery Backup', 'solar'],
            ['project-gate-motor.jpg', 'A gate motor installed alongside a sliding driveway gate', 'Gate Motor Installation', 'gate'],
        ].map(([file, alt, h3, key]) => box({ cls: 'wht-project', tag: 'article', label: h3 }, [
            box({ cls: 'wht-project__media', label: 'Project image' }, [
                image(`${SITE.domain}/assets/photos/${file}`, alt, { label: 'Photo' }),
            ]),
            box({ cls: 'wht-project__body', label: 'Project body' }, [
                heading(h3, { tag: 'h3', label: 'Project heading' }),
                arrowLink('Related service', key),
            ]),
        ]))),
    ]),

    /* SECTION 11 — REVIEWS: removed until WHT supplies genuine Google
       reviews. Tab 5 is explicit that reviews must be real and quoted word
       for word, so there is nothing to put here in the meantime. Restore
       the section and add aggregateRating to the business schema together. */

    /* SECTION 12 — FAQs. Elementor's Nested Accordion emits the FAQ schema
       itself, so the hand-written FAQPage JSON-LD is no longer needed here. */
    section({ anchor: 'faqs', alt: true, label: 'FAQs' }, [
        sectionHead({ eyebrow: 'FAQs', h2: 'Common Questions', center: true, id: 'wht-faq-title' }),
        box({ cls: 'wht-faqs', label: 'FAQ accordion' }, [
            accordionFaqs(FAQS),
        ]),
    ]),

    /* SECTION 13 — FINAL CTA */
    box({ cls: 'wht-ctaband wht-section', tag: 'section', label: 'Final CTA', pad: dims(88, 22, 88, 22), padM: dims(56, 22, 56, 22) }, [
        box({ cls: 'wht-container', label: 'Container' }, [
            heading('Tell Us What&rsquo;s Happening', { tag: 'h2', anchor: 'wht-cta-title', label: 'Heading' }),
            text('<p>Need electrical, solar, plumbing or property maintenance help? Tell WHT about the problem or project and we&rsquo;ll help you determine the next step.</p>', { label: 'Text' }),
            box({ cls: 'wht-ctaband__btns', row: true, wrap: true, keepRowM: true, gap: 14, label: 'Buttons' }, [quoteBtn(), waBtn()]),
            html(`<div class="wht-ctaband__phones">
    <a href="tel:${SITE.tel1}" data-wht-event="click_call">${ic('phone')} ${SITE.phone1}</a>
    <a href="tel:${SITE.tel2}" data-wht-event="click_call">${ic('phone')} ${SITE.phone2}</a>
</div>`, { label: 'Phone numbers' }),
        ]),
    ]),
];

