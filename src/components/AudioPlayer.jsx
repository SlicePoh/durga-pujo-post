import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ListMusic, Disc, Sparkles } from 'lucide-react';
import { OMNI_PLAYLIST } from '../data/playlist';

let ytApiPromise = null;

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function AudioPlayer({ 
  currentTrackIndex, 
  onTrackChange, 
  onOpenPlaylist, 
  musicVolume = 0.85, 
  customTrackId = null 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState({ current: 0, duration: 0 });

  const playerRef = useRef(null);
  const containerRef = useRef(null);

  const activeTrack = customTrackId 
    ? {
        title: "Custom Track",
        artist: "YouTube Stream",
        movie: "User Selected",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
        youtubeId: customTrackId,
        tagline: "Playing your custom YouTube link"
      }
    : OMNI_PLAYLIST[currentTrackIndex] || OMNI_PLAYLIST[0];

  // Initialize YouTube IFrame API
  useEffect(() => {
    let mounted = true;

    if (!ytApiPromise) {
      ytApiPromise = new Promise((resolve) => {
        if (window.YT && window.YT.Player) {
          resolve(window.YT);
        } else {
          const prevCallback = window.onYouTubeIframeAPIReady;
          window.onYouTubeIframeAPIReady = () => {
            if (prevCallback) prevCallback();
            resolve(window.YT);
          };
          const script = document.createElement('script');
          script.src = 'https://www.youtube.com/iframe_api';
          document.head.appendChild(script);
        }
      });
    }

    ytApiPromise.then((YT) => {
      if (!mounted || !containerRef.current || playerRef.current) return;

      playerRef.current = new YT.Player(containerRef.current, {
        videoId: activeTrack.youtubeId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          autoplay: 0,
          start: 5
        },
        events: {
          onReady: (event) => {
            setIsReady(true);
            event.target.setVolume(Math.round(musicVolume * 100));
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            } else if (event.data === YT.PlayerState.ENDED) {
              setIsPlaying(false);
              onTrackChange((currentTrackIndex + 1) % OMNI_PLAYLIST.length);
            }
          }
        }
      });
    });

    return () => {
      mounted = false;
    };
  }, []);

  // Update track when activeTrack changes
  useEffect(() => {
    if (playerRef.current && isReady && activeTrack.youtubeId) {
      playerRef.current.loadVideoById(activeTrack.youtubeId, 5);
      setIsPlaying(true);
    }
  }, [currentTrackIndex, customTrackId, isReady]);

  // Dynamic Volume Control (including Crossfade)
  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      const targetVol = isMuted ? 0 : Math.round(musicVolume * 100);
      playerRef.current.setVolume(targetVol);
    }
  }, [musicVolume, isMuted]);

  // Time & Progress Poller
  useEffect(() => {
    const timer = setInterval(() => {
      const player = playerRef.current;
      if (player && typeof player.getCurrentTime === 'function' && typeof player.getDuration === 'function') {
        const current = player.getCurrentTime() || 0;
        const duration = player.getDuration() || 0;
        setProgress({ current, duration });
      }
    }, 400);

    return () => clearInterval(timer);
  }, []);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleSeek = (e) => {
    const player = playerRef.current;
    if (!player || !progress.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickPos = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const seekTime = clickPos * progress.duration;

    player.seekTo(seekTime, true);
    setProgress(prev => ({ ...prev, current: seekTime }));
  };

  const percent = progress.duration > 0 ? (progress.current / progress.duration) * 100 : 0;

  return (
    <div className="w-full max-w-xl mx-auto z-30">
      {/* Hidden YouTube IFrame Container */}
      <div className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
        <div ref={containerRef} />
      </div>

      {/* Main Glassmorphic Cassette Deck */}
      <div className="glass-panel rounded-full p-3 pr-6 flex items-center gap-4 border border-white/20 shadow-2xl transition-all hover:border-white/30">
        
        {/* Spinning Vinyl / Cassette Art */}
        <div className="relative h-18 w-18 sm:h-20 sm:w-20 shrink-0">
          <div 
            className={`h-full w-full rounded-full overflow-hidden shadow-xl ring-2 ring-white/20 transition-all ${
              isPlaying ? 'animate-spin-slow ring-amber-400/50' : 'opacity-90'
            }`}
          >
            <img 
              src={activeTrack.cover} 
              alt={activeTrack.title} 
              className="h-full w-full object-cover" 
            />
          </div>
          
          {/* Cassette Spool Center Hole */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-950/80 ring-2 ring-white/50 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-amber-400"></div>
          </div>
        </div>

        {/* Track Title & Progress Bar */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-[10px] font-mono text-amber-300 border border-amber-500/30">
              2008-2012
            </span>
            <p className="truncate text-sm sm:text-base font-bold text-white drop-shadow-sm">
              {activeTrack.title}
            </p>
          </div>
          
          <p className="truncate text-xs text-white/70 mt-0.5">
            {activeTrack.artist} • <span className="text-amber-200/90 font-medium">{activeTrack.movie}</span>
          </p>

          {/* Seek Bar */}
          <div className="mt-2">
            <div 
              onClick={handleSeek}
              className="group/bar relative h-2 w-full cursor-pointer flex items-center"
              role="slider"
              aria-label="Seek track"
            >
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20 backdrop-blur-sm">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-200 transition-all duration-150"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div 
                className="absolute h-3 w-3 -translate-x-1/2 rounded-full bg-amber-300 opacity-0 shadow-lg transition-opacity group-hover/bar:opacity-100 ring-2 ring-white"
                style={{ left: `${percent}%` }}
              />
            </div>
            
            <div className="mt-1 flex items-center justify-between text-[11px] font-mono tabular-nums text-white/60">
              <span>{formatTime(progress.current)}</span>
              <span>{formatTime(progress.duration)}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button 
            onClick={() => onTrackChange((currentTrackIndex - 1 + OMNI_PLAYLIST.length) % OMNI_PLAYLIST.length)}
            className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white active:scale-95"
            title="Previous song"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          <button 
            onClick={togglePlay}
            disabled={!isReady}
            className="grid h-11 w-11 place-items-center rounded-full bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition hover:scale-105 active:scale-95 disabled:opacity-50"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button 
            onClick={() => onTrackChange((currentTrackIndex + 1) % OMNI_PLAYLIST.length)}
            className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white active:scale-95"
            title="Next song"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>

          <button 
            onClick={onOpenPlaylist}
            className="grid h-9 w-9 place-items-center rounded-full text-white/80 hover:text-white hover:bg-white/15 transition active:scale-95 ml-1"
            title="Open 2008-2012 Playlist"
          >
            <ListMusic className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
