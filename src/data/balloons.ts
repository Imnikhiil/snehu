// ─────────────────────────────────────────────────────────────
//  BALLOON GAME — edit the words freely.
//  Each balloon that gets popped reveals the next wish from the list (in random order).
//  Add or remove wishes as you like.
// ─────────────────────────────────────────────────────────────
export const balloonsCopy = {
  eyebrow: 'A LITTLE GAME',
  title: 'Pop A Balloon',
  hint: 'Pop the balloons to find all the little wishes.',
  start: 'Tap a balloon!',
  found: (a: number, b: number) => `${a} / ${b} wishes found`,
  done: 'You found every wish! May they all come true.',
  replay: 'Play again',
  skip: 'Reveal a wish for me',
  max: 8, // balloons on screen at once (fewer on phones)
};

export const wishes: string[] = [
  'May every day bring you a reason to smile.',
  'Wishing you good health and a happy heart.',
  'May your dreams find you, and may you chase them with courage.',
  'May your year be full of beautiful surprises.',
  'May you always be surrounded by people who value you.',
  'Wishing you calm in the busy days and joy in the quiet ones.',
  'May success follow every step you take.',
  'May this year be your best chapter yet.',
  'May you laugh until your cheeks hurt, often.',
  'May you never forget how special you are.',
  'May new adventures keep finding you.',
  'May all your wishes come true.',
];