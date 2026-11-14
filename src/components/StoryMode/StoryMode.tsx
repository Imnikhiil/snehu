import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react';
import Particles from '../Particles/Particles';
import { story as c } from '../../data/story';
import { getGalleryPhotos } from '../../data/gallery';
import type { Photo } from '../../data/photos';
import { celebrate } from '../../utils/confetti';

type Slide = { kind: 'title' } | { kind: 'end' } | { kind: 'photo'; src: string; caption?: string };

/** A "Play Story" poster that opens a full-screen cinematic slideshow (Ken Burns zoom, cross-fades, tap to skip). */
export default function StoryMode() {
  const all = useMemo(() => getGalleryPhotos(), []);
  const photos = useMemo<Photo[]>(() => {
    const list = c.photos.length
      ? c.photos.map((src) => all.find((p) => p.src === src) ?? ({ src, category: 'Beautiful Moments', orientation: 'portrait' } as Photo))
      : all;
    return list.slice(0, c.max);
  }, [all]);

  const slides = useMemo<Slide[]>(
    () => [{ kind: 'title' }, ...photos.map((p) => ({ kind: 'photo' as const, src: p.src, caption: p.placeholder ? '' : p.caption })), { kind: 'end' }],
    [photos],
  );
  const last = slides.length - 1;
  const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [playing, setPlaying] = useState(true);
  const iRef = useRef(0);
  const lastFocus = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const go = useCallback((n: number) => {
    const t = Math.max(0, Math.min(n, last));
    if (t === iRef.current) return;
    setPrev(iRef.current);
    iRef.current = t;
    setI(t);
  }, [last]);
  const next = useCallback(() => go(iRef.current + 1), [go]);
  const back = useCallback(() => go(iRef.current - 1), [go]);

  const start = () => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    iRef.current = 0;
    setI(0);
    setPrev(null);
    setPlaying(!reduce);
    setOpen(true);
    // start the music (this click IS the visitor's own action); does nothing if no music is set up
    document.querySelector<HTMLElement>('.music:not(.is-disabled):not(.is-playing) .music__btn')?.click();
  };
  const close = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus?.();
  }, []);
  const restart = () => {
    setPrev(null);
    iRef.current = 0;
    setI(0);
    setPlaying(!reduce);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') back();
      else if ((e.key === ' ' || e.key === 'k') && !(e.target instanceof HTMLButtonElement) && !reduce) {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close, next, back, reduce]);

  // load the next photos early so the cross-fade is smooth
  useEffect(() => {
    if (!open) return;
    for (let k = 1; k <= 2; k++) {
      const s = slides[i + k];
      if (s && s.kind === 'photo') new Image().src = s.src;
    }
  }, [open, i, slides]);

  // confetti when the story ends
  useEffect(() => {
    if (open && i === last) void celebrate();
  }, [open, i, last]);

  const renderSlide = (idx: number, cur: boolean) => {
    const s = slides[idx];
    return (
      <div key={idx} className={`story__slide ${cur ? 'is-cur' : ''}`} aria-hidden={!cur}>
        {s.kind === 'photo' && (
          <>
            <div className="story__bg" style={{ backgroundImage: `url("${s.src}")` }} />
            <img className={`story__img kb${idx % 4}`} style={{ animationDuration: `${c.seconds + 1.6}s` }} src={s.src} alt={s.caption || ''} draggable={false} />
          </>
        )}
        {s.kind === 'title' && (
          <div className="story__card">
            <Particles count={18} />
            <p className="story__small">{c.titleCard.small}</p>
            <h2 className="story__big">{c.titleCard.big}</h2>
            <p className="story__sub">{c.titleCard.sub}</p>
          </div>
        )}
        {s.kind === 'end' && (
          <div className="story__card story__card--end">
            <Particles count={24} />
            <h2 className="story__big">{c.endCard.big}</h2>
            <p className="story__sub">{c.endCard.sub}</p>
            <p className="story__sign">{c.endCard.sign}</p>
            <div className="story__actions">
              <button className="btn btn--primary" onClick={restart}>{c.endCard.replay}</button>
              <button className="btn btn--ghost" onClick={close}>{c.endCard.close}</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const cur = slides[i];
  const photoCount = slides.length - 2;
  const posters = useMemo(() => {
    const n = Math.min(3, photos.length);
    return Array.from({ length: n }, (_, k) => photos[Math.floor((k * photos.length) / n)]);
  }, [photos]);

  return (
    <section id="story" data-label="Our Story" className="sec sec--story">
      <Particles count={12} />
      <div className="sec__in">
        <header className="sec__head">
          <p className="sec__eyebrow">{c.eyebrow}</p>
          <h2 className="sec__title">{c.title}</h2>
          <p className="story__hint">{c.hint}</p>
        </header>

        <button className="story__poster" onClick={start} aria-label={`${c.cta}. ${c.moments(photoCount)}`} style={{ gridTemplateColumns: `repeat(${Math.max(1, posters.length)}, 1fr)` }}>
          {posters.map((p, k) => <img key={k} src={p.src} alt="" loading="lazy" decoding="async" draggable={false} />)}
          <span className="story__play" aria-hidden="true"><Play size={34} fill="currentColor" /></span>
          <span className="story__cta" aria-hidden="true">{c.cta} · {c.moments(photoCount)}</span>
        </button>
      </div>

      {open && (
        <div className={`story ${playing ? '' : 'is-paused'}`} role="dialog" aria-modal="true" aria-label={c.title}>
          {prev !== null && prev !== i && renderSlide(prev, false)}
          {renderSlide(i, true)}

          {/* silent timer for the opening card */}
          {i === 0 && !reduce && <span key="t" className="story__timer" onAnimationEnd={next} />}

          {i < last && (
            <>
              <button className="story__tap story__tap--prev" onClick={back} aria-label={c.labels.prev}><ChevronLeft size={34} /></button>
              <button className="story__tap story__tap--next" onClick={next} aria-label={c.labels.next}><ChevronRight size={34} /></button>
            </>
          )}

          <div className="story__top">
            <div className="story__segs" aria-hidden="true">
              {Array.from({ length: photoCount }, (_, s) => {
                const state = i > s + 1 || (i === s + 1 && reduce) ? 'is-done' : i === s + 1 ? 'is-active' : '';
                return (
                  <span key={s} className={`story__seg ${state}`}>
                    {state === 'is-active' ? (
                      <span key={i} className="story__fill" style={{ animationDuration: `${c.seconds}s` }} onAnimationEnd={next} />
                    ) : (
                      <span className="story__fill" />
                    )}
                  </span>
                );
              })}
            </div>
            <div className="story__row">
              <span className="story__count">{cur.kind === 'photo' ? `${i} / ${photoCount}` : ''}</span>
              <div className="story__btns">
                {!reduce && i < last && (
                  <button className="story__btn" onClick={() => setPlaying((p) => !p)} aria-label={playing ? c.labels.pause : c.labels.play}>
                    {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                  </button>
                )}
                <button ref={closeBtn} className="story__btn" onClick={close} aria-label={c.labels.close}><X size={20} /></button>
              </div>
            </div>
          </div>

          {cur.kind === 'photo' && cur.caption && (
            <div className="story__bottom"><p className="story__caption">{cur.caption}</p></div>
          )}
        </div>
      )}
    </section>
  );
}