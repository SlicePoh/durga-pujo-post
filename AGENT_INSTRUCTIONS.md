# 🪷 Agent Instructions — Durga Pujo Post

> Context for AI coding agents working on this project.

---

## Project Overview

**Durga Pujo Post** is an immersive single-page Durga Puja music player built with React + Vite. It features full-bleed background images (no video), a glassmorphic dark UI, and a curated Bengali festive playlist.

---

## Tech Stack

- **React 19** + **Vite 6** (SPA, no SSR)
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **lucide-react** for icons
- **@vercel/analytics** for page tracking
- No state management library — plain React hooks + localStorage

---

## Key Conventions

1. **No video** — backgrounds are static images that crossfade on track change.
2. **Two art styles** — `public/images/style1/` and `public/images/style2/` contain the same 6 scene filenames. The user toggles between "Editorial" (style1) and "Cinematic" (style2).
3. **Audio** — local MP3 files in `public/audio/`. HTML5 `<audio>` element in `AudioPlayer.jsx`.
4. **Playlist data** — single source of truth in `src/data/playlist.js`. Each track has `id`, `audioUrl`, `title`, `artist`, `movie`, `cover` (CDN image), and `bg` (scene id).
5. **Backgrounds** — `BACKGROUNDS` array defines 6 scenes: `mohaloya`, `kumortuli`, `bonedi1`, `bonedi2`, `pandal`, `night`.
6. **localStorage keys**: `puja_track_index`, `puja_style`.

---

## Project Structure

```
public/
  audio/              — MP3 files (one per track)
  images/
    style1/           — "Editorial" art style (6 PNG scenes)
    style2/           — "Cinematic" art style (same 6 PNG scenes)
src/
  App.jsx             — Main layout: bg image crossfade, header, footer player, entrance overlay
  index.css           — Tailwind base + custom glass utilities & animations
  main.jsx            — React root
  data/playlist.js    — Song list, backgrounds config, external playlist links
  components/
    AudioPlayer.jsx   — Bottom music player pill (play/pause, prev/next, seek, spinning cover)
    PlaylistDrawer.jsx— Slide-over panel with search
    ISTClock.jsx      — Live IST clock badge
    NostalgiaSFX.jsx  — Interactive SFX buttons (dhak, horn, sliding door)
  hooks/
    useAudioCrossfade.js
```

---

## Scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
```

---

## Deployment

Deployed to Vercel. Push to `dev` branch triggers preview deploy; `main` is production.

---

## Do's and Don'ts

- **DO** keep the UI minimal and glassmorphic (dark backgrounds, `backdrop-blur`, `border-white/10`).
- **DO** use Bengali text for headings/branding where appropriate.
- **DON'T** add video elements — this is an image-based experience.
- **DON'T** add unnecessary npm dependencies.
- **DON'T** store sensitive API keys or tokens in code or committed files.
