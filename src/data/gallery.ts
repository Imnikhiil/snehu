import { photos, makePlaceholder, CATEGORIES, type Orientation, type Photo } from './photos';

const ORI: Orientation[] = ['portrait', 'landscape', 'portrait', 'square', 'portrait', 'portrait', 'landscape', 'portrait', 'square'];

/** Real photos from photos.ts, or 18 labelled placeholders until you add some. */
export function getGalleryPhotos(): Photo[] {
  if (photos.length) return photos;
  return Array.from({ length: 18 }, (_, i) => ({
    ...makePlaceholder(i, ORI[i % ORI.length]),
    category: CATEGORIES[i % CATEGORIES.length],
  }));
}