import React, { useState, useEffect, useRef, useCallback } from 'react';
import ISTClock from './components/ISTClock';
import LivePassengersCounter from './components/LivePassengersCounter';
import AudioPlayer from './components/AudioPlayer';
import PlaylistDrawer from './components/PlaylistDrawer';
import { SPOTIFY_PLAYLIST_URL, YOUTUBE_MUSIC_PLAYLIST_URL, OMNI_PLAYLIST } from './data/playlist';

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => {
    const saved = localStorage.getItem('omni_pinned_track_index');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [customYoutubeId, setCustomYoutubeId] = useState(null);

  const [musicVolume, setMusicVolume] = useState(0.20); // Starts at 20%
  const [introFinished, setIntroFinished] = useState(false);

  const videoRef = useRef(null);
  const audioPlayerRef = useRef(null);

  // Changing tracks MUST NOT restart the background video! Video stays in last 4s loop!
  const handleSetTrack = (idx) => {
    setCurrentTrackIndex(idx);
    localStorage.setItem('omni_pinned_track_index', idx);
    setIntroFinished(true); // Locks video in continuous 4s vibe loop
  };

  // Ultra-Seamless Entrance Trigger
  const startCommuteExperience = useCallback(() => {
    const video = videoRef.current;
    setHasStarted(true);

    if (video) {
      video.muted = false;
      video.volume = 1.0; // 100% Video dialogue volume at 0.0s
      video.currentTime = 0;
      video.play().catch(err => console.log("Video play notice:", err));
    }

    setMusicVolume(0.20); // 20% Music volume at 0.0s
    if (audioPlayerRef.current && typeof audioPlayerRef.current.startPlayback === 'function') {
      audioPlayerRef.current.startPlayback();
    }
  }, []);

  // Video (100% -> 20%) & Aahun Aahun Music (20% -> 100%) Exact 8-Second Mixing Engine
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const t = video.currentTime;
      const duration = video.duration || 15;

      if (hasStarted && !introFinished) {
        if (t <= 8.0) {
          const prog = t / 8.0; // 0.0 to 1.0
          video.volume = 1.0 - (0.80 * prog); // 1.0 -> 0.20
          setMusicVolume(0.20 + (0.80 * prog)); // 0.20 -> 1.0
        } 
        else if (t > 8.0) {
          video.volume = 0.0;
          setMusicVolume(1.0);
          setIntroFinished(true);
        }
      }

      // Continuous Vibe Loop of last 4 seconds (NEVER RESTARTS ON SONG CHANGE)
      if (t >= duration - 0.3) {
        const vibeLoopStart = Math.max(8.0, duration - 4.0);
        video.currentTime = vibeLoopStart;
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [hasStarted, introFinished]);

  const handleCustomYoutubeUrl = (input) => {
    let videoId = input;
    if (input.includes('v=')) videoId = input.split('v=')[1]?.split('&')[0];
    else if (input.includes('youtu.be/')) videoId = input.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) setCustomYoutubeId(videoId);
  };

  return (
    <main className="relative flex h-[100dvh] w-full flex-col justify-between overflow-hidden select-none touch-manipulation">
      
      {/* Background Full-Bleed Video - Layer 0 */}
      <div className="fixed inset-0 z-0 bg-black overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          src="musics.mp4"
          autoPlay
          playsInline
          muted={!hasStarted}
          className="h-full w-full object-cover"
        />
        {/* Subtle Vignette Layer */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
      </div>

      {/* Nostalgic Emotional Entrance Overlay */}
      {!hasStarted && (
        <div 
          onClick={startCommuteExperience}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/75 backdrop-blur-2xl cursor-pointer p-6 transition-all duration-500"
        >
          <div className="flex flex-col items-center max-w-lg text-center px-4">
            
            {/* Van Icon Badge */}
            <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/10 border border-white/20 shadow-2xl backdrop-blur-md animate-bounce">
              <span className="text-3xl">🚌</span>
            </div>

            <h1 className="text-6xl sm:text-8xl font-extrabold text-white mb-3 font-hindi drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] tracking-tight">
              ओम्नी वैन
            </h1>

            <p className="text-amber-300 font-hindi font-medium text-lg sm:text-2xl tracking-wide mb-8 leading-snug drop-shadow-md">
              "अरे बस्ता संभालो... वैन बाहर हॉर्न दे रही है!"
            </p>

            <button
              type="button"
              onClick={startCommuteExperience}
              className="group relative inline-flex items-center gap-3 rounded-full py-4 px-9 text-lg font-extrabold text-black bg-amber-400 hover:bg-amber-300 shadow-[0_0_50px_rgba(245,158,11,0.6)] transition-all hover:scale-105 active:scale-95"
            >
              <span className="h-3.5 w-3.5 rounded-full bg-black animate-ping"></span>
              <span className="font-hindi tracking-wide">वैन में बैठो 🚌</span>
            </button>

            <p className="text-xs sm:text-sm font-hindi text-white/60 mt-6 tracking-wider">
              भैया ने 93.5 RED FM चला दिया है... पीछे वाली सीट तैयार है!
            </p>
          </div>
        </div>
      )}

      {/* Top Header Controls Area */}
      <header className="relative z-20 w-full px-4 pt-3 sm:pt-5 flex flex-wrap items-center justify-between gap-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <ISTClock />
          <LivePassengersCounter />
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="shrink-0"><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"></path></svg>
            <span className="hidden sm:inline">YT Music</span>
          </a>
        </div>
      </header>

      {/* Central Hero Branding */}
      <div className="relative z-20 flex flex-col items-center px-4 text-center my-auto">
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_35px_rgba(0,0,0,0.95)] font-hindi">
          ओम्नी वैन
        </h1>
        <p className="mt-2 text-xs sm:text-sm font-hindi text-amber-300/90 tracking-wider font-medium drop-shadow-md">
          पीछे वाली सीट की यादें
        </p>
      </div>

      {/* Bottom Deck Wrapper */}
      <footer className="relative z-20 flex flex-col items-center gap-2.5 px-3 pb-4 sm:pb-6 w-full max-w-xl mx-auto">
        
        {/* Minimal Glassmorphism "Jaldi Karo!" Button */}
        <button
          type="button"
          onClick={() => {
            const video = videoRef.current;
            if (video) {
              video.currentTime = 0;
              video.volume = 1.0;
              setIntroFinished(false);
            }
          }}
          className="group/pill inline-flex items-center gap-2 rounded-full py-1.5 px-4 text-xs font-bold text-white bg-white/10 backdrop-blur-xl border border-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition hover:bg-white/25 active:scale-95 ring-1 ring-white/20"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>Jaldi Karo! 🚌</span>
        </button>

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

    </main>
  );
}
