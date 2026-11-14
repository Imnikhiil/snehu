import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Particles from '../Particles/Particles';
import { scratch as c, scratchCards } from '../../data/scratch';
import { getGalleryPhotos } from '../../data/gallery';
import { burstAt } from '../../utils/confetti';

interface CardProps { src: string; text: string; label: string }

/** One scratch card: a shiny foil on a canvas that wears away where you touch it. */
function ScratchCard({ src, text, label }: CardProps) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const doneRef = useRef(false);
  const [done, setDone] = useState(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setDone(true);
    void burstAt(box.current);
  }, []);

  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext('2d')!;
    let lastW = 0;

    const paint = () => {
      const w = cv.clientWidth, h = cv.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#d9c9ff'); g.addColorStop(0.35, '#f4bfd2'); g.addColorStop(0.7, '#e8cf9a'); g.addColorStop(1, '#bfa8ff');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 260; i++) { // glitter
        ctx.fillStyle = `rgba(255,255,255,${(Math.random() * 0.55).toFixed(2)})`;
        const s = Math.random() * 2.2 + 0.4;
        ctx.fillRect(Math.random() * w, Math.random() * h, s, s);
      }
      ctx.save(); // diagonal sheen
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = '#fff';
      for (let x = -h; x < w; x += 46) {
        ctx.beginPath();
        ctx.moveTo(x, 0); ctx.lineTo(x + 14, 0); ctx.lineTo(x + 14 + h, h); ctx.lineTo(x + h, h);
        ctx.fill();
      }
      ctx.restore();
      ctx.fillStyle = 'rgba(60,40,90,0.78)';
      ctx.textAlign = 'center';
      ctx.font = `italic ${Math.round(w * 0.09)}px "Playfair Display", Georgia, serif`;
      ctx.fillText(label, w / 2, h / 2 - 6);
      ctx.font = `${Math.round(w * 0.045)}px Inter, sans-serif`;
      ctx.fillText(c.tap, w / 2, h / 2 + Math.round(w * 0.085));
    };

    // draw the foil, and redraw only if the card's WIDTH changes (phone address bar changes height while scrolling)
    const ro = new ResizeObserver(() => {
      if (doneRef.current) return;
      const w = cv.clientWidth;
      if (w && w !== lastW) { lastW = w; paint(); }
    });
    ro.observe(cv);

    let drawing = false, lx = 0, ly = 0, lastCheck = 0;
    const pos = (e: PointerEvent): [number, number] => {
      const r = cv.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    const stroke = (x: number, y: number) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = Math.max(34, cv.clientWidth * 0.13);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(x, y);
      ctx.stroke();
      lx = x; ly = y;
    };
    const check = () => {
      if (doneRef.current) return;
      const { width: w, height: h } = cv;
      const data = ctx.getImageData(0, 0, w, h).data;
      let clear = 0, total = 0;
      const step = 16;
      for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) { total++; if (data[(y * w + x) * 4 + 3] < 40) clear++; }
      if (clear / total > 0.5) finish();
    };
    const down = (e: PointerEvent) => {
      if (doneRef.current) return;
      drawing = true;
      cv.setPointerCapture(e.pointerId);
      [lx, ly] = pos(e);
      stroke(lx + 0.01, ly);
    };
    const move = (e: PointerEvent) => {
      if (!drawing) return;
      const [x, y] = pos(e);
      stroke(x, y);
      const now = performance.now();
      if (now - lastCheck > 350) { lastCheck = now; check(); }
    };
    const up = () => {
      if (!drawing) return;
      drawing = false;
      check();
    };
    cv.addEventListener('pointerdown', down);
    cv.addEventListener('pointermove', move);
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', up);
    return () => {
      ro.disconnect();
      cv.removeEventListener('pointerdown', down);
      cv.removeEventListener('pointermove', move);
      cv.removeEventListener('pointerup', up);
      cv.removeEventListener('pointercancel', up);
    };
  }, [finish, label]);

  return (
    <figure className={`scratch ${done ? 'is-done' : ''}`}>
      <div className="scratch__box" ref={box}>
        <img src={src} alt="" loading="lazy" decoding="async" draggable={false} />
        <figcaption className="scratch__text">{text}</figcaption>
        <canvas ref={canvas} className="scratch__foil" aria-hidden="true" />
      </div>
      <button className="scratch__skip" onClick={finish} hidden={done}>{c.skip}</button>
    </figure>
  );
}

export default function ScratchCards() {
  const all = useMemo(() => getGalleryPhotos(), []);
  const cards = useMemo(() => {
    const portraits = all.filter((p) => p.orientation === 'portrait');
    const pool = portraits.length >= 3 ? portraits : all;
    return scratchCards.map((cd, i) => ({
      ...cd,
      src: cd.photo || pool[Math.floor(((i + 1) * pool.length) / (scratchCards.length + 1))].src,
    }));
  }, [all]);

  return (
    <section id="scratch" className="sec sec--scratch">
      <Particles count={12} />
      <div className="sec__in">
        <header className="sec__head">
          <p className="sec__eyebrow">{c.eyebrow}</p>
          <h2 className="sec__title">{c.title}</h2>
          <p className="scratch__hint">{c.hint}</p>
        </header>
        <div className="scratch__grid">
          {cards.map((cd, i) => (
            <ScratchCard key={i} src={cd.src} text={cd.text} label={cd.label} />
          ))}
        </div>
      </div>
    </section>
  );
}