# 🪷 শারদীয় উৎসব — Durga Puja Music Player

> An immersive single-page music player with full-bleed Durga Puja imagery, glassmorphic UI, and a curated Bengali festive playlist. Switch between two art styles, feel the dhak beats, and pandal-hop from your screen.

---

## ✨ Features

- 🖼️ **Full-Screen Puja Backgrounds** — 6 scenes (Mahalaya, Kumortuli, Bonedi Bari, Raj Bari, Pandal, Night Lights) with a smooth crossfade on track change.
- 🎨 **Dual Art Styles** — Toggle between Editorial (style1) and Cinematic (style2). Preference saved in localStorage.
- 🎵 **Glassmorphic Music Player** — Play/pause, prev/next, seek bar, spinning vinyl cover art, and a full playlist drawer.
- 📋 **Playlist Drawer** — Search songs, pick a track, or paste a custom YouTube/Spotify URL to play inline.
- 🎬 **YouTube Custom Player** — Paste any YouTube or YouTube Music link to play audio with a native-looking custom UI (title, thumbnail, seekbar via YT IFrame API).
- 🟢 **Spotify Embed** — Paste a Spotify track link to play via embedded Spotify player styled to match the app.
- 🕒 **IST Clock** — Live Indian Standard Time display.
- 🔤 **Custom Fonts** — Urbanist (Google Fonts) for English, local Bengali font (Sorolota) for Bengali text.
- 📊 **Vercel Analytics** — Built-in page-view tracking.

---

## 🛠️ Quick Start

```bash
git clone https://github.com/SlicePoh/durga-pujo-post.git
cd durga-pujo-post
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 📁 Project Structure

```
public/
  audio/              — MP3 files for each track
  bengali font/       — Local Bengali font (Sorolota Unicode)
  images/
    style1/           — Art style 1 "Editorial" (6 scenes)
    style2/           — Art style 2 "Cinematic" (same 6 scenes)
src/
  App.jsx             — Main layout: bg image, header, footer player
  data/playlist.js    — Song list, backgrounds config, Spotify/YT links
  components/
    AudioPlayer.jsx   — Bottom music player pill
    YouTubePlayer.jsx — Custom YouTube audio player (YT IFrame API)
    PlaylistDrawer.jsx— Playlist modal with search & custom URL input
    ISTClock.jsx      — Live IST clock badge
```

---

## 🎨 Customization

### Change the playlist
Edit `src/data/playlist.js`. Each track can specify a `bg` field (e.g. `"pandal"`, `"night"`) to pin it to a specific background scene.

### Change backgrounds
Drop your images into `public/images/style1/` and `public/images/style2/`. Keep filenames matching across both folders.

### Add audio
Place `.mp3` files in `public/audio/` and reference them in the playlist `audioUrl` field.

---

## 🚀 Deploy

```bash
npx vercel
```

Or connect this repo to [Vercel](https://vercel.com) for automatic deploys on push.

---

## 📄 License

MIT
