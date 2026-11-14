import { useMemo } from 'react';
import { timeline, type TimelineEntry } from '../../data/timeline';
import { getGalleryPhotos } from '../../data/gallery';
import { timelineCopy } from '../../data/sections';
import { useInView } from '../../hooks/useInView';
import { cssVars } from '../../utils/cssVars';

function Entry({ e, i }: { e: TimelineEntry; i: number }) {
  const [ref, inView] = useInView<HTMLLIElement>(0.25);
  return (
    <li ref={ref} className={`tl__item ${i % 2 ? 'is-right' : ''} ${inView ? 'is-in' : ''}`} style={cssVars({ '--r': `${i % 2 ? 1.6 : -1.6}deg` })}>
      <div className="tl__media">
        {e.type === 'video' ? (
          <video src={e.src} poster={e.poster} controls preload="none" playsInline />
        ) : (
          <img src={e.src} alt={e.caption} loading="lazy" decoding="async" draggable={false} />
        )}
      </div>
      <div className="tl__text">
        <time className="tl__date">{e.date || `Moment ${i + 1}`}</time>
        {e.caption && <p>{e.caption}</p>}
      </div>
    </li>
  );
}

export default function MemoryTimeline() {
  // No entries yet? Show a handful of real photos (portrait ones, spread out) instead of empty placeholders. No dates are invented.
  const entries = useMemo<TimelineEntry[]>(() => {
    if (timeline.length) return timeline;
    const all = getGalleryPhotos();
    const portraits = all.filter((p) => p.orientation === 'portrait');
    const pool = portraits.length >= 6 ? portraits : all;
    const n = Math.min(6, pool.length);
    return Array.from({ length: n }, (_, k) => pool[Math.floor((k * pool.length) / n)]).map((p) => ({
      date: '',
      caption: p.placeholder ? 'Placeholder. Add your memory in src/data/timeline.ts' : '',
      type: 'photo' as const,
      src: p.src,
    }));
  }, []);

  return (
    <section id="timeline" className="sec sec--timeline">
      <div className="sec__in">
        <header className="sec__head">
          <h2 className="sec__title sec__title--caps">{timelineCopy.title}</h2>
        </header>
        <ol className="tl">
          {entries.map((e, i) => (
            <Entry key={i} e={e} i={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}