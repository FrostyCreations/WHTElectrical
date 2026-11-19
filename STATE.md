# WHT Electrical — where things stand

Read this first in a new session. It replaces having to re-derive anything.
Last updated: 18 November 2026 (speed, security and Agentic Browsing work all live and checked; see the 18 Nov sections).

---

## NEXT SESSION (local, user logged in to wp-admin): searchability plan

The user's goal: WHT shows up in search as much as possible. The cloud
session that did the 18 Nov work could not log in; this one can. Work in
small deploys and check the live site after each one, as on 18 Nov
(headless Chromium at 1440 + 390, then Lighthouse 13.6). Never force
Elementor's CSS settings or change stylesheet order (see the 18 Nov
rollback section).

**Found on the live site (18 Nov):** page titles are WordPress defaults
("Home - WHT Electrical", "Electrical - WHT Electrical"), not the approved
Tab 5 titles in `pages.mjs`. The only schema is Yoast's WebSite/WebPage/
BreadcrumbList plus Elementor's FAQPage. There is no LocalBusiness, no
address, phone or service area.

In order (repo work first, then wp-admin, then off-site):

1. **(DONE 18 Nov) Approved SEO titles.** Feed each page's `pages.mjs` `title` to Yoast
   (`wpseo_title` filter in the plugin, keyed by path like the
   descriptions), or set them per page in Yoast while logged in. Biggest
   on-page win.
2. **(DONE 18 Nov) LocalBusiness schema.** `layout.mjs` already builds
   `businessSchema()`, `serviceSchema()` and `breadcrumbSchema()` for the
   static build. Add them to Yoast's graph via `wpseo_schema_graph` (do not
   print a second, competing graph). Use type Electrician (also
   HomeAndConstructionBusiness), with NAP from `SITE`, areaServed, and the
   services. No aggregateRating until there are genuine reviews.
3. **(DONE 18 Nov) 301s for the 35 dead URLs.** The map is in
   `build/testserver/htaccess-production.txt` sections 4-6. Ship it as a
   third marked .htaccess block ("WHT Redirects"); `merge-htaccess.mjs`
   already handles named blocks. Skip its www/https rules if Xneelo already
   does them; check first.
4. **Open Graph:** og:image `/assets/og-image.jpg` for link previews,
   through Yoast's settings or `wpseo_opengraph_image`.
5. **Accessibility 97 -> 100:** the skip link targets `#wht-main`, which
   Elementor pages lack, and there is no `<main>` landmark.
6. **In wp-admin (logged in):**
   - Yoast: author archives off, date archives off, and check that the
     sitemap lists only the 12 pages.
   - A page cache (WP Super Cache, or Cloudflare free). The server takes
     ~3 s to first byte.
   - An SMTP plugin, plus SPF/DKIM, so form leads don't go to spam.
   - Two-factor login, login attempt limits, auto-updates, and an off-site
     backup (UpdraftPlus).
   - Elementor -> Tools -> Clear Files & Data. Page CSS is still stuck
     "inline" from the 18 Nov incident. The print-order fix makes this
     safe; check the layout straight after.
7. **Google Search Console and Bing Webmaster Tools:** verify, submit
   `/sitemap_index.xml`, request indexing of the 12 pages. Bing also feeds
   ChatGPT and Copilot search.
8. **Analytics:** GA4 via Tag Manager. Then the plugin can add
   `data-wht-event` to Elementor CTA links so calls, WhatsApp and quote
   clicks are tracked (`wht.js` already pushes them).

**Off-site, the biggest factors for local search (needs WHT):**
- **Google Business Profile:** claim or verify it; primary category
  Electrician, add Solar energy equipment supplier/installer and Plumber
  if accurate; service areas; hours; real job photos; website link;
  regular posts.
- **Reviews:** a simple ask-every-customer routine with the GBP review
  link. Genuine reviews only (standing rule). Add aggregateRating to the
  schema once they exist.
- **Consistent listings (NAP):** Bing Places, Apple Business Connect, and
  South African directories (Brabys, Snupit, Yellow Pages SA, Hello Peter),
  all with exactly the same name, address and phone as the site.
