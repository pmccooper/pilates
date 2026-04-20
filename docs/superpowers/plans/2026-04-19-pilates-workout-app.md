# Pilates Workout App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-friendly GitHub Pages workout player that filters saved Instagram/YouTube clips by tag and plays them sequentially, plus a Claude Code skill to add new clips via AI tagging.

**Architecture:** Pure static site (no build step) with `clips.json` as the database, fetched at runtime by vanilla JS ES modules. `index.html` is the tag selector; `player.html` is the workout player. A single Claude Code skill (`add-pilates-video`) appends clips to `clips.json` and pushes to GitHub, which deploys instantly via Pages.

**Tech Stack:** Vanilla HTML/CSS/JS (ES modules), GitHub Pages, Node.js (tests only — no runtime dependency), Claude Code skill markdown

---

## File Map

| File | Responsibility |
|------|---------------|
| `clips.json` | Source-of-truth clip bank |
| `js/clips.js` | Shared logic: load, filter, shuffle, embed URL, getAllTags |
| `js/player.js` | Player state: current index, navigation, shuffle toggle |
| `css/styles.css` | Mobile-first shared styles |
| `index.html` | Tag selector home page |
| `player.html` | Workout player page |
| `tests/test-clips.js` | Node.js unit tests for `js/clips.js` functions |
| `.claude/skills/add-pilates-video.md` | Claude Code skill |

---

## Task 1: Initialize repo and seed clips.json

**Files:**
- Create: `clips.json`
- Create: `.gitignore`

- [ ] **Step 1: Initialize git repo**

```bash
cd c:/Users/pmcco/Repos/Pilates
git init
```

Expected: `Initialized empty Git repository in .../Pilates/.git/`

- [ ] **Step 2: Create .gitignore**

Create `.gitignore`:
```
.DS_Store
Thumbs.db
node_modules/
```

- [ ] **Step 3: Create clips.json with seeded clips**

Create `clips.json` at repo root:
```json
[
  {
    "id": "DMIE15qS",
    "url": "https://www.instagram.com/p/DMIE15qS-vt/?img_index=2",
    "title": "Core with Pilates ball — side series",
    "tags": ["core", "ball"],
    "type": "carousel",
    "source": "instagram",
    "added": "2026-04-19"
  },
  {
    "id": "DVSaOVUAfyP",
    "url": "https://www.instagram.com/reel/DVSaOVUAfyP/",
    "title": "Core with Pilates ball",
    "tags": ["core", "ball"],
    "type": "video",
    "source": "instagram",
    "added": "2026-04-19"
  },
  {
    "id": "DWWZKwZivHs",
    "url": "https://www.instagram.com/p/DWWZKwZivHs/?img_index=3",
    "title": "Legs with Pilates ball",
    "tags": ["legs", "ball"],
    "type": "carousel",
    "source": "instagram",
    "added": "2026-04-19"
  },
  {
    "id": "DTTsMj3DcMj",
    "url": "https://www.instagram.com/reel/DTTsMj3DcMj/",
    "title": "Core with ring",
    "tags": ["core", "ring"],
    "type": "video",
    "source": "instagram",
    "added": "2026-04-19"
  },
  {
    "id": "DVZUhHhkk4Y",
    "url": "https://www.instagram.com/reel/DVZUhHhkk4Y/",
    "title": "Legs",
    "tags": ["legs"],
    "type": "video",
    "source": "instagram",
    "added": "2026-04-19"
  },
  {
    "id": "DUcDeSGAlNo",
    "url": "https://www.instagram.com/reel/DUcDeSGAlNo/",
    "title": "Core",
    "tags": ["core"],
    "type": "video",
    "source": "instagram",
    "added": "2026-04-19"
  },
  {
    "id": "DW08lH2DOUG",
    "url": "https://www.instagram.com/reel/DW08lH2DOUG/",
    "title": "Legs into core",
    "tags": ["legs", "core"],
    "type": "video",
    "source": "instagram",
    "added": "2026-04-19"
  },
  {
    "id": "DWI4U4WCDjB",
    "url": "https://www.instagram.com/reel/DWI4U4WCDjB/",
    "title": "Legs with Pilates ball",
    "tags": ["legs", "ball"],
    "type": "video",
    "source": "instagram",
    "added": "2026-04-19"
  },
  {
    "id": "DXMNVDtkUpb",
    "url": "https://www.instagram.com/reel/DXMNVDtkUpb/",
    "title": "Legs with ring",
    "tags": ["legs", "ring"],
    "type": "video",
    "source": "instagram",
    "added": "2026-04-19"
  }
]
```

