// ─────────────────────────────────────────────────────────────
//  STORY MODE (slideshow of your photos) — edit the words / timing freely.
//  seconds: how long each photo stays on screen
//  max:     most photos to include
//  photos:  optional "favourites" list in the order you want, e.g.
//           ['/assets/photos/photo-12.webp', '/assets/photos/photo-03.webp']
//           Leave [] to use all your gallery photos in their normal order.
// ─────────────────────────────────────────────────────────────
export const story = {
  eyebrow: 'PRESS PLAY',
  title: 'Watch Your Story',
  hint: 'A little film made from your moments.',
  cta: 'Play Story',
  moments: (n: number) => `${n} moments`,
  seconds: 4,
  max: 40,
  photos: [] as string[],
  titleCard: { small: 'A LITTLE STORY', big: 'For Sneha', sub: 'Made from your beautiful moments' },
  endCard: {
    big: 'Happy Birthday, Sneha!',
    sub: "Here's to many more beautiful moments.",
    sign: 'With Best Wishes ❤️',
    replay: 'Watch Again ↺',
    close: 'Close',
  },
  labels: { close: 'Close story', pause: 'Pause', play: 'Play', next: 'Next photo', prev: 'Previous photo' },
};