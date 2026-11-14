import { useState } from 'react';
import { Flower2, Fingerprint, Smile, Sparkles, Sun, Target, type LucideIcon } from 'lucide-react';
import { appreciationCards, appreciationCopy } from '../../data/sections';
import Particles from '../Particles/Particles';

const ICONS: Record<(typeof appreciationCards)[number]['icon'], LucideIcon> = {
  smile: Smile,
  kindness: Flower2,
  energy: Sun,
  dedication: Target,
  unique: Fingerprint,
  joy: Sparkles,
};

export default function AppreciationCards() {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  return (
    <section id="appreciation" className="sec sec--appreciation">
      <Particles count={14} />
      <div className="sec__in">
        <header className="sec__head">
          <h2 className="sec__title">{appreciationCopy.title}</h2>
        </header>
        <div className="flip-grid">
          {appreciationCards.map((c, i) => {
            const Icon = ICONS[c.icon];
            const isOpen = open.has(i);
            return (
              <button key={c.title} className={`flip ${isOpen ? 'is-flipped' : ''}`} aria-pressed={isOpen} onClick={() => toggle(i)}>
                <span className="flip__inner">
                  <span className="flip__face flip__front">
                    <span className="flip__icon"><Icon size={24} strokeWidth={1.4} /></span>
                    <span className="flip__title">{c.title}</span>
                    <small>{appreciationCopy.hint}</small>
                  </span>
                  <span className="flip__face flip__back">
                    <span className="flip__msg">{c.message}</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}