- [ ] **Step 4: Verify JSON is valid**

```bash
node -e "JSON.parse(require('fs').readFileSync('clips.json','utf8')); console.log('valid')"
```

Expected: `valid`

- [ ] **Step 5: Commit**

```bash
git add clips.json .gitignore
git commit -m "feat: initialize repo with seeded clip bank"
```

---

## Task 2: Shared clip logic + tests

**Files:**
- Create: `js/clips.js`
- Create: `tests/test-clips.js`

- [ ] **Step 1: Write the failing tests**

Create `tests/test-clips.js`:
```javascript
import { filterClips, shuffleArray, getAllTags, getEmbedUrl } from '../js/clips.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.error(`  FAIL: ${message}`);
    failed++;
  }
}

const clips = [
  { id: 'a', url: 'https://www.instagram.com/p/abc123/', tags: ['core', 'ball'], type: 'carousel', source: 'instagram', title: 'A', added: '2026-01-01' },
  { id: 'b', url: 'https://www.instagram.com/reel/def456/', tags: ['legs'], type: 'video', source: 'instagram', title: 'B', added: '2026-01-01' },
  { id: 'c', url: 'https://www.youtube.com/shorts/ghi789', tags: ['core', 'ring'], type: 'video', source: 'youtube', title: 'C', added: '2026-01-01' },
];

// filterClips
console.log('\nfilterClips:');
assert(filterClips(clips, ['core']).length === 2, 'filters to clips tagged core');
assert(filterClips(clips, ['legs']).length === 1, 'filters to clips tagged legs');
assert(filterClips(clips, ['ball', 'ring']).length === 2, 'union of tags returns 2');
assert(filterClips(clips, []).length === 3, 'empty tags returns all clips');
assert(filterClips(clips, ['nonexistent']).length === 0, 'unknown tag returns empty');

// getAllTags
console.log('\ngetAllTags:');
const tags = getAllTags(clips);
assert(tags.includes('core'), 'includes core');
assert(tags.includes('ball'), 'includes ball');
assert(tags.includes('legs'), 'includes legs');
assert(tags.includes('ring'), 'includes ring');
assert(tags.length === 4, 'deduplicates tags — 4 unique tags');
assert(tags[0] <= tags[1], 'tags are sorted');

// shuffleArray
console.log('\nshuffleArray:');
const arr = [1, 2, 3, 4, 5, 6, 7, 8];
const shuffled = shuffleArray(arr);
assert(shuffled.length === arr.length, 'shuffled array same length');
assert(arr.every(x => shuffled.includes(x)), 'all original elements present');
assert(JSON.stringify(shuffled) !== JSON.stringify(arr), 'order is different (may rarely fail by chance)');
const original = [...arr];
assert(JSON.stringify(arr) === JSON.stringify(original), 'original array not mutated');

// getEmbedUrl
console.log('\ngetEmbedUrl:');
assert(
  getEmbedUrl(clips[0]) === 'https://www.instagram.com/p/abc123/embed/',
  'instagram /p/ embed URL'
);
assert(
  getEmbedUrl(clips[1]) === 'https://www.instagram.com/reel/def456/embed/',
  'instagram /reel/ embed URL'
);
assert(
  getEmbedUrl(clips[2]) === 'https://www.youtube.com/embed/ghi789',
  'youtube /shorts/ embed URL'
);

const watchClip = { ...clips[2], url: 'https://www.youtube.com/watch?v=xyz999' };
assert(
  getEmbedUrl(watchClip) === 'https://www.youtube.com/embed/xyz999',
  'youtube watch?v= embed URL'
);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
node --experimental-vm-modules tests/test-clips.js 2>&1 | head -5
```

