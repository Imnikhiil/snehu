// ─────────────────────────────────────────────────────────────
//  VIDEO DATA — put .mp4 files in public/assets/videos/
//  and a poster image (thumbnail) in public/assets/photos/
// ─────────────────────────────────────────────────────────────

export interface VideoItem {
  src: string;
  poster?: string;
  title: string;
  caption?: string;
}

export const videos: VideoItem[] = [
  { src: '/assets/videos/video-01.mp4', poster: '/assets/photos/video-poster-01.jpg', title: 'Little Moments', caption: '' },
  { src: '/assets/videos/video-02.mp4', poster: '/assets/photos/video-poster-02.jpg', title: 'Moving Memories', caption: '' },
  { src: '/assets/videos/video-03.mp4', poster: '/assets/photos/video-poster-03.jpg', title: 'Good Vibes', caption: '' },
  { src: '/assets/videos/video-04.mp4', poster: '/assets/photos/video-poster-04.jpg', title: 'Just Because', caption: '' },
  { src: '/assets/videos/video-05.mp4', poster: '/assets/photos/video-poster-05.jpg', title: 'Sunny Clip', caption: '' },
  { src: '/assets/videos/video-06.mp4', poster: '/assets/photos/video-poster-06.jpg', title: 'A Happy Moment', caption: '' },
  { src: '/assets/videos/video-07.mp4', poster: '/assets/photos/video-poster-07.jpg', title: 'Caught on Camera', caption: '' },
  { src: '/assets/videos/video-08.mp4', poster: '/assets/photos/video-poster-08.jpg', title: 'Simply Happy', caption: '' },
  { src: '/assets/videos/video-09.mp4', poster: '/assets/photos/video-poster-09.jpg', title: 'A Little Magic', caption: '' },
  { src: '/assets/videos/video-10.mp4', poster: '/assets/photos/video-poster-10.jpg', title: 'Bright Moments', caption: '' },
  { src: '/assets/videos/video-11.mp4', poster: '/assets/photos/video-poster-11.jpg', title: 'Smile On', caption: '' },
  { src: '/assets/videos/video-12.mp4', poster: '/assets/photos/video-poster-12.jpg', title: 'Moments in Motion', caption: '' },
  { src: '/assets/videos/video-13.mp4', poster: '/assets/photos/video-poster-13.jpg', title: 'Feel-Good Clip', caption: '' },
  { src: '/assets/videos/video-14.mp4', poster: '/assets/photos/video-poster-14.jpg', title: 'One More Memory', caption: '' },
  { src: '/assets/videos/video-15.mp4', poster: '/assets/photos/video-poster-15.jpg', title: 'Pure Joy', caption: '' },
  { src: '/assets/videos/video-16.mp4', poster: '/assets/photos/video-poster-16.jpg', title: 'Memory in Motion', caption: '' },
  { src: '/assets/videos/video-17.mp4', poster: '/assets/photos/video-poster-17.jpg', title: 'Good Times', caption: '' },
  { src: '/assets/videos/video-18.mp4', poster: '/assets/photos/video-poster-18.jpg', title: 'Joyful Moments', caption: '' },
  { src: '/assets/videos/video-19.mp4', poster: '/assets/photos/video-poster-19.jpg', title: 'A Moment Worth Keeping', caption: '' },
  { src: '/assets/videos/video-20.mp4', poster: '/assets/photos/video-poster-20.jpg', title: 'Still Smiling', caption: '' },
];