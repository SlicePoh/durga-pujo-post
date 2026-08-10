# 🚀 AI AGENT PROMPT: Build Your Own Interactive Audio-Visual Experience

> 💡 **WELCOME! NO CODING OR GITHUB EXPERIENCE REQUIRED.**  
> You can create your own personalized, interactive website (like a *90s Cybercafe*, *Lo-Fi Rain Drive*, *Retro Gaming Den*, or *Midnight Train*) in just 2 simple steps using Google Gemini, ChatGPT, Claude, Antigravity, or Cursor!

---

## ✏️ BLOCK 1: FILL IN YOUR CUSTOM IDEA HERE (Edit this before copying!)

Replace the bracketed text `[...]` below with your own custom idea:

```text
========================================================================
MY CUSTOM WEBSITE IDEA:
- THEME NAME: [e.g. 90s Cybercafe / Rainy Night Drive / Retro Gaming Room]
- DESCRIPTION / MOOD: [e.g. Warm nostalgic vibes of playing games in a 90s cafe]
- BACKGROUND VIDEO: [e.g. Rainy window view / Retro car driving on highway]
- MY FAVORITE PLAYLIST / SONGS: [e.g. 5-10 songs you want in the music player]
- START BUTTON TEXT: [e.g. "Tap to Start 🎮" / "Jaldi Karo! 🚌" / "Drive Night 🌧️"]
- COLOR ACCENTS: [e.g. Neon Cyberpunk Purple, Warm Sunset Amber, Emerald Green]
========================================================================
```

---

## 📢 BLOCK 2: HOW TO USE THIS WITH GEMINI / CHATGPT / CURSOR (Step-by-Step Guide for Laymen)

Follow these 4 super-simple steps to build your site without typing a single line of code yourself:

1. **Step 1: Fill in Block 1 above** with your custom theme, songs, and video idea.
2. **Step 2: Copy Everything** on this page (from `# TASK: Build an Interactive Audio-Visual Web Experience` to the end).
3. **Step 3: Paste into Google Gemini or ChatGPT**:
   - Go to [Google Gemini](https://gemini.google.com) or [ChatGPT](https://chatgpt.com) or open your AI Editor (Antigravity / Cursor).
   - Paste the entire copied prompt and hit **Enter**.
4. **Step 4: Let AI Build & Publish**:
   - The AI will generate all the files for you.
   - Ask the AI: *"How do I publish this live on Vercel for free?"* and it will give you a live link to share with your friends!

---

---

# 🤖 MASTER AI PROMPT (PASTE EVERYTHING BELOW INTO GEMINI / CHATGPT / AI AGENT)

```markdown
# TASK: Build an Interactive Audio-Visual Web Experience

You are an expert Frontend AI Developer specializing in immersive, high-aesthetic web apps. Your task is to build a modern, glassmorphic React + Vite web app that provides an interactive audio-visual commuting/ambiance experience with synchronized video dialogue, background music, custom playlist drawer, ambient clocks, and visitor counters.

---

## 🎨 Design & Aesthetic Requirements
1. **Glassmorphic & Retro Visuals**: Dark mode UI (`bg-black/90`), backdrop blurs (`backdrop-blur-xl`), subtle borders (`border-white/10`), vibrant glowing pill accents (amber, emerald, indigo).
2. **FullScreen Ambient Video Background**: An HTML5 `<video>` playing in the background (`object-cover w-full h-full inset-0`), looped smoothly.
3. **Typography**: Sleek sans-serif typography (e.g. Inter, Outfit) with glowing text highlights and clean badge pills.

---

## 🔊 Audio-Visual Synchronization Engine
1. **Entrance Trigger ("Tap to Start / Jaldi Karo!")**:
   - Web browsers block autoplay audio. The app MUST render an interactive overlay or trigger pill to start media playback on first click.
2. **Dialogue-to-Music Mixing Engine**:
   - **Phase 1 (0s - 8s)**: Background video plays intro dialogue at 100% volume while background music starts at low volume (~20%).
   - **Phase 2 (8s - 12s)**: Video volume smoothly crossfades down to 20% while background music fades up to 100%.
   - **Phase 3 (12s+)**: Video locks into a continuous visual loop (e.g. last 4 seconds) at low volume while music plays in full audio quality.
3. **Audio Player Dock**:
   - Track title, artist, movie/album, cover thumbnail.
   - Play/Pause toggle, Previous/Next track control, Mute toggle, Volume slider, Progress scrubber.
   - Drawer launcher button to view the full playlist.

---

## 🗂️ Customizable Playlist & Media Structure
Create a dedicated data file at `src/data/playlist.js`:

```javascript
export const PLAYLIST_DATA = [
  {
    id: "track-1",
    title: "Aahun Aahun",
    artist: "Neeraj Shridhar",
    movie: "Love Aaj Kal (2009)",
    audioUrl: "/audio/aahun_aahun.mp3",
    youtubeId: "kYJ46_3gC_s",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600"
  },
  // Add more tracks here...
];
```

---

## 🚀 Key Components to Implement
1. `App.jsx`: Main container combining full-screen video, header stats, footer audio player, and modal drawers.
2. `LivePassengersCounter.jsx`: Animated badge displaying live online passengers/visitors with realistic fluctuation math.
3. `ISTClock.jsx`: Live real-time clock displaying current time (IST or local time zone).
4. `AudioPlayer.jsx`: Audio dock with custom controls and YouTube embed/HTML5 Audio fallback engine.
5. `PlaylistDrawer.jsx`: Slide-over panel listing tracks, search/filter, and custom YouTube video URL import.
6. `NostalgiaSFX.jsx`: Quick interactive sound trigger buttons (e.g., bus horn, conductor bell, rain toggle).

---

## 🛠️ Step-by-Step Setup Guide
1. **Initialize Project**:
   ```bash
   npx create-vite@latest my-nostalgia-app --template react
   cd my-nostalgia-app
   npm install lucide-react @vercel/analytics @tailwindcss/vite tailwindcss
   ```
2. **Media Assets**:
   - Place your loop video at `public/musics.mp4` or update the `<video src="..." />` path.
   - Place MP3 audio files inside `public/audio/`.
3. **Deployment**:
   - Deploy to Vercel with one click: `vercel`.
   - Add `<Analytics />` from `@vercel/analytics/react` inside `App.jsx`.

---

## ⚙️ Customization Instructions for Users
To customize this app for your own theme:
1. **Change Copy & Branding**: Update header titles, badges, and button text in `src/App.jsx`.
2. **Update Songs**: Edit `src/data/playlist.js` with your favorite tracks, YouTube IDs, or local MP3 files.
3. **Change Video**: Replace `public/musics.mp4` with any vertical/horizontal video loop (car drive, train view, cafe rain).
```
