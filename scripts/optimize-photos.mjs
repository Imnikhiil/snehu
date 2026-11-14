// Run:  npm run photos          (adds new photos after the ones already converted)
//       npm run photos -- --fresh   (deletes converted photos and starts again from photo-01)
//
// 1. Put your ORIGINAL photos in a folder called  raw-photos  (next to package.json).
//    TIP: to choose categories without typing anything, make sub-folders named exactly like the categories:
//      raw-photos/Little Smiles/...   raw-photos/Candid Captures/...   (loose photos get categories in rotation)
// 2. This resizes (max 1600px), converts to .webp, REMOVES location/EXIF data (privacy),
//    saves to public/assets/photos as photo-01.webp, photo-02.webp ...
//    Categories are mixed together in the numbering so the hero shows variety.
// 3. It prints ready-to-paste lines for src/data/photos.ts (also saved in photo-lines.txt).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const IN = 'raw-photos';
const OUT = 'public/assets/photos';
const CATS = ['Beautiful Moments', 'Little Smiles', 'Candid Captures', 'Special Memories', 'Just Being You', 'Unforgettable Frames'];
const IMG = /\.(jpe?g|png|webp)$/i;
const fresh = process.argv.includes('--fresh');

if (!fs.existsSync(IN)) {
  fs.mkdirSync(IN);
  console.log(`Created the "${IN}" folder. Put your original photos in it, then run "npm run photos" again.`);
  process.exit(0);
}
fs.mkdirSync(OUT, { recursive: true });

// collect photos per category
const groups = Object.fromEntries(CATS.map((c) => [c, []]));
const loose = [];
for (const e of fs.readdirSync(IN, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))) {
  if (e.isFile() && IMG.test(e.name)) loose.push(path.join(IN, e.name));
  else if (e.isDirectory()) {
    const cat = CATS.find((c) => c.toLowerCase() === e.name.trim().toLowerCase());
    if (!cat) {
      console.log(`! Skipping folder "${e.name}" — its name must be exactly one of: ${CATS.join(', ')}`);
      continue;
    }
    for (const f of fs.readdirSync(path.join(IN, e.name)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })))
      if (IMG.test(f)) groups[cat].push(path.join(IN, e.name, f));
  }
}
loose.forEach((f, i) => groups[CATS[i % CATS.length]].push(f));

// interleave categories (A1, B1, C1 ... A2, B2 ...) so numbering = nice variety
const queue = [];
for (let i = 0; queue.length < Object.values(groups).flat().length; i++)
  for (const c of CATS) if (groups[c][i]) queue.push({ file: groups[c][i], cat: c });

if (!queue.length) {
  console.log(`No .jpg/.png/.webp photos found in "${IN}". (iPhone HEIC photos: share/export them as JPEG first.)`);
  process.exit(0);
}

if (fresh) for (const f of fs.readdirSync(OUT)) if (/^photo-\d+\.webp$/.test(f)) fs.unlinkSync(path.join(OUT, f));
let n = 0;
for (const f of fs.readdirSync(OUT)) {
  const m = f.match(/^photo-(\d+)\.webp$/);
  if (m) n = Math.max(n, Number(m[1]));
}

const lines = [];
let total = 0;
for (const { file, cat } of queue) {
  n++;
  const name = `photo-${String(n).padStart(2, '0')}.webp`;
  try {
    const { data, info } = await sharp(file)
      .rotate() // apply the phone's rotation; metadata (incl. GPS) is dropped on output
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer({ resolveWithObject: true });
    fs.writeFileSync(path.join(OUT, name), data);
    total += data.length;
    const r = info.width / info.height;
    const orientation = r > 1.15 ? 'landscape' : r < 0.87 ? 'portrait' : 'square';
    console.log(`✓ ${path.basename(file)}  →  ${name}  (${Math.round(data.length / 1024)} KB, ${orientation}, ${cat})`);
    lines.push(`  { src: '/assets/photos/${name}', caption: '', category: '${cat}', orientation: '${orientation}' },`);
  } catch (err) {
    n--;
    console.log(`✗ Could not read ${file}: ${err.message}`);
  }
}

fs.writeFileSync('photo-lines.txt', lines.join('\n') + '\n');
console.log(`\nDone: ${lines.length} photos, ${(total / 1048576).toFixed(1)} MB in total.`);
console.log('Replace the contents of the `photos` array in src/data/photos.ts with these lines (also saved in photo-lines.txt):\n');
console.log(lines.join('\n'));