Expected: Error — `js/clips.js` does not exist yet.

- [ ] **Step 3: Create js/clips.js**

```bash
mkdir -p js
```

Create `js/clips.js`:
```javascript
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
node --input-type=module --experimental-vm-modules tests/test-clips.js
```

Expected output ends with: `N passed, 0 failed`

If you see an import error about ES modules, run instead:
```bash
node --experimental-vm-modules tests/test-clips.js
```

If Node version is 18+, use:
```bash
node tests/test-clips.js
```
(add `"type": "module"` to a `package.json` first: `echo '{"type":"module"}' > package.json`)

- [ ] **Step 5: Commit**

```bash
git add js/clips.js tests/test-clips.js package.json
git commit -m "feat: add shared clip logic with tests"
```

---

## Task 3: Shared CSS

**Files:**
- Create: `css/styles.css`

- [ ] **Step 1: Create css/styles.css**

```bash
mkdir -p css
```

Create `css/styles.css`:
```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0d0d0d;
  --surface: #1a1a1a;
  --border: #2e2e2e;
  --accent: #c9a96e;
  --text: #f0f0f0;
  --text-muted: #888;
  --btn-h: 56px;
  --radius: 12px;
}

html, body {
  height: 100%;
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  -webkit-tap-highlight-color: transparent;
}

a { color: inherit; text-decoration: none; }

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--btn-h);
  padding: 0 24px;
  border: none;
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  transition: opacity 0.15s;
}
.btn:active { opacity: 0.7; }

.btn-primary {
  background: var(--accent);
  color: #000;
  width: 100%;
}

.btn-secondary {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
}

.btn-icon {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 50%;
  width: var(--btn-h);
  height: var(--btn-h);
  padding: 0;
  font-size: 1.5rem;
}

.tag-btn {
  padding: 8px 16px;
  border-radius: 999px;
  border: 1.5px solid var(--border);
  background: transparent;
  color: var(--text-muted);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.15s;
}
.tag-btn.selected {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(201,169,110,0.1);
}
```

- [ ] **Step 2: Verify file exists**

```bash
ls css/styles.css
```

Expected: `css/styles.css`

- [ ] **Step 3: Commit**

```bash
git add css/styles.css
git commit -m "feat: add shared mobile-first CSS"
```

---

## Task 4: Home page (index.html)

**Files:**
- Create: `index.html`

- [ ] **Step 1: Create index.html**

