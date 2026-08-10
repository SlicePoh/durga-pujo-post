# 🚌 OmniVan Nostalgia - Interactive Audio-Visual Experience

> *Relive the golden era of 2008–2012 school commutes in an Indian Omni Van. High-octane nostalgia, video dialogue crossfading into iconic Bollywood hits, live passenger counter, and ambient vibes.*

![OmniVan Nostalgia](https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop)

---

## ✨ Features

- 🎥 **Seamless Video Loop**: High-definition video background capturing the authentic Omni Van commute experience.
- 🎚️ **8-Second Audio Mixing Engine**: Video dialogue automatically crossfades from 100% down to ambient level while your favorite nostalgic tracks fade up.
- 🎵 **Curated 2000s Nostalgia Playlist**: Instant access to classics like *Aahun Aahun*, *Give Me Some Sunshine*, *Kabhi Kabhi Aditi*, *Iktara*, *Tu Jaane Na*, *Emptiness*, *Baby*, and more.
- 📻 **Interactive Audio Dock & Drawer**: Play/pause, track navigation, volume control, local MP3 playback, and custom YouTube URL player.
- 👥 **Live Passenger Counter**: Real-time animated visitor counter reflecting live passengers riding along with you.
- 🕒 **IST Clock**: Live Indian Standard Time clock display.
- 📊 **Vercel Analytics**: Built-in page view & visitor telemetry via `@vercel/analytics`.

---

## 🤖 Build Your Own Experience Using AI Agents!

Want to create your own version of this website tailored to **your own theme** (e.g., *90s Cybercafe*, *Retro Anime Train*, *Lo-Fi Rain Drive*, *Gaming Den*)?

We have included a complete **AI Agent Prompt** in [`AGENT_INSTRUCTIONS.md`](./AGENT_INSTRUCTIONS.md).

### How to use it:
1. Open [`AGENT_INSTRUCTIONS.md`](./AGENT_INSTRUCTIONS.md).
2. Copy the entire prompt text block.
3. Paste it into your favorite AI Coding Assistant (**Antigravity**, **Cursor**, **ChatGPT**, **Claude**, or **Windsurf**).
4. Specify your desired theme, video background, and playlist. The AI will generate a fully customized web app for you!

---

## 🛠️ Manual Quick Start & Installation

### 1. Clone the repository
```bash
git clone https://github.com/notebook-learnzy/omnivan.git
cd omnivan
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start local development server
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🎨 Customizing the Site Manually

### 1. Customizing the Playlist
Edit `src/data/playlist.js`:
```javascript
export const OMNI_PLAYLIST = [
  {
    id: "my-track",
    title: "Your Song Title",
    artist: "Artist Name",
    movie: "Album / Movie Name",
    audioUrl: "/audio/my_song.mp3", // Place MP3 in public/audio/
    youtubeId: "YOUTUBE_VIDEO_ID",
    cover: "https://images.unsplash.com/photo-..."
  },
  // Add your songs here
];
```

### 2. Replacing Background Video
Replace `musics.mp4` in the root or `public/` directory with your own `.mp4` video loop, or update the `<video>` src path in `src/App.jsx`.

### 3. Adding Audio Files
Place high-quality `.mp3` files inside `public/audio/` so tracks load with 0ms latency directly on your domain.

---

## 🚀 Deployment

### Deploy to Vercel
```bash
npx vercel
```

Or push your repository to GitHub and connect it to [Vercel](https://vercel.com). Vercel Analytics will automatically track visitor page views!

---

## 📄 License
MIT License. Free to use, fork, customize, and share! 🚌✨
