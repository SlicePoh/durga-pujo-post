import React, { useState, useEffect, useRef } from 'react';
import ISTClock from './components/ISTClock';
import LivePassengersCounter from './components/LivePassengersCounter';
import AudioPlayer from './components/AudioPlayer';
import PlaylistDrawer from './components/PlaylistDrawer';
import { SPOTIFY_PLAYLIST_URL, YOUTUBE_MUSIC_PLAYLIST_URL, OMNI_PLAYLIST } from './data/playlist';

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [customYoutubeId, setCustomYoutubeId] = useState(null);

  const [musicVolume, setMusicVolume] = useState(0.0);
  const [introFinished, setIntroFinished] = useState(false);
  const videoRef = useRef(null);

  // Muted autoplay on mount
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch(err => console.log("Muted autoplay:", err));
    }
  }, []);

  // Intro Audio Crossfade & Seamless Last 5 Seconds Video Vibe Loop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const t = video.currentTime;
      const duration = video.duration || 15;

      // Phase 1: First 6 seconds - Video dialogue audio at 100%
      if (!introFinished && t < 6.0) {
        if (!video.muted) video.volume = 1.0;
        setMusicVolume(0.0);
      } 
      // Phase 2: 6s to 8.5s - Video audio decays down to 0, Music ramps up to 85%
      else if (!introFinished && t >= 6.0 && t <= 8.5) {
        const prog = (t - 6.0) / 2.5;
        if (!video.muted) video.volume = Math.max(0, 1 - prog);
        setMusicVolume(Math.min(0.85, prog * 0.85));
      } 
      // Phase 3: Past 8.5s - Video dialogue muted, Music playing at target volume
      else if (!introFinished && t > 8.5) {
        if (!video.muted) video.volume = 0.0;
        setMusicVolume(0.85);
        setIntroFinished(true);
      }

      // Vibe Loop Mechanics: When video reaches near the end of video, loop ONLY the last 5 seconds (vibing section)
      if (t >= duration - 0.3) {
        const vibeLoopStart = Math.max(8.0, duration - 5.0);
        video.currentTime = vibeLoopStart;
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [introFinished]);

  const handleUserClick = () => {
    const video = videoRef.current;
    if (video && video.muted) {
      video.muted = false;
      if (!introFinished) {
        video.currentTime = 0;
        video.volume = 1.0;
        setMusicVolume(0.0);
      }
      video.play().catch(e => console.log('Unmute play:', e));
    }
  };

  const handleCustomYoutubeUrl = (input) => {
    let videoId = input;
    if (input.includes('v=')) videoId = input.split('v=')[1]?.split('&')[0];
    else if (input.includes('youtu.be/')) videoId = input.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) setCustomYoutubeId(videoId);
  };

  return (
    <main 
      onClick={handleUserClick} 
      className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden cursor-pointer select-none"
    >
      
      {/* Background Full-Bleed Video - Layer 0 */}
      <div className="fixed inset-0 z-0 bg-black overflow-hidden">
        <video
          ref={videoRef}
          src="musics.mp4"
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
        {/* Subtle Vignette Layer */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
      </div>

      {/* Top Bar Widgets (saloon.wtf style) */}
      <ISTClock />
      <LivePassengersCounter />

      <div className="fixed right-5 top-5 z-20 flex items-center gap-2">
        <a 
          href={SPOTIFY_PLAYLIST_URL} 
          target="_blank" 
          rel="noreferrer" 
          className="group/pill flex items-center gap-2 rounded-full text-sm font-medium text-white p-2.5 sm:py-2 sm:pl-3 sm:pr-3.5 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] transition hover:opacity-80 active:scale-95"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"></path></svg>
          <span className="hidden sm:inline">Spotify</span>
          <span className="hidden sm:inline-flex"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="-rotate-45 opacity-50 transition group-hover/pill:opacity-90"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></span>
        </a>

        <a 
          href={YOUTUBE_MUSIC_PLAYLIST_URL} 
          target="_blank" 
          rel="noreferrer" 
          className="group/pill flex items-center gap-2 rounded-full text-sm font-medium text-white p-2.5 sm:py-2 sm:pl-3 sm:pr-3.5 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] transition hover:opacity-80 active:scale-95"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"></path></svg>
          <span className="hidden sm:inline">YT Music</span>
          <span className="hidden sm:inline-flex"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="-rotate-45 opacity-50 transition group-hover/pill:opacity-90"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></span>
        </a>
      </div>

      {/* Central Hero Branding (saloon.wtf style) */}
      <div className="mt-[16vh] flex flex-col items-center px-6 text-center z-20">
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)] font-hindi">
          ओम्नी वैन
        </h1>
      </div>

      {/* Bottom Music Player Pill (saloon.wtf style) */}
      <div className="mb-[8vh] flex w-full justify-center px-6 z-20">
        <AudioPlayer
          currentTrackIndex={currentTrackIndex}
          onTrackChange={setCurrentTrackIndex}
          onOpenPlaylist={() => setIsPlaylistOpen(true)}
          musicVolume={musicVolume}
          customTrackId={customYoutubeId}
        />
      </div>

      {/* Playlist Drawer Modal */}
      <PlaylistDrawer
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        currentTrackIndex={currentTrackIndex}
        onSelectTrack={(idx) => { setCustomYoutubeId(null); setCurrentTrackIndex(idx); }}
        onCustomYoutubeUrl={handleCustomYoutubeUrl}
      />

    </main>
  );
}
