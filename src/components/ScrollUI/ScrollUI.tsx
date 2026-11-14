import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';

// nice names for the side dots; any other section on the page gets a dot automatically
const LABELS: Record<string, string> = {
  home: 'Home', intro: 'Welcome', countdown: 'Countdown', memories: 'Memories', videos: 'Videos', timeline: 'Timeline',
  appreciation: 'Celebrating You', scratch: 'Scratch Cards', letter: 'A Little Note', vault: 'Secret', cake: 'Make A Wish',
  wish: 'Wish Sky', collage: 'Collage', celebrate: 'Celebrate',
};
const nice = (id: string) => LABELS[id] ?? id.charAt(0).toUpperCase() + id.slice(1);

/** Scroll progress bar, section dots (desktop) and back-to-top button. */
export default function ScrollUI() {
  const bar = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);
  const [active, setActive] = useState('home');
  const [sections, setSections] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, p)})`;
      setShowTop(window.scrollY > 800);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('main > section[id]'));
    setSections(els.map((el) => ({ id: el.id, label: el.dataset.label ?? nice(el.id) })));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -45% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // headings, kickers and captions wipe/fade in as they scroll into view
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('.sec__head > *, .vid-kicker, .collage__sub, .gift__hint, .vault__hint'))
      .filter((el) => !el.classList.contains('rv'));
    els.forEach((el, i) => {
      el.classList.add('rvx');
      el.style.setProperty('--rd', `${(i % 3) * 90}ms`);
    });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.2 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (id: string) => {
    if (id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="progress" aria-hidden="true">
        <div ref={bar} className="progress__bar" />
      </div>

      <nav className="dots" aria-label="Page sections">
        {sections.map((s) => (
          <button
            key={s.id}
            className={`dots__btn ${active === s.id ? 'is-active' : ''}`}
            onClick={() => go(s.id)}
            aria-label={s.label}
            aria-current={active === s.id ? 'true' : undefined}
          >
            <span className="dots__label">{s.label}</span>
          </button>
        ))}
      </nav>

      <button className={`totop ${showTop ? 'is-in' : ''}`} onClick={() => go('home')} aria-label="Back to top" tabIndex={showTop ? 0 : -1}>
        <ArrowUp size={18} />
      </button>
    </>
  );
}