import { loadClips, filterClips, shuffleArray, getEmbedUrl } from './clips.js';

export function createPlayer(params) {
  let clips = [];
  let index = 0;
  let isShuffled = params.get('shuffle') === '1';
  const selectedTags = (params.get('tags') || '').split(',').filter(Boolean);

  const stage = document.getElementById('player-stage');
  const hint = document.getElementById('clip-hint');
  const hintMovements = document.getElementById('hint-movements');
  const counter = document.querySelector('.counter');
  const cur = counter?.querySelector('.cur');
  const total = counter?.querySelector('.total');
  const shuffleBtn = document.querySelector('.shuffle-btn');
  const prevBtn = document.getElementById('btn-prev');
  const replayBtn = document.getElementById('btn-replay');
  const nextBtn = document.getElementById('btn-next');

  let currentIframe = null;

  function renderStage(clip) {
    // Remove previous content (but keep the hint overlay)
    currentIframe = null;
    Array.from(stage.children).forEach(el => {
      if (el !== hint) el.remove();
    });

    if (clip.source === 'youtube') {
      const iframe = document.createElement('iframe');
      iframe.id = 'clip-iframe';
      iframe.src = getEmbedUrl(clip);
      iframe.title = clip.title;
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      stage.insertBefore(iframe, hint);
      currentIframe = iframe;
    } else {
      const card = document.createElement('div');
      card.className = 'clip-card';
      card.innerHTML = `
        <p class="clip-card-title">${clip.title}</p>
        <div class="clip-card-tags">${clip.tags.map(t =>
          `<span class="clip-card-tag">${t}</span>`
        ).join('')}</div>
        <a class="clip-card-open" href="${clip.url}" target="_blank" rel="noopener">
          Open in Instagram <span style="font-size:18px">↗</span>
        </a>`;
      stage.insertBefore(card, hint);
    }
  }

  function render() {
    if (!clips.length) return;
    const clip = clips[index];

    renderStage(clip);

    if (cur) cur.textContent = String(index + 1).padStart(2, '0');
    if (total) total.textContent = String(clips.length).padStart(2, '0');

    if (clip.movements) {
      hintMovements.textContent = `${clip.movements} Movement${clip.movements !== 1 ? 's' : ''}`;
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
  replayBtn?.addEventListener('click', () => {
    if (currentIframe) {
      currentIframe.src = currentIframe.src;
    } else {
      // For Instagram cards, re-open the link
      const link = stage.querySelector('.clip-card-open');
      if (link) link.click();
    }
  });

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
