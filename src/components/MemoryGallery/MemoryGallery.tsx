import { useMemo, useState } from 'react';
import Lightbox from '../Lightbox/Lightbox';
import { useInView } from '../../hooks/useInView';
import { CATEGORIES, type Photo } from '../../data/photos';
import { getGalleryPhotos } from '../../data/gallery';
import { galleryCopy } from '../../data/sections';
import { cssVars } from '../../utils/cssVars';

type Filter = 'All' | (typeof CATEGORIES)[number];
const ROT = [-2, 1.5, -1, 2.5, -1.5, 2, -2.5, 1];
const RATIO = { portrait: '4 / 5', landscape: '3 / 2', square: '1 / 1' } as const;

interface TileProps {
  photo: Photo;
  i: number;
  onOpen: () => void;
  className?: string;
  polaroid?: boolean;
}

function Tile({ photo, i, onOpen, className = '', polaroid }: TileProps) {
  const [ref, inView] = useInView<HTMLButtonElement>(0.12);
  return (
    <button
      ref={ref}
      className={`tile ${polaroid ? 'tile--polaroid' : ''} ${inView ? 'is-in' : ''} ${className}`}
      style={{ ...cssVars({ '--r': `${ROT[i % ROT.length]}deg`, '--i': i, '--j': i % 5 }), aspectRatio: polaroid ? undefined : RATIO[photo.orientation] }}
      onClick={onOpen}
      aria-label={photo.caption ? `Open photo: ${photo.caption}` : 'Open photo'}
    >
      <span className="tile__img">
        <img src={photo.src} alt={photo.caption || ''} loading="lazy" decoding="async" draggable={false} />
      </span>
      {photo.caption && <span className="tile__cap">{photo.caption}</span>}
    </button>
  );
}

// How many photos each layout block takes in the "All" view (the rest go to the masonry).
const SIZES = [3, 4, 6, 1];

export default function MemoryGallery() {
  const all = useMemo(() => getGalleryPhotos(), []);
  const [filter, setFilter] = useState<Filter>('All');
  const [lb, setLb] = useState<number | null>(null);

  const visible = useMemo(() => (filter === 'All' ? all : all.filter((p) => p.category === filter)), [all, filter]);

  const blocks = useMemo(() => {
    let at = 0;
    const out = SIZES.map((s) => {
      const start = at;
      at += s;
      return { start, items: visible.slice(start, start + s) };
    });
    out.push({ start: at, items: visible.slice(at) });
    return out;
  }, [visible]);
  const [editorial, polaroids, strip, showcase, rest] = blocks;

  const tiles = (b: { start: number; items: Photo[] }, extra?: (j: number) => string, polaroid = false) =>
    b.items.map((p, j) => (
      <Tile key={b.start + j} photo={p} i={b.start + j} className={extra ? extra(j) : ''} polaroid={polaroid} onOpen={() => setLb(b.start + j)} />
    ));

  const pick = (f: Filter) => {
    setFilter(f);
    setLb(null);
  };

  return (
    <section id="memories" className="sec sec--gallery">
      <div className="sec__in">
        <header className="sec__head">
          <p className="sec__eyebrow">{galleryCopy.eyebrow}</p>
          <h2 className="sec__title">{galleryCopy.title}</h2>
        </header>

        <div className="g-filters" role="group" aria-label="Filter photos by category">
          {(['All', ...CATEGORIES] as Filter[]).map((f) => (
            <button key={f} className="chip" aria-pressed={filter === f} onClick={() => pick(f)}>
              {f === 'All' ? galleryCopy.all : f}
            </button>
          ))}
        </div>

        <div className="g-body" key={filter}>
          {visible.length === 0 && <p className="g-empty">{galleryCopy.empty}</p>}

          {filter === 'All' ? (
            <>
              {editorial.items.length > 0 && <div className="g-editorial">{tiles(editorial, (j) => `ed-${j}`)}</div>}
              {polaroids.items.length > 0 && <div className="g-polaroids">{tiles(polaroids, undefined, true)}</div>}
              {strip.items.length > 0 && (
                <div className="g-strip" tabIndex={0} aria-label="Photo strip, scroll sideways">
                  {tiles(strip)}
                </div>
              )}
              {showcase.items.length > 0 && (
                <button className="g-showcase" onClick={() => setLb(showcase.start)} aria-label="Open photo">
                  <img src={showcase.items[0].src} alt={showcase.items[0].caption || ''} loading="lazy" decoding="async" />
                  {showcase.items[0].caption && <span>{showcase.items[0].caption}</span>}
                </button>
              )}
              {rest.items.length > 0 && <div className="g-masonry">{tiles(rest)}</div>}
            </>
          ) : (
            <div className="g-masonry">{visible.map((p, j) => <Tile key={j} photo={p} i={j} onOpen={() => setLb(j)} />)}</div>
          )}
        </div>
      </div>

      <Lightbox photos={visible} index={lb} onClose={() => setLb(null)} onChange={setLb} />
    </section>
  );
}