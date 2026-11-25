/* WHT Electrical email-signature GIF: 1200 x 320 (2x), shown at 600 x 160,
   ~330 KB, 9 s loop. Insert it in the signature with width="600".
   Setup once, in this folder: npm i @napi-rs/canvas@0.1.65 gifenc@1.0.3
   Run: node make.mjs ../../assets/img/wht-email-signature.gif [--scale 1|2] [--frames dir]
   Copy only from the approved site copy (SITE in build/layout.mjs). */
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import gifenc from 'gifenc';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const { GIFEncoder, quantize, applyPalette } = gifenc;

const SITE_DIR = 'C:/Users/Francois Theron/Documents/WHT Website/assets';
const args = process.argv.slice(2);
const out = args[0] || 'wht-signature.gif';
const S = Number((args.find((a, i) => args[i - 1] === '--scale')) || 2);
const framesDir = args.find((a, i) => args[i - 1] === '--frames');

const exo = GlobalFonts.registerFromPath(`${SITE_DIR}/fonts/exo-2-latin-wght.woff2`, 'Exo2');
const inter = GlobalFonts.registerFromPath(`${SITE_DIR}/fonts/inter-latin-wght.woff2`, 'InterW');
const HEAD = exo ? 'Exo2' : 'Segoe UI';
const BODY = inter ? 'InterW' : 'Segoe UI';

/* Layout units are the display size (600 x 160); the GIF is drawn at
   S times that, so it stays sharp on high-resolution screens when the
   signature shows it at width="600". FPS 10 = exact 100 ms GIF delays. */
const W = 600, H = 160, FPS = 10;
const C = { navy: '#16233B', yellow: '#FFC72C', lit: '#FFF3C4', white: '#FFFFFF', label: '#D3DAE6' };

const svg = readFileSync(`${SITE_DIR}/img/wht-logo.svg`, 'utf8');
/* Rasterise the logo at the final pixel size, not at its natural size. */
const LOGO_W = 196, LOGO_H = LOGO_W * 102.47 / 439.313;
const logoWhite = await loadImage(Buffer.from(svg
    .replace(/currentColor/g, C.white)
    .replace('<svg ', `<svg width="${Math.round(LOGO_W * S)}" height="${Math.round(LOGO_H * S)}" `)));

const canvas = createCanvas(W * S, H * S);
const ctx = canvas.getContext('2d');
ctx.scale(S, S);

const clamp = (v) => Math.max(0, Math.min(1, v));
const ease = (t) => 1 - Math.pow(1 - clamp(t), 3);
/* in/out progress of a scene lasting [a, b] seconds, 0.4 s transitions */
const vis = (t, a, b, d = 0.4) => Math.min(ease((t - a) / d), ease((b - t) / d));

/* Three scenes of 3 s; the bolt lights up as each one starts. */
const SCENES = [[0.0, 3.0], [3.0, 6.0], [6.0, 9.0]];
const DUR = 9.0;

/* Light-up: 0.1 s rise, 0.3 s hold, 0.5 s fade. */
function strike(t) {
    let v = 0;
    for (const [a] of SCENES) {
        const d = ((t - a) % DUR + DUR) % DUR;
        if (d < 0.1) v = Math.max(v, d / 0.1);
        else if (d < 0.4) v = Math.max(v, 1);
        else if (d < 0.9) v = Math.max(v, 1 - ease((d - 0.4) / 0.5));
    }
    return v;
}

/* The logo bolt: outer outline of path 13 in wht-logo.svg (SVG units,
   y up). The left notch is a short stub of the logo's own speed tail,
   so the left edge steps like the right one instead of kinking. */
const BOLT = [[114.7, 100], [158.1, 100], [120.3, 70.6], [149.6, 70.6], [52.8, 0], [89.9, 50.4], [70.0, 50.4]];
const BX = 52.8, BW = 158.1 - 52.8;
function boltPath(x, y, w, h) {
    ctx.beginPath();
    BOLT.forEach(([px, py], i) => {
        const X = x + (px - BX) / BW * w, Y = y + (100 - py) / 100 * h;
        i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
    });
    ctx.closePath();
}
const mix = (c1, c2, k) => {
    const p = (c, i) => parseInt(c.slice(1 + i * 2, 3 + i * 2), 16);
    return 'rgb(' + [0, 1, 2].map((i) => Math.round(p(c1, i) + (p(c2, i) - p(c1, i)) * k)).join(',') + ')';
};

/* Bolt box: tip ends 14 px above the bottom bar. */
const BOLT_BOX = { x: 224, y: 14, w: 90, h: 124 };
function bolt(t) {
    const s = strike(t);
    const { x, y, w, h } = BOLT_BOX;
    ctx.save();
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 10;
    if (s > 0) {
        /* Soft glow. It survives the GIF because the palette sample
           always includes the lit-up frames (see below). */
        ctx.shadowColor = `rgba(255,214,90,${0.95 * s})`;
        ctx.shadowBlur = 18 * s;
    }
    boltPath(x, y, w, h);
    ctx.lineWidth = 5;
    ctx.strokeStyle = mix(C.yellow, C.lit, s);
    ctx.stroke();
    ctx.restore();
}

