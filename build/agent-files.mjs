/* =========================================================
   WHT ELECTRICAL — files for AI agents and answer engines

   llms.txt                (https://llmstxt.org/) a Markdown guide to the site
   .well-known/ard.json    Agentic Resource Discovery manifest that lists it

   Both are written into dist-wp/ by `node build/build.mjs --wp --prod`
   and uploaded to the web root by the deploy, so Apache serves them as
   plain files. That matters: Lighthouse's "Agentic Browsing" audits
   gave up on both because WordPress took ~3 s to answer the missing
   URLs, longer than Lighthouse waits.

   Everything here comes from pages.mjs and layout.mjs (the approved
   Tab 5 copy), so it cannot drift from the site. No new claims.
   ========================================================= */
import { SITE, ROUTES } from './layout.mjs';

const text = (s) => String(s)
    .replace(/&amp;/g, '&').replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘')
    .replace(/&middot;/g, '·').replace(/&nbsp;/g, ' ').replace(/<[^>]+>/g, '');

const url = (key) => SITE.domain + ROUTES[key].wp;

const SECTIONS = [
    ['Services', ['electrical', 'fault', 'coc', 'gate', 'solar', 'plumbing', 'maintenance']],
    ['About and contact', ['about', 'contact']],
    /* llmstxt.org: an "Optional" section is the part an agent may skip. */
    ['Optional', ['privacy', 'terms']],
];

export const llmsTxt = (pages) => {
    const byKey = Object.fromEntries(pages.map((p) => [p.key, p]));
    const home = byKey.home;
    const line = (key) => `- [${text(byKey[key].label)}](${url(key)}): ${text(byKey[key].description)}`;
    return [
        `# ${SITE.name}`,
        '',
        `> ${text(home.description)}`,
        '',
        `${SITE.tagline} Based in ${SITE.suburb}, ${SITE.town}, ${SITE.region}, established ${SITE.founded}.`,
        '',
        `- Phone: ${SITE.phone1} or ${SITE.phone2}`,
        `- WhatsApp: [${SITE.phone1}](https://wa.me/${SITE.wa})`,
        `- Email: [${SITE.email}](mailto:${SITE.email})`,
        `- Address: ${SITE.street}, ${SITE.suburb}, ${SITE.town}, ${SITE.region}`,
        `- Request a quote: [${url('contact')}](${url('contact')})`,
        '',
        ...SECTIONS.flatMap(([heading, keys]) => [`## ${heading}`, '', ...keys.map(line), '']),
    ].join('\n');
};

/* ARD v0.91 (what Lighthouse 13.6 validates): an "entries" array; each
   entry needs a urn:air:<publisher>:<namespace>:<name> identifier, a
   displayName, a media type, exactly one of url/data, and 2-5
   representativeQueries, which are what agent search indexes it by. */
export const ardManifest = (pages) => {
    const home = pages.find((p) => p.key === 'home');
    return {
        entries: [{
            identifier: 'urn:air:whtelectrical.co.za:website:site-guide',
            displayName: `${SITE.name} site guide`,
            description: text(home.description),
            type: 'text/markdown',
            url: `${SITE.domain}/llms.txt`,
            representativeQueries: [
                'electrician in Benoni',
                'electrical COC Gauteng',
                'solar and battery backup installer Gauteng',
                'plumbing and geyser repairs Benoni',
                'gate motor and electric fence repairs Gauteng',
            ],
        }],
    };
};
