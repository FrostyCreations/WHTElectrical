# WHT Electrical — website

Ten static pages built from the approved copy in the WHT Website Build Pack.
No frameworks and no dependencies: plain HTML, one stylesheet, one small script.

## Editing

Do not edit the generated `.html` files. Edit the source, then rebuild:

- `build/pages.mjs` — the copy and section order for every page
- `build/layout.mjs` — header, footer, menu, icons, contact details, structured data
- `assets/wht.css` — all styling
- `assets/wht.js` — menu, search, dropdown and tracking events

```bash
npm run build:local   # clickable preview files in the project root
npm run build         # dist-wp/ with the real WordPress addresses
npm run preview       # http://localhost:5173
```

Each build checks every page for broken links, missing icons, heading problems and
FAQ data that does not match the visible FAQs. It fails rather than publish a
broken page.

## Review deployment (Vercel)

`vercel.json` runs the build and serves `dist-wp/`, so the review site uses the same
addresses the WordPress site will use, such as `/electrical/coc/`.

The review site is set to `noindex` and its `robots.txt` disallows crawling, because
it shares copy, titles and canonical tags with the live whtelectrical.co.za.

## Moving to WordPress

See `WORDPRESS-ELEMENTOR-SETUP.md` for the page map, the Elementor steps and the
list of content still needed before launch.
