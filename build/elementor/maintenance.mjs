/* Property Maintenance pillar page as an Elementor template.
   Copy is the approved Tab 5 copy from build/pages.mjs. */
import {
    pageData, pageHero, section, sectionHead, col, eyebrow, h2, prose, iconTile, slist,
    processSection, relatedSection, proofSection, faqSection, ctaBand, quoteBtn, waBtn, btnRow, btnBlock,
} from './sections.mjs';

export const title = 'WHT — Property Maintenance';
const page = pageData('maintenance');

const panel = ({ icon, eb, title: t, id, body }) => col({ cls: 'wht-panel', tag: 'article', label: eb }, [
    iconTile('wht-panel__icon', icon),
    eyebrow(eb),
    h2(t, { id }),
    prose(body),
]);

export const build = () => [

    pageHero({
        h1: 'Property Maintenance Across Gauteng',
        lead: [
            'Properties need ongoing attention to stay functional, presentable and properly maintained.',
            'WHT provides practical maintenance support for homes, businesses and managed properties across Gauteng, with national capability for suitable projects.',
        ],
        crumbs: page.crumbs,
        cta: btnRow('wht-pagehero__cta', [quoteBtn(), waBtn()]),
    }),

    /* Services included */
    section({ anchor: 'services', label: 'Maintenance services' }, [
        sectionHead({ eyebrow: 'Maintenance services', h2: 'Property Work WHT Can Help With', id: 'wht-services-title' }),
        slist([
            ['tools', 'General Property Maintenance', 'Practical repairs and maintenance across residential and commercial properties.'],
            ['paint', 'Painting', 'Interior and exterior painting.'],
            ['layers', 'Ceilings', 'Ceiling repairs and related maintenance work.'],
            ['grid', 'Drywall', 'Drywall installation and repairs.'],
            ['roof', 'Roof &amp; Gutter Repairs', 'Maintenance work involving roofs and guttering.'],
            ['grid', 'Tiling', 'Tiling repairs and installations.'],
            ['home', 'Flooring', 'Flooring-related property maintenance.'],
        ]),
    ]),

    /* Managed properties */
    section({ extra: 'wht-brand', label: 'Managed properties', grid: true }, [
        col({ label: 'Managed properties copy' }, [
            eyebrow('Property managers &amp; complexes'),
            h2('Maintenance Support for Managed Properties', { id: 'wht-managed-title' }),
            prose([
                'Property managers, landlords, complexes and businesses often need contractors who can assist across more than one part of a property.',
                ['wht-emph', 'WHT&rsquo;s combined electrical, plumbing and maintenance offering allows clients to manage a broader range of practical property requirements through one service relationship.'],
            ]),
        ]),
        col({ label: 'CTA' }, [btnBlock(quoteBtn())]),
    ]),

    /* Residential | Commercial */
    section({ label: 'Residential and commercial maintenance', grid: true, top: true }, [
        panel({
            icon: 'home', eb: 'Residential maintenance', title: 'Keep Your Home in Good Working Order', id: 'wht-res-title',
            body: ['From damaged ceilings and painting to tiling and general repairs, WHT can assist with the maintenance work that keeps a property functional and cared for.'],
        }),
        panel({
            icon: 'building', eb: 'Commercial maintenance', title: 'Practical Support for Business Properties', id: 'wht-com-title',
            body: [
                'Maintenance issues can affect how a workplace functions and how the property is experienced by staff, tenants or customers.',
                'WHT provides property maintenance alongside electrical and plumbing services for commercial environments.',
            ],
        }),
    ]),

    processSection({ alt: true }),
    relatedSection({ keys: ['electrical', 'plumbing', 'solar'] }),
    proofSection({ alt: true }),
    faqSection(page.faqs, { h2: 'Maintenance FAQs', alt: false }),

    ctaBand({
        h2: 'Have a Property Maintenance Job?',
        body: ['Tell WHT what work needs attention.'],
        buttons: [quoteBtn(), waBtn()],
    }),
];
