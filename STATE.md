# WHT Electrical — where things stand

Read this first in a new session. It replaces having to re-derive anything.
Last updated: 21 October 2026 (page-speed work built and tested on branch
`claude/friendly-ptolemy-428nh3`, NOT merged or deployed yet — see the next section).

---

## NEXT: page-speed work waiting to be merged (21 Oct 2026)

Done in a cloud session that could not reach the live site (its network
blocked whtelectrical.co.za) and had no wp-admin login. Everything is on
branch `claude/friendly-ptolemy-428nh3`. Nothing is live until it is
merged to `main`, which triggers the deploy.

**Starting point (PageSpeed, per the client brief):** mobile 67 / desktop 88
performance, SEO 85. Mobile LCP 5.4 s (the hero video's JPEG poster), 6.6 MB
video, jQuery + Google Fonts + 136 KB CSS render-blocking, Pro scripts on
every page, no meta description, robots.txt timing out.

**What changed**
- Media (`build/optimise-media.sh`, needs ffmpeg): WebP + 480px WebP of every
  photo; hero WebP 1280px (122 KB, was 254 KB JPEG; under 45 KB smeared the
  solar panels) and 800px for phones (24 KB). Video re-encoded two-pass 720p,
  no audio: `wht-hero.webm` 637 KB, `wht-hero.mp4` 907 KB (was 6.6 MB). The
  original is the encoding master in `build/media-src/`.
- Hero: the photo is now an `<img class="wht-hero__poster">` (LCP,
  fetchpriority high, srcset, preloaded). The video sits on top with no
  poster, transparent until it plays. `wht.js` loads it only at ≥1024px, not on
  Save-Data or reduced motion, after load + 3 s or first scroll/mouse/click.
  Shared markup: `heroMedia()` / `heroPreload()` in `layout.mjs`.
- Fonts: Inter + Exo 2 self-hosted (`assets/fonts/`, variable Latin woff2,
  OFL), preloaded, @font-face inline. The brief named Libre Franklin; the site
  never used it — if PageSpeed showed it, it came from Elementor's kit fonts,
  which the plugin now stops printing.
- Deployed CSS minified by `build.mjs` (string-safe; verified identical to
  source apart from whitespace).
- **Plugin 1.1.0** — new code is hand-written in `build/elementor/plugin-perf.php`;
  `plugin.mjs` appends it and fills in the data from layout/pages:
  - meta description on all 12 pages from `pages.mjs` (approved Tab 5 copy,
    not the brief's wording); skipped if an SEO plugin is active;
  - hero preload + font preloads + @font-face at the top of `<head>`;
  - `wht.css`, `wht-elementor.css`, Hello's reset and Elementor `widget-*`
    CSS inlined **in place** (same cascade order); Hello theme/header-footer
    CSS dropped on Canvas pages; Elementor CSS print method forced to Internal;
  - jQuery moved to the footer, jQuery Migrate dropped;
  - Elementor Pro's frontend scripts (incl. 285 KB elements-handlers) dropped
    on pages with no Pro widget — i.e. everywhere but Contact. The brief's
    "duplicate frontend.min.js 4.3.2 vs 4.3.5" is Pro's file vs core's, not a
    duplicate;
  - `the_content` filter: swaps the OLD live homepage hero (video + JPEG
    poster) for the new markup, so **Home needs no re-import**, and points
    media-library photo copies (`/wp-content/uploads/2026/10/plumbing-tanks-2.jpg`,
    `-768x513` etc.) at `/assets/photos/*.webp` with srcset; lazy on Home.
  - Every one of these has an off switch:
    `add_filter('wht_perf_<name>', '__return_false');` — names in the file header.
- Deploy workflow: backs up live css/js/plugin/.htaccess/robots as a 30-day
  artifact; **stops if a live file was edited on the server since the last
  deploy** (rebuilds the previous commit and compares —
  `build/server/check-drift.mjs`; re-run manually with "Overwrite files changed
  on the server" after checking); uploads fonts and `build/server/robots.txt`;
  merges `build/server/htaccess-performance.txt` into the live `.htaccess`
  between `# BEGIN/END WHT Performance` markers, never touching WordPress's
  block, and restores the old file if the site answers 500.

**How it was tested (cloud, no live access)**
- 25-check PHP harness running the generated plugin against WordPress 7.1's
  real `WP_HTML_Tag_Processor` with stubs: hero swap, WebP swap incl. `-2` and
  `-768x512` names, head output per page, CSS inlining incl. traversal/foreign
  host refusal, jQuery footer, Pro scripts kept on Contact. All pass.
- `.htaccess` block served by a real Apache 2.4 with WordPress's rewrite rules:
  1-year immutable cache on static files only, gzip, routing intact, no error
  with mod_headers/expires/deflate disabled.
- Lighthouse on the STATIC build served by that Apache (not WordPress, so
  Elementor's own CSS/JS were absent): mobile 99 perf / 100 SEO, desktop 100.
  LCP = hero img; no video in the payload; desktop video starts after ~3 s.
- Drift check simulated against commit 5d92d2f: passes when untouched, stops
  on a hand-edited file.

**To do in the next (local) session, in this order**
1. The user suspects some live files are not 100% what git has (tuning done
   for Elementor). Before merging, with the logged-in browser: compare live
   `/assets/wht.css`, `/assets/wht-elementor.css`, `/assets/wht.js` with
   `git show 5d92d2f:assets/<file>`; check Elementor → Site Settings → Custom
   CSS and Elementor → Custom Code for anything that should be in the repo.
   (The deploy's drift check is the backstop, not the plan.)
2. Merge the branch to `main`; watch the Actions run (backup artifact, drift
   check, uploads, .htaccess diff, verify).
3. wp-admin → Elementor → Tools → **Clear Files & Data** (element cache and
   per-page CSS), and purge any host/page cache.
4. Check live, logged in, 1440px and 375px: hero photo then video (desktop),
   fonts, service-card photos are `/assets/photos/*.webp`, FAQ accordion opens,
   **Contact form submits** (Pro scripts must still be there), nav dropdown
   and drawer, no console errors (jQuery-in-footer is the one to watch).
5. Run PageSpeed once maintenance mode is off (logged-out visitors and
   PageSpeed see the maintenance page while it is on).
6. If anything misbehaves, switch that one optimisation off with its
   `wht_perf_*` filter rather than reverting everything.

Not done, by choice: Elementor's `frontend.min.css` and its scripts stay as
Elementor loads them (deferring them gains nothing measurable from the footer
and risks inline-script breakage); no async-CSS "critical" split — the whole
WHT CSS is small enough to inline, which avoids the layout-shift risk.

---

## Live right now

**https://whtelectrical.co.za** — WordPress, Hello Elementor theme, Elementor
4.3.5 + **Elementor Pro 4.3.2** (Essential licence, connected 16 Oct 2026).

- **Behind a maintenance-mode plugin.** Logged-out visitors (and `curl`) get
  "WHT Electrical is under maintenance". Everything below is only visible when
  logged in. Turning it off is the client's launch decision — do not touch it.
- **All 12 pages published** as native Elementor pages at their Tab 2
  permalinks (`ROUTES` in `build/layout.mjs`): Home, Electrical, Fault Finding
  & Repairs, Electrical COCs, Gate Motors & Electric Fencing, Solar & Backup
  Power, Plumbing, Property Maintenance, About, Contact, Privacy Policy, Terms.
- **Contact has a real Elementor Pro form**, published 16 Oct. Verified live:
  Tab 8 fields, labels and options; 50/50 rows on desktop, stacked on phones;
  styles match the static form; required fields enforced; honeypot hidden.
  **Delivery tested 16 Oct:** one marked test enquiry, sent with the recipient
  temporarily set to the user's Gmail on the live page only, arrived in the
  inbox (not spam); success message shown and `quote_start` → `quote_submit`
  → `generate_lead` fired. The recipient was then restored to
  info@whtelectrical.co.za by re-importing the template.
- **Verified on the live site (logged in), 15–16 Oct:** every sampled text
  style on all ten inner pages matches the static build exactly (size, weight,
  colour, family, line height); page heights within 1–3%; all icons resolve;
  no broken images; no horizontal scroll at 375px; grids collapse to one column.
- **Homepage:** the user reviewed it on 16 Oct and called it fine. It is an
  OLDER import than the current template — no Recent Work section, steps
  numbered 1–5 instead of 01–05. Tools → WHT Pages → Re-import would fix both
  but overwrites any Elementor edits to Home. Only do it if the user asks.
- The 35 old indexed URLs (`/services/`, 10 blog posts …) still 404 — item 3.
- Assets serve from `/assets/` — `wht.css`, `wht-elementor.css`, `wht.js`,
  10 photos, hero video, og-image, logo.

## How it fits together

```
build/pages.mjs + layout.mjs        source of truth for ALL copy (Tab 5 approved)
   |
   +-- build/build.mjs               -> 12 static HTML pages (local + dist-wp/)
   +-- build/elementor/*.mjs         -> Elementor template JSON (dist-elementor/)
   |      sections.mjs               shared section builders (see below)
   |      check-copy.mjs             copy parity vs dist-wp; fails the build
   +-- build/elementor/plugin.mjs    -> wht-chrome plugin + all 12 templates
            |                            (dist-plugin/wht-chrome/)
            +-- .github/workflows/deploy.yml -> SFTP to xneelo on push to main
```

**Page modules** in `build/elementor/`: `home`, `electrical`, `fault`, `coc`,
`gate`, `solar`, `plumbing`, `maintenance`, `about`, `contact`, and `legal.mjs`
(exports `privacy` and `terms`). Crumbs and FAQs are read from `pages.mjs`
via `pageData(key)`. The two legal texts are lifted verbatim from the static
build's HTML into one Text Editor each — the client approved them word for word.

**`sections.mjs` builders:** `pageHero`, `section` (with `grid`/`top` for the
two-column layout), `col`, `sectionHead`, `splitList`, `bullets`, `points`,
`slist`, `steps`, `processSection`, `related`, `relatedSection`, `callout`,
`proofSection`, `faqSection`, `ctaBand`, `photo`, `photoFigure`, `paras`/`prose`,
buttons (`quoteBtn`, `waBtn`, `callBtn`, `ghostBtn`, `ondarkBtn`, `btnRow`,
`btnBlock`), `arrowLink`, `iconTile`, `formSlot`, `contactDetails`.
Rule: anything with words is a native widget; only decorative markup (icons,
hero backdrop) goes in an HTML widget.

**wht-chrome plugin** (generated — never edit `wht-chrome.php` by hand):
- enqueues fonts, `wht.css`, `wht-elementor.css` (must load after), `wht.js`;
- adds the `.wht-site` body class (every WHT rule is scoped to it);
- prints header + footer on `wp_body_open` / `wp_footer` (pages use the
  Elementor Canvas template, which fires both but skips the theme's own);
- moves the nav's `aria-current` and the Services `is-section` mark to the page
  being served (the markup is lifted from the static homepage);
- **Tools → WHT Pages**: a row per page; "Import all new pages" (never touches
  Home or any page that exists); a Re-import button per page (replaces content,
  asks for confirmation). Imports run through Elementor's own importer, warn if
  the user lacks `unfiltered_html`, and report surviving SVG counts.

### Commands

```bash
node build/build.mjs                  # local preview pages
node build/build.mjs --wp --prod      # dist-wp/ (needed by the copy check)
node build/elementor/build.mjs        # templates + sims + copy-parity check
node build/elementor/plugin.mjs       # the WordPress plugin
```

### Deploying

Push to `main`. Changes under `assets/**`, `build/**` or the workflow trigger
the SFTP deploy: assets to `public_html/assets/`, the plugin and every template
JSON to `public_html/wp-content/plugins/wht-chrome/`. The CI build runs the copy
check, so a copy mismatch stops the deploy. Takes ~40–50s.

`gh` is not authenticated on this machine. To confirm a deploy landed, poll the
live file instead, e.g.
`curl -s https://whtelectrical.co.za/assets/wht-elementor.css | grep "<new text>"`
or `.../wp-content/plugins/wht-chrome/wht-terms.json` (200 once uploaded).

Secrets: `XNEELO_FTP_SERVER`, `XNEELO_FTP_USERNAME`, `XNEELO_FTP_PASSWORD`.
SFTP on port 22 — the server rejects FTPS on 21.

After a deploy that changes **templates**, the pages do not change until they
are re-imported from Tools → WHT Pages. CSS and plugin changes apply at once.

### Checking the live site

The user's Browser pane is **logged in to the live wp-admin** — use it. Load
pages in same-origin iframes at 1440px and 375px and read computed styles.
The method that caught every real bug: collect text runs from the static page
(served locally from `dist-wp/`), match the live runs by text, compare
font-size / weight / colour / family / line-height, and compare section heights.
The DOM simulation (`_elementor-sim-*.html`) does NOT model Elementor's own CSS
and misled once by 208px — use it for markup only.

### Playground (local WordPress test bed)

`.claude/launch.json` → `wht-playground` (WP 7.1.1, Elementor 4.2.4, no Pro).
If port 9402 is busy it moves to the next port. Then:
- `/?wht_import=1` imports all 12 templates via `build/playground/wht-import.php`
  (sandbox only: imports as user 1 with KSES off);
- `/__static/<path>/` serves `dist-wp/` on the same origin for comparisons;
- `curl` needs a cookie jar — the first request is a 302 auto-login redirect.

The user prefers work to be checked on the live site rather than in Playground.

---

## Gotchas already paid for — do not rediscover these

1. **`unfiltered_html`.** The header carries a 37-icon inline SVG sprite.
   WordPress strips every `<svg>` from users without it, silently.
2. **Elementor's `.e-con` forces `display:flex`** on every container, flattening
   the CSS grids in `wht.css`. Restated in `wht-elementor.css` §6.
3. **Elementor kit heading colour** `#6EC1E4` outranks `wht.css` (§11).
4. **Every widget wrapper is `position:relative`**, so the hero backdrop's
   `inset:0` collapsed (§10).
5. **`wht.css` element defaults are inside `:where()`** at zero specificity on
   purpose. Bridge fixes must match it or they break the hero.
6. **Elementor settings beat CSS classes**, and Elementor's padding/margin
   *settings* are emitted as custom properties that `wht.css` class rules then
   override. Section padding in particular comes from `wht.css`, not from the
   `pad` settings in `sections.mjs`.
7. **Elementor Pro cannot be installed in Playground** — hence the plugin.
8. **The default kit sets Roboto 600 and #7A7A7A** on every heading and text
   widget. Fixed by redeclaring the kit's `--e-global-*` variables on WHT
   containers (§19), not by editing the kit.
9. **Elementor's default 20px container gap and 10px padding** stack on top of
   the static build's margins. Zeroed via its custom properties (§17).
10. **A class on a widget wrapper loses to Elementor's wrapper rules** for
   inherited properties (colour, weight). Put the class on the inner `<p>`
   (`paras()` does: `['wht-emph', 'text']`) or restate it in the bridge.
11. **Elementor doubles classes to win** — e.g.
   `.elementor.elementor .e-con > .elementor-widget { max-width:100% }`.
   Match the specificity rather than guessing (§16).
12. **The accordion zeroes margins between FAQ items** (§18).
13. **Hello Elementor's `reset.css` paints every button `#CC3366`** on hover and
   focus. The WHT icon buttons restate their backgrounds (§20). It also gives
   them 8px 16px padding and a 3px radius — invisible at their fixed sizes.
14. **WordPress ships a draft page at `/privacy-policy/`.** The importer reuses
   and publishes it.
15. **The hero's slanted bottom edge showed the white page** as a band above
   the trust strip. The strip now tucks up under it by `--wht-hero-slant`
   (3.5vw, 6vw ≤860px) in `wht.css`, so both builds match.
16. Node's `fetch` fails here where curl works — Playground needs
   `NODE_OPTIONS=--network-family-autoselection-attempt-timeout=3000`.
17. **Pro Form switchers are inconsistent:** `required` and `show_labels` take
   `'true'`; `mark_required`, `custom_messages` and most others take `'yes'`.
   A wrong value silently leaves the setting off. Read
   `elementor.widgetsCache.form.controls` in the editor to check.
18. **This Essential licence offers only `email`, `email2`, `redirect` as form
   actions** — no Collect Submissions, webhooks or Mailchimp. The email is the
   only record of a lead.
19. **Elementor writes per-page CSS for widget settings at high specificity**
   (`.elementor-N .elementor-element.elementor-element-ID …`, about (0,6,0)).
   It whitened the upload box; match it when a style refuses to apply.
20. **A plugin deploy leaves a few seconds with no plugin loaded** while SFTP
   replaces `wht-chrome.php`: wp-admin's WHT Pages screen says "not allowed",
   and pages render without the header, footer and CSS. It recovers on its
   own. After launch, push plugin changes at quiet times, and don't push twice
   in a row then act straight away.
21. No Python on this machine. Multi-line shell edits with mixed quotes break
   in the Bash tool — use the Edit/Write tools.

---

## Elementor Pro

Installed and licensed (Essential, subscription A-S03424685, renews
16 Oct 2027, 1 activation). Used for **one thing only: the Contact form**.
Every other page uses free widgets, and the header/footer stay in the
wht-chrome plugin. If Theme Builder is ever used, disable the plugin's
header/footer output or every page gets two of each.

---

## Outstanding, roughly in priority order

1. **Contact form sign-off** (built: `enquiryForm()` in `sections.mjs`).
   - **Sending works** (tested to Gmail, landed in the inbox). Not yet tested:
     delivery to the info@ mailbox itself, the Reply-To (the test left Email
     blank) and the photo link (the browser pane cannot attach files).
     WordPress sends from `noreply@whtelectrical.co.za` via PHP mail; if mail
     ever goes missing, add an SMTP plugin.
   - To test against a different inbox without committing an address: change
     Email To on the live draft in the editor, test, then Re-import Contact.
   - **WHT to approve the drafted messages** (the Build Pack has none):
     success "Thank you. Your enquiry has been sent to WHT."; error "Your
     enquiry could not be sent. Please call WHT on 083 306 1267 or send a
     WhatsApp."; required "Please complete this field."; invalid "Please check
     this entry." They live in `FORM_MESSAGES`.
   - **WHT to confirm the recipient** (Tab 12 lists "preferred email address"
     as unconfirmed). Note WordPress's admin email is francois@bigondigital.co.za,
     which is what Pro defaults to — the form deliberately uses info@.
   - Contact is published (16 Oct); what remains is the WHT sign-off above.
2. **Head-level SEO.** The move to WordPress lost it: no meta description, no
   og:title/og:image, no LocalBusiness or BreadcrumbList schema, and titles are
   just the page name. FAQPage schema survives (Nested Accordion emits it).
   Plan: generate it into `wht-chrome.php` keyed by slug from `pages.mjs`
   (`title`, `description`, `crumbs`, `service`, `faqs` are all there), so it
   cannot drift from the copy — not retyped into Yoast.
3. **Redirects for the 35 dead URLs.** Map written and verified against the old
   sitemap: `build/testserver/htaccess-production.txt`.
4. **Launch (client's call):** turn off maintenance mode.
5. ~~Hero video is 6.5 MB~~ — re-encoded to 637 KB / 907 KB on the page-speed
   branch (see NEXT at the top).
6. **Homepage drift.** Roughly 300px shorter than the static build beyond the
   missing Recent Work section; not measured section by section since the
   spacing fixes. Cosmetic.
7. **Below 1200px the bolt is still in its old wider position**, so small
   windows show less video, not more.
8. Elementor buttons carry no `data-wht-event` attributes (custom attributes
   are Pro), so CTA clicks on Elementor pages are not tracked by `wht.js`.

## Content still needed from WHT

- Genuine Google reviews (section removed until then; add `aggregateRating` at
  the same time)
- Real job details for Recent Work — photos are real, write-ups were removed
- A photo of Wayne and an early WHT photo for About. **Do not substitute stock
  portraits**: both slots sit beside copy about Wayne personally. Real WHT work
  photos fill them for now.
- Facebook and Instagram URLs (icons removed)
- Business hours (Tab 12 lists them unconfirmed)
- Geo coordinates for the business schema

## Standing rules

- No unconfirmed registrations, guarantees, response times, warranties or
  qualifications.
- Reviews must be genuine and quoted word for word.
- Copy comes from `pages.mjs` only; never retype it in a template. The copy
  check enforces this both ways.
- Privacy Policy and Terms were approved as-is by the client on 15 Oct 2026.
  Still not a lawyer's review; the client accepted that.
- `.claude/launch.json` has the user's own uncommitted changes — leave them out
  of commits.
