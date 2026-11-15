import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Particles from '../Particles/Particles';
import { balloonsCopy as c, wishes } from '../../data/balloons';
import { celebrate } from '../../utils/confetti';
import { cssVars } from '../../utils/cssVars';

interface B { id: number; x: number; size: number; dur: number; col: number; sway: number; y: number; popped: boolean }
const COLORS = [['#d9c9ff', '#9f86e8'], ['#f9c6d8', '#e0839f'], ['#f1dba6', '#cfa954'], ['#c3d6f5', '#86a6dd'], ['#ffffff', '#c9c4d8']];
const BITS = Array.from({ length: 10 }, (_, k) => {
  const a = (Math.PI * 2 * k) / 10;
  return { dx: `${(Math.cos(a) * 46).toFixed(0)}px`, dy: `${(Math.sin(a) * 46).toFixed(0)}px` };
});
const shuffle = <T,>(a: T[]) => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};
const isMobile = () => matchMedia('(max-width: 767px)').matches;

export default function Balloons() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = useRef<HTMLElement>(null);
  const idRef = useRef(0);
  const count = useRef(0); // wishes revealed so far
  const order = useMemo(() => shuffle(wishes.map((_, i) => i)), []);

  const make = useCallback((y = 0): B => {
    const mobile = isMobile();
    return {
      id: ++idRef.current,
      x: 6 + Math.random() * 80,
      size: (mobile ? 62 : 72) + Math.random() * (mobile ? 22 : 30),
      dur: 9 + Math.random() * 5,
      col: Math.floor(Math.random() * COLORS.length),
      sway: 8 + Math.random() * 14,
      y,
      popped: false,
    };
  }, []);
  const staticSet = useCallback(() => Array.from({ length: 8 }, (_, i) => ({ ...make(10 + ((i * 37) % 55)), x: 8 + ((i * 11) % 82) })), [make]);

  const [items, setItems] = useState<B[]>(() => (reduce ? staticSet() : []));
  const [found, setFound] = useState(0);
  const [latest, setLatest] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // keep a few balloons floating up while the section is on screen
  useEffect(() => {
    if (reduce || !visible) return;
    const max = isMobile() ? 5 : c.max;
    const t = window.setInterval(() => {
      if (document.hidden) return;
      setItems((l) => (l.filter((b) => !b.popped).length >= max ? l : [...l, make()]));
    }, 1000);
    return () => clearInterval(t);
  }, [visible, reduce, make]);

  const reveal = useCallback(() => {
    if (count.current >= order.length) {
      setLatest(wishes[Math.floor(Math.random() * wishes.length)]); // bonus pops after finishing
    } else {
      setLatest(wishes[order[count.current]]);
      count.current += 1;
      setFound(count.current);
      if (count.current === order.length) window.setTimeout(() => void celebrate(), 500);
    }
    setTick((t) => t + 1);
  }, [order]);

  const remove = (id: number) => setItems((l) => l.filter((b) => b.id !== id));
  const pop = (id: number) => {
    setItems((l) => l.map((b) => (b.id === id ? { ...b, popped: true } : b)));
    window.setTimeout(() => remove(id), 650);
    reveal();
  };
  // for keyboard / screen-reader users: pops the oldest balloon (or just reveals a wish)
  const skip = () => {
    const first = items.find((b) => !b.popped);
    if (first) pop(first.id);
    else reveal();
  };
  const replay = () => {
    count.current = 0;
    setFound(0);
    setLatest(null);
    setItems(reduce ? staticSet() : []);
  };

  const total = wishes.length;
  const done = found >= total;

  return (
    <section id="balloons" ref={root} data-label="Pop A Balloon" className="sec sec--bl">
      <div className="sec__in">
        <header className="sec__head">
          <p className="sec__eyebrow">{c.eyebrow}</p>
          <h2 className="sec__title">{c.title}</h2>
          <p className="bl__hint">{c.hint}</p>
        </header>

        <div className="bl__stage">
          <Particles count={16} />
          {found === 0 && <p className="bl__start" aria-hidden="true">{c.start}</p>}
          {items.map((b) => {
            const col = COLORS[b.col];
            return (
              <button
                key={b.id}
                className={`bl ${b.popped ? 'is-popped' : ''}`}
                style={cssVars({ '--x': `${b.x}%`, '--size': `${b.size}px`, '--dur': `${b.dur}s`, '--c1': col[0], '--c2': col[1], '--sway': `${b.sway}px`, '--y': `${b.y}%` })}
                onPointerDown={(e) => { e.preventDefault(); if (!b.popped) pop(b.id); }}
                onAnimationEnd={(e) => { if (e.animationName === 'blRise') remove(b.id); }}
                aria-label="Pop balloon"
                tabIndex={-1}
              >
                <span className="bl__sway">
                  <span className="bl__body" />
                  <span className="bl__string" />
                  {b.popped && BITS.map((p, k) => <i key={k} className="bl__bit" style={cssVars({ '--dx': p.dx, '--dy': p.dy })} />)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="bl__panel" aria-live="polite">
          {latest ? <p key={tick} className="bl__wish">“{latest}”</p> : <p className="bl__wish bl__wish--idle">{c.start}</p>}
          <div className="bl__dots" aria-hidden="true">
            {Array.from({ length: total }, (_, k) => <span key={k} className={k < found ? 'is-on' : ''} />)}
          </div>
          <p className="bl__count">{c.found(found, total)}</p>
          {done && <p className="bl__done">{c.done}</p>}
        </div>

        <div className="bl__actions">
          {done ? (
            <button className="btn btn--primary" onClick={replay}>{c.replay}</button>
          ) : (
            <button className="btn btn--ghost" onClick={skip}>{c.skip}</button>
          )}
        </div>
      </div>
    </section>
  );
}