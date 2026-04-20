import { loadClips, filterClips, shuffleArray, getEmbedUrl } from './clips.js';

export function createPlayer(params) {
  let clips = [];
  let index = 0;
  let isShuffled = params.get('shuffle') === '1';
  const selectedTags = (params.get('tags') || '').split(',').filter(Boolean);

  const iframe = document.getElementById('clip-iframe');
  const counter = document.querySelector('.counter');
  const cur = counter?.querySelector('.cur');
  const total = counter?.querySelector('.total');
  const hint = document.querySelector('.hint');
  const shuffleBtn = document.querySelector('.shuffle-btn');
  const prevBtn = document.getElementById('btn-prev');
  const replayBtn = document.getElementById('btn-replay');
  const nextBtn = document.getElementById('btn-next');

  function render() {
    if (!clips.length) return;
    const clip = clips[index];
    iframe.src = getEmbedUrl(clip);

    if (cur) cur.textContent = String(index + 1).padStart(2, '0');
    if (total) total.textContent = String(clips.length).padStart(2, '0');

    if (clip.movements) {
      hint.querySelector('span:first-child').textContent = `${clip.movements} Movement${clip.movements !== 1 ? 's' : ''}`;
      hint.hidden = false;
    } else {
      hint.hidden = true;
    }

    shuffleBtn?.setAttribute('aria-pressed', isShuffled ? 'true' : 'false');
  }

  function goTo(i) {
    index = ((i % clips.length) + clips.length) % clips.length;
    render();
  }

  prevBtn?.addEventListener('click', () => goTo(index - 1));
  nextBtn?.addEventListener('click', () => goTo(index + 1));
  replayBtn?.addEventListener('click', () => { iframe.src = iframe.src; });

  shuffleBtn?.addEventListener('click', () => {
    isShuffled = !isShuffled;
    clips = isShuffled
      ? shuffleArray(clips)
      : [...clips].sort((a, b) => a.added.localeCompare(b.added));
    index = 0;
    render();
  });

  loadClips().then(all => {
    const filtered = filterClips(all, selectedTags);
    clips = isShuffled ? shuffleArray(filtered) : filtered;
    if (!clips.length) {
      if (cur) cur.textContent = '–';
      if (total) total.textContent = '–';
      return;
    }
    render();
  });
}
