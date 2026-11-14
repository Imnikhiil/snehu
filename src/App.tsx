import { lazy, Suspense, useMemo, useState } from 'react';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Introduction from './components/Introduction/Introduction';
import Countdown from './components/Countdown/Countdown';
import MemoryGallery from './components/MemoryGallery/MemoryGallery';
import VideoMemories from './components/VideoMemories/VideoMemories';
import MemoryTimeline from './components/MemoryTimeline/MemoryTimeline';
import AppreciationCards from './components/AppreciationCards/AppreciationCards';
import ScratchCards from './components/ScratchCards/ScratchCards';
import Marquee from './components/Marquee/Marquee';
import BirthdayLetter from './components/BirthdayLetter/BirthdayLetter';
import OpenWhen from './components/OpenWhen/OpenWhen';
import SecretVault from './components/SecretVault/SecretVault';
import BirthdayCake from './components/BirthdayCake/BirthdayCake';
import WishJar from './components/WishJar/WishJar';
import PhotoCollage from './components/PhotoCollage/PhotoCollage';
import FinalCelebration from './components/FinalCelebration/FinalCelebration';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import ScrollUI from './components/ScrollUI/ScrollUI';
import CursorGlow from './components/CursorGlow/CursorGlow';
import Petals from './components/Petals/Petals';
import Lightbox from './components/Lightbox/Lightbox';
import { getHeroPhotos } from './data/photos';

// developer-only helper: http://localhost:5173/?pick  (never loaded on the real site)
const PhotoPicker = lazy(() => import('./components/PhotoPicker/PhotoPicker'));

export default function App() {
  const [ready, setReady] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const heroPhotos = useMemo(() => getHeroPhotos(24), []);

  if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('pick')) {
    return (
      <Suspense fallback={null}>
        <PhotoPicker />
      </Suspense>
    );
  }

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <LoadingScreen onReady={() => setReady(true)} />
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero ready={ready} photos={heroPhotos} onOpen={setLightbox} />
        <Introduction />
        <Countdown />
        <MemoryGallery />
        <VideoMemories />
        <MemoryTimeline />
        <AppreciationCards />
        <ScratchCards />
        <Marquee items={['Happy Birthday Sneha', '17 · 11 · 2026', 'Make a wish', 'Keep shining', 'Smile more', 'Beautiful moments']} />
        <BirthdayLetter />
        <OpenWhen />
        <SecretVault />
        <BirthdayCake />
        <WishJar />
        <PhotoCollage />
        <FinalCelebration />
      </main>
      <ScrollUI />
      <Petals />
      <CursorGlow />
      <MusicPlayer />
      <Lightbox
        photos={heroPhotos}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onChange={setLightbox}
      />
    </>
  );
}