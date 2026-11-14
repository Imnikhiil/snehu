import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import Particles from '../Particles/Particles';
import { cake } from '../../data/messages';
import { celebrate } from '../../utils/confetti';
import { playBlow } from '../../utils/sound';
import { cssVars } from '../../utils/cssVars';

const CANDLES = [160, 185, 210, 235, 260];
const candleY = (x: number) => 158 + 8 * Math.sqrt(1 - Math.pow((x - 210) / 72, 2));
const edgeY = (cy: number, rx: number, ry: number, x: number) => cy + ry * Math.sqrt(Math.max(0, 1 - Math.pow((x - 210) / rx, 2)));
const SPARKS = [[70, 90], [350, 110], [110, 40], [320, 30], [40, 200], [385, 220]];

function Drips({ cy, rx, ry, from, to, step }: { cy: number; rx: number; ry: number; from: number; to: number; step: number }) {
  const xs: number[] = [];
  for (let x = from; x <= to; x += step) xs.push(x);
  return (
    <g fill="#fff3f7">
      {xs.map((x, i) => (
        <rect key={x} x={x - 8} y={edgeY(cy, rx, ry, x) - 8} width={16} height={16 + (i % 3) * 9} rx={8} />
      ))}
    </g>
  );
}

export default function BirthdayCake() {
  const [lit, setLit] = useState(true);
  const [sound, setSound] = useState(true);
  const timer = useRef<number>();
  useEffect(() => () => clearTimeout(timer.current), []);

  const blow = () => {
    setLit(false);
    if (sound) playBlow();
    timer.current = window.setTimeout(celebrate, 480);
  };
  const again = () => {
    setLit(true);
    celebrate();
  };

  return (
    <section id="cake" className="sec sec--cake">
      <Particles count={16} />
      <div className="sec__in cake__in">
        <h2 className="sec__title">{cake.title}</h2>

        <div className={`cake__wrap ${lit ? '' : 'is-out'}`}>
          <div className="cake__glow" aria-hidden="true" />
          <svg className="cake" viewBox="0 0 420 440" role="img" aria-label="A birthday cake with candles">
            <defs>
              <linearGradient id="ck-bot" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c97a9c" /><stop offset=".5" stopColor="#F4BFD2" /><stop offset="1" stopColor="#c97a9c" /></linearGradient>
              <linearGradient id="ck-mid" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8d77d8" /><stop offset=".5" stopColor="#C9B8FF" /><stop offset="1" stopColor="#8d77d8" /></linearGradient>
              <linearGradient id="ck-top" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#b29557" /><stop offset=".5" stopColor="#D7BB83" /><stop offset="1" stopColor="#b29557" /></linearGradient>
              <linearGradient id="ck-plate" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2d36" /><stop offset="1" stopColor="#14161b" /></linearGradient>
              <linearGradient id="ck-candle" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#e9dfd0" /><stop offset=".5" stopColor="#fffaf0" /><stop offset="1" stopColor="#d6c9b6" /></linearGradient>
              <linearGradient id="ck-flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#ffd36b" /><stop offset="1" stopColor="#ff8a3d" /></linearGradient>
              <radialGradient id="ck-glow"><stop offset="0" stopColor="#ffcf7a" stopOpacity=".55" /><stop offset="1" stopColor="#ffcf7a" stopOpacity="0" /></radialGradient>
            </defs>

            {/* plate */}
            <ellipse cx="210" cy="396" rx="190" ry="34" fill="url(#ck-plate)" stroke="#D7BB83" strokeOpacity=".45" />

            {/* bottom tier */}
            <path d="M50 300 V390 A160 34 0 0 0 370 390 V300 Z" fill="url(#ck-bot)" />
            <ellipse cx="210" cy="300" rx="160" ry="34" fill="#fff3f7" />
            <Drips cy={300} rx={160} ry={34} from={72} to={350} step={26} />

            {/* middle tier */}
            <path d="M95 225 V300 A115 25 0 0 0 325 300 V225 Z" fill="url(#ck-mid)" />
            <ellipse cx="210" cy="225" rx="115" ry="25" fill="#f6f1ff" />
            <Drips cy={225} rx={115} ry={25} from={108} to={312} step={24} />

            {/* top tier */}
            <path d="M138 160 V225 A72 17 0 0 0 282 225 V160 Z" fill="url(#ck-top)" />
            <ellipse cx="210" cy="160" rx="72" ry="17" fill="#fff8ea" />
            <Drips cy={160} rx={72} ry={17} from={150} to={270} step={20} />

            {/* candles */}
            {CANDLES.map((x, i) => {
              const y = candleY(x);
              return (
                <g key={x} transform={`translate(${x} ${y})`}>
                  <rect x="-3.5" y="-46" width="7" height="46" rx="2" fill="url(#ck-candle)" />
                  <rect x="-3.5" y="-34" width="7" height="3" fill="#F4BFD2" opacity=".8" />
                  <rect x="-3.5" y="-22" width="7" height="3" fill="#C9B8FF" opacity=".8" />
                  <line x1="0" y1="-46" x2="0" y2="-50" stroke="#2b2824" strokeWidth="1.4" />
                  <g transform="translate(0 -50)">
                    <g className="flame" style={cssVars({ '--i': i })}>
                      <circle cy="-14" r="20" fill="url(#ck-glow)" />
                      <path d="M0 2 C6 -4 7 -16 0 -30 C-7 -16 -6 -4 0 2Z" fill="url(#ck-flame)" />
                      <ellipse cy="-6" rx="2.2" ry="5" fill="#fff6d6" />
                    </g>
                    <path className="smoke" d="M0 -4 C-6 -14 6 -22 0 -34" fill="none" stroke="#cfd0d8" strokeWidth="2" strokeLinecap="round" style={cssVars({ '--i': i })} />
                  </g>
                </g>
              );
            })}

            {/* sparkles */}
            {SPARKS.map(([x, y], i) => (
              <g key={i} transform={`translate(${x} ${y})`}>
                <path className="spark" d="M0 -9 L2.2 -2.2 L9 0 L2.2 2.2 L0 9 L-2.2 2.2 L-9 0 L-2.2 -2.2Z" style={{ animationDelay: `${-i * 0.7}s` }} />
              </g>
            ))}
          </svg>
        </div>

        <p className={`cake__msg ${lit ? '' : 'is-in'}`} aria-live="polite">{lit ? '' : cake.message}</p>

        <div className="cake__actions">
          {lit ? (
            <button className="btn btn--primary" onClick={blow}>{cake.blow}</button>
          ) : (
            <button className="btn btn--primary" onClick={again}>{cake.again}</button>
          )}
          <button className="cake__sound" onClick={() => setSound((s) => !s)} aria-pressed={sound} aria-label={sound ? 'Turn blow sound off' : 'Turn blow sound on'}>
            {sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </div>
    </section>
  );
}