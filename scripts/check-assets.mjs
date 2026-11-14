// Run:  npm run check
// Verifies every photo / video / poster / music path in your data files really exists in /public
// (exact upper/lower-case match, because Vercel & Netlify servers are case-sensitive and Windows is not).
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataFiles = ['src/data/photos.ts', 'src/data/videos.ts', 'src/data/timeline.ts', 'src/data/music.ts'];
const MB = 1024 * 1024;

function existsExact(rel) {
  let dir = path.join(root, 'public');
  for (const part of rel.split('/').filter(Boolean)) {
    if (!fs.existsSync(dir) || !fs.readdirSync(dir).includes(part)) return false;
    dir = path.join(dir, part);
  }
  return true;
}

let missing = 0, total = 0, bytes = 0;
const used = new Set();

for (const file of dataFiles) {
  if (!fs.existsSync(file)) continue;
  const code = fs.readFileSync(file, 'utf8').split('\n').map((l) => l.replace(/\/\/.*$/, '')).join('\n');
  for (const m of code.matchAll(/['"`](\/assets\/[^'"`]+)['"`]/g)) {
    const rel = m[1];
    total++;
    used.add(rel);
    if (!existsExact(rel)) {
      missing++;
      console.log(`✗ MISSING  ${rel}   (listed in ${file})`);
      continue;
    }
    const size = fs.statSync(path.join(root, 'public', rel)).size;
    bytes += size;
    if (/\.(webp|jpe?g|png)$/i.test(rel) && size > 600 * 1024) console.log(`! heavy image (${(size / MB).toFixed(1)} MB): ${rel}  → run "npm run photos" to shrink`);
    if (/\.(mp4|webm|mov)$/i.test(rel) && size > 25 * MB) console.log(`! heavy video (${(size / MB).toFixed(1)} MB): ${rel}  → compress to 720p`);
  }
}

// files sitting in public/assets that no data file uses
const unused = [];
(function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name !== '.gitkeep') {
      const rel = '/' + path.relative(path.join(root, 'public'), p).split(path.sep).join('/');
      if (!used.has(rel)) unused.push(rel);
    }
  }
})(path.join(root, 'public', 'assets'));

console.log(`\nChecked ${total} asset path(s) — ${(bytes / MB).toFixed(1)} MB referenced.`);
if (unused.length) console.log(`ℹ ${unused.length} file(s) in public/assets are not used by any data file (they still get uploaded):\n  ${unused.join('\n  ')}`);
if (missing) {
  console.log(`\n✗ ${missing} missing file(s). Fix the path or the filename, then run again.`);
  process.exit(1);
}
console.log(total ? '✓ All asset paths are fine.' : 'ℹ No real assets listed yet (placeholders are showing).');
