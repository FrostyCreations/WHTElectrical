/* Minimal static server for previewing the build over real http://, so relative
   and root-relative asset/link paths resolve exactly as they will when hosted.
   node build/serve.mjs [dir] [port]     e.g.  node build/serve.mjs dist-wp 5174
   No dependencies. Directory requests serve index.html (WordPress-style permalinks). */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, resolve, extname, normalize, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir = resolve(root, process.argv[2] || '.');
const port = Number(process.argv[3] || process.env.PORT || 5173);
const TYPES = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
    '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
};

createServer(async (req, res) => {
    try {
        const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
        let file = normalize(join(dir, path));
        if (file !== dir && !file.startsWith(dir + sep)) { res.writeHead(403).end('403'); return; }
        let info = await stat(file).catch(() => null);
        if (info && info.isDirectory()) { file = join(file, 'index.html'); info = await stat(file).catch(() => null); }
        if (!info) { res.writeHead(404, { 'content-type': 'text/plain' }).end(`404 ${path}`); return; }
        res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
        res.end(await readFile(file));
    } catch (err) {
        res.writeHead(500, { 'content-type': 'text/plain' }).end(String(err));
    }
}).listen(port, () => console.log(`Serving ${dir} at http://localhost:${port}`));