Create `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Pilates</title>
  <link rel="stylesheet" href="css/styles.css">
  <style>
    body { display: flex; flex-direction: column; min-height: 100dvh; }

    header {
      padding: 48px 24px 24px;
      text-align: center;
    }
    header h1 { font-size: 1.8rem; letter-spacing: 0.08em; color: var(--accent); }
    header p { color: var(--text-muted); margin-top: 6px; font-size: 0.9rem; }

    main { flex: 1; padding: 0 24px; }

    .section-label {
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 12px;
    }

    #tag-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 32px;
    }

    .shuffle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      background: var(--surface);
      border-radius: var(--radius);
      margin-bottom: 32px;
    }
    .shuffle-row span { font-size: 0.95rem; }

    .toggle {
      position: relative;
      width: 48px;
      height: 28px;
    }
    .toggle input { opacity: 0; width: 0; height: 0; }
    .toggle-track {
      position: absolute;
      inset: 0;
      border-radius: 999px;
      background: var(--border);
      cursor: pointer;
      transition: background 0.2s;
    }
    .toggle input:checked + .toggle-track { background: var(--accent); }
    .toggle-track::after {
      content: '';
      position: absolute;
      left: 3px;
      top: 3px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: white;
      transition: transform 0.2s;
    }
    .toggle input:checked + .toggle-track::after { transform: translateX(20px); }

    footer { padding: 24px; }

    #clip-count {
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 12px;
    }

    #start-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  </style>
</head>
<body>
  <header>
    <h1>PILATES</h1>
    <p>Select what you want to work on</p>
  </header>

  <main>
    <p class="section-label">Focus areas</p>
    <div id="tag-grid">
      <p style="color:var(--text-muted);font-size:0.9rem">Loading...</p>
    </div>

    <div class="shuffle-row">
      <span>Shuffle</span>
      <label class="toggle">
        <input type="checkbox" id="shuffle-toggle">
        <span class="toggle-track"></span>
      </label>
    </div>
  </main>

  <footer>
    <p id="clip-count"></p>
    <button id="start-btn" class="btn btn-primary" disabled>Start Workout</button>
  </footer>

  <script type="module">
    import { loadClips, filterClips, getAllTags } from './js/clips.js';

    let allClips = [];
    let selectedTags = [];

    const tagGrid = document.getElementById('tag-grid');
    const clipCount = document.getElementById('clip-count');
    const startBtn = document.getElementById('start-btn');
    const shuffleToggle = document.getElementById('shuffle-toggle');

    function updateCount() {
      const matching = filterClips(allClips, selectedTags);
      clipCount.textContent = `${matching.length} clip${matching.length !== 1 ? 's' : ''} selected`;
      startBtn.disabled = matching.length === 0;
    }

    function renderTags(tags) {
      tagGrid.innerHTML = '';
      tags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'tag-btn';
        btn.textContent = tag;
        btn.addEventListener('click', () => {
          const idx = selectedTags.indexOf(tag);
          if (idx === -1) {
            selectedTags.push(tag);
            btn.classList.add('selected');
          } else {
            selectedTags.splice(idx, 1);
            btn.classList.remove('selected');
          }
          updateCount();
        });
        tagGrid.appendChild(btn);
      });
    }

    startBtn.addEventListener('click', () => {
      const params = new URLSearchParams({
        tags: selectedTags.join(','),
        shuffle: shuffleToggle.checked ? '1' : '0',
      });
      window.location.href = `player.html?${params}`;
    });

    loadClips().then(clips => {
      allClips = clips;
      renderTags(getAllTags(clips));
      updateCount();
    });
  </script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify tag buttons appear**

```bash
# Windows: start a local server to test
npx --yes serve . -p 3000
```

Open `http://localhost:3000` in browser. Verify:
- Tags render as pill buttons (core, ball, legs, ring, etc.)
- Tapping a tag highlights it gold
- Clip count updates as tags are selected/deselected
- "Start Workout" is disabled until at least one tag is selected
- Shuffle toggle works visually

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add tag selector home page"
```

---

## Task 5: Player page

**Files:**
- Create: `player.html`
- Create: `js/player.js`

- [ ] **Step 1: Create js/player.js**

Create `js/player.js`:
```javascript
import { loadClips, filterClips, shuffleArray, getEmbedUrl } from './clips.js';

