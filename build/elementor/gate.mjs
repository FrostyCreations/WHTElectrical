/* Gate Motors & Electric Fencing as an Elementor template (High-Intent template).
   Copy is the approved Tab 5 copy from build/pages.mjs. */
import {
    pageData, pageHero, section, col, eyebrow, h2, h3, prose, iconTile, bullets, processSection,
    relatedSection, faqSection, ctaBand, quoteBtn, waBtn, btnRow,
} from './sections.mjs';

export const title = 'WHT — Gate Motors & Electric Fencing';
const page = pageData('gate');

const panel = ({ icon, eb, title: t, id, body, sublabel, items }) =>
    col({ cls: 'wht-panel', tag: 'article', label: eb }, [
        iconTile('wht-panel__icon', icon),
        eyebrow(eb),
        h2(t, { id }),
        prose(body),
        h3(sublabel, { cls: 'wht-sublabel', label: 'Sub-label' }),
        bullets(items, { one: true }),
    ]);

export const build = () => [

    pageHero({
        h1: 'Gate Motor &amp; Electric Fence Repairs Across Gauteng',
        lead: [
            'A gate that will not open or an electric fence that is not working can quickly become inconvenient and affect how secure the property feels.',
            'WHT provides gate motor and electric fence repairs, installations and compliance support.',
        ],
        crumbs: page.crumbs,
        cta: btnRow('wht-pagehero__cta', [quoteBtn(), waBtn()]),
    }),

    /* Gate motors | Electric fencing */
    section({ label: 'Gate motor and electric fence services', grid: true, top: true }, [
        panel({
            icon: 'gate', eb: 'Gate motor problems', title: 'Gate Won&rsquo;t Open?', id: 'wht-gate-title',
            body: [
                'A gate motor failure may involve the motor itself, electrical supply, backup battery, controls or another part of the system.',
                'WHT can assess the problem and determine what needs attention.',
            ],
            sublabel: 'Gate motor services',
            items: ['Gate motor installations', 'Gate motor repairs', 'Gate motor upgrades', 'Electrical fault finding', 'Power supply-related problems'],
        }),
        panel({
            icon: 'fence', eb: 'Electric fencing', title: 'Keep Your Electric Fence Working Properly', id: 'wht-fence-title',
            body: ['An electric fence needs to operate consistently to perform its intended role.'],
            sublabel: 'WHT provides',
            items: ['Electric fence installations', 'Electric fence repairs', 'Electric fence extensions', 'Fault assessment', 'Electric fence COCs'],
        }),
    ]),

    processSection({
        alt: true,
        items: [
            [null, 'Explain whether the problem involves the gate, electric fence or both.'],
            [null, 'The relevant system is assessed before the recommended repair, installation or compliance work is explained.'],
        ],
    }),

    relatedSection({ keys: ['coc', 'fault', 'backup'], h2: 'Related Services' }),

    faqSection(page.faqs, { h2: 'Gate &amp; Fence FAQs' }),

    ctaBand({
        h2: 'Gate or Electric Fence Giving You Trouble?',
        body: ['Tell WHT what is happening.'],
        buttons: [waBtn(), quoteBtn()],
    }),
];
