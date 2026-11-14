import type { Options } from 'canvas-confetti';

const COLORS = ['#C9B8FF', '#F4BFD2', '#D7BB83', '#FFFFFF'];
const load = async () => (await import('canvas-confetti')).default; // loaded only when first needed
const base: Options = { colors: COLORS, disableForReducedMotion: true, zIndex: 300, ticks: 240 };

/** Big celebratory burst (cake, finale). */
export async function celebrate() {
  const confetti = await load();
  confetti({ ...base, particleCount: 120, spread: 90, startVelocity: 48, origin: { x: 0.5, y: 0.62 } });
  setTimeout(() => {
    confetti({ ...base, particleCount: 60, angle: 60, spread: 70, origin: { x: 0, y: 0.7 } });
    confetti({ ...base, particleCount: 60, angle: 120, spread: 70, origin: { x: 1, y: 0.7 } });
  }, 250);
}

/** Smaller burst from the centre of an element (gift box, buttons). */
export async function burstAt(el: Element | null) {
  const confetti = await load();
  let origin = { x: 0.5, y: 0.6 };
  if (el) {
    const r = el.getBoundingClientRect();
    origin = { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight };
  }
  confetti({ ...base, particleCount: 90, spread: 80, startVelocity: 40, origin });
  confetti({ ...base, particleCount: 40, spread: 130, scalar: 0.8, origin });
}