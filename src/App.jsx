import React, { useState, useRef } from 'react';
import { Images, ListMusic, X } from 'lucide-react';
import ISTClock from './components/ISTClock';
import AudioPlayer from './components/AudioPlayer';
import YouTubePlayer from './components/YouTubePlayer';
import PlaylistDrawer from './components/PlaylistDrawer';
import {
  SPOTIFY_PLAYLIST_URL,
  YOUTUBE_MUSIC_PLAYLIST_URL,
  PUJA_PLAYLIST,
  BACKGROUNDS,
  BACKGROUND_STYLES,
} from './data/playlist';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => {
    const saved = localStorage.getItem('puja_track_index');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  // customEmbed: { type: 'youtube' | 'spotify', id: string } | null
  const [customEmbed, setCustomEmbed] = useState(null);

  // Which image pack to use (style1 / style2)
  const [styleName, setStyleName] = useState(() => {
    const saved = localStorage.getItem('puja_style');
    return BACKGROUND_STYLES.includes(saved) ? saved : BACKGROUND_STYLES[0];
  });

  const audioPlayerRef = useRef(null);

  // Music plays at full volume
  const musicVolume = 1.0;

  // Resolve the background scene for the active track.
  // When custom embed is active, use bonedi1 background.
  const activeTrack = PUJA_PLAYLIST[currentTrackIndex] || PUJA_PLAYLIST[0];
  const bgIndex = (() => {
    if (customEmbed) {
      return BACKGROUNDS.findIndex(b => b.id === 'bonedi1');
    }
    if (activeTrack?.bg) {
      const found = BACKGROUNDS.findIndex(b => b.id === activeTrack.bg);
      if (found !== -1) return found;
    }
    return currentTrackIndex % BACKGROUNDS.length;
  })();
  const activeBg = BACKGROUNDS[bgIndex];
  const bgSrc = `/images/${styleName}/${activeBg.file}`;

  const handleSetTrack = (idx) => {
    setCustomEmbed(null);
    setCurrentTrackIndex(idx);
    localStorage.setItem('puja_track_index', idx);
  };

  const toggleStyle = () => {
    setStyleName(prev => {
      const next = prev === BACKGROUND_STYLES[0] ? BACKGROUND_STYLES[1] : BACKGROUND_STYLES[0];
      localStorage.setItem('puja_style', next);
      return next;
    });
  };

  const handleCustomUrl = (input) => {
    // YouTube
    if (input.includes('youtube.com') || input.includes('youtu.be')) {
      let videoId = input;
      if (input.includes('v=')) videoId = input.split('v=')[1]?.split('&')[0];
      else if (input.includes('youtu.be/')) videoId = input.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) setCustomEmbed({ type: 'youtube', id: videoId });
      return;
    }
    // Spotify track
    if (input.includes('spotify.com/track/')) {
      const trackId = input.split('track/')[1]?.split('?')[0];
      if (trackId) setCustomEmbed({ type: 'spotify', id: trackId });
      return;
    }
    // Bare YouTube video ID fallback
    if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) {
      setCustomEmbed({ type: 'youtube', id: input.trim() });
    }
  };

  return (
    <main className="relative flex h-[100dvh] w-full flex-col justify-between overflow-hidden select-none touch-manipulation">
      
      {/* Background Full-Bleed Image — Layer 0 (crossfades on scene change) */}
      <div className="fixed inset-0 z-0 bg-black overflow-hidden pointer-events-none">
        <img key={bgSrc} src={bgSrc} alt={activeBg.label} className="h-full w-full object-cover animate-fade-in" />
        {/* Subtle Gradient Vignette Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
      </div>

      {/* Top Header Controls Bar */}
      <header className="relative z-20 w-full px-4 pt-3 sm:pt-5 max-w-7xl mx-auto grid grid-cols-3 items-center">
        {/* Left: Clock */}
        <div className="flex items-center justify-start">
          <ISTClock />
        </div>

        {/* Center: Bengali text */}
        <div className="flex items-center justify-center">
            <span className="text-2xl sm:text-5xl font-medium text-white font-hindi tracking-wide">শারদীয় উৎসব</span>
        </div>

        {/* Right: Spotify & YT Music buttons */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
          <a 
            href={SPOTIFY_PLAYLIST_URL} 
            target="_blank" 
            rel="noreferrer" 
            className="group/pill flex items-center gap-1.5 rounded-full text-xs sm:text-sm font-medium text-white px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/20 shadow-md transition hover:bg-white/20 active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="shrink-0"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"></path></svg>
            <span className="hidden sm:inline">Spotify Playlist</span>
          </a>

          {/* <a 
            href={YOUTUBE_MUSIC_PLAYLIST_URL} 
            target="_blank" 
            rel="noreferrer" 
            className="group/pill flex items-center gap-1.5 rounded-full text-xs sm:text-sm font-medium text-white px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/20 shadow-md transition hover:bg-white/20 active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="shrink-0"><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104-7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"></path></svg>
            <span className="hidden sm:inline">YT Music</span>
          </a> */}
        </div>
      </header>

      {/* Completely Clean & Unobstructed Center Viewport */}
      <div className="flex-1 pointer-events-none" />

      {/* Bottom Deck Wrapper */}
      <footer className="relative z-20 flex flex-col items-center gap-2.5 px-3 pb-4 sm:pb-6 w-full max-w-xl mx-auto">
        
        {/* Scene label + Style toggle */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full py-1.5 px-4 text-xs font-bold text-white bg-white/10 backdrop-blur-xl border border-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)] ring-1 ring-white/20">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="font-hindi">{activeBg.label}</span>
            <span className="text-white/50 font-normal hidden sm:inline">· {activeBg.vibe}</span>
          </div>

          <button
            type="button"
            onClick={toggleStyle}
            className="group/pill inline-flex items-center gap-1.5 rounded-full py-1.5 px-3 text-xs font-bold text-white bg-white/10 backdrop-blur-xl border border-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition hover:bg-white/25 active:scale-95 ring-1 ring-white/20"
            aria-label="Switch image style"
          >
            <Images className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wide">{styleName === BACKGROUND_STYLES[0] ? 'Editorial' : 'Cinematic'}</span>
          </button>
        </div>

        {/* Bottom Music Player */}
        {customEmbed && customEmbed.type === 'youtube' ? (
          <YouTubePlayer
            videoId={customEmbed.id}
            onOpenPlaylist={() => setIsPlaylistOpen(true)}
            onClose={() => setCustomEmbed(null)}
          />
        ) : customEmbed && customEmbed.type === 'spotify' ? (
          <div className="w-full max-w-xl mx-auto z-30">
            <div className="relative flex items-center gap-2.5 sm:gap-4 rounded-3xl sm:rounded-full p-2 sm:p-2.5 pr-3 sm:pr-4 bg-white/10 backdrop-blur-2xl backdrop-saturate-150 border border-white/20 shadow-[0_8px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)]">
              {/* Embed area */}
              <div className="flex-1 min-w-0 rounded-2xl overflow-hidden h-[80px]">
                <iframe
                  src={`https://open.spotify.com/embed/track/${customEmbed.id}?utm_source=generator&theme=0`}
                  className="w-full h-[80px] border-0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  title="Spotify Player"
                />
              </div>

              {/* Controls: Playlist + Close */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPlaylistOpen(true)}
                  className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white active:scale-95"
                  aria-label="Open Playlist"
                >
                  <ListMusic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCustomEmbed(null)}
                  className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white active:scale-95"
                  aria-label="Close custom player"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <AudioPlayer
            ref={audioPlayerRef}
            currentTrackIndex={currentTrackIndex}
            onTrackChange={handleSetTrack}
            onOpenPlaylist={() => setIsPlaylistOpen(true)}
            musicVolume={musicVolume}
            isPlaying={isPlaying}
            onPlayingChange={setIsPlaying}
          />
        )}
      </footer>

      {/* Playlist Drawer Modal */}
      <PlaylistDrawer
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        currentTrackIndex={currentTrackIndex}
        onSelectTrack={(idx) => { setCustomEmbed(null); handleSetTrack(idx); }}
        onCustomYoutubeUrl={handleCustomUrl}
        isPlaying={isPlaying}
        onTogglePlay={() => {
          if (audioPlayerRef.current) {
            const aud = audioPlayerRef.current;
            if (typeof aud.togglePlay === 'function') aud.togglePlay();
          }
        }}
      />

      <Analytics />
    </main>
  );
}
