/* Fault Finding & Repairs as an Elementor template (High-Intent template).
   Copy is the approved Tab 5 copy from build/pages.mjs. */
import { text } from './lib.mjs';
import {
    pageData, pageHero, section, col, eyebrow, h2, prose, bullets, processSection, faqSection,
    ctaBand, waBtn, callBtn, ghostBtn, btnRow, btnBlock,
} from './sections.mjs';

export const title = 'WHT — Fault Finding & Repairs';
const page = pageData('fault');
const WA_MSG = "Hi WHT Electrical, my power keeps tripping. Here's what is happening:";

export const build = () => [

    pageHero({
        h1: 'Power Keeps Tripping? Electrical Fault Finding Across Gauteng',
        lead: [
            'When an electrical problem keeps coming back, finding the cause matters.',
            'WHT provides electrical fault finding and repairs to identify what is causing the problem and determine the appropriate solution.',
        ],
        crumbs: page.crumbs,
        cta: btnRow('wht-pagehero__cta', [waBtn('WhatsApp WHT About the Problem', WA_MSG), callBtn()]),
    }),

    /* Direct answer + common problems */
    section({ label: 'Why power trips and what WHT investigates', grid: true, top: true }, [
        col({ cls: 'wht-answer', label: 'Direct answer' }, [
            h2('Why Does My Power Keep Tripping?'),
            prose([
                'Repeated tripping usually means the electrical system is responding to a fault or abnormal condition. The cause may sit within a circuit, appliance, connection or another part of the installation.',
                'Proper testing helps identify where the problem is coming from.',
            ]),
        ]),
        col({ label: 'Common problems' }, [
            eyebrow('Common problems'),
            h2('Electrical Problems WHT Can Investigate', { cls: 'wht-title' }),
            bullets([
                'Power repeatedly tripping', 'Earth leakage problems', 'Trips after rain',
                'Electrical problems after power interruptions', 'Lights not working correctly',
                'Faulty plug circuits', 'DB board problems', 'Recurring unexplained faults',
                'Electrical issues other contractors have struggled to resolve',
            ], { one: true }),
        ]),
    ]),

    /* What WHT does */
    section({ extra: 'wht-brand', label: 'Fault-finding approach' }, [
        col({ cls: 'wht-prose', label: 'Approach copy' }, [
            eyebrow('Fault-finding approach'),
            h2('Find the Cause Before Recommending the Repair', { id: 'wht-approach-title' }),
            prose([
                ['wht-emph', 'Electrical faults are not always obvious.'],
                'The visible symptom may be a tripped switch or a circuit that stops working, while the underlying problem sits somewhere else in the system.',
                'WHT assesses and tests the relevant electrical installation to narrow down the cause.',
                'Once the issue has been identified, the findings and recommended work can be explained.',
            ]),
        ]),
    ]),

    processSection({
        h2: 'What Happens During Fault Finding?',
        items: [
            ['Describe the Problem', 'Tell WHT what happens and when you notice it.'],
            ['Assessment &amp; Testing', 'The relevant circuits and electrical components are assessed.'],
            ['Identify the Fault', 'Testing helps narrow down the cause of the problem.'],
            ['Recommended Repair', 'WHT explains what needs attention and the appropriate next step.'],
        ],
    }),

    /* Related service */
    section({ alt: true, label: 'Related electrical work', grid: true }, [
        col({ label: 'Heading' }, [
            eyebrow('Related electrical work'),
            h2('Related Electrical Work', { id: 'wht-related-title', cls: 'wht-title' }),
            text('<p>Fault finding may lead to work involving:</p>', { cls: 'wht-lead', label: 'Lead' }),
            btnBlock(ghostBtn('View All Electrical Services', 'electrical'), 24),
        ]),
        col({ label: 'List' }, [
            bullets(['DB boards', 'Wiring', 'Plug circuits', 'Lighting', 'Isolators', 'Electrical repairs', 'Compliance-related work']),
        ]),
    ]),

    faqSection(page.faqs, { h2: 'Fault Finding FAQs', alt: false }),

    ctaBand({
        h2: 'Power Keeps Tripping?',
        body: ['Tell us what is happening and when the problem occurs.'],
        buttons: [waBtn('WhatsApp WHT', WA_MSG), callBtn()],
        phones: true,
    }),
];
