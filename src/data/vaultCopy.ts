// Public wording of the locked section (the secret content itself is encrypted, see scripts/make-vault.mjs)
export const vaultCopy = {
  eyebrow: 'A SECRET, LOCKED AWAY',
  title: 'Something is waiting behind this lock.',
  hint: 'The code is hidden inside your gift 🎁',
  enter: (n: number) => `Enter the ${n}-digit code`,
  checking: 'Unlocking…',
  wrong: 'That is not the right code. Try again.',
  unlocked: 'Unlocked ✨',
  error: 'Something went wrong while opening it. Please refresh and try again.',
  noCrypto: 'This lock needs a secure (https) link to open.',
  openedTitle: 'You found it. 💜',
  openedSub: 'Just for you.',
};