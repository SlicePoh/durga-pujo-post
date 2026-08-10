import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ListMusic, Disc } from 'lucide-react';
import { OMNI_PLAYLIST } from '../data/playlist';

let ytApiPromise = null;

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
  musicVolume = 0.85, 
  customTrackId = null 
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState({ current: 0, duration: 0 });

  const playerRef = useRef(null);
  const containerRef = useRef(null);

  const activeTrack = customTrackId 
    ? {
        title: "Custom Stream",
        artist: "YouTube Stream",
        movie: "User Selected",
        cover: OMNI_PLAYLIST[0].cover,
        youtubeId: customTrackId
      }
    : OMNI_PLAYLIST[currentTrackIndex] || OMNI_PLAYLIST[0];

  useImperativeHandle(ref, () => ({
    playFromStart: () => {
      if (playerRef.current && isReady) {
        playerRef.current.seekTo(0, true);
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    }
  }));

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
          start: 0
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
          },
          onError: (event) => {
            console.warn("YouTube player error:", event.data);
            setTimeout(() => {
              onTrackChange((currentTrackIndex + 1) % OMNI_PLAYLIST.length);
            }, 400);
          }
        }
      });
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (playerRef.current && isReady && activeTrack.youtubeId) {
      playerRef.current.loadVideoById(activeTrack.youtubeId, 0);
      setIsPlaying(true);
    }
  }, [currentTrackIndex, customTrackId, isReady]);

  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      playerRef.current.setVolume(Math.round(musicVolume * 100));
    }
  }, [musicVolume]);

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
      <div className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
        <div ref={containerRef} />
      </div>

      <div className="group relative flex items-center gap-4 rounded-full p-3 pr-5 bg-white/10 backdrop-blur-2xl backdrop-saturate-150 border border-white/20 shadow-[0_8px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]">
        <div className="relative h-20 w-20 shrink-0">
          <div className={`h-full w-full rounded-full overflow-hidden shadow-lg ring-1 ring-white/20 ${isPlaying ? 'animate-spin-slow' : 'opacity-90'}`}>
            <img src={activeTrack.cover} alt={activeTrack.title} className="h-full w-full object-cover" />
          </div>
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/70 ring-2 ring-white/40" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-white drop-shadow-sm">{activeTrack.title}</p>
          <p className="truncate text-[13px] text-white/70">{activeTrack.artist}</p>

          <div className="mt-2">
            <div onClick={handleSeek} className="group/bar relative h-2 w-full cursor-pointer" role="slider" aria-label="Seek">
              <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-white/90" style={{ width: `${percent}%` }} />
              </div>
              <div className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover/bar:opacity-100" style={{ left: `${percent}%` }} />
            </div>
            <div className="mt-1.5 text-left text-[11px] tabular-nums text-white/60">
              {formatTime(progress.current)} / {formatTime(progress.duration)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            type="button"
            onClick={() => onTrackChange((currentTrackIndex - 1 + OMNI_PLAYLIST.length) % OMNI_PLAYLIST.length)} 
            className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white active:scale-95"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          <button 
            type="button"
            onClick={togglePlay} 
            disabled={!isReady} 
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-black shadow-lg transition hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button 
            type="button"
            onClick={() => onTrackChange((currentTrackIndex + 1) % OMNI_PLAYLIST.length)} 
            className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white active:scale-95"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>

          <button 
            type="button"
            onClick={onOpenPlaylist} 
            className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white active:scale-95 ml-1"
          >
            <ListMusic className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

export default AudioPlayer;
