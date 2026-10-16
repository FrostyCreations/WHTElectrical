# WHT Electrical — where things stand

Read this first in a new session. It replaces having to re-derive anything.
Last updated: 16 October 2026.

---

## Live right now

**https://whtelectrical.co.za** — WordPress, Hello Elementor theme, free
Elementor 4.3.5. **No Elementor Pro** (see "Elementor Pro" below).

- **Behind a maintenance-mode plugin.** Logged-out visitors (and `curl`) get
  "WHT Electrical is under maintenance". Everything below is only visible when
  logged in. Turning it off is the client's launch decision — do not touch it.
- **11 pages published** as native Elementor pages at their Tab 2 permalinks
  (`ROUTES` in `build/layout.mjs`): Home, Electrical, Fault Finding & Repairs,
  Electrical COCs, Gate Motors & Electric Fencing, Solar & Backup Power,
  Plumbing, Property Maintenance, About, Privacy Policy, Terms.
- **Contact is imported as a DRAFT.** Its form is a placeholder that does not
  send. Do not publish it until a real form works (outstanding item 1).
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
17. No Python on this machine. Multi-line shell edits with mixed quotes break
   in the Bash tool — use the Edit/Write tools.

---

## Elementor Pro

Not needed for anything built so far. Theme Builder is replaced by the plugin;
every page uses free widgets. The only Pro feature that would help is **Form
Builder** for the Contact form, which the **Essential plan ($60/yr, 1 site)**
covers. An existing licence "needs reissuing" — check it before buying.
Contact Form 7 (free) is the no-cost alternative. If Theme Builder is ever used,
disable the plugin's header/footer output or every page gets two of each.

---

## Outstanding, roughly in priority order

1. **Contact form.** Either Elementor Pro Form (Essential plan) or Contact Form 7.
   Fields per Tab 8: Name*, Mobile Number*, Email, Area / Suburb*, What Do You
   Need Help With?* (Electrical, Fault Finding, Electrical COC, Gate Motor,
   Electric Fencing, Solar & Backup Power, Plumbing, Property Maintenance,
   Other), Tell Us What's Happening*, Upload a Photo (optional). Email to
   info@whtelectrical.co.za. Fire `quote_submit` + `generate_lead` on success.
   `lib.mjs formSlot()` already styles CF7/WPForms output. Then publish Contact.
2. **Head-level SEO.** The move to WordPress lost it: no meta description, no
   og:title/og:image, no LocalBusiness or BreadcrumbList schema, and titles are
   just the page name. FAQPage schema survives (Nested Accordion emits it).
   Plan: generate it into `wht-chrome.php` keyed by slug from `pages.mjs`
   (`title`, `description`, `crumbs`, `service`, `faqs` are all there), so it
   cannot drift from the copy — not retyped into Yoast.
3. **Redirects for the 35 dead URLs.** Map written and verified against the old
   sitemap: `build/testserver/htaccess-production.txt`.
4. **Launch (client's call):** turn off maintenance mode.
5. **Hero video is 6.5 MB** — the homepage LCP. No ffmpeg on this machine.
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
