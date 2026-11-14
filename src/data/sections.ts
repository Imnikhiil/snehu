// Editable text for the story sections.

export const intro = {
  eyebrow: 'A LITTLE SOMETHING FOR YOU',
  title: 'Today is all about you, Sneha.',
  text: 'Some days deserve a little extra celebration. And some people deserve a little extra happiness. Today is one of those days.',
  dateLabel: '17 November 2026',
};

export const galleryCopy = {
  eyebrow: 'THE MEMORY GALLERY',
  title: 'Every frame, every story.',
  all: 'All',
  empty: 'No photos in this category yet.',
};

export const videosCopy = {
  title: 'Little Moments, Moving Memories.',
  featured: 'Some moments are too beautiful to stay still.',
  empty: 'Your videos will play here. Add them in src/data/videos.ts.',
};

export const timelineCopy = {
  title: 'A JOURNEY THROUGH LITTLE MOMENTS',
};

export const appreciationCopy = {
  title: 'Things Worth Celebrating About You.',
  hint: 'Tap to reveal',
};

// icon must be one of: smile | kindness | energy | dedication | unique | joy
export const appreciationCards = [
  { icon: 'smile', title: 'Your Beautiful Smile', message: 'A smile like yours quietly brightens a room. Never lose it.' },
  { icon: 'kindness', title: 'Your Kindness', message: 'The way you treat people says so much about you. Kindness like yours is rare, and always remembered.' },
  { icon: 'energy', title: 'Your Positive Energy', message: 'You carry a lightness that lifts the people around you, even on ordinary days.' },
  { icon: 'dedication', title: 'Your Dedication', message: 'Whatever you put your heart into, you give it your best. That effort always shows.' },
  { icon: 'unique', title: 'Your Unique Personality', message: 'There is only one you, and that is exactly what makes you special.' },
  { icon: 'joy', title: 'Your Little Moments of Happiness', message: 'Here is to the small, happy moments. They are the ones that stay with us the longest.' },
] as const;