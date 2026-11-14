import { useEffect, useRef } from 'react';
import Particles from '../Particles/Particles';
import { finale } from '../../data/messages';
import { useInView } from '../../hooks/useInView';
import { celebrate } from '../../utils/confetti';

/** Twinkling night sky on a canvas. Pauses when off-screen; static if reduced motion is on. */
function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, raf = 0, visible = true;
    let stars: { x: number; y: number; r: number; p: number; s: number }[] = [];

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#fff';
      for (const s of stars) {
        ctx.globalAlpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin((t / 1000) * s.s + s.p));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    const resize = () => {
      W = c.clientWidth;
      H = c.clientHeight;
      c.width = W * dpr;
      c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = W < 768 ? 70 : 140;
      stars = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + 0.3, p: Math.random() * 6.28, s: 0.4 + Math.random() * 1.2 }));
      draw(0);
    };
    const loop = (t: number) => {
      if (visible && !document.hidden) draw(t);
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(c);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);
    resize();
    if (!reduce) raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="fin__stars" aria-hidden="true" />;
}

export default function FinalCelebration() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const fired = useRef(false);

  useEffect(() => {
    if (inView && !fired.current) {
      fired.current = true;
      celebrate();
    }
  }, [inView]);

  const replay = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <section id="celebrate" className="sec sec--final">
      <StarField />
      <Particles count={26} />
      <div ref={ref} className={`sec__in fin ${inView ? 'is-in' : ''}`}>
        <h2 className="fin__title">{finale.title}</h2>
        <p className="fin__text">{finale.text}</p>
        <p className="fin__date">{finale.date}</p>
        <p className="fin__closing">{finale.closing}</p>
        <p className="fin__sign">{finale.signature}</p>
        <button className="btn btn--primary" onClick={replay}>{finale.replay}</button>
      </div>
    </section>
  );
}