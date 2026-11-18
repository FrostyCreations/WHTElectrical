# WHT Electrical — putting the site live on xneelo

Everything in this folder was generated from one source project. Nothing here is
hand-maintained, so if the copy changes, the package is rebuilt rather than patched.

**Reference build:** <https://wht-electrical.vercel.app/> — this is the approved site,
exactly as it should end up looking. Keep it open in a tab while you work; it is the
spec. It is `noindex`, so it will not compete with the real site in search.

---

## What's in the box

```
assets/                          upload this whole folder to the server
  wht.css                        the one stylesheet, every rule scoped to .wht-site
  wht.js                         drawer, search, FAQ accordions, hero video, tracking
  photos/                        10 real WHT job photographs, web-sized
  img/                           the vector logo (SVG + PNG fallback)
  video/wht-hero.webm, .mp4      homepage hero video, 637 KB / 907 KB

elementor/
  00-sitewide-head.html          fonts + stylesheet, goes in <head> sitewide
  00-sitewide-footer-code.html   the script tag, goes before </body> sitewide
  00-body-class-snippet.php      adds the .wht-site body class — nothing styles without it
  01-header-template.html        icon sprite + header, for the Theme Builder
  02-footer-template.html        footer + search + drawer + mobile bar
  pages/                         12 files, one per page, <main> content only
  seo/page-meta.csv              title, description, slug, parent for every page
  seo/schema/                    paste-ready JSON-LD, one file per page

source/                          the generator. Rebuilds every page from one place.
```

### Read this before you start

This is a **static HTML site built to drop into WordPress**. It is not a theme and not
an Elementor kit. The styling is one stylesheet scoped to `.wht-site`, so it will not
fight the active theme and the theme will not fight it.

The import route below was tested end to end in WordPress Playground: all 12 pages at the
correct permalinks, assets loading, Elementor Canvas applied, no `wpautop` damage, drawer
and FAQs working. The traps called out below are ones that actually bit during that test,
not theoretical ones.

---

## Before you start

You will need:

- **konsoleH / xneelo Control Panel** login (client number + management password)
- **FTP or SFTP** credentials — konsoleH → *Manage Services* → *FTP Users*
- **WordPress Administrator** login (not Editor — see step 6)
- **Elementor Pro** if you want Theme Builder for the header and footer. Free Elementor
  cannot build a custom header/footer; without Pro you put those in the theme's own
  header/footer hooks via WPCode instead.

**Take a backup first.** konsoleH can do it, or use UpdraftPlus. If anything on the domain
is currently live, build on a staging subdomain and cut over at the end.

---

## Step 1 — PHP settings on xneelo

konsoleH → *Hosting Services* → select the domain → *Manage Services* → **PHP Config**.

| Directive | Set to | Why |
|---|---|---|
| PHP version | 8.1 or newer | Elementor's minimum is 7.4; 8.1+ is what it's tested on |
| `memory_limit` | 256M | Elementor editor is heavy; 128M causes blank-screen saves |
| `max_execution_time` | 120 | Importing and saving long pages |
| `upload_max_filesize` | 64M | See the note on the video below |
| `post_max_size` | 64M | Must be ≥ `upload_max_filesize` |
| `max_input_vars` | 3000 | Elementor saves pages as many small fields; the 1000 default silently truncates long pages |

`max_input_vars` is the one that causes the worst bug: the page saves, reports success, and
quietly loses the end of it. Set it before you build anything.

---

## Step 2 — Upload the assets

Put the **`assets/` folder** in the web root so it ends up at `public_html/assets/`.

Use **FTP/SFTP** (FileZilla) or konsoleH → *Services* → *File Manager*, which opens
directly in `public_html`.

Then check these three load in a browser before going further:

```
https://yourdomain.co.za/assets/wht.css
https://yourdomain.co.za/assets/wht.js
https://yourdomain.co.za/assets/photos/hero-solar-roof.jpg
```

**Do not put these in the WordPress Media Library.** The paths in the markup are absolute
(`/assets/...`). Media Library uploads land in `/wp-content/uploads/YYYY/MM/` with
different filenames, and you would have to rewrite every reference.

**The hero video** is 6.5 MB. FTP it with everything else rather than uploading through
WordPress — that avoids `upload_max_filesize` entirely.

It is only fetched at **861px and wider**. That is not an arbitrary number: at 860px and
below the stylesheet drops the bolt shape and lays the blue panel flat across the whole
hero, so nothing of the video would show. Narrower devices get the poster photograph and
never download the file. The gate lives in `wht.js` and the breakpoint in `wht.css` — if
one moves, move the other.

If the site lives in a subdirectory, put `assets/` at the web root anyway and the absolute
paths keep working. If that is not possible, change the three `/assets/` paths in
`00-sitewide-head.html` and `00-sitewide-footer-code.html`, and find-and-replace `/assets/`
across `elementor/pages/*.html` and the two template files.

