# 🚌 OmniVan Nostalgia - Interactive Audio-Visual Experience

> *Relive the golden era of 2008–2012 school commutes in an Indian Omni Van. High-octane nostalgia, video dialogue crossfading into iconic Bollywood hits, live passenger counter, and ambient vibes.*

![OmniVan Nostalgia](https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop)

---

## 🤖 BUILD YOUR OWN WEBSITE (No Coding Knowledge Required!)

Want to create your own personalized web experience (e.g. *90s Cybercafe*, *Lo-Fi Rain Drive*, *Retro Anime Train*, *Gaming Den*)? **You don't need to know how to code!** You can use AI to build it for you in 2 minutes.

---

### ✏️ BLOCK 1: YOUR CUSTOM IDEA (Fill this in!)
Before using the AI prompt in [`AGENT_INSTRUCTIONS.md`](./AGENT_INSTRUCTIONS.md), decide on your idea:

1. **Theme Name**: (e.g. *90s Cybercafe in Delhi* / *Tokyo Rain Drive*)
2. **Background Video**: (e.g. *Rainy window view* / *Retro driving loop*)
3. **Playlist**: (e.g. *Your top 5 favorite songs*)
4. **Button Text**: (e.g. *Tap to Enter 🎮* / *Start Ride 🌧️*)

---

### 📢 BLOCK 2: HOW TO GENERATE IT USING GEMINI / CHATGPT / CURSOR

Follow these 4 simple steps:

1. **Open the Prompt File**: Click on [`AGENT_INSTRUCTIONS.md`](./AGENT_INSTRUCTIONS.md).
2. **Copy the Text**: Fill in your idea into **Block 1** and copy the prompt text.
3. **Paste into Gemini or ChatGPT**:
   - Go to [Google Gemini](https://gemini.google.com) or [ChatGPT](https://chatgpt.com) or your AI Editor (Antigravity / Cursor).
   - Paste the prompt and press **Enter**.
4. **Publish Free**:
   - Ask Gemini or ChatGPT: *"How do I publish this live on Vercel for free?"*
   - It will guide you step-by-step to get your live website link!

---

## ✨ Features of this Website

- 🎥 **Seamless Video Loop**: High-definition video background capturing the authentic Omni Van commute experience.
- 🎚️ **8-Second Audio Mixing Engine**: Video dialogue automatically crossfades from 100% down to ambient level while your favorite nostalgic tracks fade up.
- 🎵 **Curated 2000s Nostalgia Playlist**: Instant access to classics like *Aahun Aahun*, *Give Me Some Sunshine*, *Kabhi Kabhi Aditi*, *Iktara*, *Tu Jaane Na*, *Emptiness*, *Baby*, and more.
- 📻 **Interactive Audio Dock & Drawer**: Play/pause, track navigation, volume control, local MP3 playback, and custom YouTube URL player.
- 👥 **Live Passenger Counter**: Real-time animated visitor counter reflecting live passengers riding along with you.
- 🕒 **IST Clock**: Live Indian Standard Time clock display.
- 📊 **Vercel Analytics**: Built-in page view & visitor telemetry via `@vercel/analytics`.

---

## 🛠️ Developer Quick Start (For Coders)

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
