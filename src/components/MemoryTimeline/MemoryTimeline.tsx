import { useMemo } from 'react';
import { timeline, type TimelineEntry } from '../../data/timeline';
import { makePlaceholder } from '../../data/photos';
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
        <time className="tl__date">{e.date}</time>
        <p>{e.caption}</p>
      </div>
    </li>
  );
}

export default function MemoryTimeline() {
  // Until real entries exist, show clearly-labelled placeholders (no invented dates).
  const entries = useMemo<TimelineEntry[]>(
    () =>
      timeline.length
        ? timeline
        : (['portrait', 'landscape', 'portrait'] as const).map((o, i) => ({
            date: 'Add a real date or occasion',
            caption: 'Placeholder. Add your memory in src/data/timeline.ts',
            type: 'photo' as const,
            src: makePlaceholder(i + 3, o).src,
          })),
    [],
  );

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