export function createPlayer(container, params) {
  let clips = [];
  let index = 0;
  let isShuffled = params.get('shuffle') === '1';
  const selectedTags = (params.get('tags') || '').split(',').filter(Boolean);

  const iframe = container.querySelector('#clip-iframe');
  const counter = container.querySelector('#counter');
  const hint = container.querySelector('#movement-hint');
  const prevBtn = container.querySelector('#btn-prev');
  const replayBtn = container.querySelector('#btn-replay');
  const nextBtn = container.querySelector('#btn-next');
  const shuffleBtn = container.querySelector('#btn-shuffle');

  function render() {
    if (clips.length === 0) return;
    const clip = clips[index];
    iframe.src = getEmbedUrl(clip);
    counter.textContent = `${index + 1} / ${clips.length}`;
    if (clip.movements) {
      hint.textContent = `${clip.movements} movement${clip.movements !== 1 ? 's' : ''} — 3 sets of 20 each`;
      hint.hidden = false;
    } else {
      hint.hidden = true;
    }
    prevBtn.disabled = false;
    shuffleBtn.textContent = isShuffled ? '🔀 On' : '🔀 Off';
  }

  function goTo(i) {
    index = ((i % clips.length) + clips.length) % clips.length;
    render();
  }

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));
  replayBtn.addEventListener('click', () => { iframe.src = iframe.src; });
  shuffleBtn.addEventListener('click', () => {
    isShuffled = !isShuffled;
    clips = isShuffled ? shuffleArray(clips) : [...clips].sort((a, b) => a.added.localeCompare(b.added));
    index = 0;
    render();
  });

  loadClips().then(all => {
    const filtered = filterClips(all, selectedTags);
    clips = isShuffled ? shuffleArray(filtered) : filtered;
    if (clips.length === 0) {
      counter.textContent = 'No clips found for selected tags';
      return;
    }
    render();
  });
}
```

- [ ] **Step 2: Create player.html**

Create `player.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Pilates — Workout</title>
  <link rel="stylesheet" href="css/styles.css">
  <style>
    html, body { height: 100%; overflow: hidden; }
    body { display: flex; flex-direction: column; }

    #top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      padding-top: max(12px, env(safe-area-inset-top));
      flex-shrink: 0;
    }

    #back-btn {
      font-size: 0.85rem;
      color: var(--text-muted);
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px 0;
    }

    #counter {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-variant-numeric: tabular-nums;
    }

    #btn-shuffle {
      font-size: 0.8rem;
      padding: 4px 10px;
      height: auto;
      border-radius: 999px;
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--text-muted);
      cursor: pointer;
    }

    #embed-wrap {
      flex: 1;
      position: relative;
      overflow: hidden;
    }

    #clip-iframe {
      width: 100%;
      height: 100%;
      border: none;
      background: #000;
    }

    #movement-hint {
      position: absolute;
      bottom: 8px;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-muted);
      background: rgba(0,0,0,0.7);
      padding: 6px 12px;
    }

    #bottom-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      padding-bottom: max(16px, env(safe-area-inset-bottom));
      gap: 16px;
      flex-shrink: 0;
    }

    #btn-prev, #btn-replay, #btn-next {
      flex: 1;
    }
  </style>
</head>
<body>
  <div id="top-bar">
    <button id="back-btn" onclick="window.location.href='index.html'">← Back</button>
    <span id="counter">Loading...</span>
    <button id="btn-shuffle">🔀 Off</button>
  </div>

  <div id="embed-wrap">
    <iframe id="clip-iframe" allowfullscreen allow="autoplay"></iframe>
    <p id="movement-hint" hidden></p>
  </div>

  <div id="bottom-bar">
    <button id="btn-prev" class="btn btn-secondary">Prev</button>
    <button id="btn-replay" class="btn btn-secondary">↺</button>
    <button id="btn-next" class="btn btn-primary" style="color:#000">Next</button>
  </div>

  <script type="module">
    import { createPlayer } from './js/player.js';
    const params = new URLSearchParams(window.location.search);
    createPlayer(document, params);
  </script>
</body>
</html>
```

- [ ] **Step 3: Test player in browser**

With the local server from Task 4 still running (or restart: `npx serve . -p 3000`):

1. Open `http://localhost:3000`, select "core" tag, hit Start Workout
2. Verify player loads with an embedded Instagram clip
3. Verify clip counter shows "1 / N"
4. Tap Next — verify next clip loads
5. Tap Prev — verify previous clip loads
6. Tap Replay — verify iframe reloads same clip
7. Navigate to last clip, tap Next — verify it loops to clip 1
8. Tap Shuffle toggle — verify counter resets to 1/N and clips re-randomize
9. Tap Back — verify returns to home page

- [ ] **Step 4: Commit**

```bash
git add player.html js/player.js
git commit -m "feat: add workout player with navigation and shuffle"
```

---

## Task 6: add-pilates-video skill

**Files:**
- Create: `.claude/skills/add-pilates-video.md`

- [ ] **Step 1: Create skill directory and file**

```bash
mkdir -p .claude/skills
```

