// ─────────────────────────────────────────────────────────────
//  Editable text for the birthday interactions.
//  Lines with  hand: true  are shown in handwriting style.
// ─────────────────────────────────────────────────────────────

export interface LetterLine {
  text: string;
  hand?: boolean;
}

export const letter = {
  eyebrow: 'A LITTLE NOTE, JUST FOR YOU',
  open: 'Open Your Letter 💌',
  salutation: 'Dear Sneha,',
  lines: [
    { text: 'On your special day, I just want to wish you endless happiness, good health and countless reasons to smile.' },
    { text: 'May every new chapter of your life bring beautiful opportunities, memorable experiences and everything your heart wishes for.' },
    { text: 'Keep smiling, keep shining and never stop being the wonderful person you are.', hand: true },
    { text: 'I hope this little surprise brings a smile to your face.' },
    { text: 'Wishing you a very Happy Birthday!', hand: true },
  ] as LetterLine[],
  signoff: 'With Best Wishes ✨',
};

export const cake = {
  title: 'Make A Wish, Sneha!',
  blow: 'Blow The Candles 🕯️',
  again: 'Celebrate Again ✨',
  message: 'May all your wishes come true!',
};

export const gift = {
  title: 'One Last Little Surprise...',
  hint: 'Tap the box',
  message: 'Never stop smiling, never stop growing and may life always surprise you with beautiful moments.',
  button: 'Keep Shining ✨',
};

export const collage = {
  title: 'A THOUSAND LITTLE MOMENTS.',
  sub: 'And every single one deserves to be remembered.',
};

export const finale = {
  title: 'HAPPY BIRTHDAY, SNEHA!',
  text: 'May your days be filled with happiness, your journey with success, and your life with countless beautiful moments.',
  date: '17 NOVEMBER 2026',
  closing: "Here's to another year of smiles, new beginnings and beautiful memories.",
  signature: 'With Best Wishes ❤️',
  replay: 'Experience The Surprise Again ↺',
};