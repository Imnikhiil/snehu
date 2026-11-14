// ─────────────────────────────────────────────────────────────
//  "OPEN WHEN…" ENVELOPES — edit the words freely (keep the structure).
//  icon:   smile | rain | trophy | moon | sparkle
//  colors: [lighter, darker] colour of the envelope
//  photo:  optional, e.g. '/assets/photos/photo-07.webp' (shown on the note)
//  confetti: true = confetti when that note opens
//  Separate paragraphs with a blank line.
// ─────────────────────────────────────────────────────────────
export type IconKey = 'smile' | 'rain' | 'trophy' | 'moon' | 'sparkle';

export interface OpenWhenCard {
  title: string;
  icon: IconKey;
  colors: [string, string];
  message: string;
  photo?: string;
  confetti?: boolean;
}

export const openWhen = {
  eyebrow: 'FOR EVERY KIND OF DAY',
  title: 'Open When…',
  hint: 'Little notes for the moments you might need them.',
  signoff: 'With Best Wishes ✨',
  close: 'Close',
};

export const openWhenCards: OpenWhenCard[] = [
  {
    title: 'Open when you need a smile',
    icon: 'smile',
    colors: ['#cfc2f2', '#a894e0'],
    message: 'Think of the last time you laughed so much that your cheeks hurt.\n\nThat version of you is still right there, and the next laugh is closer than you think. Smile. It suits you.',
  },
  {
    title: 'Open when you feel low',
    icon: 'rain',
    colors: ['#bcd0ee', '#8fa9d6'],
    message: "It's okay to have days like this. They don't last forever, and they don't say anything bad about you.\n\nTake a deep breath, drink some water and be gentle with yourself. Better days are already on their way.",
  },
  {
    title: 'Open when you achieve something',
    icon: 'trophy',
    colors: ['#e8d3a4', '#cdb078'],
    message: "Look at you, doing it again!\n\nTake a moment to feel proud, because you worked for this. Celebrate loudly. You've earned every bit of it.",
    confetti: true,
  },
  {
    title: "Open when you can't sleep",
    icon: 'moon',
    colors: ['#c9c2e6', '#9b92c9'],
    message: "Put the worries down for tonight. They'll still be there tomorrow, and you'll handle them better after some rest.\n\nThink of one good thing that happened today. Now close your eyes. Sweet dreams.",
  },
  {
    title: 'Open when you doubt yourself',
    icon: 'sparkle',
    colors: ['#f1c7d6', '#d99bb3'],
    message: 'You are more capable than you think, and you have come much further than you give yourself credit for.\n\nDoubt is only a sign that you care. Keep going, one step at a time.',
  },
];