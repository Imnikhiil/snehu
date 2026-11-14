import { useRef, useState } from 'react';
import { Film, Maximize, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { videos, type VideoItem } from '../../data/videos';
import { videosCopy } from '../../data/sections';
import { cssVars } from '../../utils/cssVars';

const fmt = (s: number) => {
  if (!isFinite(s)) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

function Player({ video }: { video: VideoItem }) {
  const wrap = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [muted, setMuted] = useState(false);
  const [failed, setFailed] = useState(false);

  const toggle = () => {
    const el = vid.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => setFailed(true));
    else el.pause();
  };

  const fullscreen = () => {
    const w = wrap.current as any;
    const v = vid.current as any;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (w?.requestFullscreen) w.requestFullscreen();
    else if (v?.webkitEnterFullscreen) v.webkitEnterFullscreen(); // iPhone Safari
  };

  const pct = dur ? (cur / dur) * 100 : 0;

  return (
    <div className="player" ref={wrap}>
      <video
        ref={vid}
        src={video.src}
        poster={video.poster}
        preload="none"
        playsInline
        muted={muted}
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={() => setCur(vid.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDur(vid.current?.duration ?? 0)}
        onError={() => setFailed(true)}
      />
      {!playing && !failed && (
        <button className="player__big" onClick={toggle} aria-label="Play video">
          <Play size={28} fill="currentColor" />
        </button>
      )}
      {failed && <p className="player__err">This video could not be loaded. Check its path in src/data/videos.ts.</p>}
      <div className="player__bar">
        <button onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
        </button>
        <input
          type="range"
          min={0}
          max={1000}
          value={dur ? Math.round((cur / dur) * 1000) : 0}
          style={cssVars({ '--p': `${pct}%` })}
          aria-label="Seek"
          onChange={(e) => {
            if (vid.current && dur) vid.current.currentTime = (Number(e.target.value) / 1000) * dur;
          }}
        />
        <span className="player__time">{fmt(cur)} / {fmt(dur)}</span>
        <button onClick={() => setMuted((m) => !m)} aria-label={muted ? 'Unmute' : 'Mute'}>
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <button onClick={fullscreen} aria-label="Full screen">
          <Maximize size={18} />
        </button>
      </div>
    </div>
  );
}

export default function VideoMemories() {
  const [active, setActive] = useState(0);
  const current = videos[active];

  return (
    <section id="videos" className="sec sec--videos">
      <div className="sec__in">
        <header className="sec__head">
          <h2 className="sec__title">{videosCopy.title}</h2>
        </header>

        {current ? (
          <div className="vid-layout">
            <div className="vid-main">
              <p className="vid-kicker">{videosCopy.featured}</p>
              <Player key={current.src} video={current} />
              <div className="vid-meta">
                <h3>{current.title}</h3>
                {current.caption && <p>{current.caption}</p>}
              </div>
            </div>
            {videos.length > 1 && (
              <ul className="vid-list" aria-label="More videos">
                {videos.map((v, i) => (
                  <li key={v.src}>
                    <button className={`vcard ${i === active ? 'is-active' : ''}`} onClick={() => setActive(i)} aria-label={`Play ${v.title}`}>
                      <span className="vcard__thumb">
                        {v.poster ? <img src={v.poster} alt="" loading="lazy" decoding="async" /> : <span className="vcard__blank" />}
                        <span className="vcard__play"><Play size={16} fill="currentColor" /></span>
                      </span>
                      <span className="vcard__title">{v.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="vid-empty">
            <Film size={34} strokeWidth={1.2} />
            <p>{videosCopy.empty}</p>
          </div>
        )}
      </div>
    </section>
  );
}