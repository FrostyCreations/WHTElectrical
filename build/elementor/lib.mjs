/* Tiny builder for Elementor page templates (container layout, free widgets only).
   Each template module calls kit(theme) and describes the page with box()/heading()/text()/…
   build.mjs turns that into the JSON format Elementor's Templates → Import accepts. */

let seq = 0;
let prefix = 'a';
export function resetIds(p) { seq = 0; prefix = p; }
function id() {
    // Deterministic 7-char ids, so rebuilding does not churn every file.
    seq++;
    let h = 2166136261;
    for (const ch of prefix + ':' + seq) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
}

export const px = (size, unit = 'px') => ({ unit, size, sizes: [] });
export function dims(t, r = t, b = t, l = r, unit = 'px') {
    return { unit, top: String(t), right: String(r), bottom: String(b), left: String(l), isLinked: t === r && r === b && b === l };
}

function typo(o = {}, prefixKey = 'typography') {
    if (!o || !Object.keys(o).length) return {};
    const s = { [`${prefixKey}_typography`]: 'custom' };
    if (o.family) s[`${prefixKey}_font_family`] = o.family;
    if (o.size != null) s[`${prefixKey}_font_size`] = px(o.size);
    // Tablets get a size between desktop and phone unless one is given.
    const sizeT = o.sizeT ?? (o.size != null && o.sizeM != null && o.size > o.sizeM ? Math.round((o.size + o.sizeM) / 2) : null);
    if (sizeT != null) s[`${prefixKey}_font_size_tablet`] = px(sizeT);
    if (o.sizeM != null) s[`${prefixKey}_font_size_mobile`] = px(o.sizeM);
    if (o.weight) s[`${prefixKey}_font_weight`] = String(o.weight);
    if (o.lh != null) s[`${prefixKey}_line_height`] = px(o.lh, 'em');
    if (o.ls != null) s[`${prefixKey}_letter_spacing`] = px(o.ls);
    if (o.transform) s[`${prefixKey}_text_transform`] = o.transform;
    if (o.style) s[`${prefixKey}_font_style`] = o.style;
    if (o.decoration) s[`${prefixKey}_text_decoration`] = o.decoration;
    return s;
}

function common(o, s) {
    if (o.cls) s._css_classes = o.cls;
    if (o.anchor) s._element_id = o.anchor;
    if (o.label) s._title = o.label;
    if (o.margin) s._margin = o.margin;
    if (o.maxW) { s._element_width = 'initial'; s._element_custom_width = px(o.maxW); }
    if (o.hideM) s.hide_mobile = 'hidden-mobile';
    return s;
}

function widget(type, settings) {
    return { id: id(), elType: 'widget', isInner: false, settings, elements: [], widgetType: type };
}

/* Container. Rows stack to a column on phones unless keepRowM is set. */
export function box(o = {}, children = []) {
    const s = { container_type: o.grid ? 'grid' : 'flex' };
    s.content_width = o.boxed ? 'boxed' : 'full';
    if (o.boxed) s.boxed_width = px(o.boxed === true ? 1160 : o.boxed);
    if (o.w) s.width = px(o.w, '%');
    if (o.wT) s.width_tablet = px(o.wT, '%');
    if (o.wM) s.width_mobile = px(o.wM, '%');
    // A readable measure on desktop that still fills the screen on tablets and phones.
    if (o.maxW) { s.width = px(o.maxW); s.width_tablet = px(100, '%'); s.width_mobile = px(100, '%'); }
    if (o.grid) {
        s.grid_columns_grid = px(o.grid, 'fr');
        s.grid_columns_grid_tablet = px(o.gridT ?? Math.min(o.grid, 2), 'fr');
        s.grid_columns_grid_mobile = px(o.gridM ?? 1, 'fr');
        // Rows size to content; Elementor's default is 2 equal rows, which leaves an empty band.
        for (const bp of ['', '_tablet', '_mobile']) s[`grid_rows_grid${bp}`] = { unit: 'custom', size: 'auto', sizes: [] };
        const g = String(o.gap ?? 20);
        s.grid_gaps = { column: g, row: g, isLinked: true, unit: 'px' };
        s.grid_auto_flow = 'row';
    } else {
        s.flex_direction = o.row ? 'row' : 'column';
        if (o.row && !o.keepRowM) s.flex_direction_mobile = 'column';
        if (o.row && o.dirT) s.flex_direction_tablet = o.dirT;
        if (o.wrap) s.flex_wrap = 'wrap';
        if (o.justify) s.flex_justify_content = o.justify;
        if (o.align) s.flex_align_items = o.align;
        if (o.alignT) s.flex_align_items_tablet = o.alignT;
        if (o.alignM) s.flex_align_items_mobile = o.alignM;
        const g = String(o.gap ?? 20);
        s.flex_gap = { column: g, row: g, isLinked: true, unit: 'px', size: Number(g) };
    }
    if (o.minH) s.min_height = px(o.minH);
    if (o.bg) { s.background_background = 'classic'; s.background_color = o.bg; }
    if (o.bgImg) { s.background_background = 'classic'; s.background_image = { url: o.bgImg, id: '' }; s.background_size = 'cover'; s.background_position = 'center center'; }
    s.padding = o.pad ?? dims(0);
    if (o.padT) s.padding_tablet = o.padT;
    if (o.padM) s.padding_mobile = o.padM;
    if (o.margin) s.margin = o.margin;
    if (o.border) {
        s.border_border = o.border.style || 'solid';
        s.border_width = typeof o.border.w === 'object' ? o.border.w : dims(o.border.w ?? 1);
        s.border_color = o.border.color;
    }
    if (o.radius != null) s.border_radius = typeof o.radius === 'object' ? o.radius : dims(o.radius);
    if (o.shadow) {
        s.box_shadow_box_shadow_type = 'yes';
        s.box_shadow_box_shadow = { horizontal: o.shadow[0], vertical: o.shadow[1], blur: o.shadow[2], spread: o.shadow[3] ?? 0, color: o.shadow[4] };
    }
    if (o.tag) s.html_tag = o.tag;
    if (o.overflow) s.overflow = 'hidden';
    const cls = [o.cls, o.grow && 'wpt-grow', o.auto && 'wpt-auto'].filter(Boolean).join(' ');
    if (cls) s.css_classes = cls;
    if (o.anchor) s._element_id = o.anchor;
    if (o.label) s._title = o.label;
    if (o.hideM) s.hide_mobile = 'hidden-mobile';
    return { id: id(), elType: 'container', isInner: false, settings: s, elements: children.filter(Boolean) };
}

