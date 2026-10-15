/* Plumbing pillar page as an Elementor template.
   Copy is the approved Tab 5 copy from build/pages.mjs. */
import {
    pageData, pageHero, section, sectionHead, splitList, slist, callout, processSection,
    relatedSection, proofSection, faqSection, ctaBand, quoteBtn, waBtn, btnRow,
} from './sections.mjs';

export const title = 'WHT — Plumbing';
const page = pageData('plumbing');

export const build = () => [

    pageHero({
        h1: 'Plumbing, Leak &amp; Geyser Repairs Across Gauteng',
        lead: [
            'A plumbing problem can disrupt a home or property quickly.',
            'WHT provides general plumbing repairs, geyser services, leak repairs and property plumbing support.',
        ],
        crumbs: page.crumbs,
        cta: btnRow('wht-pagehero__cta', [quoteBtn(), waBtn()]),
    }),

    splitList({
        label: 'Common plumbing problems', eyebrow: 'Common plumbing problems',
        h2: 'What Plumbing Problem Are You Dealing With?', id: 'wht-problems-title',
        lead: 'WHT can assist with:',
        items: ['Leaks', 'Burst pipes', 'Geyser problems', 'No hot water', 'Kitchen plumbing', 'Bathroom plumbing', 'General plumbing repairs', 'Plumbing maintenance'],
    }),

    /* Services included */
    section({ anchor: 'services', alt: true, label: 'Plumbing services' }, [
        sectionHead({ eyebrow: 'Plumbing services', h2: 'Plumbing Services', id: 'wht-services-title' }),
        slist([
            ['inspect', 'Leak Detection &amp; Repairs', 'Assessment and repair of plumbing leaks.'],
            ['droplet', 'Burst Pipes', 'Repairs where damaged plumbing has caused or may cause water loss and property damage.'],
            ['tools', 'Geyser Repairs', 'Assessment and repair of geyser-related problems.'],
            ['home', 'Geyser Installation &amp; Replacement', 'Installation or replacement where a geyser needs to be changed.'],
            ['grid', 'Kitchen &amp; Bathroom Plumbing', 'Practical plumbing work for kitchens and bathrooms.'],
            ['clock', 'General Maintenance', 'Ongoing plumbing repairs and property maintenance requirements.'],
        ]),
    ]),

    /* No hot water? */
    section({ label: 'No hot water' }, [
        callout({
            eyebrow: 'No hot water?', h2: 'Is the Problem Plumbing or Electrical?', id: 'wht-hotwater-title',
            body: [
                'A loss of hot water can involve the geyser, plumbing system or electrical supply.',
                'Because WHT works across both electrical and plumbing services, the problem can be approached from the relevant side of the system.',
            ],
            cta: quoteBtn('Tell Us What&rsquo;s Happening'),
        }),
    ]),

    processSection({
        alt: true,
        items: [
            [null, 'Tell us what is happening and where the problem is located.'],
            [null, 'WHT can assess the issue, explain what needs attention and recommend the appropriate repair or replacement.'],
        ],
    }),

    relatedSection({ keys: ['electrical', 'maintenance', 'solar'] }),
    proofSection({ alt: true }),
    faqSection(page.faqs, { h2: 'Plumbing FAQs', alt: false }),

    ctaBand({
        h2: 'Plumbing Problem?',
        body: ['Tell WHT what is happening.'],
        buttons: [waBtn(), quoteBtn()],
    }),
];
