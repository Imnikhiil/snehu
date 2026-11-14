// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  PHOTO DATA â€” add your real photos here.
//  1. Put the file in  public/assets/photos/   (e.g. photo-01.webp)
//  2. Add one line to the `photos` array below.
//  Until you add photos, clearly-labelled PLACEHOLDERS are shown.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const CATEGORIES = [
  'Beautiful Moments',
  'Little Smiles',
  'Candid Captures',
  'Special Memories',
  'Just Being You',
  'Unforgettable Frames',
] as const;

export type Category = (typeof CATEGORIES)[number];
export type Orientation = 'portrait' | 'landscape' | 'square';

export interface Photo {
  src: string;
  caption?: string;
  category: Category;
  orientation: Orientation;
  placeholder?: boolean;
}

export const photos: Photo[] = [
  { src: '/assets/photos/photo-01.webp', caption: '', category: 'Beautiful Moments', orientation: 'portrait' },
  { src: '/assets/photos/photo-02.webp', caption: '', category: 'Little Smiles', orientation: 'portrait' },
  { src: '/assets/photos/photo-03.webp', caption: '', category: 'Candid Captures', orientation: 'portrait' },
  { src: '/assets/photos/photo-04.webp', caption: '', category: 'Special Memories', orientation: 'portrait' },
  { src: '/assets/photos/photo-05.webp', caption: '', category: 'Just Being You', orientation: 'portrait' },
  { src: '/assets/photos/photo-06.webp', caption: '', category: 'Unforgettable Frames', orientation: 'portrait' },
  { src: '/assets/photos/photo-07.webp', caption: '', category: 'Beautiful Moments', orientation: 'portrait' },
  { src: '/assets/photos/photo-08.webp', caption: '', category: 'Little Smiles', orientation: 'portrait' },
  { src: '/assets/photos/photo-09.webp', caption: '', category: 'Candid Captures', orientation: 'landscape' },
  { src: '/assets/photos/photo-10.webp', caption: '', category: 'Special Memories', orientation: 'portrait' },
  { src: '/assets/photos/photo-11.webp', caption: '', category: 'Just Being You', orientation: 'portrait' },
  { src: '/assets/photos/photo-12.webp', caption: '', category: 'Unforgettable Frames', orientation: 'portrait' },
  { src: '/assets/photos/photo-13.webp', caption: '', category: 'Beautiful Moments', orientation: 'landscape' },
  { src: '/assets/photos/photo-14.webp', caption: '', category: 'Little Smiles', orientation: 'portrait' },
  { src: '/assets/photos/photo-15.webp', caption: '', category: 'Candid Captures', orientation: 'landscape' },
  { src: '/assets/photos/photo-16.webp', caption: '', category: 'Special Memories', orientation: 'portrait' },
  { src: '/assets/photos/photo-17.webp', caption: '', category: 'Just Being You', orientation: 'portrait' },
  { src: '/assets/photos/photo-18.webp', caption: '', category: 'Unforgettable Frames', orientation: 'portrait' },
  { src: '/assets/photos/photo-19.webp', caption: '', category: 'Beautiful Moments', orientation: 'portrait' },
  { src: '/assets/photos/photo-20.webp', caption: '', category: 'Little Smiles', orientation: 'portrait' },
  { src: '/assets/photos/photo-21.webp', caption: '', category: 'Candid Captures', orientation: 'landscape' },
  { src: '/assets/photos/photo-22.webp', caption: '', category: 'Special Memories', orientation: 'landscape' },
  { src: '/assets/photos/photo-23.webp', caption: '', category: 'Just Being You', orientation: 'portrait' },
  { src: '/assets/photos/photo-24.webp', caption: '', category: 'Unforgettable Frames', orientation: 'portrait' },
  { src: '/assets/photos/photo-25.webp', caption: '', category: 'Beautiful Moments', orientation: 'portrait' },
  { src: '/assets/photos/photo-26.webp', caption: '', category: 'Little Smiles', orientation: 'portrait' },
  { src: '/assets/photos/photo-27.webp', caption: '', category: 'Candid Captures', orientation: 'portrait' },
  { src: '/assets/photos/photo-28.webp', caption: '', category: 'Special Memories', orientation: 'portrait' },
  { src: '/assets/photos/photo-29.webp', caption: '', category: 'Just Being You', orientation: 'portrait' },
  { src: '/assets/photos/photo-30.webp', caption: '', category: 'Unforgettable Frames', orientation: 'landscape' },
  { src: '/assets/photos/photo-31.webp', caption: '', category: 'Beautiful Moments', orientation: 'landscape' },
  { src: '/assets/photos/photo-32.webp', caption: '', category: 'Little Smiles', orientation: 'landscape' },
  { src: '/assets/photos/photo-33.webp', caption: '', category: 'Candid Captures', orientation: 'landscape' },
  { src: '/assets/photos/photo-34.webp', caption: '', category: 'Special Memories', orientation: 'portrait' },
  { src: '/assets/photos/photo-35.webp', caption: '', category: 'Just Being You', orientation: 'landscape' },
  { src: '/assets/photos/photo-36.webp', caption: '', category: 'Unforgettable Frames', orientation: 'portrait' },
  { src: '/assets/photos/photo-37.webp', caption: '', category: 'Beautiful Moments', orientation: 'portrait' },
  { src: '/assets/photos/photo-38.webp', caption: '', category: 'Little Smiles', orientation: 'portrait' },
  { src: '/assets/photos/photo-39.webp', caption: '', category: 'Candid Captures', orientation: 'portrait' },
  { src: '/assets/photos/photo-40.webp', caption: '', category: 'Special Memories', orientation: 'portrait' },
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ placeholder generator (do not edit) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PALETTE: [string, string][] = [
  ['#C9B8FF', '#2a2250'],
  ['#F4BFD2', '#3a2030'],
  ['#D7BB83', '#33291a'],
  ['#8fa4d8', '#1a2238'],
  ['#b9a1e8', '#241b3d'],
];
const PLACEHOLDER_ORIENTATIONS: Orientation[] = [
  'portrait', 'portrait', 'landscape', 'portrait', 'square', 'portrait', 'landscape', 'portrait',
];

export function makePlaceholder(i: number, orientation: Orientation): Photo {
  const [w, h] = orientation === 'portrait' ? [800, 1000] : orientation === 'landscape' ? [1000, 700] : [900, 900];
  const [a, b] = PALETTE[i % PALETTE.length];
  const n = String(i + 1).padStart(2, '0');
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs>` +
    `<rect width='100%' height='100%' fill='url(#g)'/>` +
    `<text x='50%' y='48%' fill='white' fill-opacity='.85' font-family='sans-serif' font-size='${w * 0.05}' text-anchor='middle'>PLACEHOLDER ${n}</text>` +
    `<text x='50%' y='56%' fill='white' fill-opacity='.55' font-family='sans-serif' font-size='${w * 0.032}' text-anchor='middle'>replace with a real photo</text></svg>`;
  return {
    src: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    caption: 'Placeholder â€” replace with a real photo',
    category: 'Beautiful Moments',
    orientation,
    placeholder: true,
  };
}

/** Returns `count` photos for the hero. Real photos are cycled; placeholders fill in if none exist yet. */
export function getHeroPhotos(count: number): Photo[] {
  return Array.from({ length: count }, (_, i) =>
    photos.length
      ? photos[i % photos.length]
      : makePlaceholder(i, PLACEHOLDER_ORIENTATIONS[i % PLACEHOLDER_ORIENTATIONS.length]),
  );
}