function background(t) {
    ctx.fillStyle = C.navy;
    ctx.fillRect(0, 0, W, H);
    bolt(t);
    ctx.fillStyle = C.yellow;
    ctx.fillRect(0, H - 4, W, 4);
}

function drawLogo() {
    ctx.drawImage(logoWhite, 22, (H - LOGO_H) / 2 - 2, LOGO_W, LOGO_H);
}

function text(str, x, y, { font, size, weight = 700, color = C.white, alpha = 1, dx = 0, italic = false, spacing = 0 }) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.font = `${italic ? 'italic ' : ''}${weight} ${size}px ${font}`;
    if (spacing) ctx.letterSpacing = `${spacing}px`;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(str, x + dx, y);
    ctx.restore();
}

const X = 332;
/* Copy: SITE.tagline, phones, services, domain. */
function scenes(t) {
    let v = vis(t, ...SCENES[0]);
    if (v > 0) {
        text('Problems Found.', X, 70, { font: HEAD, size: 28, weight: 800, alpha: v, dx: (1 - v) * 24, italic: true });
        text('Solutions Delivered.', X, 104, { font: HEAD, size: 28, weight: 800, color: C.yellow, alpha: v, dx: (1 - v) * 40, italic: true });
    }
    v = vis(t, ...SCENES[1]);
    if (v > 0) {
        text('CALL OR WHATSAPP', X, 56, { font: BODY, size: 13, weight: 700, color: C.label, alpha: v, spacing: 1 });
        text('083 306 1267', X, 92, { font: HEAD, size: 34, weight: 800, color: C.yellow, alpha: v, dx: (1 - v) * 30 });
        text('or call 083 952 2925', X, 122, { font: HEAD, size: 20, weight: 700, alpha: v, dx: (1 - v) * 44 });
    }
    v = vis(t, ...SCENES[2]);
    if (v > 0) {
        text('Electrical  ·  Solar  ·  Plumbing', X, 64, { font: BODY, size: 16, weight: 600, alpha: v, dx: (1 - v) * 24 });
        text('& Property Maintenance', X, 88, { font: BODY, size: 16, weight: 600, alpha: v, dx: (1 - v) * 32 });
        text('whtelectrical.co.za', X, 122, { font: HEAD, size: 22, weight: 800, color: C.yellow, alpha: v, dx: (1 - v) * 40 });
    }
}

const N = Math.round(DUR * FPS);
const frames = [];
const lit = [];
for (let i = 0; i < N; i++) {
    /* Start mid-tagline: Outlook for Windows shows only the first frame. */
    const t = (i / FPS + 1.2) % DUR;
    ctx.clearRect(0, 0, W, H);
    background(t);
    drawLogo();
    scenes(t);
    frames.push(ctx.getImageData(0, 0, W * S, H * S).data.slice());
    if (strike(t) > 0) lit.push(i);
    if (framesDir) {
        mkdirSync(framesDir, { recursive: true });
        writeFileSync(`${framesDir}/f${String(i).padStart(3, '0')}.png`, canvas.toBuffer('image/png'));
    }
}

/* One shared palette, so colours don't shimmer. The sample always
   includes the lit-up frames, or their halo colours get dropped. */
const pick = new Set([...frames.keys()].filter((i) => i % 5 === 0).concat(lit));
const sample = [...pick].map((i) => frames[i]);
const big = new Uint8ClampedArray(sample.reduce((n, f) => n + f.length, 0));
let o = 0; for (const f of sample) { big.set(f, o); o += f.length; }
const palette = quantize(big, 95);
/* Last slot is the "unchanged" colour: each frame after the first
   stores only the pixels that differ from the one before it. */
const TRANSPARENT = palette.length;
palette.push([255, 0, 255]);

const gif = GIFEncoder();
const shown = [];          /* palette indices of each distinct frame */
const delays = [];
for (const f of frames) {
    const idx = applyPalette(f, palette.slice(0, TRANSPARENT));
    const last = shown[shown.length - 1];
    if (last && idx.every((v, k) => v === last[k])) { delays[delays.length - 1] += 1000 / FPS; continue; }
    shown.push(idx); delays.push(1000 / FPS);
}
shown.forEach((idx, n) => {
    let data = idx;
    if (n > 0) {
        const prev = shown[n - 1];
        data = new Uint8Array(idx.length);
        for (let k = 0; k < idx.length; k++) data[k] = idx[k] === prev[k] ? TRANSPARENT : idx[k];
    }
    gif.writeFrame(data, W * S, H * S, n === 0
        ? { palette, delay: delays[n], dispose: 1 }
        : { delay: delays[n], dispose: 1, transparent: true, transparentIndex: TRANSPARENT });
});
gif.finish();
writeFileSync(out, gif.bytes());
console.log(`${W * S}x${H * S}  fonts: ${HEAD}/${BODY}  frames: ${N}  size: ${(gif.bytes().length / 1024).toFixed(0)} KB  -> ${out}`);
