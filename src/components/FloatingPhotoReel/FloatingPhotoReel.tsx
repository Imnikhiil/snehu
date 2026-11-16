import { useEffect, useRef, useState } from 'react';
import type { Photo } from '../../data/photos';
import { cssVars } from '../../utils/cssVars';

type Pt = [number, number];
interface Reel {
  path: [Pt, Pt, Pt, Pt]; // cubic bezier, in viewport fractions
  from: number; // first photo index
  count: number;
  speed: number; // loops per second
  h0: number; // item height at path start (fraction of stage height)
  h1: number; // item height at path end
}

// Desktop: arc from top-left flowing to centre + a smaller strip flowing in from the right.
const DESKTOP: Reel[] = [
  { path: [[-0.04, 0.19], [0.12, 0.12], [0.24, 0.28], [0.34, 0.43]], from: 0, count: 10, speed: 0.024, h0: 0.075, h1: 0.135 },
  { path: [[1.06, 0.47], [0.96, 0.49], [0.88, 0.53], [0.76, 0.56]], from: 10, count: 5, speed: 0.03, h0: 0.1, h1: 0.075 },
];
// Mobile: one curved strip flowing across the top of the stage; the photo collage sits right below it.
// (h0/h1 are fractions of the *stage* height, which on phones is only the top part of the hero.)
const MOBILE: Reel[] = [
  { path: [[-0.1, 0.2], [0.25, 0.03], [0.7, 0.21], [1.1, 0.09]], from: 0, count: 9, speed: 0.028, h0: 0.17, h1: 0.24 },
];

// Mobile collage: l = centre (% of stage width), t = top (% of stage height), h = card height (% of stage height).
const MOBILE_CARDS = [
  { l: 50, t: 28, h: 60, r: -2, z: 4 },
  { l: 21, t: 39, h: 44, r: -7, z: 3 },
  { l: 79, t: 36, h: 46, r: 6, z: 3 },
  { l: 3, t: 64, h: 28, r: 5, z: 1 },
  { l: 97, t: 66, h: 28, r: -5, z: 1 },
] as const;

// Big overlapping floating cards (desktop). l/t = % position, w = width in vw, r = tilt, d = parallax depth (px), z = layer.
const CARDS = [
  { l: 62, t: 7, w: 13, r: 1.5, d: 18, z: 3, o: 'portrait', dim: 1 },
  { l: 47, t: 27, w: 10.5, r: -2, d: 10, z: 2, o: 'portrait', dim: 1 },
  { l: 42, t: 31, w: 12.5, r: -1, d: 26, z: 4, o: 'portrait', dim: 1 },
  { l: 57, t: 33, w: 7, r: 3, d: 8, z: 1, o: 'portrait', dim: 1 },
  { l: 63, t: 52, w: 14, r: -3, d: 30, z: 4, o: 'portrait', dim: 1 },
  { l: 80, t: 40, w: 8.5, r: 2, d: 14, z: 3, o: 'portrait', dim: 1 },
  { l: 21, t: 58, w: 12, r: 2, d: 6, z: 0, o: 'landscape', dim: 0.5 },
] as const;

const ITEM_W = { portrait: 76, landscape: 134, square: 100 } as const;

function useIsMobile() {
  const [m, setM] = useState(() => matchMedia('(max-width: 767px)').matches);
  useEffect(() => {
    const q = matchMedia('(max-width: 767px)');
    const f = () => setM(q.matches);
    q.addEventListener('change', f);
    return () => q.removeEventListener('change', f);
  }, []);
  return m;
}

function bezier(p: Reel['path'], t: number): Pt {
  const u = 1 - t;
  const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  return [
    a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0],
    a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1],
  ];
}

interface LayerProps {
  reel: Reel;
  photos: Photo[];
  base: number;
  onOpen: (i: number) => void;
}

