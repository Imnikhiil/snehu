import { useMemo, useState } from 'react';
import Lightbox from '../Lightbox/Lightbox';
import { getGalleryPhotos } from '../../data/gallery';
import { collage } from '../../data/messages';
import { useInView } from '../../hooks/useInView';
import { cssVars } from '../../utils/cssVars';

// l / t / w are % of the collage box, r = tilt, z = layer
const SLOTS = [
  { l: 4, t: 8, w: 20, r: -4, z: 2 },
  { l: 20, t: 38, w: 22, r: 3, z: 3 },
  { l: 38, t: 4, w: 18, r: 2, z: 1 },
  { l: 47, t: 40, w: 17, r: -3, z: 4 },
  { l: 62, t: 10, w: 22, r: -2, z: 2 },
  { l: 74, t: 42, w: 19, r: 4, z: 3 },
  { l: 84, t: 5, w: 13, r: -5, z: 1 },
];
const RATIO = { portrait: '4 / 5', landscape: '3 / 2', square: '1 / 1' } as const;

export default function PhotoCollage() {
  const all = useMemo(() => getGalleryPhotos(), []);
  const picks = useMemo(() => {
    const n = Math.min(SLOTS.length, all.length);
    return Array.from({ length: n }, (_, i) => all[Math.floor((i * all.length) / n)]);
  }, [all]);
  const [ref, inView] = useInView<HTMLDivElement>(0.2);
  const [lb, setLb] = useState<number | null>(null);

  return (
    <section id="collage" className="sec sec--collage">
      <div className="sec__in">
        <header className="sec__head">
          <h2 className="sec__title sec__title--caps">{collage.title}</h2>
          <p className="collage__sub">{collage.sub}</p>
        </header>
        <div ref={ref} className={`col ${inView ? 'is-in' : ''}`}>
          {picks.map((p, i) => {
            const s = SLOTS[i];
            return (
              <button
                key={i}
                className="col__item"
                style={{ ...cssVars({ '--l': `${s.l}%`, '--t': `${s.t}%`, '--w': `${s.w}%`, '--r': `${s.r}deg`, '--i': i }), zIndex: s.z, aspectRatio: RATIO[p.orientation] }}
                onClick={() => setLb(i)}
                aria-label={p.caption ? `Open photo: ${p.caption}` : 'Open photo'}
              >
                <img src={p.src} alt={p.caption || ''} loading="lazy" decoding="async" draggable={false} />
              </button>
            );
          })}
        </div>
      </div>
      <Lightbox photos={picks} index={lb} onClose={() => setLb(null)} onChange={setLb} />
    </section>
  );
}