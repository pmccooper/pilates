export async function loadClips() {
  const res = await fetch('./clips.json');
  if (!res.ok) throw new Error('Failed to load clips.json');
  return res.json();
}

export function filterClips(clips, tags) {
  if (!tags || tags.length === 0) return clips;
  return clips.filter(clip => tags.some(tag => clip.tags.includes(tag)));
}

export function getAllTags(clips) {
  const tags = new Set();
  clips.forEach(clip => clip.tags.forEach(t => tags.add(t)));
  return [...tags].sort();
}

export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getEmbedUrl(clip) {
  if (clip.source === 'youtube') {
    const url = new URL(clip.url);
    let videoId;
    if (url.pathname.startsWith('/shorts/')) {
      videoId = url.pathname.split('/shorts/')[1].split('/')[0];
    } else if (url.searchParams.get('v')) {
      videoId = url.searchParams.get('v');
    } else if (url.hostname === 'youtu.be') {
      videoId = url.pathname.slice(1);
    }
    return `https://www.youtube.com/embed/${videoId}`;
  }
  const match = clip.url.match(/instagram\.com\/(p|reel)\/([^/?]+)/);
  if (match) {
    return `https://www.instagram.com/${match[1]}/${match[2]}/embed/`;
  }
  return clip.url;
}
