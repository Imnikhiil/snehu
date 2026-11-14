import { useEffect, useRef, useState } from 'react';
import Particles from '../Particles/Particles';
import { countdown as c } from '../../data/premium';
import { useInView } from '../../hooks/useInView';
import { celebrate } from '../../utils/confetti';

const TARGET = new Date(c.target).getTime();
const DAY = 86_400_000;
const pad = (n: number) => String(n).padStart(2, '0');

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <div className="cd__unit">
      <div className="cd__num">
        {/* the key makes the digit re-animate every time it changes */}
        <span key={value} className="cd__digit">{value}</span>
      </div>
      <span className="cd__label">{label}</span>
    </div>
  );
}

/** Flip-style countdown to the birthday. Switches to a celebration message on the day itself. */
export default function Countdown() {
  const [ref, inView] = useInView<HTMLDivElement>(0.25);
  const [now, setNow] = useState(() => Date.now());
  const fired = useRef(false);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const left = TARGET - now;
  const phase = left > 0 ? 'before' : now < TARGET + DAY ? 'today' : 'after';

  useEffect(() => {
    if (phase === 'today' && inView && !fired.current) {
      fired.current = true;
      void celebrate();
    }
  }, [phase, inView]);

  const s = Math.max(0, Math.floor(left / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  return (
    <section id="countdown" className="sec sec--countdown">
      <Particles count={12} />
      <div className="sec__in">
        <div ref={ref} className={`rv ${inView ? 'is-in' : ''}`}>
          <header className="sec__head">
            <p className="sec__eyebrow">{c.eyebrow}</p>
            <h2 className="sec__title">{phase === 'before' ? c.title : phase === 'today' ? c.today : c.after}</h2>
          </header>
          {phase === 'before' ? (
            <div className="cd" role="timer" aria-label={`${d} days ${h} hours ${m} minutes ${sec} seconds left`}>
              <Unit value={pad(d)} label={c.labels.days} />
              <Unit value={pad(h)} label={c.labels.hours} />
              <Unit value={pad(m)} label={c.labels.minutes} />
              <Unit value={pad(sec)} label={c.labels.seconds} />
            </div>
          ) : (
            <p className="cd__done">{phase === 'today' ? c.todaySub : c.afterSub}</p>
          )}
        </div>
      </div>
    </section>
  );
}