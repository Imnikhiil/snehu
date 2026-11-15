import { useEffect, useRef, useState } from 'react';
import { Check, CloudRain, Moon, Smile, Sparkles, Trophy, X, type LucideIcon } from 'lucide-react';
import Particles from '../Particles/Particles';
import { openWhen as c, openWhenCards as cards, type IconKey } from '../../data/openwhen';
import { useInView } from '../../hooks/useInView';
import { burstAt } from '../../utils/confetti';
import { cssVars } from '../../utils/cssVars';

const ICONS: Record<IconKey, LucideIcon> = { smile: Smile, rain: CloudRain, trophy: Trophy, moon: Moon, sparkle: Sparkles };

export default function OpenWhen() {
  const [gridRef, inView] = useInView<HTMLDivElement>(0.01);
  const [opening, setOpening] = useState<number | null>(null); // envelope whose flap is opening
  const [active, setActive] = useState<number | null>(null); // note being read
  const [read, setRead] = useState<Set<number>>(new Set());
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const timer = useRef<number>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const open = (i: number) => {
    if (opening !== null) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    setOpening(i);
    timer.current = window.setTimeout(() => {
      setActive(i);
      if (cards[i].confetti) void burstAt(null);
    }, 650);
  };

  const close = () => {
    if (active !== null) setRead((r) => new Set(r).add(active));
    setActive(null);
    setOpening(null);
    lastFocus.current?.focus?.();
  };

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'Tab') {
        e.preventDefault(); // the close button is the only control in the note
        closeBtn.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const card = active !== null ? cards[active] : null;

  return (
    <section id="openwhen" data-label="Open When" className="sec sec--ow">
      <Particles count={12} />
      <div className="sec__in">
        <header className="sec__head">
          <p className="sec__eyebrow">{c.eyebrow}</p>
          <h2 className="sec__title">{c.title}</h2>
          <p className="ow__hint">{c.hint}</p>
        </header>

        <div ref={gridRef} className={`ow__grid ${inView ? 'is-in' : ''}`}>
          {cards.map((cd, i) => {
            const Icon = ICONS[cd.icon];
            return (
              <button
                key={i}
                className={`ow ${opening === i ? 'is-open' : ''} ${read.has(i) ? 'is-read' : ''}`}
                style={{ ...cssVars({ '--t1': cd.colors[0], '--t2': cd.colors[1], '--i': i }) }}
                onClick={() => open(i)}
                aria-haspopup="dialog"
                aria-label={cd.title}
              >
                <span className="ow__back" />
                <span className="ow__flap" />
                <span className="ow__paper" />
                <span className="ow__front" />
                <span className="ow__seal" aria-hidden="true">{read.has(i) ? <Check size={16} /> : <Icon size={16} />}</span>
                <span className="ow__label">{cd.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {card && (
        <div className="ow__modal" role="dialog" aria-modal="true" aria-label={card.title} onClick={close}>
          <article className="ow__note" onClick={(e) => e.stopPropagation()}>
            <button ref={closeBtn} className="ow__close" onClick={close} aria-label={c.close}><X size={18} /></button>
            <p className="ow__ttl">{card.title}</p>
            {card.photo && <img className="ow__photo" src={card.photo} alt="" loading="lazy" decoding="async" />}
            <div className="ow__msg">
              {card.message.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <p className="ow__sign">{c.signoff}</p>
          </article>
        </div>
      )}
    </section>
  );
}