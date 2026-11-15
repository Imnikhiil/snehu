import { useRef, useState } from 'react';
import Particles from '../Particles/Particles';
import { gift } from '../../data/messages';
import { burstAt } from '../../utils/confetti';

export default function SurpriseGift() {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLButtonElement>(null);

  const openBox = () => {
    if (open) return;
    setOpen(true);
    setTimeout(() => burstAt(box.current), 450);
  };

  const keepShining = () => {
    burstAt(null);
    document.getElementById('celebrate')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="gift" data-label="Surprise" className="sec sec--gift">
      <Particles count={20} />
      <div className="sec__in gift__in">
        <h2 className="sec__title">{gift.title}</h2>

        <button ref={box} className={`gift ${open ? 'is-open' : ''}`} onClick={openBox} aria-label="Open the gift box" aria-expanded={open}>
          <span className="gift__beam" aria-hidden="true" />
          <span className="gift__lid" aria-hidden="true"><span className="gift__bow" /></span>
          <span className="gift__box" aria-hidden="true" />
        </button>

        {!open && <p className="gift__hint">{gift.hint}</p>}

        <div className={`gift__reveal ${open ? 'is-in' : ''}`} aria-hidden={!open}>
          <p className="gift__msg">{gift.message}</p>
          <button className="btn btn--glow" onClick={keepShining} tabIndex={open ? 0 : -1}>{gift.button}</button>
        </div>
      </div>
    </section>
  );
}