- **Content, drafted for WHT's approval** (no unconfirmed claims):
  - real Recent Work write-ups (location, problem, fix, linked service);
  - suburb or area pages (Benoni, Boksburg, Kempton Park, Germiston, East
    Rand) only if WHT confirms it works there and there is real,
    non-duplicate content for each;
  - more FAQs drawn from questions customers actually ask.

## 18 Nov 2026 (local session): plan items 1-3 LIVE

- **Titles** (59284ac): `wpseo_title` / `wpseo_opengraph_title` from
  `pages.mjs`; a title typed into Yoast for a page still wins. Verified on
  all 12 live pages.
- **Schema** (59284ac): `schemaNodes()` in `layout.mjs` -> Yoast's graph via
  `wpseo_schema_graph`: Electrician + HomeAndConstructionBusiness
  (`#business`, NAP, logo, contactPoint x2, areaServed, OfferCatalog of the
  7 services), WebSite.publisher -> #business, and a Service node on each
  service page. One graph per page. Switches `seo_title`, `schema`.
- **og-image.jpg** was never uploaded (404 live); build + deploy now ship
  it. 200 live.
- **Redirects** (7e8e823): `build/server/htaccess-redirects.txt`, third
  merged block "WHT Redirects". All 16 rules return 301 to the mapped page;
  /, pages, wp-login, sitemap, robots unaffected. www/https were already
  handled by the server, so not repeated.
- Layout checked in the browser after deploy 1; no console errors.

**wp-admin, same day (logged in):**
- Installed already: Wordfence, UpdraftPlus, WP-Optimize, Yoast 28.7,
  Burst Statistics, Creame WhatsApp, Internal Links, Maintenance (active
  but not blocking visitors).
- Yoast: author and date archives disabled (redirect home); categories,
  tags and Elementor Floating Elements hidden from search. The sitemap index
  is now post + page only. Posts left indexable for future Recent Work.
- **Page cache ON** (WP-Optimize, 24 h lifespan, minify/merge NOT enabled,
  so the stylesheet order is unchanged). First byte 2.1 s -> 0.2 s. Cached
  copies checked: titles, schema, Contact form, Elementor CSS before wht.css.
  **After a plugin/CSS deploy, purge it** (WP-Optimize -> Cache -> Purge,
  or the admin-bar menu), or visitors see the old HTML for up to 24 h.
- **UpdraftPlus:** Google Drive authenticated, but nothing had been
  scheduled since the 22 Oct backup. Re-saved: database weekly, files
  monthly, keep 2. Next run 19 Nov 00:09. Cached pages don't run WP-cron,
  so ask Xneelo (konsoleH cron) to call /wp-cron.php hourly if runs slip.
- **Left for the user (security settings):** Wordfence 2FA is OFF (enable
  it under Login Security and scan the QR code on a phone); brute force is
  at defaults (20 failures, 4 h lockout): suggest 5 failures and "lock out
  invalid usernames"; WordPress/plugin auto-updates; SMTP (needs the
  mailbox password).
