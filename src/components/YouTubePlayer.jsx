import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, ListMusic, X } from 'lucide-react';

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function YouTubePlayer({ videoId, onOpenPlaylist, onClose }) {
  const [meta, setMeta] = useState({ title: 'Loading...', thumbnail: '' });
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState({ current: 0, duration: 0 });
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  // Fetch video metadata via oEmbed
  useEffect(() => {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        setMeta({
          title: data.title || 'YouTube Track',
          thumbnail: data.thumbnail_url || ''
        });
      })
      .catch(() => setMeta({ title: 'YouTube Track', thumbnail: '' }));
  }, [videoId]);

  // Load YouTube IFrame API and create player
  useEffect(() => {
    const createPlayer = () => {
      const instance = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: { autoplay: 1, controls: 0, modestbranding: 1, rel: 0 },
        events: {
          onReady: (e) => {
            playerRef.current = e.target;
            e.target.playVideo();
            setIsPlaying(true);
          },
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
            else if (e.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
            else if (e.data === window.YT.PlayerState.ENDED) setIsPlaying(false);
          }
        }
      });
      playerRef.current = instance;
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      // Load the API script if not already present
      if (!document.getElementById('yt-iframe-api')) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
      playerRef.current = null;
    };
  }, [videoId]);

  // Progress tracker
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const p = playerRef.current;
      if (p && typeof p.getCurrentTime === 'function') {
        setProgress({
          current: p.getCurrentTime() || 0,
          duration: p.getDuration() || 0
        });
      }
    }, 500);
    return () => clearInterval(intervalRef.current);
  }, []);

  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (isPlaying) {
      p.pauseVideo();
    } else {
      p.playVideo();
    }
  }, [isPlaying]);

  const handleSeek = (e) => {
    const p = playerRef.current;
    if (!p || !progress.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    p.seekTo(pct * progress.duration, true);
  };

  const handleSeekKeyDown = (e) => {
    const p = playerRef.current;
    if (!p || !progress.duration) return;
    const step = progress.duration * 0.05;
    if (e.key === 'ArrowRight') {
      p.seekTo(Math.min(progress.duration, progress.current + step), true);
    } else if (e.key === 'ArrowLeft') {
      p.seekTo(Math.max(0, progress.current - step), true);
    }
  };

  const percent = progress.duration > 0 ? (progress.current / progress.duration) * 100 : 0;

  return (
    <div className="w-full max-w-xl mx-auto z-30">
      {/* Hidden YT player */}
      <div className="fixed w-0 h-0 overflow-hidden opacity-0 pointer-events-none" aria-hidden="true">
        <div ref={containerRef} />
      </div>

      {/* Custom player UI */}
      <div className="group relative flex items-center gap-2.5 sm:gap-4 rounded-3xl sm:rounded-full p-2.5 sm:p-3 pr-3 sm:pr-5 bg-white/10 backdrop-blur-xs backdrop-saturate-150 border border-white/20 shadow-[0_8px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)]">
        {/* Thumbnail as cover art */}
        <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0">
          <div className={`h-full w-full rounded-full overflow-hidden shadow-lg ring-1 ring-white/20 ${isPlaying ? 'animate-spin-slow' : 'opacity-90'}`}>
            {meta.thumbnail ? (
              <img src={meta.thumbnail} alt={meta.title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-red-900/50 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </div>
            )}
          </div>
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/70 ring-2 ring-white/40" />
        </div>

        {/* Track Title & Seekbar */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs sm:text-sm font-semibold text-white drop-shadow-sm">{meta.title}</p>
          <p className="truncate text-[11px] sm:text-xs text-white/70">YouTube</p>

          <div className="mt-1 sm:mt-1.5">
            <div onClick={handleSeek} onKeyDown={handleSeekKeyDown} className="group/bar relative h-2 w-full cursor-pointer" role="slider" tabIndex={0} aria-label="Seek" aria-valuenow={Math.round(percent)} aria-valuemin={0} aria-valuemax={100}>
              <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-red-400/90" style={{ width: `${percent}%` }} />
              </div>
              <div className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover/bar:opacity-100" style={{ left: `${percent}%` }} />
            </div>
            <div className="mt-1 text-left text-[10px] sm:text-[11px] tabular-nums text-white/60">
              {formatTime(progress.current)} / {formatTime(progress.duration)}
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <button
            type="button"
            onClick={togglePlay}
            className="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full bg-white text-black shadow-lg transition hover:scale-105 active:scale-95"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={onOpenPlaylist}
            className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white active:scale-95"
            aria-label="Playlist"
          >
            <ListMusic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white active:scale-95"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
