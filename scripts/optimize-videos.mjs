// Run:  npm run videos          (adds new videos after the ones already converted)
//       npm run videos -- --fresh   (deletes converted videos and starts again from video-01)
//
// Needs ffmpeg:  run once  npm install -D ffmpeg-static   (no other install needed).
// 1. Put your ORIGINAL videos in a folder called  raw-videos  (next to package.json).
// 2. This shrinks each one to 720p MP4 (web-friendly, starts fast), saves it as
//    public/assets/videos/video-01.mp4 ... and makes a poster picture public/assets/photos/video-poster-01.jpg
// 3. It prints ready-to-paste lines for src/data/videos.ts (also saved in video-lines.txt).
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const IN = 'raw-videos';
const OUT_V = 'public/assets/videos';
const OUT_P = 'public/assets/photos';
const VID = /\.(mp4|mov|m4v|mkv|webm|avi|3gp)$/i;
const fresh = process.argv.includes('--fresh');

// use ffmpeg from the computer if it exists, otherwise the one installed by "npm install -D ffmpeg-static"
let FFMPEG = 'ffmpeg';
if (spawnSync(FFMPEG, ['-version']).error) {
  try {
    FFMPEG = (await import('ffmpeg-static')).default;
  } catch {
    FFMPEG = null;
  }
  if (!FFMPEG || spawnSync(FFMPEG, ['-version']).error) {
    console.log('ffmpeg was not found. Run this once:  npm install -D ffmpeg-static   then run "npm run videos" again.');
    process.exit(1);
  }
}
if (!fs.existsSync(IN)) {
  fs.mkdirSync(IN);
  console.log(`Created the "${IN}" folder. Put your original videos in it, then run "npm run videos" again.`);
  process.exit(0);
}
fs.mkdirSync(OUT_V, { recursive: true });
fs.mkdirSync(OUT_P, { recursive: true });

const files = fs.readdirSync(IN).filter((f) => VID.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
if (!files.length) {
  console.log(`No videos found in "${IN}".`);
  process.exit(0);
}

if (fresh) {
  for (const f of fs.readdirSync(OUT_V)) if (/^video-\d+\.mp4$/.test(f)) fs.unlinkSync(path.join(OUT_V, f));
  for (const f of fs.readdirSync(OUT_P)) if (/^video-poster-\d+\.jpg$/.test(f)) fs.unlinkSync(path.join(OUT_P, f));
}
let n = 0;
for (const f of fs.readdirSync(OUT_V)) {
  const m = f.match(/^video-(\d+)\.mp4$/);
  if (m) n = Math.max(n, Number(m[1]));
}

const lines = [];
let total = 0;
for (const f of files) {
  n++;
  const id = String(n).padStart(2, '0');
  const src = path.join(IN, f);
  const out = path.join(OUT_V, `video-${id}.mp4`);
  const poster = path.join(OUT_P, `video-poster-${id}.jpg`);
  process.stdout.write(`… ${f}  →  video-${id}.mp4  (please wait) `);

  // shorter side becomes 720px, ffmpeg auto-applies the phone's rotation
  const enc = spawnSync(FFMPEG, [
    '-y', '-i', src,
    '-vf', "scale='if(gt(iw,ih),-2,720)':'if(gt(iw,ih),720,-2)'",
    '-c:v', 'libx264', '-crf', '28', '-preset', 'fast', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', out,
  ]);
  if (enc.status !== 0 || !fs.existsSync(out)) {
    console.log('✗ failed');
    n--;
    continue;
  }
  // poster = a frame from ~1 second in (or the first frame for very short clips)
  let p = spawnSync(FFMPEG, ['-y', '-ss', '1', '-i', out, '-frames:v', '1', '-vf', 'scale=900:-2', '-q:v', '4', poster]);
  if (p.status !== 0 || !fs.existsSync(poster)) spawnSync(FFMPEG, ['-y', '-i', out, '-frames:v', '1', '-vf', 'scale=900:-2', '-q:v', '4', poster]);

  const mb = fs.statSync(out).size / 1048576;
  total += mb;
  console.log(`✓ ${mb.toFixed(1)} MB`);
  lines.push(`  { src: '/assets/videos/video-${id}.mp4', poster: '/assets/photos/video-poster-${id}.jpg', title: 'Memory ${id}', caption: '' },`);
}

fs.writeFileSync('video-lines.txt', lines.join('\n') + '\n');
console.log(`\nDone: ${lines.length} videos, ${total.toFixed(0)} MB in total.${total > 200 ? '  ⚠ That is heavy — consider trimming long clips.' : ''}`);
console.log('Replace the contents of the `videos` array in src/data/videos.ts with these lines (also saved in video-lines.txt):\n');
console.log(lines.join('\n'));