Create `.claude/skills/add-pilates-video.md`:
```markdown
# add-pilates-video

Add a new video clip to the Pilates workout library.

## Usage

`/add-pilates-video <url>`

## Steps

1. **Fetch the page content** using WebFetch on the provided URL. Capture the page title, description, any visible text describing the exercises, and any timestamp markers.

2. **Analyze the content** to determine:
   - `title`: A concise descriptive name for the clip (e.g. "Core with Pilates ball — oblique series")
   - `tags`: Select ALL that apply from this list. Use only these values unless a clear new category is needed:
     `core`, `legs`, `ball`, `ring`, `obliques`, `glutes`, `arms`, `stretch`, `hips`, `back`, `full-body`
   - `type`: `"carousel"` if the URL contains `img_index` or the page shows multiple slides; otherwise `"video"`
   - `source`: `"instagram"` if the URL contains `instagram.com`; `"youtube"` if it contains `youtube.com` or `youtu.be`
   - `movements`: An integer count of distinct exercises ONLY if the description or timestamps explicitly list them (e.g. "5 moves", or 5 numbered timestamps). Omit this field entirely if not clearly stated.
   - `id`: Extract the post shortcode or video ID from the URL:
     - Instagram `/p/SHORTCODE/` or `/reel/SHORTCODE/` → use the SHORTCODE
     - YouTube `/shorts/VIDEO_ID` or `watch?v=VIDEO_ID` → use VIDEO_ID

3. **Read `clips.json`** to check if the id already exists. If it does, report "Clip already exists" and stop.

4. **Append** the new clip object to the array in `clips.json`. The `added` field should be today's date in `YYYY-MM-DD` format.

5. **Validate** the updated JSON is parseable: `node -e "JSON.parse(require('fs').readFileSync('clips.json','utf8')); console.log('valid')"`

6. **Commit and push**:
   ```bash
   git add clips.json
   git commit -m "feat: add clip — <title>"
   git push
   ```

7. **Confirm** by reporting: the title, tags assigned, movements (if detected), and the GitHub Pages URL where the change is live.
```

- [ ] **Step 2: Verify skill file is readable**

```bash
cat .claude/skills/add-pilates-video.md | head -5
```

Expected: first 5 lines of the skill file.

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/add-pilates-video.md
git commit -m "feat: add add-pilates-video Claude Code skill"
```

---

## Task 7: GitHub Pages deploy

**Files:** No code changes — configuration only.

- [ ] **Step 1: Create GitHub repo**

Go to https://github.com/new and create a new **public** repository named `pilates` (or `Pilates`). Do NOT initialize with a README.

- [ ] **Step 2: Add remote and push**

```bash
git remote add origin https://github.com/YOUR_USERNAME/pilates.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

- [ ] **Step 3: Enable GitHub Pages**

1. Go to your repo on GitHub → Settings → Pages
2. Under "Source", select **Deploy from a branch**
3. Branch: `main`, folder: `/ (root)`
4. Click Save

- [ ] **Step 4: Verify site is live**

Wait ~60 seconds, then open: `https://YOUR_USERNAME.github.io/pilates/`

Verify:
- Home page loads with tag buttons
- Selecting tags and starting workout navigates to player
- Player loads an embedded clip

- [ ] **Step 5: Bookmark on phone**

Open `https://YOUR_USERNAME.github.io/pilates/` on your phone. Use "Add to Home Screen" for a native-app-like experience.

---

## Self-Review Checklist

- [x] **clips.json seeded** with all 9 user-provided clips — Task 1
- [x] **filterClips** tested and implemented — Task 2
- [x] **shuffleArray** tested and implemented — Task 2
- [x] **getAllTags** tested and implemented — Task 2
- [x] **getEmbedUrl** tested for Instagram /p/, /reel/, YouTube /shorts/, watch?v= — Task 2
- [x] **Tag selector home page** with multi-select, shuffle toggle, clip count — Task 4
- [x] **Player** with Previous/Next/Replay/Shuffle, loop behavior, movement hint — Task 5
- [x] **"3 sets of 20" hardcoded** in player hint — Task 5 (player.js render function)
- [x] **Loops back to clip 1** when Next pressed on last clip — Task 5 (goTo with modulo)
- [x] **Shuffle toggle re-randomizes and returns to clip 1** — Task 5 (player.js shuffleBtn handler)
- [x] **add-pilates-video skill** with Haiku tagging, duplicate check, commit+push — Task 6
- [x] **GitHub Pages deploy** — Task 7
- [x] No TBDs or placeholders in any task
- [x] Type/function names consistent across tasks (filterClips, shuffleArray, getAllTags, getEmbedUrl, createPlayer all defined in Task 2/5 before use)
