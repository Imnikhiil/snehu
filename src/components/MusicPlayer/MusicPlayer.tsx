import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2 } from 'lucide-react';
import { music } from '../../data/music';
import { cssVars } from '../../utils/cssVars';

/** Floating player. Lives at the app root, so music keeps playing while the visitor scrolls. Never autoplays. */
export default function MusicPlayer() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [vol, setVol] = useState(0.6);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [error, setError] = useState(false);
  const enabled = Boolean(music.src) && !error;

  useEffect(() => {
    if (audio.current) audio.current.volume = vol;
  }, [vol, enabled]);

  // If a video starts playing, pause the music so the two never fight.
  useEffect(() => {
    const onPlay = (e: Event) => {
      if (e.target instanceof HTMLVideoElement) audio.current?.pause();
    };
    document.addEventListener('play', onPlay, true);
    return () => document.removeEventListener('play', onPlay, true);
  }, []);

  const toggle = () => {
    const a = audio.current;
    if (!a || !enabled) return;
    if (a.paused) a.play().catch(() => setError(true));
    else a.pause();
  };

  const label = enabled ? music.title : error ? 'Music file not found' : 'Music coming soon';
  const pct = dur ? (cur / dur) * 100 : 0;

  return (
    <div className={`music ${playing ? 'is-playing' : ''} ${enabled ? '' : 'is-disabled'}`} role="group" aria-label="Music player">
      {enabled && (
        <audio
          ref={audio}
          src={music.src}
          loop
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={() => setCur(audio.current?.currentTime ?? 0)}
          onLoadedMetadata={() => setDur(audio.current?.duration ?? 0)}
          onError={() => setError(true)}
        />
      )}
      <button className="music__btn" onClick={toggle} disabled={!enabled} aria-label={playing ? 'Pause music' : 'Play music'}>
        {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
      </button>
      <span className="eq" aria-hidden="true"><i /><i /><i /><i /></span>
      <span className="music__title">{label}</span>
      <label className="music__vol">
        <Volume2 size={14} aria-hidden="true" />
        <input type="range" min={0} max={1} step={0.05} value={vol} onChange={(e) => setVol(Number(e.target.value))} disabled={!enabled} aria-label="Volume" />
      </label>
      <span className="music__bar" style={cssVars({ '--p': `${pct}%` })} aria-hidden="true" />
    </div>
  );
}