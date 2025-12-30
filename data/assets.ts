
export const categories = ["All", "Humans", "Realistic", "Anime", "Cyberpunk", "Nature"];

export const musicCategories = ["All", "Classical", "Arabic", "Cinematic", "Ambient"];

export const musicLibrary = [
  { 
    id: 'm1', 
    title: 'Cinematic Inspiration', 
    artist: 'Audio Studio', 
    category: 'Cinematic', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 
    duration: 372 
  },
  { 
    id: 'm2', 
    title: 'Midnight Piano', 
    artist: 'Classical Masters', 
    category: 'Classical', 
    url: 'https://cdn.pixabay.com/audio/2022/10/25/audio_2434529f79.mp3', 
    duration: 180 
  },
  { 
    id: 'm3', 
    title: 'Arabic Nights (Oud)', 
    artist: 'Oriental Heritage', 
    category: 'Arabic', 
    url: 'https://cdn.pixabay.com/audio/2022/11/22/audio_1f81076b1e.mp3', 
    duration: 185 
  },
  { 
    id: 'm4', 
    title: 'Desert Breeze', 
    artist: 'Mystic Sounds', 
    category: 'Arabic', 
    url: 'https://cdn.pixabay.com/audio/2023/06/21/audio_5f27192628.mp3', 
    duration: 240 
  },
  { 
    id: 'm5', 
    title: 'Deep Space Ambient', 
    artist: 'Electronic Pulse', 
    category: 'Ambient', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', 
    duration: 312 
  }
];

export const languages = [
  { code: 'ar', name: 'العربية', greeting: 'مرحباً بك في فيديو فاكتوري. أنا جاهز لتوليد صوتك الاحترافي.' },
  { code: 'en', name: 'English', greeting: 'Welcome to Video Factory. I am ready to generate your professional voice.' }
];

const humanIds = [3771115, 3778603, 3785077, 3916433, 415829, 220453];

export const libraryImages = Array.from({ length: 40 }).map((_, i) => {
  const id = humanIds[i % humanIds.length];
  return {
    id: `img-${i}`,
    url: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`,
    title: `Asset ${i + 1}`,
    category: i < 20 ? "Humans" : "Nature",
    prompt: "Cinematic high-quality visual asset."
  };
});

export const videoTemplates = [
  {
    id: 'tpl-1',
    title: 'Ocean Majesty',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    category: 'Cinematic',
    description: 'Breathtaking 4K ocean waves.',
    basePrompt: 'Cinematic wide shot of blue ocean water, sunlight reflecting.'
  },
  {
    id: 'tpl-2',
    title: 'Floral Bloom',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    category: 'Nature',
    description: 'Stunning macro time-lapse.',
    basePrompt: 'Macro shot of a flower blooming, vibrant colors, bokeh background.'
  }
];

export const voices = {
  female: [{ id: 'f-1', name: 'Layla (Arabic)', style: 'Natural', prebuiltName: 'Kore' }],
  male: [{ id: 'm-1', name: 'Adam (Arabic)', style: 'Professional', prebuiltName: 'Charon' }]
};