/** One seamless looping strip. Items travel along a bezier curve; they fade in/out at the ends so the loop never "jumps". */
function ReelLayer({ reel, photos, base, onOpen }: LayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const nodes = Array.from(el.children) as HTMLElement[];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, prog = 0, raf = 0, last = performance.now(), visible = true;

    const draw = () => {
      nodes.forEach((node, i) => {
        const s = (prog + i / nodes.length) % 1;
        const [x, y] = bezier(reel.path, s);
        const [x2, y2] = bezier(reel.path, Math.min(s + 0.01, 1));
        const ang = (Math.atan2((y2 - y) * H, (x2 - x) * W) * 180) / Math.PI * 0.25;
        const scale = ((reel.h0 + (reel.h1 - reel.h0) * s) * H) / 100;
        const bw = Number(node.dataset.w);
        const opacity = Math.max(0, Math.min(1, s / 0.1, (1 - s) / 0.1));
        node.style.opacity = opacity.toFixed(3);
        node.style.pointerEvents = opacity > 0.7 ? 'auto' : 'none';
        node.style.transform = `translate3d(${x * W - bw / 2}px, ${y * H - 50}px, 0) rotate(${ang.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      });
    };

    const measure = () => {
      W = el.clientWidth;
      H = el.clientHeight;
      draw();
    };
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (visible && !document.hidden) {
        prog = (prog + dt * reel.speed) % 1;
        draw();
      }
      raf = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    if (!reduce) raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [reel]);

  return (
    <div className="reel" ref={ref}>
      {photos.map((p, i) => (
        <button
          key={i}
          className="reel__item"
          data-w={ITEM_W[p.orientation]}
          style={{ width: ITEM_W[p.orientation] }}
          onClick={() => onOpen(base + i)}
          aria-label={`Open photo ${base + i + 1}`}
          tabIndex={-1}
        >
          <img src={p.src} alt="" loading="lazy" decoding="async" draggable={false} />
        </button>
      ))}
    </div>
  );
}

function Cluster({ photos, base, onOpen }: { photos: Photo[]; base: number; onOpen: (i: number) => void }) {
  return (
    <div className="cluster">
      {CARDS.map((c, i) => {
        const photo = photos[i % photos.length];
        return (
          <div
            key={i}
            className="card"
            style={{
              left: `${c.l}%`,
              top: `${c.t}%`,
              width: `min(${c.w}vw, ${(c.w * 1.7).toFixed(1)}vh)`,
              aspectRatio: c.o === 'portrait' ? '4 / 5' : '3 / 2',
              zIndex: c.z,
              rotate: `${c.r}deg`,
              opacity: c.dim,
              ...cssVars({ '--d': c.d, '--i': i }),
            }}
          >
            <div className="card__float" style={{ animationDuration: `${7 + i * 1.3}s`, animationDelay: `${-i * 1.7}s` }}>
              <button className="card__btn" onClick={() => onOpen(base + i)} aria-label={`Open photo ${base + i + 1}`}>
                <img src={photo.src} alt={photo.caption || 'A photograph'} loading={i < 3 ? 'eager' : 'lazy'} decoding="async" draggable={false} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Overlapping, gently floating photo cards for phones — the mobile twin of the desktop <Cluster>. */
function MobileCluster({ photos, base, onOpen }: { photos: Photo[]; base: number; onOpen: (i: number) => void }) {
  return (
    <div className="cluster cluster--m">
      {MOBILE_CARDS.map((c, i) => {
        const photo = photos[i % photos.length];
        return (
          <div
            key={i}
            className="card mcard"
            style={{
              left: `${c.l}%`,
              top: `${c.t}%`,
              zIndex: c.z,
              rotate: `${c.r}deg`,
              ...cssVars({ '--h': c.h, '--d': 0, '--i': i }),
            }}
          >
            <div className="card__float" style={{ animationDuration: `${6 + i * 1.1}s`, animationDelay: `${-i * 1.6}s` }}>
              <button className="card__btn" onClick={() => onOpen(base + i)} aria-label={`Open photo ${base + i + 1}`}>
                <img src={photo.src} alt={photo.caption || 'A photograph'} loading={i < 3 ? 'eager' : 'lazy'} decoding="async" draggable={false} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface Props {
  photos: Photo[]; // needs at least 22 entries
  onOpen: (i: number) => void;
}

export default function FloatingPhotoReel({ photos, onOpen }: Props) {
  const mobile = useIsMobile();
  const reels = mobile ? MOBILE : DESKTOP;
  return (
    <div className="stage">
      {reels.map((r, i) => (
        <ReelLayer
          key={`${mobile ? 'm' : 'd'}-${i}`}
          reel={r}
          photos={photos.slice(r.from, r.from + r.count)}
          base={r.from}
          onOpen={onOpen}
        />
      ))}
      {mobile ? (
        <MobileCluster photos={photos.slice(15, 20)} base={15} onOpen={onOpen} />
      ) : (
        <Cluster photos={photos.slice(15, 22)} base={15} onOpen={onOpen} />
      )}
    </div>
  );
}