import React, { useState, useCallback } from 'react';
import { useAudioCrossfade } from './hooks/useAudioCrossfade';
import ISTClock from './components/ISTClock';
import LivePassengersCounter from './components/LivePassengersCounter';
import AudioPlayer from './components/AudioPlayer';
import PlaylistDrawer from './components/PlaylistDrawer';
import NostalgiaSFX from './components/NostalgiaSFX';
import { SPOTIFY_PLAYLIST_URL, YOUTUBE_MUSIC_PLAYLIST_URL, OMNI_PLAYLIST } from './data/playlist';
import { ExternalLink, RotateCcw, Volume2, Music2, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [customYoutubeId, setCustomYoutubeId] = useState(null);

  // Audio crossfade hook
  const { videoRef, introState, replayIntro } = useAudioCrossfade({
    onFadeStart: () => {
      console.log('Crossfade started: video audio fading down...');
    },
    onFadeComplete: () => {
      console.log('Crossfade complete: 2008-2012 music playing!');
    }
  });

  const handleSelectTrack = (index) => {
    setCustomYoutubeId(null);
    setCurrentTrackIndex(index);
  };

  const handleCustomYoutubeUrl = (input) => {
    let videoId = input;
    if (input.includes('v=')) {
      videoId = input.split('v=')[1]?.split('&')[0];
    } else if (input.includes('youtu.be/')) {
      videoId = input.split('youtu.be/')[1]?.split('?')[0];
    }
    if (videoId) {
      setCustomYoutubeId(videoId);
    }
  };

  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden bg-slate-950">
      
      {/* Background Fullscreen Video */}
      <div className="fixed inset-0 -z-10 bg-black overflow-hidden">
        <video
          ref={videoRef}
          src="/musics.mp4"
          autoPlay
          playsInline
          loop
          className="h-full w-full object-cover opacity-85 transition-opacity duration-1000"
        />
        
        {/* Dark Vignette & Atmospheric Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/90" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(2,6,23,0.65)_100%)]" />
      </div>

      {/* Top Bar Navigation & Widgets */}
      <ISTClock />
      <LivePassengersCounter />

      <div className="fixed right-5 top-5 z-30 flex items-center gap-2">
        <a 
          href={SPOTIFY_PLAYLIST_URL} 
          target="_blank" 
          rel="noopener noreferrer"
          className="glass-pill flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-white transition hover:scale-105 active:scale-95 shadow-lg"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DB954">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <span className="hidden sm:inline">Spotify</span>
        </a>

        <a 
          href={YOUTUBE_MUSIC_PLAYLIST_URL} 
          target="_blank" 
          rel="noopener noreferrer"
          className="glass-pill flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-white transition hover:scale-105 active:scale-95 shadow-lg"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF0000">
            <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"/>
          </svg>
          <span className="hidden sm:inline">YT Music</span>
        </a>
      </div>

      {/* Main Hero Header Title */}
      <div className="mt-[15vh] flex flex-col items-center px-6 text-center z-20">
        <div className="glass-pill px-4 py-1.5 rounded-full mb-3 flex items-center gap-2 text-xs font-mono text-amber-300 border border-amber-400/30 shadow-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>7:15 AM SCHOOL COMMUTE • 2008–2012 ERA</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] uppercase">
          OMNI<span className="text-amber-400 font-mono">VAN</span>
        </h1>
        
        <p className="mt-2 text-sm sm:text-base text-white/80 font-medium max-w-md drop-shadow-md">
          Sliding door <span className="text-amber-300 font-mono">Kachak!</span>, Nokia 5310 tunes & 2008–2012 school commute hits.
        </p>

        {/* Crossfade Status & Re-live Button */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          {introState.isCrossfading && (
            <div className="glass-pill px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs text-amber-300 animate-pulse border border-amber-400/40">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Van ambient audio fading into 2008-2012 music...</span>
            </div>
          )}

          <button
            onClick={replayIntro}
            className="glass-pill px-4 py-2 rounded-full flex items-center gap-2 text-xs font-semibold text-white hover:bg-amber-500/20 hover:text-amber-300 border border-white/20 transition active:scale-95 shadow-lg"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Re-live 7:15 AM Van Arrival 🚍</span>
          </button>
        </div>
      </div>

      {/* Nostalgia Sound Effects Sidebar */}
      <NostalgiaSFX />

      {/* Bottom Audio Player Component */}
      <div className="mb-[6vh] w-full px-4 z-30">
        <AudioPlayer 
          currentTrackIndex={currentTrackIndex}
          onTrackChange={setCurrentTrackIndex}
          onOpenPlaylist={() => setIsPlaylistOpen(true)}
          musicVolume={introState.musicVolume}
          customTrackId={customYoutubeId}
        />
      </div>

      {/* Playlist Drawer Modal */}
      <PlaylistDrawer 
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        currentTrackIndex={currentTrackIndex}
        onSelectTrack={handleSelectTrack}
        onCustomYoutubeUrl={handleCustomYoutubeUrl}
      />
    </main>
  );
}
