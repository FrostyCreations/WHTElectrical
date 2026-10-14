/* =========================================================
   WHT ELECTRICAL — homepage hero as an Elementor template

       node build/elementor/home-hero.mjs

   This is the proof piece. The brief is that the hero must look the
   same as the HTML build, so the approach is deliberate:

   - The three decorative layers (video, blue bolt panel, yellow SVG
     edge) go in ONE HTML widget, byte-identical to the static build.
     They carry no copy, so nothing is lost by not making them native,
     and keeping the exact markup is the only way to guarantee the
     clip-path and the stroke render identically.

   - Everything with words in it — eyebrow, headline, three paragraphs,
     two buttons — is a native Elementor widget Wayne can edit.

   The one thing to watch: Elementor puts a widget's CSS classes on its
   outer wrapper, not on the <h1>/<p> inside. wht.css styles the hero
   with descendant selectors (.wht-hero h1, .wht-hero p), which still
   match through the wrapper, but the button styling does not survive —
   that needs the bridge rules in assets/wht-elementor.css.
   ========================================================= */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resetIds, box, heading, text, button, html, dims } from './lib.mjs';
import { MODE, SITE, href } from '../layout.mjs';

/* layout.mjs keeps waHref private, so the same link is built here from the
   same SITE.wa number rather than duplicating the number itself. */
const waHref = (msg) => `https://wa.me/${SITE.wa}` + (msg ? `?text=${encodeURIComponent(msg)}` : '');

MODE.wp = true;                       // absolute /assets/... paths, as WordPress serves them
const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
resetIds('wht-home-hero');

/* ---------- The decorative layers, copied exactly ---------- */
const DECOR = `<div class="wht-hero__media">
    <video class="wht-hero__video" data-src="/assets/video/wht-hero.mp4"
        poster="/assets/photos/hero-solar-roof.jpg"
        autoplay muted loop playsinline preload="none" aria-hidden="true"></video>
</div>
<div class="wht-hero__panel" aria-hidden="true"></div>
<svg class="wht-hero__edge" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path d="M 68 0 L 56 48 L 66 48 L 46 100" vector-effect="non-scaling-stroke"/>
</svg>`;

/* ---------- The hero ---------- */
const hero = box({ cls: 'wht-hero', anchor: 'home', tag: 'section', label: 'Hero' }, [
    html(DECOR, { label: 'Hero backdrop — video, bolt panel, yellow edge' }),

    /* Padding lives in Elementor's own settings rather than CSS, so it stays
       adjustable in the editor. wht.css uses clamp(60px,8vw,100px) top and
       clamp(84px,11vw,140px) bottom; these are those values at each breakpoint. */
    box({
        cls: 'wht-container wht-hero__inner', label: 'Hero inner',
        pad: dims(100, 22, 140, 22), padT: dims(80, 22, 110, 22), padM: dims(60, 22, 84, 22),
    }, [
        box({ cls: 'wht-hero__content', label: 'Hero copy' }, [

            heading(SITE.tagline, { tag: 'span', cls: 'wht-hero__brandline', label: 'Brandline' }),

            heading('Electrical, Solar, Plumbing &amp; Maintenance Across Gauteng',
                { tag: 'h1', anchor: 'wht-h1', label: 'Headline' }),

            text('<p>Power tripping? Gate stuck? No hot water? Planning solar or backup power?</p>',
                { cls: 'wht-hero__q', label: 'Question line' }),

            text('<p>WHT Electrical helps homeowners, businesses and property managers find practical solutions to the problems that interrupt everyday life.</p>',
                { label: 'Lead paragraph' }),

            text('<p>Based in Benoni and serving clients throughout Gauteng, with national project capability.</p>',
                { cls: 'wht-hero__base', label: 'Location line' }),

            box({ cls: 'wht-hero__cta', row: true, wrap: true, keepRowM: true, gap: 14, label: 'Hero buttons' }, [
                button('Request a Quote', href('contact'),
                    { cls: 'wht-btn wht-btn--primary', label: 'Request a Quote' }),
                button('WhatsApp WHT', waHref("Hi WHT Electrical, I'd like help with the following:"),
                    { cls: 'wht-btn wht-btn--wa', external: true, label: 'WhatsApp WHT' }),
            ]),
        ]),
    ]),
]);

/* ---------- Elementor's Templates → Import format ---------- */
const template = {
    content: [hero],
    page_settings: {},
    version: '0.4',
    title: 'WHT — Homepage hero',
    type: 'page',
};

const outDir = join(root, 'dist-elementor');
mkdirSync(outDir, { recursive: true });
const file = join(outDir, 'wht-home-hero.json');
writeFileSync(file, JSON.stringify(template, null, 2));

/* ---------- Report what came out ---------- */
const census = {};
(function walk(els) {
    for (const e of els || []) {
        const k = e.widgetType || e.elType;
        census[k] = (census[k] || 0) + 1;
        walk(e.elements);
    }
})(template.content);

const native = Object.entries(census).filter(([k]) => k !== 'html' && k !== 'container')
    .reduce((n, [, v]) => n + v, 0);

console.log(`wrote dist-elementor/wht-home-hero.json\n`);
for (const [k, v] of Object.entries(census).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(v).padStart(3)}  ${k}`);
}
console.log(`\n${native} editable widgets, ${census.html || 0} HTML widget (the decorative backdrop).`);
