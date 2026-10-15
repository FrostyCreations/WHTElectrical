# WHT Electrical — where things stand

Read this first in a new session. It replaces having to re-derive anything.
Last updated: 15 October 2026 (ten inner pages live).

---

## Live right now

**https://whtelectrical.co.za** — WordPress, Hello Elementor theme, free
Elementor (no Pro; the licence key needs reissuing).

- **Behind a maintenance-mode plugin.** Logged-out visitors get "WHT Electrical
  is under maintenance". Everything below is only visible when logged in.
- **11 pages published** as native Elementor pages at their Tab 2 permalinks:
  Home, Electrical, Fault Finding, COCs, Gate Motors, Solar, Plumbing, Property
  Maintenance, About, Privacy Policy, Terms. **Contact is imported as a draft**
  (its form does not send — item 4).
- Verified on the live site, logged in: every text style sampled on all ten
  new pages matches the static build exactly; page heights within 1–3%; all
  icons resolve; no broken images; no horizontal scroll at 375px.
- **The live homepage is an older import.** It lacks the Recent Work section
  and numbers its steps 1–5. Tools → WHT Pages → Re-import fixes both, but
  overwrites any edits made to Home in Elementor — check with WHT first.
- The 35 old indexed URLs (`/services/`, 10 blog posts …) still 404 — item 3.
- Assets serve from `/assets/` — CSS, JS, 10 photos, hero video, og-image.

## How it fits together

```
build/pages.mjs + layout.mjs   source of truth for all copy (Tab 5 approved)
   |
   +-- build/build.mjs          -> 12 static HTML pages (local + dist-wp)
   +-- build/elementor/*.mjs    -> Elementor template JSON (dist-elementor/)
   +-- build/elementor/plugin.mjs -> wht-chrome plugin (dist-plugin/)
            |
            +-- .github/workflows/deploy.yml -> SFTP to xneelo on push
```

**wht-chrome** is a WordPress plugin that does what Elementor Pro's Theme
Builder would: enqueues the CSS/JS, adds the `.wht-site` body class, prints the
header and footer on `wp_body_open` / `wp_footer`, and provides
**Tools → WHT Pages**: one row per page, "Import all new pages" (never touches
Home or an existing page), and a Re-import button per page that replaces its
content. It also moves the nav's current-page mark to the page being served.

### Commands

```bash
node build/build.mjs                  # local preview pages
node build/build.mjs --wp --prod      # dist-wp, crawlable robots + sitemap
node build/elementor/build.mjs        # Elementor JSON + sims + copy-parity check
node build/elementor/plugin.mjs       # the WordPress plugin
```

Pushing to `main` with changes under `assets/**` or `build/**` deploys assets and the plugin
over SFTP. Secrets: `XNEELO_FTP_SERVER`, `XNEELO_FTP_USERNAME`,
`XNEELO_FTP_PASSWORD`. SFTP on port 22 — the server rejects FTPS on 21.

---

## Gotchas already paid for — do not rediscover these

1. **`unfiltered_html`.** The header carries a 37-icon inline SVG sprite.
   WordPress strips every `<svg>` from users without this capability, silently.
   The importer checks and reports the surviving count.
2. **Elementor's `.e-con` forces `display:flex`** on every container, flattening
   every CSS grid in `wht.css`. Restated in `assets/wht-elementor.css`.
3. **Elementor's kit colours headings** `#6EC1E4` via
   `.elementor-widget-heading .elementor-heading-title`, which outranks
   `.wht-hero h1`. Also fixed in the bridge.
4. **Elementor makes every widget wrapper `position:relative`**, so the hero
   backdrop's `inset:0` sized against a 0-height wrapper and vanished.
5. **`wht.css` declares element defaults inside `:where()`** at zero specificity
   on purpose. Fixes must match that specificity or they break the hero.
6. **Elementor settings beat CSS classes.** `box()` now only emits padding and
   gap when asked; defaulting them overrode every card's own padding.
7. **Elementor Pro cannot be installed in WordPress Playground**, so Theme
   Builder templates cannot be tested there. That is why the header and footer
   ship as a plugin.
8. **Elementor's default kit sets Roboto 600 and #7A7A7A** on every heading and
   text widget, outranking wht.css. Fixed by redeclaring the kit's
   `--e-global-*` variables on WHT containers (bridge §19), not in the kit.
9. **Elementor adds a 20px gap and 10px padding** to every container wht.css
   does not style. Zeroed through its custom properties (bridge §17).
10. **A class on a widget wrapper loses to Elementor's wrapper rules** for
   inherited properties (colour, weight). Put the class on the inner `<p>`
   where possible (`paras()` does), or restate it in the bridge.
11. **The DOM simulation does not model Elementor's own CSS** — it placed the
   page hero 208px off. Check against the real page: match text runs by
   content and compare computed styles at 1440px, static vs live.
12. **WordPress ships a draft page at /privacy-policy/.** The importer reuses
   and publishes it.
13. Node's `fetch` fails here where curl works — Playground needs
   `NODE_OPTIONS=--network-family-autoselection-attempt-timeout=3000`.

---

## Outstanding, roughly in priority order

1. **Launch decisions for WHT:** turn off maintenance mode, and whether to
   re-import Home (see above).
2. **Head-level SEO.** The move to WordPress lost it: no meta description, no
   og:title/og:image, no LocalBusiness or BreadcrumbList schema, and the title
   is just "WHT Electrical". FAQPage schema survived because Elementor's Nested
   Accordion emits it. Plan: generate all of it into `wht-chrome.php` keyed by
   slug, so it stays in sync with the Tab 5 copy instead of being retyped into
   Yoast.
3. **Redirects for the 35 dead URLs.** Map already written and verified against
   the old sitemap: `build/testserver/htaccess-production.txt`.
4. **Contact form.** The template's form is a marked placeholder that does not
   send. Without Pro, use Contact Form 7 (free, installs from the directory).
   Do not publish Contact until it works.
5. **Hero video is 6.5 MB** — the page's LCP. No ffmpeg on this machine.
6. **~239px of layout drift** vs the static build, worst the approach section
   at -103px. Cosmetic.
7. **Below 1200px the bolt is still in its old wider position**, so small
   windows show less video, not more.

## Content still needed from WHT

- Genuine Google reviews (section removed until then; add `aggregateRating` at
  the same time)
- Real job details for Recent Work — photos are real, write-ups were removed
- A photo of Wayne and an early WHT photo for About. **Do not substitute stock
  portraits**: both slots sit beside copy about Wayne personally.
- Facebook and Instagram URLs (icons removed; both were `REPLACE`)
- Business hours (Tab 12 lists them unconfirmed)
- Geo coordinates for the business schema

## Standing rules from the Build Pack

- No unconfirmed registrations, guarantees, response times, warranties or
  qualifications.
- Reviews must be genuine and quoted word for word.
- Privacy Policy and Terms were approved as-is by the client on 15 Oct 2026.
  Still not a lawyer's review; the client accepted that.
