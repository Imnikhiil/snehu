import { useState } from 'react';
import { photos } from '../../data/photos';

/** DEV ONLY helper. Open  http://localhost:5173/?pick  to see every photo with its number,
 *  click your favourites in order, and copy ready-made timeline lines. */
export default function PhotoPicker() {
  const [sel, setSel] = useState<string[]>([]);
  const [copied, setCopied] = useState('');
  const num = (src: string) => src.split('/').pop()!.replace('.webp', '');
  const toggle = (src: string) => setSel((s) => (s.includes(src) ? s.filter((x) => x !== src) : [...s, src]));
  const copy = async (what: string, label: string) => {
    await navigator.clipboard.writeText(what);
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };
  const lines = sel.map((s) => `  { date: '', caption: '', type: 'photo', src: '${s}' },`).join('\n');

  return (
    <div className="picker">
      <h1>Pick your best photos (in order)</h1>
      <p>Click a photo to select / unselect. The number on the photo is its file number.</p>
      <div className="picker__grid">
        {photos.map((p) => {
          const i = sel.indexOf(p.src);
          return (
            <button key={p.src} className={`picker__item ${i >= 0 ? 'is-sel' : ''}`} onClick={() => toggle(p.src)}>
              <img src={p.src} alt="" loading="lazy" />
              <span className="picker__no">{num(p.src)}</span>
              {i >= 0 && <span className="picker__order">{i + 1}</span>}
            </button>
          );
        })}
      </div>
      <div className="picker__bar">
        <span>{sel.length ? sel.map((s) => num(s).replace('photo-', '')).join(', ') : 'Nothing selected yet'}</span>
        <button disabled={!sel.length} onClick={() => copy(lines, 'lines')}>{copied === 'lines' ? 'Copied ✓' : 'Copy timeline lines'}</button>
        <button disabled={!sel.length} onClick={() => copy(sel.map((s) => num(s)).join(', '), 'names')}>{copied === 'names' ? 'Copied ✓' : 'Copy numbers'}</button>
      </div>
    </div>
  );
}