import { useCallback, useEffect, useRef, useState } from 'react';
import { Delete } from 'lucide-react';
import manifest from '../../data/vault.json';
import { vaultCopy as c } from '../../data/vaultCopy';
import Particles from '../Particles/Particles';
import Lightbox from '../Lightbox/Lightbox';
import { b64, decryptBytes, deriveKey } from '../../utils/vaultCrypto';
import { celebrate } from '../../utils/confetti';
import { cssVars } from '../../utils/cssVars';
import type { Photo } from '../../data/photos';

interface Item { type: 'photo' | 'video'; file: string; mime: string; w: number; h: number }
interface Manifest { digits: number; iterations: number; salt: string; check: string; message: string | null; items: Item[] }
interface Opened extends Item { url: string }
type Status = 'locked' | 'checking' | 'wrong' | 'unlocking' | 'open' | 'error' | 'nocrypto';

const M = manifest as unknown as Manifest;
const hasVault = M.digits > 0 && (M.items.length > 0 || !!M.message);

function Padlock({ open, wrong }: { open: boolean; wrong: boolean }) {
  return (
    <svg className={`padlock ${open ? 'is-open' : ''} ${wrong ? 'is-wrong' : ''}`} viewBox="0 0 120 140" aria-hidden="true">
      <defs>
        <linearGradient id="pl-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f0d9a0" /><stop offset="1" stopColor="#b08d4a" /></linearGradient>
      </defs>
      <path className="padlock__shackle" d="M35 64 V44 a25 25 0 0 1 50 0 V64" fill="none" stroke="#d7bb83" strokeWidth="9" strokeLinecap="round" />
      <rect x="18" y="60" width="84" height="68" rx="14" fill="url(#pl-g)" />
      <circle cx="60" cy="90" r="8" fill="#3a2d14" />
      <rect x="56.5" y="92" width="7" height="18" rx="3.5" fill="#3a2d14" />
    </svg>
  );
}

function Vault() {
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState<Status>('locked');
  const [content, setContent] = useState<{ message: string | null; items: Opened[] } | null>(null);
  const [lb, setLb] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLElement>(null);
  const urls = useRef<string[]>([]);
  const timers = useRef<number[]>([]);

  useEffect(() => () => {
    urls.current.forEach((u) => URL.revokeObjectURL(u));
    timers.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const tryUnlock = useCallback(async (code: string) => {
    if (!window.crypto?.subtle) {
      setStatus('nocrypto');
      return;
    }
    setStatus('checking');
    let key: CryptoKey;
    try {
      key = await deriveKey(code, M.salt, M.iterations);
      await decryptBytes(key, b64(M.check)); // throws when the code is wrong
    } catch {
      setStatus('wrong');
      timers.current.push(window.setTimeout(() => { setPin(''); setStatus('locked'); }, 900));
      return;
    }
    try {
      const message = M.message ? new TextDecoder().decode(await decryptBytes(key, b64(M.message))) : null;
      const items = await Promise.all(
        M.items.map(async (it) => {
          const enc = await (await fetch(it.file)).arrayBuffer();
          const url = URL.createObjectURL(new Blob([await decryptBytes(key, enc)], { type: it.mime }));
          urls.current.push(url);
          return { ...it, url };
        }),
      );
      setContent({ message, items });
      setStatus('unlocking');
      celebrate();
      timers.current.push(window.setTimeout(() => setStatus('open'), 1300));
    } catch {
      setStatus('error');
    }
  }, []);

  const press = useCallback((d: string) => setPin((p) => (p.length < M.digits ? p + d : p)), []);
  const back = useCallback(() => setPin((p) => p.slice(0, -1)), []);

  useEffect(() => {
    if (pin.length === M.digits && status === 'locked') void tryUnlock(pin);
  }, [pin, status, tryUnlock]);

  // typing the code on a real keyboard
  useEffect(() => {
    if (!visible || status !== 'locked') return;
    const onKey = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) press(e.key);
      else if (e.key === 'Backspace') back();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, status, press, back]);

  const text =
    status === 'checking' ? c.checking : status === 'wrong' ? c.wrong : status === 'unlocking' ? c.unlocked :
    status === 'error' ? c.error : status === 'nocrypto' ? c.noCrypto : c.enter(M.digits);

  const photos: Photo[] = (content?.items ?? []).filter((i) => i.type === 'photo').map((i) => ({ src: i.url, caption: '', category: 'Beautiful Moments', orientation: 'portrait' }));
  let photoIdx = -1;

  return (
    <section id="vault" ref={root} className="sec sec--vault">
      <Particles count={14} />
      <div className="sec__in">
        {status !== 'open' || !content ? (
          <>
            <header className="sec__head">
              <p className="sec__eyebrow">{c.eyebrow}</p>
              <h2 className="sec__title">{c.title}</h2>
              <p className="vault__hint">{c.hint}</p>
            </header>
            <div className="vault__lockwrap">
              <Padlock open={status === 'unlocking'} wrong={status === 'wrong'} />
              <div className="vault__dots" aria-hidden="true">
                {Array.from({ length: M.digits }, (_, i) => <span key={i} className={`vault__dot ${i < pin.length ? 'is-on' : ''}`} />)}
              </div>
              <p className={`vault__status ${status === 'wrong' ? 'is-wrong' : ''}`} role="status" aria-live="polite">{text}</p>
              <div className="keypad" role="group" aria-label="Number pad">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
                  <button key={d} className="key" onClick={() => press(d)} disabled={status !== 'locked'}>{d}</button>
                ))}
                <span />
                <button className="key" onClick={() => press('0')} disabled={status !== 'locked'}>0</button>
                <button className="key key--ghost" onClick={back} disabled={status !== 'locked'} aria-label="Delete last digit"><Delete size={22} /></button>
              </div>
            </div>
          </>
        ) : (
          <div className="vault__open">
            <header className="sec__head">
              <h2 className="sec__title">{c.openedTitle}</h2>
              <p className="vault__hint">{c.openedSub}</p>
            </header>
            {content.message && (
              <div className="vault__note">
                {content.message.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
              </div>
            )}
            <div className="vault__grid">
              {content.items.map((it, i) => {
                const style = { ...cssVars({ '--j': i % 6 }), aspectRatio: `${it.w} / ${it.h}` };
                if (it.type === 'video')
                  return <div key={i} className="vtile" style={style}><video src={it.url} controls playsInline preload="metadata" /></div>;
                const idx = ++photoIdx;
                return (
                  <button key={i} className="vtile" style={style} onClick={() => setLb(idx)} aria-label="Open photo">
                    <img src={it.url} alt="" decoding="async" draggable={false} />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <Lightbox photos={photos} index={lb} onClose={() => setLb(null)} onChange={setLb} />
    </section>
  );
}

export default function SecretVault() {
  if (hasVault) return <Vault />;
  if (import.meta.env.DEV)
    return (
      <section id="vault" className="sec sec--vault">
        <div className="sec__in vault__dev">
          <p>🔒 Secret vault is empty (only you see this note while developing).</p>
          <p>Put secret photos/videos in <code>raw-vault</code> and run <code>npm run vault -- 1711</code></p>
        </div>
      </section>
    );
  return null;
}