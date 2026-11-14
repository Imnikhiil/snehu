import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Photo } from '../../data/photos';

interface Props {
  photos: Photo[];
  index: number | null;
  onClose: () => void;
  onChange: (i: number) => void;
}

export default function Lightbox({ photos, index, onClose, onChange }: Props) {
  const open = index !== null;
  const touchX = useRef<number | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const n = photos.length;

  const go = (d: number) => {
    if (index === null) return;
    onChange((index + d + n) % n);
  };

  // Remember what was focused before opening, and give focus back on close.
  useEffect(() => {
    if (open) lastFocus.current = document.activeElement as HTMLElement | null;
    else {
      lastFocus.current?.focus?.();
      lastFocus.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab') {
        // keep keyboard focus inside the viewer
        const f = dialog.current?.querySelectorAll<HTMLElement>('button');
        if (!f || !f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index]);

  if (!open) return null;
  const p = photos[index!];

  return (
    <div
      ref={dialog}
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
    >
      <button ref={closeBtn} className="lb__btn lb__close" aria-label="Close" onClick={(e) => { e.stopPropagation(); onClose(); }}>
        <X size={20} />
      </button>
      <button className="lb__btn lb__nav lb__nav--prev" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); go(-1); }}>
        <ChevronLeft size={22} />
      </button>
      <button className="lb__btn lb__nav lb__nav--next" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); go(1); }}>
        <ChevronRight size={22} />
      </button>
      <figure className="lb__fig" onClick={(e) => e.stopPropagation()}>
        <img key={index} src={p.src} alt={p.caption || 'Photograph'} draggable={false} />
        <figcaption>
          <span>{p.caption}</span>
          <span className="lb__count">{index! + 1} / {n}</span>
        </figcaption>
      </figure>
    </div>
  );
}