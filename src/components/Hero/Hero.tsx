import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import FloatingPhotoReel from '../FloatingPhotoReel/FloatingPhotoReel';
import { useParallax } from '../../hooks/useParallax';
import { hero } from '../../data/content';
import type { Photo } from '../../data/photos';

interface Props {
  ready: boolean;
  photos: Photo[];
  onOpen: (i: number) => void;
}

/** Wireframe "perspective sphere" behind the photos (like the Motion reference). */
function WireSphere() {
  const meridians = [0.2, 0.4, 0.6, 0.8, 0.95];
  const parallels = [0.2, 0.4, 0.6, 0.8];
  return (
    <svg className="hero__wire" viewBox="-500 -500 1000 1000" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <circle r="480" />
      <circle r="330" />
      {meridians.map((k) => <ellipse key={`m${k}`} rx={480 * k} ry="480" />)}
      {parallels.map((k) => <ellipse key={`p${k}`} rx="480" ry={480 * k} />)}
    </svg>
  );
}

export default function Hero({ ready, photos, onOpen }: Props) {
  const root = useRef<HTMLElement>(null);
  useParallax(root);

  // One orchestrated entrance when the loader finishes.
  useLayoutEffect(() => {
    if (!ready || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .from('.hero__eyebrow', { opacity: 0, x: -20, duration: 0.9 })
        .from('.hero__line > span', { yPercent: 115, duration: 1.2, stagger: 0.12 }, '-=0.6')
        .from('.hero__sub, .hero__cta, .hero__badge, .hero__scroll', { opacity: 0, y: 24, duration: 1, stagger: 0.1 }, '-=0.7');
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section id="home" ref={root} className={`hero ${ready ? 'is-ready' : ''}`}>
      <div className="hero__grid" aria-hidden="true" />
      <WireSphere />
      <FloatingPhotoReel photos={photos} onOpen={onOpen} />
      <div className="hero__scrim" aria-hidden="true" />

      <div className="hero__content">
        <p className="hero__eyebrow">
          <i aria-hidden="true" />
          {hero.eyebrow}
        </p>
        <h1 className="hero__title">
          {hero.lines.map((l, i) => (
            <span key={l} className={`hero__line ${i === hero.lines.length - 1 ? 'is-italic' : ''}`}>
              <span>{l}</span>
            </span>
          ))}
        </h1>
        <p className="hero__sub">{hero.sub}</p>
        <div className="hero__cta">
          <a className="btn btn--primary" href={hero.primaryHref}>{hero.primary}</a>
          <a className="btn btn--ghost" href={hero.secondaryHref}>{hero.secondary}</a>
        </div>
      </div>

      <p className="hero__scroll">{hero.scroll}</p>
      <p className="hero__badge">{hero.badge}</p>
    </section>
  );
}