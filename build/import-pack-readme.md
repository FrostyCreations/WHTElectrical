# WHT Electrical — homepage go-live

Four files. Import in this order. The whole thing is about 20 minutes.

**Assets are already on the server** — CSS, JS, the 10 photographs and the
hero video were deployed to `public_html/assets/` and all return 200 over
HTTPS. Nothing to upload. The templates reference them from there.

---

## 0. Back up first

konsoleH, or UpdraftPlus. This replaces the live homepage.

---

## 1. Switch the theme to Hello Elementor

Appearance → Themes → Add New → **Hello Elementor** → Install → Activate.

Everything here was built and tested against it. The current *Electrician*
theme carries its own CSS that will fight the WHT stylesheet, and that
combination has not been tested.

---

## 2. Sitewide CSS, JS and the body class

**Elementor → Custom Code**, Location `<head>`, Include *Entire Site*:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/wht.css">
<link rel="stylesheet" href="/assets/wht-elementor.css">
<meta name="theme-color" content="#1E2F4D">
```

`wht-elementor.css` must load **after** `wht.css`. It re-aims three things
at the DOM Elementor actually renders — buttons, grids and heading
colours — and without it the headings come out Elementor blue and every
card grid collapses.

Same again, Location `</body> — End`:

```html
<script src="/assets/wht.js" defer></script>
```

**WPCode → PHP snippet**, run everywhere:

```php
add_filter( 'body_class', function ( $classes ) {
    $classes[] = 'wht-site';
    return $classes;
} );
```

Every rule in `wht.css` is scoped to `.wht-site`. Without this class the
site renders completely unstyled.

---

---

## ⚠️ No Elementor Pro? Use the plugin instead

Elementor's Theme Builder needs Pro. Without it, `wht-header.json` and
`wht-footer.json` are rejected with "Invalid template type", and the page
publishes with no navigation, logo, footer or mobile contact bar.

**wht-chrome.zip** does the same job without Pro:

1. **Plugins → Add New → Upload Plugin** → `wht-chrome.zip` → Install → Activate
2. That is it. It replaces section 2 (sitewide code and body class) AND the
   two Theme Builder templates — skip both.

It enqueues the stylesheets and script, adds the `.wht-site` body class, and
prints the header and footer on `wp_body_open` and `wp_footer`. Those hooks
fire on the Elementor Canvas page template, which skips the theme's own
header and footer, so the WHT chrome appears with nothing competing with it.

Verified in WordPress 7.1.1 with **free Elementor 4.2.4 and no Pro**: header,
footer, drawer, search overlay and mobile bar all present, 37 icons all
resolving, nav correctly marking the current page, no broken images.

**When Pro arrives**, you can either leave this plugin alone — it works fine —
or move the header and footer into Theme Builder and deactivate it. Do not do
both or you will get two of each.

---

## 3. ⚠️ Import as a full Administrator

The header template carries an inline SVG sprite of 37 icons. **WordPress
strips every `<svg>` unless the importing user has `unfiltered_html`**, and
it fails silently — the paste looks fine and the icons are simply gone.

- Single-site Administrator: has it.
- **Multisite: Administrators do NOT.** Only Super Admin.
- Wordfence and iThemes can remove it from everyone. Check first.

After importing the header, view source and search for `<symbol`. If it is
missing, this is why. Fix the capability and import again rather than
patching icons by hand.

---

## 4. Import the templates

**Templates → Saved Templates → Import Templates**, in this order:

| File | Lands in |
|---|---|
| `wht-header.json` | Theme Builder → Header |
| `wht-footer.json` | Theme Builder → Footer |
| `wht-home-launch.json` | Saved Templates |

Set both Theme Builder templates to **Display Conditions: Entire Site**.

> The header and footer are the one part NOT verified end to end. Theme
> Builder template types need Elementor Pro, which cannot be installed in
> WordPress Playground, so they could not be tested the way everything
> else was. Import them **before** switching the front page, and check the
> navigation and footer actually appear.

---

## 5. Build the page

1. Pages → Add New, title **Home**
2. Page Attributes → Template → **Elementor Canvas**
3. Edit with Elementor → folder icon → My Templates → **Insert** `WHT — Home (launch)`
4. Publish
5. Settings → Reading → Front page displays **A static page** → **Home**

---

## 6. Check before you walk away

- [ ] Page source contains `<symbol` — icons survived
- [ ] `body` has class `wht-site`
- [ ] Hero shows the bolt, the yellow edge and the video playing
- [ ] Headings are navy, not light blue (that means `wht-elementor.css` is not loading)
- [ ] Service and problem cards sit in grids, not a single column
- [ ] FAQ accordions open
- [ ] Header nav, footer, mobile drawer and sticky contact bar all work
- [ ] 375px wide: no sideways scroll

---

## Why `wht-home-launch.json` and not `wht-home.json`

The full template still contains scaffolding from the static build:
three review cards reading *"Placeholder — paste a genuine Google review
here, word for word"* attributed to *"Reviewer name"* under five stars,
and three projects labelled *"Example project"*.

The launch file omits the Recent Work and Reviews sections entirely —
0 placeholder strings, verified in the rendered page. Both sections come
back with one flag once Wayne supplies the real job details and the real
Google reviews.

---

## Known, to tidy after

- About 239px of cumulative layout drift against the HTML build, worst
  being the approach section at -103px. Cosmetic.
- Below 1200px the bolt is still in its old, wider position, so smaller
  windows show *less* of the video rather than more.
- The Contact page template exists but its form is a marked placeholder
  that does not send. Do not publish Contact until Elementor's Form
  widget is wired in, or enquiries are silently lost.
