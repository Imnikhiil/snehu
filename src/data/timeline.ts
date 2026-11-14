// ─────────────────────────────────────────────────────────────
//  TIMELINE DATA — only add real dates/occasions. Never guess.
//  type: 'photo' uses src as the image. type: 'video' uses src as .mp4 plus an optional poster.
// ─────────────────────────────────────────────────────────────

export interface TimelineEntry {
  date: string; // e.g. "March 2025" or "Diwali 2025"
  caption: string;
  type: 'photo' | 'video';
  src: string;
  poster?: string;
}

export const timeline: TimelineEntry[] = [
  // { date: 'March 2025', caption: 'A day to remember', type: 'photo', src: '/assets/photos/photo-03.webp' },
];