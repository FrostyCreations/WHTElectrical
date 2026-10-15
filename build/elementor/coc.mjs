/* Electrical COCs as an Elementor template (High-Intent template).
   Copy is the approved Tab 5 copy from build/pages.mjs. */
import { text, dims } from './lib.mjs';
import {
    pageData, pageHero, section, col, eyebrow, h2, prose, bullets, processSection, callout,
    faqSection, ctaBand, quoteBtn, waBtn, ghostBtn, btnRow,
} from './sections.mjs';

export const title = 'WHT — Electrical COCs';
const page = pageData('coc');
const WA_MSG = "Hi WHT Electrical, I'd like to ask about an electrical COC for my property.";

export const build = () => [

    pageHero({
        h1: 'Electrical COC Inspections &amp; Certificates Across Gauteng',
        question: 'Need an electrical Certificate of Compliance for your property?',
        lead: ['WHT provides electrical inspections, compliance-related repairs and COC services for residential, commercial and other properties.'],
        crumbs: page.crumbs,
        cta: btnRow('wht-pagehero__cta', [quoteBtn('Ask About a COC'), waBtn('WhatsApp WHT', WA_MSG)]),
    }),

    /* Direct answer + when you need one */
    section({ label: 'What a COC is and when you may need one', grid: true, top: true }, [
        col({ cls: 'wht-answer', label: 'Direct answer' }, [
            eyebrow('What is an electrical COC?'),
            h2('What Is an Electrical Certificate of Compliance?'),
            prose([
                'An electrical Certificate of Compliance confirms that an electrical installation has been assessed against the applicable compliance requirements at the time of inspection.',
                'If problems are identified, remedial work may be needed before certification can be completed.',
            ]),
        ]),
        col({ label: 'When clients may need a COC' }, [
            eyebrow('When clients may need a COC'),
            h2('When Might You Need an Electrical COC?', { cls: 'wht-title' }),
            text('<p>Clients commonly enquire about COCs when:</p>', { cls: 'wht-lead', label: 'Lead' }),
            bullets([
                'Selling or transferring property', 'Checking an existing electrical installation',
                'Completing electrical alterations', 'Addressing compliance concerns', 'Updating electrical systems',
            ], { one: true, margin: dims(20, 0, 20, 0) }),
            text('<p>The requirements can vary according to the property and work involved.</p>', { cls: 'wht-note', label: 'Note' }),
        ]),
    ]),

    processSection({
        h2: 'What Happens During the COC Process?', eyebrow: 'The WHT COC process', alt: true,
        items: [
            ['Inspection', 'The electrical installation is assessed.'],
            ['Findings', 'Any compliance problems identified during the inspection are explained.'],
            ['Remedial Work', 'Where required, WHT can quote on the electrical work needed to address the identified issues.'],
            ['Reinspection &amp; Certification', 'Once the relevant work has been completed and the installation meets the applicable requirements, the certification process can proceed.'],
        ],
    }),

    /* Electric fence COC */
    section({ label: 'Electric fence COC' }, [
        callout({
            eyebrow: 'Electric fence COC', h2: 'Does My Electric Fence Need Separate Compliance?', id: 'wht-fence-title',
            body: [
                'Electrical installation compliance and electric fence compliance are separate areas.',
                'WHT provides electric fence COC services in addition to general electrical compliance services.',
                'If your property has an electric fence, mention this when you contact WHT.',
            ],
            cta: ghostBtn('Ask About Electric Fence Compliance', 'gate'),
        }),
    ]),

    faqSection(page.faqs, { h2: 'COC FAQs' }),

    ctaBand({
        h2: 'Need an Electrical COC?',
        body: ['Tell WHT what type of property you have and what the COC is required for.'],
        buttons: [quoteBtn('Ask About a COC'), waBtn('WhatsApp WHT', WA_MSG)],
    }),
];
