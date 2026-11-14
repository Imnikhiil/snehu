import { useEffect, useState } from 'react';

interface Props {
  onReady: () => void;
}

/** Animated "S" loader. Waits for fonts + a minimum time, then fades out and reveals the hero. */
export default function LoadingScreen({ onReady }: Props) {
  const [hide, setHide] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let alive = true;
    const minTime = new Promise((r) => setTimeout(r, 1600));
    const fonts = document.fonts?.ready ?? Promise.resolve();
    Promise.race([Promise.all([minTime, fonts]), new Promise((r) => setTimeout(r, 4000))]).then(() => {
      if (!alive) return;
      setHide(true);
      onReady();
      setTimeout(() => alive && setGone(true), 900);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;
  return (
    <div className={`loader ${hide ? 'is-hide' : ''}`} role="status" aria-label="Loading">
      <div className="loader__mark">
        <svg className="loader__ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="46" />
        </svg>
        <span className="loader__s">S</span>
      </div>
    </div>
  );
}