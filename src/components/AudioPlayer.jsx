import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, ListMusic } from 'lucide-react';
import { PUJA_PLAYLIST } from '../data/playlist';

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const AudioPlayer = forwardRef(({ 
  currentTrackIndex, 
  onTrackChange, 
  onOpenPlaylist, 
  musicVolume = 1.0, 
  isPlaying = false,
  onPlayingChange
}, ref) => {
  const [progress, setProgress] = useState({ current: 0, duration: 0 });

  const audioRef = useRef(null);
  const isFirstMountRef = useRef(true);

  const activeTrack = PUJA_PLAYLIST[currentTrackIndex] || PUJA_PLAYLIST[0];

  const togglePlay = useCallback(() => {
    const aud = audioRef.current;
    if (!aud) return;
    if (isPlaying) {
      aud.pause();
      onPlayingChange(false);
    } else {
      aud.play().then(() => onPlayingChange(true)).catch(e => console.log('Toggle error:', e));
    }
  }, [isPlaying, onPlayingChange]);

  // Guaranteed Initial Start
  useImperativeHandle(ref, () => ({
    startPlayback: () => {
      const aud = audioRef.current;
      if (aud) {
        aud.src = activeTrack.audioUrl;
        aud.currentTime = 0;
        aud.volume = Math.max(0, Math.min(1, musicVolume));
        aud.load();
        const playPromise = aud.play();
        if (playPromise !== undefined) {
          playPromise.then(() => onPlayingChange(true)).catch(err => console.log("Audio start error:", err));
        }
      }
    },
    togglePlay
  }));

  // Clean, Non-Stuck Track Switching Routine
  const loadAndPlayTrack = useCallback(() => {
    const aud = audioRef.current;
    if (!aud) return;

    aud.src = activeTrack.audioUrl;
    aud.currentTime = 0;
    aud.volume = Math.max(0, Math.min(1, musicVolume));
    aud.load();

    const playPromise = aud.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => onPlayingChange(true))
        .catch(err => {
          console.log("Play pending network buffering:", err);
        });
    }
  }, [activeTrack, musicVolume, onPlayingChange]);

  // Handle Track Index Changes (Skip initial mount)
  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }
    loadAndPlayTrack();
  }, [currentTrackIndex]);

  // Synchronize Volume Smoothly on the single audio line
  useEffect(() => {
    const aud = audioRef.current;
    if (aud) {
      aud.volume = Math.max(0, Math.min(1, musicVolume));
    }
  }, [musicVolume]);

  // Progress Tracker
  useEffect(() => {
    const interval = setInterval(() => {
      const aud = audioRef.current;
      if (aud?.duration) {
        setProgress({ current: aud.currentTime || 0, duration: aud.duration || 0 });
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const handleSeek = (e) => {
    const aud = audioRef.current;
    if (!aud || !progress.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const seekTime = pct * progress.duration;
    aud.currentTime = seekTime;
    setProgress(prev => ({ ...prev, current: seekTime }));
  };

  const handleSeekKeyDown = (e) => {
    const aud = audioRef.current;
    if (!aud || !progress.duration) return;
    const step = progress.duration * 0.05;
    if (e.key === 'ArrowRight') {
      aud.currentTime = Math.min(progress.duration, aud.currentTime + step);
    } else if (e.key === 'ArrowLeft') {
      aud.currentTime = Math.max(0, aud.currentTime - step);
    }
  };

  const percent = progress.duration > 0 ? (progress.current / progress.duration) * 100 : 0;

  return (
    <div className="w-full max-w-xl mx-auto z-30">
      {/* SINGLE UNIFIED STREAMING AUDIO ELEMENT */}
      <audio 
        ref={audioRef} 
        src={activeTrack.audioUrl} 
        preload="auto"
        onEnded={() => {
          onPlayingChange(false);
          onTrackChange((currentTrackIndex + 1) % PUJA_PLAYLIST.length);
        }}
      >
        <track kind="captions" />
      </audio>

      <div className="group relative flex items-center gap-2 sm:gap-4 rounded-2xl sm:rounded-full p-2 sm:p-3 pr-2.5 sm:pr-5 bg-white/10 backdrop-blur-xs backdrop-saturate-150 border border-white/20 shadow-[0_8px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)]">
        {/* Cover Art */}
        <div className="relative h-11 w-11 sm:h-16 sm:w-16 shrink-0">
          <div className={`h-full w-full rounded-full overflow-hidden shadow-lg ring-1 ring-white/20 ${isPlaying ? 'animate-spin-slow' : 'opacity-90'}`}>
            <img src={activeTrack.cover} alt={activeTrack.title} className="h-full w-full object-cover" />
          </div>
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 sm:h-2.5 sm:w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/70 ring-2 ring-white/40" />
        </div>

        {/* Track Title & Seekbar */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs sm:text-sm font-semibold text-white drop-shadow-sm">{activeTrack.title}</p>
          <p className="truncate text-[11px] sm:text-xs text-white/70">{activeTrack.artist}</p>

          <div className="mt-1 sm:mt-1.5">
            <div onClick={handleSeek} onKeyDown={handleSeekKeyDown} className="group/bar relative h-2 w-full cursor-pointer" role="slider" tabIndex={0} aria-label="Seek" aria-valuenow={Math.round(percent)} aria-valuemin={0} aria-valuemax={100}>
              <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-amber-300/90" style={{ width: `${percent}%` }} />
              </div>
              <div className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover/bar:opacity-100" style={{ left: `${percent}%` }} />
            </div>
            <div className="mt-1 text-left text-[10px] sm:text-[11px] tabular-nums text-white/60">
              {formatTime(progress.current)} / {formatTime(progress.duration)}
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-0 sm:gap-1 shrink-0">
          <button 
            type="button"
            onClick={() => onTrackChange((currentTrackIndex - 1 + PUJA_PLAYLIST.length) % PUJA_PLAYLIST.length)} 
            className="grid h-7 w-7 sm:h-9 sm:w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white active:scale-95"
            aria-label="Previous Track"
          >
            <SkipBack className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
          </button>

          <button 
            type="button"
            onClick={togglePlay} 
            className="grid h-9 w-9 sm:h-11 sm:w-11 place-items-center rounded-full bg-white text-black shadow-lg transition hover:scale-105 active:scale-95"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-current" /> : <Play className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-current ml-0.5" />}
          </button>

          <button 
            type="button"
            onClick={() => onTrackChange((currentTrackIndex + 1) % PUJA_PLAYLIST.length)} 
            className="grid h-7 w-7 sm:h-9 sm:w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white active:scale-95"
            aria-label="Next Track"
          >
            <SkipForward className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
          </button>

          <button 
            type="button"
            onClick={onOpenPlaylist} 
            className="grid h-7 w-7 sm:h-9 sm:w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white active:scale-95"
            aria-label="Playlist Drawer"
          >
            <ListMusic className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

export default AudioPlayer;
