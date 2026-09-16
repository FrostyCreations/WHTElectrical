# WHT Electrical — site build notes

The full 10-page launch site from the **WHT Website Build Pack**: Tab 2 sitemap, Tab 3
homepage wireframe, Tab 4 page templates, Tab 5 approved copy, Tab 8 CTAs and form,
Tab 9 visual direction, Tab 11 technical requirements.

---

## What's in the folder

```
index.html, electrical.html, …        ← 10 generated pages (open these to review)
assets/wht.css                        ← the ONE stylesheet, shared by every page
assets/wht.js                         ← the ONE script, shared by every page
build/layout.mjs                      ← header, footer, drawer, icons, schema, section builders
build/pages.mjs                       ← every page's copy and section order
build/build.mjs                       ← generator + verifier
build/serve.mjs                       ← local preview server (no dependencies)
dist-wp/                              ← same 10 pages with real WordPress permalinks
wht-electrical-improved.html          ← earlier single-page concept — superseded, safe to delete
```

**Do not hand-edit the `.html` files.** They are generated. Edit `build/pages.mjs` (copy)
or `build/layout.mjs` (anything shared), then rebuild. Header, footer, navigation, icons
and contact details exist in exactly one place, so they cannot drift between pages.

---

## Page map

| Page | Local file | WordPress URL | Tab 4 template |
|---|---|---|---|
| Home | `index.html` | `/` | Homepage (unique) |
| Electrical | `electrical.html` | `/electrical/` | Service Pillar |
| Fault Finding & Repairs | `electrical-fault-finding-repairs.html` | `/electrical/fault-finding-repairs/` | High-Intent |
| Electrical COCs | `electrical-coc.html` | `/electrical/coc/` | High-Intent |
| Gate Motors & Electric Fencing | `electrical-gate-motors-electric-fencing.html` | `/electrical/gate-motors-electric-fencing/` | High-Intent |
| Solar & Backup Power | `solar-backup-power.html` | `/solar-backup-power/` | Service Pillar |
| Plumbing | `plumbing.html` | `/plumbing/` | Service Pillar |
| Property Maintenance | `property-maintenance.html` | `/property-maintenance/` | Service Pillar |
| About WHT | `about.html` | `/about/` | Standard Content |
| Contact | `contact.html` | `/contact/` | Standard Content |

Each page carries its Tab 5 SEO title and meta description, a canonical URL, and
structured data: LocalBusiness (sitewide), BreadcrumbList, Service (service pages) and
FAQPage (pages with FAQs). The FAQPage schema is generated from the same array as the
visible FAQs, so the two cannot disagree.

---

## Commands

Requires Node 18+ (no packages to install).

```bash
node build/build.mjs
```
Rebuilds the 10 local preview pages, with links between them that work when clicked.

```bash
node build/build.mjs --wp
```
Writes `dist-wp/` using the real permalinks (`/electrical/coc/` etc.) and copies the assets.

```bash
node build/serve.mjs . 5173
```
Preview at http://localhost:5173.

```bash
node build/serve.mjs dist-wp 5174
```
Preview the WordPress-URL version at http://localhost:5174.

### What every build verifies

The build refuses to finish (exit code 1) if any page has:

- a broken internal link, or an `#anchor` pointing at an id that doesn't exist
- more or fewer than one `<h1>`, or a skipped heading level
- duplicate `id` attributes
- an icon that isn't in the sprite
- an `<img>` without `alt`
- a mismatch between visible FAQs and FAQPage schema
- unrendered template output (`undefined`, `${…}`)

These checks were tested by planting one of each fault in a copy of the build — all were
caught. The finished site was also crawled over HTTP (every internal link and asset
returned 200 in both builds) and every page was loaded at 375px to confirm the stylesheet
and script load, the header and mobile bar work, and nothing overflows sideways.

---

## ⚠️ Two design decisions still open

You asked to keep the current design, so it's kept. Both conflict with Tab 9 and are
one-line changes if your brand lead disagrees.

**1. Yellow accent.** Tab 9's palette is White / WHT Blue / Deep Navy / Light Blue Grey.
The design uses `#FFC72C` for CTAs, the bolt edge, step numbers and accents. To drop it,
change `--wht-yellow` at the top of `assets/wht.css`.

**2. Lightning bolt vs "avoid generic lightning or storm imagery."** I read that line as
being about *photography*. The bolt is a geometric shape from the logo mark. It appears
as the homepage hero panel and as a faint watermark in inner-page heroes
(`.wht-pagehero__bolt` — delete that one `div` in `layout.mjs` to remove it sitewide).

---

## Where I went beyond the Tab 5 copy — please review

The Build Pack says copy is final and approved, so every departure is listed here.

**Headings added where Tab 5 gives only a section label** (the templates need an H2):
"Solar & Backup Power Services", "Plumbing Services", "Related Electrical Work",
"Contact Details", "Related Services", and FAQ headings such as "Electrical FAQs".

**Approved copy reused on pages that had none for a template section:**
- *Process* on Solar and Property Maintenance uses the homepage "What Happens When You
  Contact WHT?" five steps. Tab 4 requires a process section; Tab 5 gave those pages none.
- *Related services* cards use the homepage problem-card and service-card wording.
- *Project / proof* on pillar pages uses the homepage Recent Work intro and links to it,
  since Projects is Phase 2.
- The homepage problem-solving checklist uses the About page line
  "Listen to the problem. Assess what is happening. Explain the recommended solution.
  Do the work with care."
- The homepage's eighth problem card uses the Contact page's "Not Sure Which Service to
  Choose?" copy.

