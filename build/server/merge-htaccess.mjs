/* =========================================================
   Put the WHT Security and WHT Performance blocks into the live .htaccess.

       node build/server/merge-htaccess.mjs <live> <out>

   <live> is the server's current .htaccess as downloaded by the deploy
   (it may not exist). <out> is written with the blocks from
   htaccess-security.txt and htaccess-performance.txt at the top, in that
   order, and everything else exactly as it was: an older copy of a block
   is replaced, never duplicated, and WordPress's own "# BEGIN WordPress"
   rules are not touched.

   Exit code 0 = <out> differs from <live> and should be uploaded,
   3 = nothing to change, 1 = refused (see the message).
   ========================================================= */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const [livePath, outPath] = process.argv.slice(2);
if (!livePath || !outPath) {
    console.error('usage: node build/server/merge-htaccess.mjs <live> <out>');
    process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
/* A block whose file is not in the repo is skipped: not added, and any
   copy already in the live file is left exactly as it is. */
const BLOCKS = [
    { name: 'WHT Security', file: 'htaccess-security.txt' },
    { name: 'WHT Performance', file: 'htaccess-performance.txt' },
].filter(({ file }) => existsSync(join(here, file)));
const live = existsSync(livePath) ? readFileSync(livePath, 'utf8') : '';
const eol = live.includes('\r\n') ? '\r\n' : '\n';

let rest = live;
const changed = [];
for (const { name } of BLOCKS) {
    const BEGIN = `# BEGIN ${name}`;
    const END = `# END ${name}`;
    const begins = rest.split(BEGIN).length - 1;
    const ends = rest.split(END).length - 1;
    if (begins !== ends || begins > 1) {
        console.error(`Refusing: the live .htaccess has ${begins} "${BEGIN}" and ${ends} "${END}" lines. Fix it by hand first.`);
        process.exit(1);
    }
    changed.push(`${name} block ${begins ? 'replaced' : 'added'}`);
    if (!begins) continue;
    const a = rest.indexOf(BEGIN);
    const b = rest.indexOf(END) + END.length;
    if (b < a) {
        console.error(`Refusing: the ${name} markers in the live .htaccess are out of order.`);
        process.exit(1);
    }
    rest = rest.slice(0, a) + rest.slice(b);
}
rest = rest.replace(/^\s+/, '');

const blocks = BLOCKS.map(({ file }) => readFileSync(join(here, file), 'utf8').trim().replace(/\n/g, eol));
const out = blocks.join(eol + eol) + eol + (rest ? eol + rest : '');

/* Whatever WordPress wrote must come through untouched. */
for (const marker of ['# BEGIN WordPress', '# END WordPress']) {
    if (live.includes(marker) && !out.includes(marker)) {
        console.error(`Refusing: "${marker}" would be lost.`);
        process.exit(1);
    }
}
const wp = (s) => {
    const a = s.indexOf('# BEGIN WordPress');
    return a < 0 ? '' : s.slice(a, s.indexOf('# END WordPress', a));
};
if (wp(live) !== wp(out)) {
    console.error('Refusing: the WordPress rules would change.');
    process.exit(1);
}

writeFileSync(outPath, out);
if (out === live) {
    console.log('.htaccess already has the current WHT blocks; nothing to upload.');
    process.exit(3);
}
console.log(`.htaccess: ${changed.join(', ')}; ${live ? 'all other rules kept' : 'there was no .htaccess before'}.`);