export function heading(title, o = {}) {
    const s = { title, header_size: o.tag || 'h2', title_color: o.color, ...typo(o.t) };
    if (o.align) s.align = o.align;
    if (o.alignM) s.align_mobile = o.alignM;
    if (o.href) s.link = { url: o.href, is_external: '', nofollow: '', custom_attributes: '' };
    return widget('heading', common(o, s));
}

export function text(html, o = {}) {
    const s = { editor: html, text_color: o.color, ...typo(o.t) };
    if (o.align) s.align = o.align;
    return widget('text-editor', common(o, s));
}

export function button(label, href, o = {}) {
    const s = {
        text: label,
        link: { url: href, is_external: o.external ? 'on' : '', nofollow: '', custom_attributes: '' },
        size: 'md',
        button_text_color: o.color,
        background_background: 'classic', background_color: o.bg,
        hover_color: o.hoverColor ?? o.color,
        button_background_hover_background: 'classic', button_background_hover_color: o.hoverBg ?? o.bg,
        text_padding: o.pad ?? dims(14, 22),
        border_radius: dims(o.radius ?? 0),
        ...typo(o.t),
    };
    if (o.border) { s.border_border = 'solid'; s.border_width = dims(o.border.w); s.border_color = o.border.color; }
    if (o.align) s.align = o.align;
    return widget('button', common(o, s));
}

/* Inline list of links — used for menus (Nav Menu is an Elementor Pro widget). */
export function links(items, o = {}) {
    const s = {
        view: o.inline === false ? 'traditional' : 'inline',
        icon_list: items.map(([label, href]) => ({ text: label, selected_icon: { value: '', library: '' }, link: { url: href, is_external: '', nofollow: '' }, _id: id() })),
        text_color: o.color, text_color_hover: o.hover ?? o.color,
        space_between: px(o.gap ?? 22),
        ...typo(o.t, 'icon_typography'),
    };
    return widget('icon-list', common(o, s));
}

/* Bulleted list with a small text marker instead of an icon font. */
export function list(items, o = {}) {
    const s = {
        view: 'traditional',
        icon_list: items.map(label => ({ text: label, selected_icon: { value: o.icon || 'fas fa-minus', library: 'fa-solid' }, _id: id() })),
        icon_color: o.iconColor ?? o.color, text_color: o.color,
        icon_size: px(o.iconSize ?? 10), space_between: px(o.gap ?? 8),
        ...typo(o.t, 'icon_typography'),
    };
    return widget('icon-list', common(o, s));
}

/* FAQ: Elementor's free Nested Accordion. Renders native <details>/<summary>, so it works
   without JavaScript and with the keyboard, and Elementor prints the FAQ schema itself.
   Each answer is a child container holding a Text Editor, editable like any other text. */
export function accordion(items, o = {}) {
    const children = items.map(it => ({
        id: id(), elType: 'container', isInner: true,
        settings: { _title: it.q, content_width: 'full', container_type: 'flex', flex_direction: 'column', padding: dims(0) },
        elements: [widget('text-editor', { editor: `<p>${it.a}</p>`, text_color: o.soft ?? o.color, ...typo(o.body) })],
    }));
    const s = {
        items: items.map(it => ({ item_title: it.q, _id: id(), element_css_id: '' })),
        title_tag: 'h3',
        faq_schema: 'yes',
        default_state: 'all_collapsed',
        max_items_expended: 'multiple',
        accordion_item_title_icon: { value: '', library: '' },
        accordion_item_title_icon_active: { value: '', library: '' },
        normal_title_color: o.color, hover_title_color: o.accent ?? o.color, active_title_color: o.color,
        ...typo(o.title, 'title_typography'),
    };
    return { id: id(), elType: 'widget', isInner: false, settings: common(o, s), elements: children, widgetType: 'nested-accordion' };
}