**Button labels** are all Tab 8 CTAs (Request a Quote, WhatsApp WHT, Tell Us What's
Happening, Ask About a COC, Request a Solar Assessment) plus "Call WHT" and
"View All Electrical Services" from Tab 5, and "View Recent Work" for the proof link.

**Mobile bar order** is now **CALL | WHATSAPP | QUOTE**, matching Tab 8 exactly. The earlier
homepage had Quote in the middle.

---

## Still to supply before launch

| Item | Where | Notes |
|---|---|---|
| **All photography** | homepage hero, service and project cards | Unsplash placeholders. Tab 9: real technicians, DB boards, solar, inverters, gate motors, fencing, plumbing, branded vehicles. Update the alt text to describe the real photo. |
| **Photos of Wayne / early WHT** | About page | Shown as clearly-marked dashed placeholders — deliberately *not* stock photos of a stranger presented as the founder. |
| **Genuine Google reviews** | homepage Reviews | Tab 5: real reviews only, wording unchanged. Then add `aggregateRating` to the business schema in `layout.mjs`. |
| **Three real projects** | homepage Recent Work | Tab 10 template: location, problem, work completed, linked service. |
| **Business hours** | Contact page + schema | Tab 12 lists these as unconfirmed, so no hours are shown. A comment marks the spot. |
| **Social profile URLs** | footer | `REPLACE` placeholders. Delete the icons if WHT has none. |
| **Geo coordinates** | business schema | Improves map and local results. |
| **OG share image** | `/assets/og-image.jpg` | 1200×630. |
| **Privacy Policy & Terms pages** | footer links | Not in the 10-page build; the links are placeholders and currently 404. |

---

## Putting it into WordPress + Elementor

**1. Load the shared assets once, sitewide.** Upload `assets/wht.css` and `assets/wht.js`,
then enqueue them via **Elementor → Custom Code** or **WPCode**, along with the Google Fonts
`<link>`s from any page's `<head>`. Every page depends on these two files.

**2. Header and footer → Elementor Theme Builder templates.** Take the `<header>` block, and
the `<footer>` + drawer + search + mobile bar blocks, from any page in `dist-wp/` (they're
identical everywhere) into one Header template and one Footer template, each in an HTML
widget. Include the icon `<svg>` sprite once, in the header. Wrap each template's markup in
`<div class="wht-site">…</div>` — every style is scoped to that class.

> The nav highlights the current page with `aria-current`. In one shared Elementor header
> that is static, so either use Elementor's Nav Menu widget (which adds current-page classes
> itself) or add a small snippet that sets the attribute from the URL.

**3. Each page → one full-width HTML widget.** Page Layout: **Elementor Full Width**. Paste
the content between `<main id="wht-main">` and `</main>` from that page in `dist-wp/`,
wrapped in `<div class="wht-site">`. Use `dist-wp/`, not the local files — its links already
use the real permalinks.

**4. SEO + schema.** Put each page's title and description into **Yoast** or **Rank Math**.
Paste its `<script type="application/ld+json">` blocks into **WPCode**, scoped to that page.
If Yoast or Rank Math also emits Organization/LocalBusiness schema, keep only one of the two.

> FAQPage schema: Google now shows FAQ rich results only for a small set of authoritative
> sites, so don't expect FAQ dropdowns in Google results. The markup still helps answer
> engines and AI search, which Tab 1 explicitly targets.

**5. Contact form.** Replace the placeholder with **Elementor Form / WPForms / CF7** using the
same Tab 8 fields, including the optional photo upload. Fire `quote_submit` and
`generate_lead` from the plugin's success event.

**Cleaner long-term route:** rebuild each section with native Elementor widgets and Global
Colors/Fonts, using these pages as the spec, so WHT can edit copy without touching HTML.
Tab 11's reusable components map one-to-one onto the builders in `layout.mjs`.

---

## Tracking (Tab 11)

Links carry `data-wht-event`, and `assets/wht.js` pushes each one to `dataLayer` on click —
a harmless no-op until Google Tag Manager is installed. Emitted: `click_call`,
`click_whatsapp`, `click_email`, `quote_start`, and `quote_submit` from the placeholder form.
`generate_lead` must come from the real form plugin.

Still to install: GA4, GTM, Search Console, Bing Webmaster Tools.

---

## Design mechanics worth knowing

**Homepage bolt.** Four layers: photo → blue panel clipped to the bolt → SVG stroke tracing
its edge in yellow → copy. To reshape it, edit **both** of these in `assets/wht.css`:

```css
.wht-hero { --wht-bolt: polygon(0 0, 80% 0, 56% 48%, 72% 48%, 40% 100%, 0 100%); }
.wht-hero__edge path { d: path("M 80 0 L 56 48 L 72 48 L 40 100"); }
```

The yellow edge is a real SVG stroke rather than an offset copy of the panel. An offset
only shows an outline on edges facing the direction it moves, and the bolt's diagonals
and its horizontal jut face opposite ways. Below 860px the bolt gives way to a flat panel.

**CSS traps already handled — don't "fix" these back:**
1. Element defaults are wrapped in `:where()` (zero specificity), so `.wht-site a` can't
   override button text colours.
2. `.wht-site svg { fill: currentColor }` is required — SVG's default fill is black.
3. `aspect-ratio` goes on card `<img>`s, not their wrappers. On the wrapper plus
   `height:100%` it's circular, and browsers fall back to each photo's own ratio, which
   makes cards uneven heights.
4. Hero inners use `padding-top`/`-bottom`, never the `padding` shorthand, which would zero
   the container's side padding.

**Before launch:** convert real photos to WebP/AVIF with responsive `srcset` — the main
remaining performance item. FAQs use native `<details>`, and the whole site runs on one
small shared script.
