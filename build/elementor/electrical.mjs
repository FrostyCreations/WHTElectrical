/* Electrical pillar page as an Elementor template. Copy is the approved
   Tab 5 copy from build/pages.mjs; crumbs and FAQs are read from it. */
import {
    pageData, pageHero, section, sectionHead, splitList, slist, related, processSection,
    proofSection, faqSection, ctaBand, photoFigure, quoteBtn, waBtn, btnRow,
} from './sections.mjs';

export const title = 'WHT — Electrical';
const page = pageData('electrical');

export const build = () => [

    pageHero({
        h1: 'Electrical Services &amp; Repairs Across Gauteng',
        lead: [
            'From a plug that has stopped working to recurring power trips or a larger electrical installation, WHT provides practical electrical support for homes, businesses and properties.',
            'Services are available throughout Gauteng, with national electrical project capability.',
        ],
        crumbs: page.crumbs,
        cta: btnRow('wht-pagehero__cta', [quoteBtn(), waBtn()]),
    }),

    photoFigure('dbboard', 'DB board work on a recent WHT job.'),

    /* Common problems */
    splitList({
        label: 'Common problems', eyebrow: 'Common problems',
        h2: 'Something Electrical Giving You Trouble?', id: 'wht-problems-title',
        lead: 'Common problems include:',
        items: [
            'Power repeatedly tripping', 'Earth leakage faults', 'Lights that stop working',
            'Faulty plugs or switches', 'DB board problems', 'Damaged or ageing wiring',
            'Electrical problems after power interruptions', 'Circuits that need upgrading',
            'Electrical installations requiring compliance work',
        ],
        one: true,
        note: 'You do not need to diagnose the fault yourself. Tell WHT what is happening and the problem can be assessed.',
    }),

    /* Services included */
    section({ anchor: 'services', alt: true, label: 'Electrical services' }, [
        sectionHead({ eyebrow: 'Electrical services', h2: 'Electrical Work WHT Can Help With', id: 'wht-services-title' }),
        slist([
            ['inspect', 'Repairs &amp; Fault Finding', 'Electrical diagnostics and repairs for recurring or unexpected faults.'],
            ['cable', 'New Installations', 'Electrical work for new installations, additions and property improvements.'],
            ['grid', 'DB Boards', 'DB board repairs, upgrades and related electrical work.'],
            ['layers', 'Rewiring', 'Rewiring where existing electrical systems need attention or upgrading.'],
            ['plug', 'Plugs, Switches &amp; Lighting', 'Installation and repair of plug points, switches and lighting.'],
            ['tools', 'Geyser &amp; Stove Isolators', 'Electrical isolators and related circuit work.'],
            ['doc', 'Electrical COCs', 'Electrical inspections, remedial work and Certificates of Compliance.'],
            ['generator', 'Generator Connections', 'Generator connections and whole-house generator installation requirements.'],
            ['gate', 'Gate Motors &amp; Electric Fencing', 'Electrical support for property access and perimeter systems.'],
        ]),
    ]),

    /* Related specialist services — each keeps its approved H2 */
    section({ label: 'Specialist electrical services' }, [
        related([
            ['bolt', 'fault', 'Power Keeps Tripping?', [
                'A circuit that repeatedly trips is usually telling you that something needs attention.',
                'WHT provides electrical fault finding to identify the affected circuit, installation or component before recommending the appropriate repair.',
            ], 'Explore Fault Finding'],
            ['doc', 'coc', 'Need an Electrical COC?', ['WHT can assist with electrical inspections, compliance-related repairs and electrical Certificates of Compliance.'], 'Electrical COC Services'],
            ['gate', 'gate', 'Gate Motors &amp; Electric Fencing', ['WHT provides gate motor repairs and installations together with electric fence repairs, extensions and compliance services.'], 'Explore Gate Motors &amp; Electric Fencing'],
        ], { level: 'h2' }),
    ]),

    processSection({
        h2: 'How WHT Approaches Electrical Work', alt: true,
        items: [
            [null, 'Tell us what is happening or what work you require.'],
            [null, 'The relevant electrical system is assessed and the recommended work is explained.'],
            [null, 'Once approved, the work is completed and tested, with applicable documentation supplied where required.'],
        ],
    }),

    proofSection(),

    faqSection(page.faqs, { h2: 'Electrical FAQs' }),

    ctaBand({
        h2: 'Need Electrical Help?',
        body: ['Whether you know exactly what work is required or simply know something is not working properly, tell WHT what is happening.'],
        buttons: [quoteBtn(), waBtn()],
    }),
];