---

## Step 3 — WordPress permalinks

*Settings → Permalinks* → **Post name**.

The URLs in `seo/page-meta.csv` assume it. Three pages are children of Electrical and get
nested URLs automatically once their parent exists — which is why step 7 builds them in
order.

---

## Step 4 — Plugins

- **Elementor** (+ **Elementor Pro** for Theme Builder)
- **WPCode** — for the PHP snippet and the per-page schema
- **Yoast SEO** or **Rank Math** — titles and descriptions

Elementor → *Settings* → *Features*: leave defaults. Elementor → *Settings* → *Advanced*:
set **CSS Print Method** to *External File*.

---

## Step 5 — Sitewide CSS, JS and the body class

**5a. The body class.** Add `00-body-class-snippet.php` as a WPCode **PHP snippet**, set to
run everywhere. Every rule in `wht.css` is scoped to `.wht-site`, and the colour, spacing
and font variables are declared on it. Without this class the site renders completely
unstyled.

> Do not instead wrap the header, content and footer in three separate `.wht-site` divs.
> On mobile that applies the sticky-bar bottom padding three times and leaves a gap under
> every page.

**5b. The stylesheet and fonts.** Elementor → *Custom Code* → new snippet, Location
**`<head>`**, Include **Entire Site**. Paste `00-sitewide-head.html`.

**5c. The script.** Same again, Location **`</body>` — End**. Paste
`00-sitewide-footer-code.html`.

Without `wht.js` the site still renders, but the mobile menu, the search overlay, the FAQ
accordions, the sticky header shadow, the hero video and the click tracking all stop.

---

## Step 6 — ⚠️ The SVG trap, before you paste anything

The site uses an inline SVG icon sprite: **37 icons, 87 `<svg>` elements per page**. Every
icon, the logo, the arrows and the bolt edge come from it.

**WordPress strips all of them unless the user pasting has the `unfiltered_html`
capability.** The paste appears to work. You save. The icons are simply gone, and nothing
warns you.

- Paste as a **full Administrator on a single-site install** — that role has it.
- On **WordPress Multisite**, even Administrators do not. Only Super Admin does.
- Some security plugins (Wordfence, iThemes) remove it from everyone. Check first.

After pasting the header template, view the page source and search for `<symbol`. If it is
missing, this is why. Do not work around it by re-adding icons one at a time — fix the
capability and paste again.

---

## Step 7 — Header and footer templates

*Templates → Theme Builder → Header → Add New.* One **HTML widget**, full width, no
padding. Paste `01-header-template.html`. Display Conditions: **Entire Site**.

Same for the Footer with `02-footer-template.html`.

The footer file contains four things the script expects to find together: the footer, the
search overlay, the mobile drawer and the sticky mobile contact bar. Keep them in that
order and do not split them across templates.

---

## Step 8 — The 12 pages

Build them **in the order in `seo/page-meta.csv`** — parents before children, or the nested
URLs cannot be set.

For each page:

1. *Pages → Add New*. Title from the **WordPress page** column.
2. Set the **slug** and, where the CSV gives one, the **Parent** under *Page Attributes*.
3. *Page Attributes → Template* → **Elementor Canvas**. This is what removes the theme's
   own header and footer, which the Theme Builder templates replace.
4. Edit with Elementor. One **HTML widget**, full width, no padding.
5. Paste the whole matching file from `elementor/pages/`, `<main>` wrapper included.
6. Publish.

Then *Settings → Reading* → Front page displays **A static page** → **Home**.

### The current-page highlight

The header and the mobile drawer mark the current page with `aria-current="page"` (and
`is-section` on the Services parent). A single shared Elementor template cannot carry a
per-page marker, so in WordPress every page would look like no page is current.

Two ways to fix it, either is fine:

- Rebuild the nav with Elementor's **Nav Menu** widget, which adds its own current-page
  classes, and restyle to match; or
- add a small WPCode JS snippet that reads `location.pathname` and sets `aria-current` on
  the matching links.

This is the one piece of the static build that does not survive the move as-is. The package
flags it rather than hiding it.

---

## Step 9 — SEO and structured data

**Titles and descriptions:** `seo/page-meta.csv`, into Yoast or Rank Math per page. They
are plain text, already decoded — paste as-is.

**Structured data:** `seo/schema/` has one paste-ready file per page, 38 blocks in total —
LocalBusiness sitewide, plus BreadcrumbList, Service and FAQPage where they apply. Add each
as a WPCode **HTML snippet**, Site Wide Header, with Smart Conditional Logic limiting it to
that page.

> If Yoast or Rank Math is also emitting Organization or LocalBusiness schema, **turn one of
> the two off**. Two competing copies means neither is trusted.

