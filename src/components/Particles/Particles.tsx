import { useMemo } from 'react';

/** Lightweight floating dots (pure CSS animation, deterministic positions). */
export default function Particles({ count = 18 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number) => {
          const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453;
          return x - Math.floor(x);
        };
        return { left: r(1) * 100, top: r(2) * 100, size: 2 + r(3) * 4, dur: 12 + r(4) * 14, delay: -r(5) * 20, hue: r(6) };
      }),
    [count],
  );
  return (
    <div className="particles" aria-hidden="true">
      {items.map((p, i) => (
        <i
          key={i}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            color: p.hue > 0.66 ? 'var(--gold)' : p.hue > 0.33 ? 'var(--pink)' : 'var(--lavender)',
          }}
        />
      ))}
    </div>
  );
}