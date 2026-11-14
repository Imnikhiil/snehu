// ─────────────────────────────────────────────────────────────
//  TIMELINE — your best moments, in order.
//  Easiest way: run  npm run dev  then open  http://localhost:5173/?pick
//  click your favourite photos in order, press "Copy timeline lines", paste them below,
//  then fill in the REAL date / occasion and a short caption for each.
//  Only write dates you actually know. Leave date: '' if you don't (a "Moment 1, 2, 3" label is shown).
//  Until you add entries, a few of your photos are shown automatically.
// ─────────────────────────────────────────────────────────────

export interface TimelineEntry {
  date: string; // e.g. "March 2025" or "Diwali 2025" — can be ''
  caption: string;
  type: 'photo' | 'video';
  src: string;
  poster?: string; // for videos
}

export const timeline: TimelineEntry[] = [
  // { date: 'March 2025', caption: 'A day to remember', type: 'photo', src: '/assets/photos/photo-03.webp' },
  // { date: '', caption: 'Little moment', type: 'video', src: '/assets/videos/video-02.mp4', poster: '/assets/photos/video-poster-02.jpg' },
];