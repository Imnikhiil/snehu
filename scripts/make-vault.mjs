// Run:  npm run vault -- 1711        (1711 = the secret code; use 4 to 8 digits)
//       npm run vault                (it will ask you for the code)
//
// 1. Put the SECRET photos / videos in a folder called  raw-vault  (next to package.json).
//    Optional: a text file  raw-vault/message.txt  with a private message.
// 2. This shrinks them, then ENCRYPTS everything with your code and saves it to public/vault/*.bin
//    plus src/data/vault.json. Without the code nobody can see the photos, videos or message
//    (not even by opening the files or the website source).
// 3. Run it again any time to change the content or the code.
// Remember the code: it is stored nowhere. Original files stay only on your computer.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import readline from 'node:readline/promises';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';

const IN = 'raw-vault';
const OUT = 'public/vault';
const MANIFEST = 'src/data/vault.json';
const ITER = 200000;
const IMG = /\.(jpe?g|png|webp)$/i;
const VID = /\.(mp4|mov|m4v|mkv|webm|avi|3gp)$/i;
const byName = (a, b) => a.localeCompare(b, undefined, { numeric: true });

if (!fs.existsSync(IN)) {
  fs.mkdirSync(IN);
  console.log(`Created the "${IN}" folder. Put the secret photos/videos (and optionally message.txt) in it, then run  npm run vault -- 1711`);
  process.exit(0);
}

const media = fs.readdirSync(IN).filter((f) => IMG.test(f) || VID.test(f)).sort(byName);
const msgPath = path.join(IN, 'message.txt');
const message = fs.existsSync(msgPath) ? fs.readFileSync(msgPath, 'utf8').trim() : '';
if (!media.length && !message) {
  console.log(`"${IN}" is empty. Add photos/videos and/or message.txt first.`);
  process.exit(0);
}

// the secret code
let pin = process.argv.slice(2).find((a) => !a.startsWith('--'));
if (!pin) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  pin = (await rl.question('Choose a numeric code (4 to 8 digits): ')).trim();
  rl.close();
}
if (!/^\d{4,8}$/.test(pin)) {
  console.log('The code must be 4 to 8 digits, numbers only.');
  process.exit(1);
}

// ffmpeg only if there are videos
let FFMPEG = null;
if (media.some((f) => VID.test(f))) {
  FFMPEG = 'ffmpeg';
  if (spawnSync(FFMPEG, ['-version']).error) {
    try {
      FFMPEG = (await import('ffmpeg-static')).default;
    } catch {
      FFMPEG = null;
    }
    if (!FFMPEG || spawnSync(FFMPEG, ['-version']).error) {
      console.log('ffmpeg was not found. Run  npm install -D ffmpeg-static  (then  node node_modules/ffmpeg-static/install.js  if needed) and try again.');
      process.exit(1);
    }
  }
}

const salt = crypto.randomBytes(16);
const key = crypto.pbkdf2Sync(pin, salt, ITER, 32, 'sha256');
const encrypt = (buf) => {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([c.update(buf), c.final()]);
  return Buffer.concat([iv, ct, c.getAuthTag()]); // WebCrypto layout: iv | ciphertext | tag
};

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const items = [];
let n = 0;
for (const f of media) {
  n++;
  const id = String(n).padStart(3, '0');
  const src = path.join(IN, f);
  let buf, mime, w, h, type;
  try {
    if (IMG.test(f)) {
      const r = await sharp(src).rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toBuffer({ resolveWithObject: true });
      buf = r.data; w = r.info.width; h = r.info.height; mime = 'image/webp'; type = 'photo';
    } else {
      const tmp = path.join(os.tmpdir(), `vault-${id}.mp4`);
      const enc = spawnSync(FFMPEG, ['-y', '-i', src, '-vf', "scale='if(gt(iw,ih),-2,720)':'if(gt(iw,ih),720,-2)'", '-c:v', 'libx264', '-crf', '28', '-preset', 'fast', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', tmp]);
      if (enc.status !== 0 || !fs.existsSync(tmp)) throw new Error('ffmpeg failed');
      const info = spawnSync(FFMPEG, ['-i', tmp]).stderr.toString();
      const m = info.match(/Video:.*?, (\d{2,5})x(\d{2,5})/);
      w = m ? Number(m[1]) : 1280; h = m ? Number(m[2]) : 720;
      buf = fs.readFileSync(tmp); fs.unlinkSync(tmp); mime = 'video/mp4'; type = 'video';
    }
  } catch (err) {
    console.log(`✗ ${f}: ${err.message}`);
    n--;
    continue;
  }
  fs.writeFileSync(path.join(OUT, `${id}.bin`), encrypt(buf));
  items.push({ type, file: `/vault/${id}.bin`, mime, w, h });
  console.log(`✓ ${f}  →  encrypted (${(buf.length / 1048576).toFixed(1)} MB, ${type})`);
}

const manifest = {
  v: 1,
  digits: pin.length,
  iterations: ITER,
  salt: salt.toString('base64'),
  check: encrypt(Buffer.from('SNEHA-VAULT-OK')).toString('base64'),
  message: message ? encrypt(Buffer.from(message, 'utf8')).toString('base64') : null,
  items,
};
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

console.log(`\nVault ready: ${items.length} file(s)${message ? ' + a private message' : ''}, ${pin.length}-digit code.`);
console.log('The code is NOT saved anywhere. Write it down for the gift card.');
console.log('Now run  npm run dev  and open the "Secret" section to try it.');
