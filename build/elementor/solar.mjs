/* Solar & Backup Power pillar page as an Elementor template.
   Copy is the approved Tab 5 copy from build/pages.mjs. */
import { box, text, dims } from './lib.mjs';
import {
    pageData, pageHero, section, sectionHead, col, eyebrow, h2, h3, prose, iconTile, bullets, slist,
    processSection, relatedSection, proofSection, faqSection, ctaBand, photoFigure,
    quoteBtn, waBtn, btnRow, btnBlock,
} from './sections.mjs';

export const title = 'WHT — Solar & Backup Power';
const page = pageData('solar');
const WA_MSG = "Hi WHT Electrical, I'm planning solar or backup power and would like an assessment.";

export const build = () => [

    pageHero({
        h1: 'Solar, Inverter &amp; Battery Backup Systems Across Gauteng',
        question: 'What Do You Need to Keep Running When the Power Goes Out?',
        lead: [
            'The right backup system starts with understanding how your home, business or property actually uses power.',
            'WHT provides solar, inverter, battery and off-grid power systems for residential, commercial and industrial applications.',
        ],
        crumbs: page.crumbs,
        cta: btnRow('wht-pagehero__cta', [quoteBtn('Request a Solar Assessment'), waBtn('WhatsApp WHT', WA_MSG)]),
    }),

    photoFigure('commercial', 'A commercial rooftop solar installation completed by WHT.'),

    /* Start with your power needs */
    section({ label: 'Start with your power needs', grid: true, top: true }, [
        col({ label: 'Power needs copy' }, [
            eyebrow('Start with your power needs'),
            h2('Design the System Around What Matters to You', { id: 'wht-needs-title', cls: 'wht-title' }),
            prose([
                'Customers often start by asking what size inverter or battery they need.',
                ['wht-emph', 'A more useful starting point is understanding what you want to keep running.'],
                'From there, the system can be planned around your actual requirements.',
            ]),
        ]),
        col({ cls: 'wht-panel', label: 'That may include' }, [
            h3('That may include', { cls: 'wht-sublabel', label: 'Sub-label', margin: dims(0, 0, 14, 0) }),
            bullets(['Lighting', 'Wi-Fi', 'Refrigeration', 'Security systems', 'Gate motors', 'Office equipment', 'Selected appliances', 'Important business circuits']),
        ]),
    ]),

    /* Services included */
    section({ anchor: 'services', alt: true, label: 'Solar and backup power services' }, [
        sectionHead({ eyebrow: 'Solar &amp; backup power services', h2: 'Solar &amp; Backup Power Services', id: 'wht-services-title' }),
        slist([
            ['solar', 'Solar Installations', 'Solar panel installations for residential, commercial and industrial applications.'],
            ['bolt', 'Inverter Systems', 'Inverter installations designed around the power requirements of the property.'],
            ['battery', 'Battery Backup', 'Battery systems that provide stored power when grid supply is interrupted.'],
            ['layers', 'Lithium Battery Storage', 'Lithium storage systems for backup and solar applications.'],
            ['grid', 'Hybrid Solar', 'Systems combining solar generation, battery storage and grid supply.'],
            ['home', 'Off-Grid Systems', 'Solutions for properties requiring a greater level of energy independence.'],
        ]),
    ]),

    /* Choose the right level of backup */
    section({ label: 'Choose the right level of backup' }, [
        sectionHead({ eyebrow: 'Choose the right level of backup', h2: 'What Are You Trying to Achieve?', id: 'wht-levels-title' }),
        box({ cls: 'wht-markets', label: 'Backup levels' }, [
            ['battery', 'Keep the Essentials Running', 'Backup for selected circuits and important everyday appliances.'],
            ['solar', 'Reduce Dependence on Grid Power', 'Combine solar generation with storage to reduce reliance on grid electricity.'],
            ['home', 'Move Towards Greater Independence', 'Larger hybrid or off-grid systems can be designed around broader energy requirements.'],
        ].map(([icon, t, p]) => box({ cls: 'wht-market', tag: 'article', label: t }, [
            iconTile('wht-market__icon', icon),
            h3(t),
            text(`<p>${p}</p>`, { label: 'Text' }),
        ]))),
    ]),

    /* Commercial & industrial */
    section({ extra: 'wht-brand', label: 'Commercial and industrial solar', grid: true }, [
        col({ label: 'Commercial copy' }, [
            eyebrow('Commercial &amp; industrial solar'),
            h2('Power Solutions for Businesses', { id: 'wht-commercial-title' }),
            prose([
                'Commercial and industrial properties often have different consumption patterns, operating hours and continuity requirements.',
                'WHT can assess the property and recommend a system suited to the operational environment.',
                ['wht-emph', 'National project capability is available for suitable commercial and industrial work.'],
            ]),
        ]),
        col({ label: 'CTA' }, [btnBlock(quoteBtn('Request a Solar Assessment'))]),
    ]),

    processSection({ alt: true }),
    relatedSection({ keys: ['electrical', 'gate', 'fault'] }),
    proofSection({ alt: true }),
    faqSection(page.faqs, { h2: 'Solar FAQs', alt: false }),

    ctaBand({
        h2: 'Planning Solar or Backup Power?',
        body: ['Tell WHT what you want to keep running and what you would like the system to achieve.'],
        buttons: [quoteBtn('Request a Solar Assessment'), waBtn('WhatsApp WHT', WA_MSG)],
    }),
];
