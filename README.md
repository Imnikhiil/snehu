# Sneha — A World of Beautiful Moments

A cinematic birthday surprise website (Vite + React + TypeScript + GSAP).

## 1. Run it on your computer
```bash
npm install
npm run dev                 # open http://localhost:5173
npm run dev -- --host       # also gives a network URL you can open on your phone (same Wi-Fi)
```

## 2. Where your files go
| What            | Folder                      | Example filename        |
|-----------------|-----------------------------|-------------------------|
| Photos          | `public/assets/photos/`     | `photo-01.webp`         |
| Video posters   | `public/assets/photos/`     | `video-poster-01.webp`  |
| Videos          | `public/assets/videos/`     | `video-01.mp4`          |
| Music           | `public/assets/music/`      | `song.mp3`              |

### Photos (easy way)
1. Make a folder `raw-photos` next to `package.json` and put your original photos in it (JPG/PNG/WebP; export iPhone HEIC as JPEG).
2. `npm run photos` — resizes, converts to WebP, **removes location data**, saves to `public/assets/photos/`, and prints ready-to-paste lines.
3. Paste those lines inside the `photos` array in `src/data/photos.ts`, then edit captions/categories.

Categories: Beautiful Moments · Little Smiles · Candid Captures · Special Memories · Just Being You · Unforgettable Frames.
Orientation: `portrait`, `landscape` or `square`.

### Videos
Compress phone videos first (4K clips are far too heavy): HandBrake → preset "Fast 720p30", MP4. Keep each under ~15 MB.
Take one screenshot of each as its poster (`video-poster-01.webp`). Then add to `src/data/videos.ts`:
```ts
{ src: '/assets/videos/video-01.mp4', poster: '/assets/photos/video-poster-01.webp', title: 'Little Moments', caption: 'A moment worth remembering' },
```

### Timeline
Add only real dates/occasions in `src/data/timeline.ts`.

### Music
Put the song in `public/assets/music/` and set `src` in `src/data/music.ts`. It never autoplays; Sneha taps play.

## 3. Edit the words
- Hero text & menu: `src/data/content.ts`
- Intro, gallery, appreciation cards: `src/data/sections.ts`
- Letter, cake, gift box, finale: `src/data/messages.ts`

## 4. Before you deploy
```bash
npm run check      # every photo/video/music path exists (exact CAPITALS matter on servers)
npm run build      # must finish without errors
npm run preview    # test the real production build
```

## 5. Deploy
**Netlify Drop (easiest):** `npm run build` → go to https://app.netlify.com/drop → drag the `dist` folder in (log in so the site stays online).
**Vercel:** `npm i -g vercel` → `vercel` (answer the questions, defaults are fine) → `vercel --prod`.
Both give you a link. Choose a hard-to-guess site name (e.g. `sneha-surprise-7k2q`). The link is unlisted, not password-protected.

Changed something later? Run `npm run build` and deploy again.

## Privacy
No analytics, no tracking, no social sharing, no third-party image hosting. Photos are served only from your own site. The only external request is Google Fonts (typography).