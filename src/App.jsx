import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  const [hasInteracted, setHasInteracted] = useState(false);

  // Audio crossfade hook
  const { videoRef, introState, replayIntro } = useAudioCrossfade({
    onFadeStart: () => {
      console.log('Crossfade started: video audio fading down...');
    },
    onFadeComplete: () => {
      console.log('Crossfade complete: 2008-2012 music playing!');
    }
  });

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch(err => console.log('Muted autoplay notice:', err));
    }
  }, [videoRef]);

  const startRideWithAudio = () => {
    setHasInteracted(true);
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.currentTime = 0;
      video.volume = 1.0;
      video.play().catch(e => console.log('Unmute play error:', e));
    }
  };

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
    <main 
      onClick={() => { if (!hasInteracted) startRideWithAudio(); }}
      className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden bg-slate-950 cursor-pointer select-none"
    >
      
      {/* Background Fullscreen Video */}
      <div className="fixed inset-0 -z-10 bg-black overflow-hidden">
        <video
          ref={videoRef}
          src="musics.mp4"
          autoPlay
          playsInline
          muted
          loop
          className="h-full w-full object-cover opacity-90 transition-opacity duration-700"
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
          <span>Spotify</span>
        </a>

        <a 
          href={YOUTUBE_MUSIC_PLAYLIST_URL} 
          target="_blank" 
          rel="noopener noreferrer"
          className="glass-pill flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-white transition hover:scale-105 active:scale-95 shadow-lg"
        >
          <span>YT Music</span>
        </a>
      </div>

      {/* Main Hero Header Title */}
      <div className="mt-[14vh] flex flex-col items-center px-6 text-center z-20">
        <div className="glass-pill px-4 py-1.5 rounded-full mb-3 flex items-center gap-2 text-xs font-mono text-amber-300 border border-amber-400/30 shadow-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>7:15 AM SCHOOL COMMUTE • 2008–2012 ERA</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] uppercase">
          OMNI<span className="text-amber-400 font-mono">VAN</span>
        </h1>
        
        <p className="mt-2 text-sm sm:text-base text-white/90 font-medium max-w-md drop-shadow-md">
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
            onClick={(e) => { e.stopPropagation(); startRideWithAudio(); }}
            className="glass-pill px-5 py-2.5 rounded-full text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 border border-amber-300 transition active:scale-95 shadow-xl flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-950" />
            <span>Re-live 7:15 AM Van Arrival 🚍</span>
          </button>
        </div>

        {!hasInteracted && (
          <p className="mt-3 text-xs text-amber-300/80 animate-pulse font-mono">
            👆 Tap anywhere on screen to enable van morning audio dialogue!
          </p>
        )}
      </div>

      {/* Nostalgia Sound Effects Sidebar */}
      <NostalgiaSFX />

      {/* Bottom Audio Player Component */}
      <div className="mb-[5vh] w-full px-4 z-30">
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