- "Hello World" post and "Sample Page" moved to the trash (user OK'd);
  cache purged. Sitemap index = page-sitemap only, listing exactly the 12
  pages. /hello-world/ still 301s home via WHT Redirects.
- **Google Search Console:** URL-prefix property https://whtelectrical.co.za/
  verified by HTML tag (code in Yoast -> Site connections; don't remove it).
  The property already had history: an old /sitemap.xml (2023, 35 pages),
  which now 301s to the Yoast index. Submitted sitemap_index.xml.
  Indexing requested (confirmed): Home, Electrical, Fault Finding, COC
  (was not on Google), Solar, Plumbing, About. Daily quota then ran out:
  **request Gate Motors, Property Maintenance and Contact on 19 Nov.**
- **Bing Webmaster Tools:** imported from Search Console (read-only GSC
  access granted by the user). Bing already had click data for the site.
  Both sitemaps imported (processing). All 12 pages submitted via URL
  Submission ("12 URLs submitted successfully").
- Search Console and Bing sit under the Big On Digital Google account; add
  a WHT-owned account as Owner once WHT has one.
- **GA4 LIVE** (257155b): new Analytics account "WHT Electrical" (linked
  to the Big On Digital org; optional data sharing all off), property
  whtelectrical.co.za (a416867923 / p565079897, SA time, ZAR), web stream
  "WHT Electrical website". Google issued a Google tag container
  **GTM-KVJ93FWQ** (gtm.js snippet, no G- config line); `SITE.ga4` in
  layout.mjs, printed by plugin-perf.php for visitors only (not logged-in
  editors). Switch: ga4.
- **Events:** wht.js now uses one delegated listener; links without
  data-wht-event are named by href (tel: -> click_call, wa.me ->
  click_whatsapp, mailto: -> click_email, /contact/ buttons -> quote_start),
  so Elementor buttons are tracked. Contact form: quote_start,
  quote_submit, generate_lead. Verified by hand-loading the tag on a
  logged-in page: page_view, click_whatsapp, quote_start, click_call all
  reached /g/collect.
- **On 19 Nov:** in GA4 Admin -> Events -> Recent events, star
  generate_lead, click_call and click_whatsapp as key events (they only
  appear once GA has processed them, up to 24 h).
- **Form email (SMTP), not finished:** mail is at Xneelo
  (MX mail.whtelectrical.co.za; SPF includes spf.host-h.net, ?all; DKIM
  selector `xneelo`; NO DMARC: suggest `_dmarc` TXT
  `v=DMARC1; p=none; rua=mailto:info@whtelectrical.co.za`). FluentSMTP
  installed and configured: From WHT Electrical <info@...>, host
  mail.whtelectrical.co.za:587 TLS (cert valid), user info@..., Force From
  on. The user entered the password; the test gave "SMTP Error: Could not
  authenticate." **FluentSMTP is now DEACTIVATED** (settings kept), because
  a failing connection stops ALL site mail, leads included; the form is
  back on PHP mail. Next: check/reset the info@ password in konsoleH,
  reactivate, re-enter it, send a test, and only leave it active if the
  test succeeds.
- **og:image + main landmark LIVE** (abe79f9, 19 Nov): Yoast now prints
  og:image /assets/og-image.jpg (1200x630, summary_large_image) on every
  page without its own image (`wpseo_add_opengraph_images`, switch
  og_image). Page content is wrapped in `<main id="wht-main">` via
  the_content priority 99 (switch main), so the header skip link works
  and there is a main landmark (plan item 5, a11y 97 -> expect 100).
  Checked live at 1440 and 390: containers centred (123 px each side at
  1440), hero copy z-index 3, Elementor CSS before wht.css, no horizontal
  scroll, skip link lands on #wht-main, all requests 200.
- WP-Optimize showed a setup wizard offering to turn on minify/"lighter
  files": exited WITHOUT saving. Don't accept it: it can reorder CSS.
  Purge reliably via the admin-bar "Purge cache for all pages" link.

## 18 Nov 2026: security and Agentic Browsing, LIVE

- **Security stage 1** (FrostyCreations/WHTElectrical#8): .htaccess WHT
  Security block. Live: all six headers sent; xmlrpc.php, readme files,
  wp-config.php, dotfiles and folder listings 403; pages, wp-login and
  wp-admin unaffected.
- **Agentic Browsing** (FrostyCreations/WHTElectrical#9): `llms.txt` and
  `/.well-known/ard.json` generated by `build/agent-files.mjs` from the
  approved copy and uploaded as real files. Both audits had failed only
  because WordPress took ~3 s to answer the missing URLs (Lighthouse 13.6.0
  source: `core/audits/agentic/`). The dotfile rule exempts `.well-known`.
  The ARD entry scores 0.9: `text/markdown` is not one of ARD's
  agent-specific media types, and using one would misdescribe the file.
- **Security stage 2** (FrostyCreations/WHTElectrical#10): plugin 1.2.0
  with `plugin-security.php`. Live: no generator tags, no Yoast version
  comment, no ?ver=<version>, no REST/RSD links, 0 HTML comments, every
  new-tab link has noopener, REST users list and ?author=1 give 404.
- Layout, fonts, WebP, Contact form scripts and FAQ accordion re-checked in
  the browser after each stage; no JS errors.

Lighthouse 13.6.0 from the cloud session after all of it: mobile perf 93,
accessibility 97, best practices 100, SEO 100, Agentic Browsing 98 (all four
agentic audits pass); desktop 88 / 99 / 100 / 100 / 98 (desktop perf here is
noisy: PageSpeed itself showed 94 earlier).

Still open: accessibility 97 on mobile ("skip links are not focusable", "no
main landmark": the skip link points at #wht-main, which Elementor pages do
not have); the wp-admin items under "Needs wp-admin"; a page-cache plugin
for the ~3 s server response.

## 18 Nov 2026 (later): speed work re-applied in two stages, LIVE

Checked on the live site after each stage (headless Chromium at 1440 and
390, plus Lighthouse from the cloud session):

- **Stage 1** (FrostyCreations/WHTElectrical#5): .htaccess WHT Performance
  block (1-year cache, gzip), deploy backup + drift check, video 907 KB MP4 +
  637 KB WebM with the delayed loader, WebP and font files, minified CSS,
  robots.txt -> Yoast `sitemap_index.xml`. Plugin unchanged.
- **Stage 2** (FrostyCreations/WHTElectrical#6): plugin 1.1.0 with
  `build/elementor/plugin-perf.php` MINUS forced Elementor CSS print method,
  stylesheet inlining and Hello style dequeue. Self-hosted fonts, hero WebP
  `<img>` + preload (old live hero upgraded on the fly), WebP photos,
  Yoast description fallback, jQuery in the footer, Pro scripts only on Contact.
- Verified: layout centred, Elementor CSS before wht.css, Exo 2/Inter loaded,
  no Google Fonts, 5/5 homepage photos WebP, jQuery not in <head>, Pro scripts
  + `elementorProFrontend` on Contact only, FAQ accordion opens, a meta
  description on every page, no JS errors, no 4xx.

| Lighthouse (live home) | before | after stage 2 |
| --- | --- | --- |
| Mobile perf | 63 | 94 |
| Desktop perf | 67 | 92 |
| SEO | 85-92 | 100 |
| Mobile LCP | 6.2 s | 1.5 s |
| Bytes | 1.4 MB | 418 KB |

What still holds the scores back: the server's response time (about 2.5 s to
first byte from the cloud session; a page-cache plugin would help most) and
Elementor's/Hello's render-blocking CSS, deliberately left alone. The security
work (htaccess-security.txt, plugin-security.php in commit f451b5f) is NOT
live; re-apply it the same way, one stage at a time.

## 18 Nov 2026: speed + security deploy, broken layout, rollback

**Where things stood at the time:** the live site went back to the 16 Oct
state plus one fix (below); the speed work was then re-applied (section above). It is all in git
history: merge `5ca3464` (FrostyCreations/WHTElectrical#1), reverted by
FrostyCreations/WHTElectrical#2. Bring it back in small pieces, checking the
live page after each; do not re-merge it in one go.

**What happened:** #1 deployed cleanly (every step green), but the site came
out "all left aligned" with the hero copy invisible. Reverting the files
(#2, plus a one-off workflow that restored the backed-up .htaccess,
robots.txt, CSS, JS and plugin) did NOT fix it.

**Cause, read from the live page:** Elementor's `frontend.min.css` was
printing AFTER `wht.css`. Its `.e-con` rule sets margin-inline, position and
z-index at the same specificity as `.wht-container` / `.wht-hero__inner`, so
the later file wins: containers got 0 side margins, and the hero copy lost
`z-index: 3` and fell behind the blue panel. The order most likely changed
because #1's plugin forced Elementor's CSS print method to Internal, which
Elementor remembers per page until its CSS is regenerated, so reverting files
did not undo it.

**Fix (live, FrostyCreations/WHTElectrical#3):** `wht` depends on
`elementor-frontend`, added on `wp_print_styles`, so WordPress always prints
Elementor's CSS first. Verified on the live site at 1440px and 390px: Home and
Electrical centred, hero copy visible, no JS errors.

**Lessons for re-applying the speed work:**
- Never force `elementor_css_print_method`; leave Elementor's CSS settings alone.
- Any change to stylesheet order or inlining must keep Elementor's
  frontend.min.css BEFORE wht.css / wht-elementor.css.
- This session can now load whtelectrical.co.za (environment allowlist), so
  check the live page (headless Chromium, 1440 + 390) after every deploy.

**Open questions for WHT/user:** on live the hero brandline is white (static
build: yellow) and the phone hero buttons are not full width. Unknown whether
that predates 18 Nov.

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
