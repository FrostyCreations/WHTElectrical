/* =========================================================
   Has anyone changed the live files by hand since the last deploy?

       node build/server/check-drift.mjs <live> <previous> <current>

   Each argument is a folder laid out the same way:
       assets/wht.css, assets/wht-elementor.css, assets/wht.js
       plugin/wht-chrome.php, plugin/wht-*.json
   <live>     what the deploy just downloaded from the server
   <previous> those files built from the commit that was last deployed
   <current>  those files built from the commit being deployed now

   A live file is fine if it matches either build: the previous one (the
   normal case) or the current one (this commit was already deployed and
   the run is a repeat). Anything else was edited on the server, and
   uploading would silently overwrite that edit, so this exits 1 and
   lists the files. A file missing from the server is not drift.
   ========================================================= */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const [live, previous, current] = process.argv.slice(2);
if (!live || !previous || !current) {
    console.error('usage: node build/server/check-drift.mjs <live> <previous> <current>');
    process.exit(1);
}

const hash = (f) => (existsSync(f) ? createHash('sha256').update(readFileSync(f)).digest('hex') : null);
const list = (dir) => (existsSync(dir) ? readdirSync(dir).filter((f) => !f.startsWith('.')) : []);

const files = [
    ...['wht.css', 'wht-elementor.css', 'wht.js'].map((f) => `assets/${f}`),
    ...list(join(live, 'plugin')).map((f) => `plugin/${f}`),
];

const drift = [];
for (const f of files) {
    const l = hash(join(live, f));
    if (!l) { console.log(`  ${f.padEnd(28)} not on the server yet`); continue; }
    if (!hash(join(previous, f)) && !hash(join(current, f))) {
        console.log(`  ${f.padEnd(28)} not built by git; left alone`);
        continue;
    }
    const state = l === hash(join(previous, f)) ? 'matches the last deploy'
        : l === hash(join(current, f)) ? 'already this version'
            : null;
    console.log(`  ${f.padEnd(28)} ${state || 'CHANGED ON THE SERVER'}`);
    if (!state) drift.push(f);
}

if (drift.length) {
    console.error(`\n${drift.length} live file(s) differ from anything git deployed:\n  ${drift.join('\n  ')}`);
    console.error('\nThey were edited on the server, or a previous deploy only half finished. The live copies are');
    console.error('in this run\'s "live-backup" artifact: compare them, move any change worth keeping into the repo,');
    console.error('then re-run the workflow from the Actions tab with "Overwrite files changed on the server" ticked.');
    process.exit(1);
}
console.log('\nNo live file was changed by hand since the last deploy.');
