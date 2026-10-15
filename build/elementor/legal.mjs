/* Privacy Policy and Terms as Elementor templates.

   The client approved both texts as-is on 15 Oct 2026, so the wording
   must not drift by a word. Rather than retype it, the body is lifted
   from the static page that pages.mjs renders, and dropped into ONE
   Text Editor: a legal page is edited as a document, headings and
   lists included, not as forty separate widgets. */
import { box, text } from './lib.mjs';
import { pageData, pageHero, PAD } from './sections.mjs';

function legalBody(key) {
    const page = pageData(key);
    const html = page.body(page);
    const open = '<div class="wht-container wht-prose">';
    const a = html.indexOf(open);
    const b = html.lastIndexOf('</div>');
    if (a < 0 || b < a) throw new Error(`${key}: could not find the prose block in pages.mjs output`);
    /* No whitespace between tags: WordPress runs wpautop over the editor
       content, and stray newlines between block tags turn into <br>s. */
    return html.slice(a + open.length, b).trim().replace(/>\s+</g, '><');
}

const legalPage = (key, h1, lead) => () => [
    pageHero({ h1, lead: [lead], crumbs: pageData(key).crumbs }),
    box({ cls: 'wht-section', tag: 'section', label: h1, ...PAD }, [
        box({ cls: 'wht-container wht-prose', label: 'Container' }, [
            text(legalBody(key), { label: `${h1} text` }),
        ]),
    ]),
];

export const privacy = {
    title: 'WHT — Privacy Policy',
    build: legalPage('privacy', 'Privacy Policy',
        'How WHT Electrical collects, uses and protects the personal information you give us through this website.'),
};

export const terms = {
    title: 'WHT — Terms',
    build: legalPage('terms', 'Terms of Use',
        'The terms on which this website is made available, and how enquiries and quotes work.'),
};
