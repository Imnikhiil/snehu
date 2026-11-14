import { useEffect, useRef } from 'react';

/** Desktop only: a soft glow that follows the cursor + a gentle "magnetic" pull on main buttons. */
export default function CursorGlow() {
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const g = glow.current!;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, shown = false;
    let mag: HTMLElement | null = null;

    const reset = (el: HTMLElement) => {
      el.style.removeProperty('--tx');
      el.style.removeProperty('--ty');
    };
    const tick = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      g.style.transform = `translate3d(${x - 250}px, ${y - 250}px, 0)`;
      raf = Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        x = tx;
        y = ty;
        g.style.opacity = '1';
      }
      if (!raf) raf = requestAnimationFrame(tick);

      const t = (e.target as HTMLElement).closest?.('.btn--primary, .btn--glow') as HTMLElement | null;
      if (mag && mag !== t) {
        reset(mag);
        mag = null;
      }
      if (t) {
        mag = t;
        const r = t.getBoundingClientRect();
        t.style.setProperty('--tx', `${((e.clientX - (r.left + r.width / 2)) * 0.25).toFixed(1)}px`);
        t.style.setProperty('--ty', `${((e.clientY - (r.top + r.height / 2)) * 0.35).toFixed(1)}px`);
      }
    };
    const leave = () => {
      shown = false;
      g.style.opacity = '0';
      if (mag) reset(mag);
      mag = null;
    };

    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={glow} className="cursor-glow" aria-hidden="true" />;
}