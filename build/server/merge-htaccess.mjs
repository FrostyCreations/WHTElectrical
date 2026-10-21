/* =========================================================
   Put the WHT Performance block into the live .htaccess.

       node build/server/merge-htaccess.mjs <live> <out>

   <live> is the server's current .htaccess as downloaded by the deploy
   (it may not exist). <out> is written with the block from
   htaccess-performance.txt at the top and everything else exactly as it
   was: an older copy of the block is replaced, never duplicated, and
   WordPress's own "# BEGIN WordPress" rules are not touched.

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

const BEGIN = '# BEGIN WHT Performance';
const END = '# END WHT Performance';
const block = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'htaccess-performance.txt'), 'utf8').trim();
const live = existsSync(livePath) ? readFileSync(livePath, 'utf8') : '';
const eol = live.includes('\r\n') ? '\r\n' : '\n';

const begins = live.split(BEGIN).length - 1;
const ends = live.split(END).length - 1;
if (begins !== ends || begins > 1) {
    console.error(`Refusing: the live .htaccess has ${begins} "${BEGIN}" and ${ends} "${END}" lines. Fix it by hand first.`);
    process.exit(1);
}

let rest = live;
if (begins === 1) {
    const a = live.indexOf(BEGIN);
    const b = live.indexOf(END) + END.length;
    if (b < a) {
        console.error('Refusing: the WHT Performance markers in the live .htaccess are out of order.');
        process.exit(1);
    }
    rest = live.slice(0, a) + live.slice(b);
}
rest = rest.replace(/^\s+/, '');

const out = block.replace(/\n/g, eol) + eol + (rest ? eol + rest : '');

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
    console.log('.htaccess already has the current WHT Performance block; nothing to upload.');
    process.exit(3);
}
console.log(`.htaccess: WHT Performance block ${begins ? 'replaced' : 'added'}; ${live ? 'all other rules kept' : 'there was no .htaccess before'}.`);
