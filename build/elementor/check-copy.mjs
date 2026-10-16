/* =========================================================
   Copy parity: static page vs Elementor template.

   pages.mjs holds the approved Tab 5 copy. The Elementor modules
   restate it as widgets, which is where a word can quietly go missing
   or a typo creep in. This compares the two, both ways:

     missing — text on the static page that the template lacks
     extra   — text in the template that the static page lacks

   Reads dist-wp/, so run `node build/build.mjs --wp --prod` first.
   ========================================================= */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROUTES } from '../layout.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/* Known, deliberate differences. Keep this short and say why. */
const ALLOW = {
    /* The static form marks the photo field with an "Optional" tag and has a
       visible honeypot label; Elementor's labels are plain text and its
       honeypot has no label. Required fields get Elementor's asterisk. */
    contact: {
        missing: [/^(Optional|Website)$/],
    },
};

const ENT = { amp: '&', rsquo: "'", lsquo: "'", rdquo: '"', ldquo: '"', mdash: '—', ndash: '–', hellip: '…', middot: '·', nbsp: ' ', quot: '"', lt: '<', gt: '>' };
const norm = (s) => s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&([a-z]+);/g, (m, n) => ENT[n] ?? m)
    .replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ').trim();

/* Visible text runs in a fragment of HTML: one entry per run between tags. */
const runs = (html) => html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/g, ' ')
    .split(/<[^>]+>/)
    .map(norm)
    .filter((t) => /[A-Za-z0-9]/.test(t));

/* Every string a template shows: headings, text, buttons, HTML, list items,
   FAQ questions, captions. Joined with a separator so runs never fuse. */
function templateRuns(content) {
    const out = [];
    (function walk(els) {
        for (const el of els || []) {
            const s = el.settings || {};
            for (const k of ['title', 'editor', 'html', 'text', 'caption']) if (typeof s[k] === 'string') out.push(...runs(s[k]));
            for (const it of s.items || []) if (it.item_title) out.push(...runs(it.item_title));
            for (const it of s.icon_list || []) if (it.text) out.push(...runs(it.text));
            /* Pro Form: labels, select options (the label half of 'Label|value')
               and the button. The success/error messages are not page copy. */
            for (const f of s.form_fields || []) {
                if (f.field_label) out.push(...runs(f.field_label));
                for (const o of (f.field_options || '').split('\n')) if (o) out.push(...runs(o.split('|')[0]));
            }
            if (s.button_text) out.push(...runs(s.button_text));
            walk(el.elements);
        }
    })(content);
    return out;
}

function staticRuns(slug) {
    const f = join(root, 'dist-wp', ...ROUTES[slug].wp.split('/').filter(Boolean), 'index.html');
    if (!existsSync(f)) return null;
    const html = readFileSync(f, 'utf8');
    const a = html.indexOf('<main id="wht-main">');
    const b = html.indexOf('</main>');
    return runs(html.slice(a, b));
}

export function checkCopy(slugs, built) {
    let ok = true;
    console.log('\n  copy parity vs dist-wp');
    for (const slug of slugs) {
        const st = staticRuns(slug);
        if (!st) { console.log(`  ${slug.padEnd(11)} SKIP — no dist-wp page; run node build/build.mjs --wp --prod`); continue; }
        const el = templateRuns(built[slug]);
        const allow = ALLOW[slug] || {};
        const stAll = st.join('\n'), elAll = el.join('\n');
        /* A run counts as present if it appears inside the other side's text,
           so a link or <strong> splitting a sentence differently is not a miss. */
        const missing = st.filter((t) => !elAll.includes(t) && !(allow.missing || []).some((re) => re.test(t)));
        const extra = el.filter((t) => !stAll.includes(t) && !(allow.extra || []).some((re) => re.test(t)));
        if (!missing.length && !extra.length) { console.log(`  ${slug.padEnd(11)} ok  (${st.length} runs)`); continue; }
        ok = false;
        console.error(`  ${slug.padEnd(11)} MISMATCH`);
        for (const t of missing) console.error(`      missing: ${t}`);
        for (const t of extra) console.error(`      extra:   ${t}`);
    }
    return ok;
}