export const divider = (o = {}) => widget('divider', common(o, { style: o.style || 'solid', weight: px(o.weight ?? 1), color: o.color, width: px(100, '%'), gap: px(o.gap ?? 2) }));
export const spacer = (h, o = {}) => widget('spacer', common(o, { space: px(h), ...(o.hM != null ? { space_mobile: px(o.hM) } : {}) }));
export const html = (code, o = {}) => widget('html', common(o, { html: code }));
export const shortcode = (code = '', o = {}) => widget('shortcode', common(o, { shortcode: code }));
export const map = (address, o = {}) => widget('google_maps', common(o, { address, zoom: px(o.zoom ?? 15), height: px(o.h ?? 320) }));
export const image = (url, alt, o = {}) => widget('image', common(o, { image: { url, id: '', alt }, image_size: 'full' }));

/* Large windows: Elementor's sizes are fixed pixels, so above 1600px the page is scaled up in small
   steps (the zoom rules below) at the same rate the HTML sites grow. Without this the layout stays
   1200px wide and looks small on big monitors.

   Everything a template needs that native controls can't express: fonts + scoped CSS.
   Lives in one HTML widget at the top so it survives import without Elementor Pro. */
export function styleBlock(theme) {
    const f = theme.form || {};
    const base = `
    .wpt-style{display:none!important}
    @media (min-width:1600px){html{zoom:1.065}}
    @media (min-width:1760px){html{zoom:1.13}}
    @media (min-width:1920px){html{zoom:1.195}}
    @media (min-width:2080px){html{zoom:1.26}}
    @media (min-width:2240px){html{zoom:1.325}}
    @media (min-width:2400px){html{zoom:1.39}}
    @media (min-width:2560px){html{zoom:1.455}}
    .e-con.wpt-grow{--width:auto;--flex-grow:1;--flex-shrink:1;min-width:0}
    .e-con.wpt-auto{--width:auto;--flex-grow:0;--flex-shrink:0}
    .elementor-heading-title{overflow-wrap:break-word}
    .elementor-widget-text-editor p{margin:0 0 .7em}.elementor-widget-text-editor p:last-child{margin-bottom:0}
    .elementor-widget-text-editor a{color:inherit;text-decoration:underline;text-underline-offset:3px}
    .elementor-widget-heading .elementor-heading-title a{color:inherit}
    .elementor-button:focus-visible,.elementor a:focus-visible{outline:3px solid ${f.accent || 'currentColor'};outline-offset:3px}
    .wpt-form:empty,.wpt-form .elementor-shortcode:empty{display:none}
    .wpt-form input:not([type=submit]):not([type=checkbox]):not([type=radio]),.wpt-form select,.wpt-form textarea{width:100%;font:inherit;font-family:${f.font || 'inherit'};padding:12px 14px;border:${f.border || '2px solid currentColor'};border-radius:${f.radius ?? 0}px;background:${f.field || '#fff'};color:${f.ink || 'inherit'}}
    .wpt-form label{display:grid;gap:6px;margin:0 0 16px;font-family:${f.font || 'inherit'};font-weight:600}
    .wpt-form .wpcf7-form-control-wrap,.wpt-form .wpforms-field{display:block}
    .wpt-form .wpcf7-form>p{margin:0}
    .wpt-form .wpcf7-response-output{margin:12px 0 0!important;padding:10px 12px!important;border-radius:${f.radius ?? 0}px}
    .wpt-form button,.wpt-form input[type=submit]{font-family:${f.font || 'inherit'};font-weight:700;padding:14px 22px;border:0;border-radius:${f.radius ?? 0}px;background:${f.accent || '#111'};color:${f.accentInk || '#fff'};cursor:pointer}
    `;
    const css = (base + theme.css).trim().replace(/\n\s*/g, '\n');
    const code = `<!-- ${theme.name}: template fonts and styles. Keep this widget. -->\n` +
        `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n` +
        `<link rel="stylesheet" href="${theme.fonts}">\n<style>\n${css}\n</style>` + (theme.js ? `\n<script>\n${theme.js.trim()}\n</script>` : '') +
        (theme.head ? `\n${theme.head}` : '');
    return box({ label: 'Template styles (keep)', cls: 'wpt-style', pad: dims(0) }, [html(code, { label: 'Fonts + CSS' })]);
}

/* Form slot: empty Shortcode widget + styling hooks for WPForms, Contact Form 7 and Elementor Pro Form. */
export function formSlot(o = {}) {
    return box({ label: 'Form slot — paste your form shortcode', cls: `wpt-form ${o.cls || ''}`.trim(), pad: dims(0) }, [
        shortcode('', { label: 'Form shortcode (WPForms / Contact Form 7)' }),
    ]);
}
