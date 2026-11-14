import { useRef, useState, type FormEvent } from 'react';
import Particles from '../Particles/Particles';
import { wish as c } from '../../data/premium';
import { useInView } from '../../hooks/useInView';
import { burstAt } from '../../utils/confetti';
import { cssVars } from '../../utils/cssVars';

interface Wish { id: number; text: string; x: number; y: number; size: number }

const KEY = 'sneha-wishes';
const MAX = 12;

function load(): Wish[] {
  try {
    const v: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(v) ? (v as Wish[]).slice(-MAX) : [];
  } catch {
    return [];
  }
}
function save(w: Wish[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(w));
  } catch {
    /* private mode: wishes just won't be remembered */
  }
}

/** She types a wish, it rises into a night sky as a glowing star. Wishes are kept only on her own device. */
export default function WishJar() {
  const [ref, inView] = useInView<HTMLDivElement>(0.2);
  const [wishes, setWishes] = useState<Wish[]>(load);
  const [text, setText] = useState('');
  const [active, setActive] = useState<number | null>(null);
  const btn = useRef<HTMLButtonElement>(null);

  const send = (e: FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    const w: Wish = { id: Date.now(), text: t, x: 8 + Math.random() * 84, y: 10 + Math.random() * 60, size: 16 + Math.random() * 14 };
    const next = [...wishes, w].slice(-MAX);
    setWishes(next);
    save(next);
    setActive(w.id);
    setText('');
    void burstAt(btn.current);
  };

  const current = wishes.find((w) => w.id === active);

  return (
    <section id="wish" className="sec sec--wish">
      <Particles count={14} />
      <div className="sec__in">
        <div ref={ref} className={`rv ${inView ? 'is-in' : ''}`}>
          <header className="sec__head">
            <p className="sec__eyebrow">{c.eyebrow}</p>
            <h2 className="sec__title">{c.title}</h2>
            <p className="wish__hint">{c.hint}</p>
          </header>

          <div className="wish__sky">
            {wishes.map((w) => (
              <button
                key={w.id}
                className={`wish__star ${w.id === active ? 'is-active' : ''}`}
                style={{ left: `${w.x}%`, top: `${w.y}%`, ...cssVars({ '--s': `${w.size}px`, '--f': `${w.id % 7}s` }) }}
                onClick={() => setActive(w.id)}
                aria-label={`${c.starLabel} ${w.text}`}
              >
                <svg viewBox="-10 -10 20 20" aria-hidden="true">
                  <path d="M0 -9 L2.4 -2.4 L9 0 L2.4 2.4 L0 9 L-2.4 2.4 L-9 0 L-2.4 -2.4Z" fill="currentColor" />
                </svg>
              </button>
            ))}
            {!wishes.length && <p className="wish__empty">{c.empty}</p>}
          </div>

          <p className="wish__read" aria-live="polite">{current ? current.text : ''}</p>

          <form className="wish__form" onSubmit={send}>
            <input
              className="wish__input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={c.placeholder}
              maxLength={90}
              aria-label={c.placeholder}
            />
            <button ref={btn} className="btn btn--primary" type="submit">{c.button}</button>
          </form>
          <p className="wish__note">{c.note}</p>
        </div>
      </div>
    </section>
  );
}