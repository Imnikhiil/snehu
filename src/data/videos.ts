// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  VIDEO DATA â€” put .mp4 files in public/assets/videos/
//  and a poster image (thumbnail) in public/assets/photos/
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface VideoItem {
  src: string;
  poster?: string;
  title: string;
  caption?: string;
}

export const videos: VideoItem[] = [
  { src: '/assets/videos/video-01.mp4', poster: '/assets/photos/video-poster-01.jpg', title: 'Memory 01', caption: '' },
  { src: '/assets/videos/video-02.mp4', poster: '/assets/photos/video-poster-02.jpg', title: 'Memory 02', caption: '' },
  { src: '/assets/videos/video-03.mp4', poster: '/assets/photos/video-poster-03.jpg', title: 'Memory 03', caption: '' },
  { src: '/assets/videos/video-04.mp4', poster: '/assets/photos/video-poster-04.jpg', title: 'Memory 04', caption: '' },
  { src: '/assets/videos/video-05.mp4', poster: '/assets/photos/video-poster-05.jpg', title: 'Memory 05', caption: '' },
  { src: '/assets/videos/video-06.mp4', poster: '/assets/photos/video-poster-06.jpg', title: 'Memory 06', caption: '' },
  { src: '/assets/videos/video-07.mp4', poster: '/assets/photos/video-poster-07.jpg', title: 'Memory 07', caption: '' },
  { src: '/assets/videos/video-08.mp4', poster: '/assets/photos/video-poster-08.jpg', title: 'Memory 08', caption: '' },
  { src: '/assets/videos/video-09.mp4', poster: '/assets/photos/video-poster-09.jpg', title: 'Memory 09', caption: '' },
  { src: '/assets/videos/video-10.mp4', poster: '/assets/photos/video-poster-10.jpg', title: 'Memory 10', caption: '' },
  { src: '/assets/videos/video-11.mp4', poster: '/assets/photos/video-poster-11.jpg', title: 'Memory 11', caption: '' },
  { src: '/assets/videos/video-12.mp4', poster: '/assets/photos/video-poster-12.jpg', title: 'Memory 12', caption: '' },
  { src: '/assets/videos/video-13.mp4', poster: '/assets/photos/video-poster-13.jpg', title: 'Memory 13', caption: '' },
  { src: '/assets/videos/video-14.mp4', poster: '/assets/photos/video-poster-14.jpg', title: 'Memory 14', caption: '' },
  { src: '/assets/videos/video-15.mp4', poster: '/assets/photos/video-poster-15.jpg', title: 'Memory 15', caption: '' },
  { src: '/assets/videos/video-16.mp4', poster: '/assets/photos/video-poster-16.jpg', title: 'Memory 16', caption: '' },
  { src: '/assets/videos/video-17.mp4', poster: '/assets/photos/video-poster-17.jpg', title: 'Memory 17', caption: '' },
  { src: '/assets/videos/video-18.mp4', poster: '/assets/photos/video-poster-18.jpg', title: 'Memory 18', caption: '' },
  { src: '/assets/videos/video-19.mp4', poster: '/assets/photos/video-poster-19.jpg', title: 'Memory 19', caption: '' },
  { src: '/assets/videos/video-20.mp4', poster: '/assets/photos/video-poster-20.jpg', title: 'Memory 20', caption: '' },
];
