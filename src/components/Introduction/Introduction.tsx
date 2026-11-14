import { useEffect, useState } from 'react';
import Particles from '../Particles/Particles';
import { useInView } from '../../hooks/useInView';
import { intro } from '../../data/sections';
import { cssVars } from '../../utils/cssVars';

const pad = (n: number, l = 2) => String(n).padStart(l, '0');

function useCountUp(active: boolean, to: number, ms: number) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - t0) / ms, 1);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, to, ms]);
  return v;
}

export default function Introduction() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const d = useCountUp(inView, 17, 1600);
  const m = useCountUp(inView, 11, 1600);
  const y = useCountUp(inView, 2026, 2000);
  const rv = (i: number, extra = '') => ({
    className: `rv ${extra} ${inView ? 'is-in' : ''}`,
    style: cssVars({ '--d': `${i * 140}ms` }),
  });

  return (
    <section id="intro" className="sec intro">
      <Particles count={22} />
      <div className="intro__inner" ref={ref}>
        <p {...rv(0, 'sec__eyebrow')}>{intro.eyebrow}</p>
        <h2 {...rv(1, 'sec__title')}>{intro.title}</h2>
        <p {...rv(2, 'intro__text')}>{intro.text}</p>
        <p {...rv(3, 'intro__date')} role="img" aria-label={intro.dateLabel}>
          <span aria-hidden="true">{`${pad(d)}.${pad(m)}.${pad(y, 4)}`}</span>
        </p>
      </div>
    </section>
  );
}