The FAQ schema is generated from the same data as the visible FAQs, so the two cannot
disagree. Note that Google now shows FAQ rich results only for a small set of authoritative
sites — the markup still earns its place with AI search and answer engines, which is what it
is there for.

---

## Step 10 — The contact form

The Contact page ships a **placeholder form that does not send anything**. It validates and
shows a message saying so.

Replace it with Elementor Form, WPForms or CF7, keeping the same fields including the
optional photo upload. Point it at WHT's real address. Fire `quote_submit` and
`generate_lead` from the plugin's success event so the tracking keeps working.

Do not launch with the placeholder — enquiries will be silently lost.

---

## Step 11 — Before you call it done

- [ ] Every page loads at its URL from `page-meta.csv`
- [ ] Page source contains `<symbol` — icons survived (step 6)
- [ ] `body` has class `wht-site`
- [ ] Header, footer, mobile drawer, search overlay all work
- [ ] FAQ accordions open
- [ ] Hero video plays on desktop; phones show the photo
- [ ] Current-page highlight works (step 8)
- [ ] Contact form sends a real email
- [ ] Every internal link resolves — no 404s
- [ ] Mobile at 375px: no sideways scroll, sticky bar sits correctly
- [ ] `robots.txt` and Search Console no longer blocking (the review build was `noindex`)
- [ ] SSL on, `http://` redirects to `https://`, one canonical host (www or not, not both)

---

## Phase 2 — making the copy editable

**Be clear about what step 8 gives you: pixel-accurate pages that Wayne cannot edit.** HTML
inside an HTML widget is not editable in the Elementor UI. Copy changes mean editing HTML or
coming back to the source project.

Since the brief is that WHT edit their own copy, the sections below should be rebuilt with
native Elementor widgets. The site is built from a small set of repeating components, so this
is mechanical rather than creative work:

| In the build | Elementor equivalent | Worth converting? |
|---|---|---|
| `sectionHead()` — eyebrow, H2, lead | Heading + Text Editor in a Container | **Yes** — on every section |
| `bullets()` — checklist | Icon List | **Yes** |
| `slist()` — service list with icons | Icon Box in a grid Container | **Yes** |
| `steps()` — numbered process | Icon Box, numbered | **Yes** |
| `faqSection()` — `<details>` accordions | Accordion / Toggle | **Yes** |
| `related()` / service cards | Image Box in a Container | **Yes** |
| `pageHero()` — inner page hero | Container + Heading + Buttons | **Yes** |
| `ctaBand()` | Container + Heading + Buttons | **Yes** |
| Homepage bolt hero | — | **No.** `clip-path` + an SVG stroke edge + video layer. No widget does this. Leave as HTML. |
| Icon sprite | — | **No.** Infrastructure, not copy. |
| Mobile drawer, search, sticky bar | — | **No.** Driven by `wht.js`. |
| JSON-LD | — | **No.** WPCode. |

Set Elementor's **Global Colors and Fonts** from the variables at the top of `assets/wht.css`
first, then build. That way a brand change is one edit, not forty.

Practical order: convert the four Service Pillar pages first — they share one template, so the
pattern you work out there applies to the rest. Keep the Home page as HTML longest; it is the
most custom and the least likely to need copy edits.

---

## Rebuilding the package

If the copy or photographs change, do not patch this folder. In the source project:

```bash
node build/build.mjs --wp
node build/package-handoff.mjs
```

The build refuses to finish if any page has a broken internal link, a dead anchor, a missing
`alt`, a missing asset file, more than one `<h1>`, a skipped heading level, a duplicate id, an
unknown icon, or a mismatch between the visible FAQs and the FAQ schema.

---

## Still outstanding before launch

These are content decisions, not developer work. They need Wayne.

| Item | Where |
|---|---|
| **Privacy Policy and Terms are drafts** — red banner on both, `[CONFIRM]` markers inside. Need Wayne and ideally a lawyer. | `/privacy-policy/`, `/terms/` |
| **Recent Work write-ups** are placeholder text. The three photographs are real WHT jobs; the problem/work-completed copy is not. | Home |
| **Photo of Wayne** and an early WHT photo — two marked placeholder slots. | About |
| **Genuine Google reviews**, quoted exactly. Then add `aggregateRating` to the business schema. | Home |
| **Business hours** — unconfirmed, so none are shown. | Contact + schema |
| **Social profile URLs** — `REPLACE` placeholders. Delete the icons if WHT has none. | Footer |
| **Geo coordinates** for the business schema | `source/build/layout.mjs` |
| **OG share image**, 1200×630 | `/assets/og-image.jpg` |
| **GA4, GTM, Search Console, Bing Webmaster Tools** | Not installed |

The build deliberately states no registrations, guarantees, response times, warranties or
qualifications, because the Build Pack says none of those are confirmed. Do not add them
without Wayne confirming each one.
