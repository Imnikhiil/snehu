import { useEffect, useRef } from 'react';

const COLORS = ['244,191,210', '201,184,255', '215,187,131']; // pink, lavender, gold
interface Petal { x: number; y: number; s: number; vy: number; sw: number; ph: number; r: number; vr: number; c: string; a: number }

/** Soft petals drifting down the whole page. Fixed canvas, pauses when the tab is hidden, off for reduced motion. */
export default function Petals() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, raf = 0, last = 0;
    let petals: Petal[] = [];

    const make = (initial: boolean): Petal => ({
      x: Math.random() * W,
      y: initial ? Math.random() * H : -20,
      s: 5 + Math.random() * 7,
      vy: 28 + Math.random() * 40,
      sw: 14 + Math.random() * 26,
      ph: Math.random() * 6.28,
      r: Math.random() * 6.28,
      vr: (Math.random() - 0.5) * 1.6,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      a: 0.25 + Math.random() * 0.35,
    });

    const resize = () => {
      const widthChanged = innerWidth !== W;
      W = innerWidth;
      H = innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // on phones the address bar changes the height while scrolling: don't restart the petals for that
      if (widthChanged || !petals.length) petals = Array.from({ length: W < 768 ? 12 : 24 }, () => make(true));
    };

    const frame = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      if (!document.hidden) {
        ctx.clearRect(0, 0, W, H);
        for (const p of petals) {
          p.y += p.vy * dt;
          p.ph += dt * 0.9;
          p.r += p.vr * dt;
          if (p.y > H + 20) Object.assign(p, make(false));
          ctx.save();
          ctx.translate(p.x + Math.sin(p.ph) * p.sw, p.y);
          ctx.rotate(p.r);
          ctx.scale(1, Math.abs(Math.cos(p.ph * 1.3)) * 0.6 + 0.4); // little "flip" as it turns in the air
          ctx.fillStyle = `rgba(${p.c},${p.a})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.s * 0.55, p.s, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      raf = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener('resize', resize);
    last = performance.now();
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="petals" aria-hidden="true" />;
}