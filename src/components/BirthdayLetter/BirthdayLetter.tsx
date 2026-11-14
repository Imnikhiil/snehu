import { useEffect, useRef, useState } from 'react';
import { letter } from '../../data/messages';
import { cssVars } from '../../utils/cssVars';

export default function BirthdayLetter() {
  // 0 = closed envelope, 1 = opening, 2 = letter shown
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const timer = useRef<number>();
  useEffect(() => () => clearTimeout(timer.current), []);

  const open = () => {
    if (stage) return;
    setStage(1);
    timer.current = window.setTimeout(() => setStage(2), 1500);
  };

  const n = letter.lines.length;

  return (
    <section id="letter" className="sec sec--letter">
      <div className="sec__in">
        <header className="sec__head">
          <p className="sec__eyebrow">{letter.eyebrow}</p>
        </header>

        <div className="ltr__stage">
          <div className={`env ${stage >= 1 ? 'is-open' : ''} ${stage === 2 ? 'is-gone' : ''}`} aria-hidden={stage === 2}>
            <div className="env__back" />
            <div className="env__flap" />
            <div className="env__paper" />
            <div className="env__front" />
            <div className="env__seal" aria-hidden="true">S</div>
          </div>

          <article className={`ltr ${stage === 2 ? 'is-in' : ''}`} aria-hidden={stage !== 2} aria-label="A letter for Sneha">
            <p className="ltr__hi">{letter.salutation}</p>
            {letter.lines.map((l, i) => (
              <p key={i} className={`ltr__line ${l.hand ? 'is-hand' : ''}`} style={cssVars({ '--delay': `${0.4 + i * 0.9}s` })}>
                {l.text}
              </p>
            ))}
            <p className="ltr__line ltr__sign is-hand" style={cssVars({ '--delay': `${0.4 + n * 0.9}s` })}>
              {letter.signoff}
            </p>
          </article>
        </div>

        <div className="ltr__cta">
          {stage === 0 && (
            <button className="btn btn--primary" onClick={open}>
              {letter.open}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}