import React, { useState, useRef, useCallback } from 'react';
import { Images } from 'lucide-react';
import ISTClock from './components/ISTClock';
import AudioPlayer from './components/AudioPlayer';
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

  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [customYoutubeId, setCustomYoutubeId] = useState(null);

  // Which image pack to use (style1 / style2)
  const [styleName, setStyleName] = useState(() => {
    const saved = localStorage.getItem('puja_style');
    return BACKGROUND_STYLES.includes(saved) ? saved : BACKGROUND_STYLES[0];
  });

  const audioPlayerRef = useRef(null);

  // Music plays at full volume — no video dialogue mixing anymore.
  const musicVolume = 1.0;

  // Resolve the background scene for the active track.
  // A track may specify `bg` (a BACKGROUNDS id); otherwise cycle by index.
  const activeTrack = PUJA_PLAYLIST[currentTrackIndex] || PUJA_PLAYLIST[0];
  const bgIndex = (() => {
    if (activeTrack?.bg) {
      const found = BACKGROUNDS.findIndex(b => b.id === activeTrack.bg);
      if (found !== -1) return found;
    }
    return currentTrackIndex % BACKGROUNDS.length;
  })();
  const activeBg = BACKGROUNDS[bgIndex];
  const bgSrc = `/images/${styleName}/${activeBg.file}`;

  const handleSetTrack = (idx) => {
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

  // Entrance trigger — browsers block autoplay until a user gesture.
  const startExperience = useCallback(() => {
    setHasStarted(true);
    if (audioPlayerRef.current && typeof audioPlayerRef.current.startPlayback === 'function') {
      audioPlayerRef.current.startPlayback();
    }
  }, []);

  const handleCustomYoutubeUrl = (input) => {
    let videoId = input;
    if (input.includes('v=')) videoId = input.split('v=')[1]?.split('&')[0];
    else if (input.includes('youtu.be/')) videoId = input.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) setCustomYoutubeId(videoId);
  };

  return (
    <main className="relative flex h-[100dvh] w-full flex-col justify-between overflow-hidden select-none touch-manipulation">
      
      {/* Background Full-Bleed Image — Layer 0 (crossfades on scene change) */}
      <div className="fixed inset-0 z-0 bg-black overflow-hidden pointer-events-none">
        <img
          key={bgSrc}
          src={bgSrc}
          alt={activeBg.label}
          className="h-full w-full object-cover animate-fade-in"
        />
        {/* Subtle Gradient Vignette Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
      </div>

      {/* Emotional Entrance Overlay */}
      {!hasStarted && (
        <div 
          onClick={startExperience}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/75 backdrop-blur-2xl cursor-pointer p-6 transition-all duration-500"
        >
          <div className="flex flex-col items-center max-w-lg text-center px-4">
            
            {/* Lotus / Puja Icon Badge */}
            <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/10 border border-white/20 shadow-2xl backdrop-blur-md animate-bounce">
              <span className="text-3xl">🪷</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-3 font-hindi drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] tracking-tight">
              শারদ উৎসব
            </h1>

            <p className="text-amber-300 font-hindi font-medium text-lg sm:text-2xl tracking-wide mb-8 leading-snug drop-shadow-md">
              "ঢাকের বোল আর শিউলি ফুলের গন্ধ... পুজো এসে গেছে!"
            </p>

            <button
              type="button"
              onClick={startExperience}
              className="group relative inline-flex items-center gap-3 rounded-full py-4 px-9 text-lg font-extrabold text-black bg-amber-400 hover:bg-amber-300 shadow-[0_0_50px_rgba(245,158,11,0.6)] transition-all hover:scale-105 active:scale-95"
            >
              <span className="h-3.5 w-3.5 rounded-full bg-black animate-ping"></span>
              <span className="font-hindi tracking-wide">পুজোয় চলো 🪘</span>
            </button>

            <p className="text-xs sm:text-sm font-hindi text-white/60 mt-6 tracking-wider">
              রেডিওতে মহালয়া বেজে উঠেছে... আলো জ্বলে উঠেছে প্যান্ডেলে!
            </p>
          </div>
        </div>
      )}

      {/* Top Header Controls Bar (Contains clean 'ओम्नी वैन' title at top) */}
      <header className="relative z-20 w-full px-4 pt-3 sm:pt-5 flex items-center justify-between gap-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <ISTClock />
        </div>

        {/* Clean Top Title */}
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/15">
          <span className="text-xl font-extrabold text-white font-hindi tracking-wide">শারদ উৎসব 🪷</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <a 
            href={SPOTIFY_PLAYLIST_URL} 
            target="_blank" 
            rel="noreferrer" 
            className="group/pill flex items-center gap-1.5 rounded-full text-xs sm:text-sm font-medium text-white px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/20 shadow-md transition hover:bg-white/20 active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="shrink-0"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"></path></svg>
            <span className="hidden sm:inline">Spotify</span>
          </a>

          <a 
            href={YOUTUBE_MUSIC_PLAYLIST_URL} 
            target="_blank" 
            rel="noreferrer" 
            className="group/pill flex items-center gap-1.5 rounded-full text-xs sm:text-sm font-medium text-white px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/20 shadow-md transition hover:bg-white/20 active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="shrink-0"><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104-7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"></path></svg>
            <span className="hidden sm:inline">YT Music</span>
          </a>
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

        {/* Bottom Music Player Pill */}
        <AudioPlayer
          ref={audioPlayerRef}
          currentTrackIndex={currentTrackIndex}
          onTrackChange={handleSetTrack}
          onOpenPlaylist={() => setIsPlaylistOpen(true)}
          musicVolume={musicVolume}
          customTrackId={customYoutubeId}
          hasStarted={hasStarted}
        />
      </footer>

      {/* Playlist Drawer Modal */}
      <PlaylistDrawer
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        currentTrackIndex={currentTrackIndex}
        onSelectTrack={(idx) => { setCustomYoutubeId(null); handleSetTrack(idx); }}
        onCustomYoutubeUrl={handleCustomYoutubeUrl}
      />

      <Analytics />
    </main>
  );
}
