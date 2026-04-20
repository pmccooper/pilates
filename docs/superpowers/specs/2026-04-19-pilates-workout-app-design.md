# Pilates Workout App — Design Spec
**Date:** 2026-04-19

## Overview

A mobile-friendly GitHub Pages web app for running Pilates workouts assembled from saved Instagram/YouTube clips. A single Claude Code skill (`add-pilates-video`) adds new clips to the local repo with AI-generated tags. The site itself handles tag filtering, playlist building, shuffle, and looped playback — no server required.

---

## Architecture

```
/
├── index.html          — tag selector home page
├── player.html         — workout player
├── clips.json          — clip bank (the database)
├── workouts/           — archived workout snapshots (optional, future)
└── .claude/
    └── skills/
        └── add-pilates-video.md   — Claude Code skill
```

GitHub Pages hosts the site from the repo root. `clips.json` is fetched at runtime by the site's JavaScript. The player receives the selected tags via URL query params (e.g. `player.html?tags=core,ball&shuffle=true`).

---

## Data Model

### clips.json

Array of clip objects:

```json
[
  {
    "id": "dmie15qs",
    "url": "https://www.instagram.com/p/DMIE15qS-vt/",
    "title": "Core with Pilates ball — oblique series",
    "tags": ["core", "ball", "obliques"],
    "type": "carousel",
    "source": "instagram",
    "movements": 5,
    "added": "2026-04-19"
  }
]
```

**Fields:**
- `id` — short unique string derived from the URL
- `url` — original post URL
- `title` — Haiku-generated descriptive title
- `tags` — array of lowercase strings (e.g. `core`, `ball`, `ring`, `legs`, `obliques`)
- `type` — `"carousel"` or `"video"`
- `source` — `"instagram"` or `"youtube"`
- `movements` — integer if detectable from description/timestamps; omitted if unknown. For Instagram carousels, inferred from item count if available.
- `added` — ISO date string

---

## The Site

### Home Page (`index.html`)

- Lists all unique tags found across `clips.json` as toggleable buttons
- User taps one or more tags to select them (multi-select)
- "Start Workout" button navigates to `player.html?tags=core,ball&shuffle=false`
- Shuffle toggle on the home page (persists to player via query param)
- Mobile-first, full-screen layout

### Player Page (`player.html`)

**Layout:**
- Top bar: clip counter (e.g. "Clip 3 of 12"), tag summary, shuffle indicator
- Main area: embedded iframe (Instagram or YouTube short)
- Movement hint: "5 movements — 3 sets of 20 each" shown below iframe if `movements` is set ("3 sets of 20" is a hardcoded constant)
- Bottom bar: Previous | Replay | Next buttons

**Playlist behavior:**
1. On load: reads `clips.json`, filters by selected tags, optionally shuffles
2. Displays clips one at a time — user advances manually via Next
3. When the last clip is reached and Next is pressed, loops back to clip 1
4. Shuffle toggle button on player re-randomizes the full playlist and returns to clip 1

**Iframe embedding:**
- Instagram posts: standard Instagram embed URL
- YouTube: `youtube.com/embed/<id>` with autoplay disabled (user-initiated)

---

## The Skill: `add-pilates-video`

**Invocation:** `add-pilates-video <url>`

**Steps:**
1. Claude Code dispatches the skill with the URL
2. Haiku fetches the page's description/transcript/metadata
3. Haiku generates:
   - `title`: concise descriptive title
   - `tags`: array of relevant lowercase tags from a standard set (`core`, `legs`, `ball`, `ring`, `obliques`, `glutes`, `arms`, `stretch`)
   - `movements`: integer if explicitly mentioned in description or timestamps; omitted otherwise. For Instagram carousels, use item count if detectable.
   - `type`: `carousel` or `video`
   - `source`: `instagram` or `youtube`
4. New entry is appended to `clips.json`
5. Changes are committed and pushed to the repo
6. GitHub Pages reflects the new clip immediately

---

## Standard Tag Vocabulary

To keep tags consistent across Haiku calls, Haiku selects from this set (and may add new ones if clearly warranted):

`core`, `legs`, `ball`, `ring`, `obliques`, `glutes`, `arms`, `stretch`, `hips`, `back`, `full-body`

---

## Key Constraints

- No backend — pure static site, all logic in client-side JS
- Works on mobile (iPhone Safari / Chrome)
- Clips.json is the single source of truth — no build step required
- Instagram iframes may require user to be logged in on their device; this is acceptable
- YouTube embeds work without authentication
