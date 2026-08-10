import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Play, Pause, SkipBack, SkipForward, ListMusic } from 'lucide-react';
import { OMNI_PLAYLIST } from '../data/playlist';

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
  musicVolume = 0.20, 
  customTrackId = null 
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState({ current: 0, duration: 0 });

  // Dual Audio Elements for Studio-Grade 100% Smooth Crossfade Between Playlist Songs
  const activeSlotRef = useRef('A'); // 'A' or 'B'
  const audioARef = useRef(null);
  const audioBRef = useRef(null);

  const activeTrack = customTrackId 
    ? {
        title: "Custom Stream",
        artist: "YouTube Stream",
        movie: "User Selected",
        cover: OMNI_PLAYLIST[0].cover,
        audioUrl: OMNI_PLAYLIST[0].audioUrl
      }
    : OMNI_PLAYLIST[currentTrackIndex] || OMNI_PLAYLIST[0];

  useImperativeHandle(ref, () => ({
    unlockAudio: () => {
      const a = audioARef.current;
      const b = audioBRef.current;
      [a, b].forEach(aud => {
        if (aud) {
          aud.currentTime = 0;
          aud.volume = 0.0;
          const p = aud.play();
          if (p !== undefined) {
            p.then(() => { aud.pause(); aud.currentTime = 0; }).catch(() => {});
          }
        }
      });
    },
    playFromStart: () => {
      const a = audioARef.current;
      if (a) {
        a.currentTime = 0;
        a.volume = Math.max(0, Math.min(1, musicVolume));
        const playPromise = a.play();
        if (playPromise !== undefined) {
          playPromise.then(() => setIsPlaying(true)).catch(err => console.log("Audio play error:", err));
        }
      }
    }
  }));

  // Butter-Smooth Crossfade When Switching Songs
  useEffect(() => {
    const curAudio = activeSlotRef.current === 'A' ? audioARef.current : audioBRef.current;
    const nextAudio = activeSlotRef.current === 'A' ? audioBRef.current : audioARef.current;

    if (!curAudio || !nextAudio) return;

    nextAudio.src = activeTrack.audioUrl;
    nextAudio.currentTime = 0;
    nextAudio.volume = 0.0;

    if (isPlaying) {
      const playPromise = nextAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          let fadeStep = 0;
          const totalSteps = 20;
          const fadeTimer = setInterval(() => {
            fadeStep++;
            const ratio = fadeStep / totalSteps;
            curAudio.volume = Math.max(0, musicVolume * (1 - ratio));
            nextAudio.volume = Math.min(1, musicVolume * ratio);

            if (fadeStep >= totalSteps) {
              clearInterval(fadeTimer);
              curAudio.pause();
              curAudio.currentTime = 0;
              activeSlotRef.current = activeSlotRef.current === 'A' ? 'B' : 'A';
            }
          }, 40);
        }).catch(e => {
          console.log("Smooth crossfade notice:", e);
          activeSlotRef.current = activeSlotRef.current === 'A' ? 'B' : 'A';
        });
      }
    } else {
      activeSlotRef.current = activeSlotRef.current === 'A' ? 'B' : 'A';
    }
  }, [currentTrackIndex]);

  // Synchronize Volume Smoothly
  useEffect(() => {
    const curAudio = activeSlotRef.current === 'A' ? audioARef.current : audioBRef.current;
    if (curAudio) {
      curAudio.volume = Math.max(0, Math.min(1, musicVolume));
      if (musicVolume > 0.01 && curAudio.paused) {
        curAudio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  }, [musicVolume]);

  // Progress Tracker
  useEffect(() => {
    const interval = setInterval(() => {
      const curAudio = activeSlotRef.current === 'A' ? audioARef.current : audioBRef.current;
      if (curAudio && curAudio.duration) {
        setProgress({ current: curAudio.currentTime || 0, duration: curAudio.duration || 0 });
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    const curAudio = activeSlotRef.current === 'A' ? audioARef.current : audioBRef.current;
    if (!curAudio) return;
    if (isPlaying) {
      curAudio.pause();
      setIsPlaying(false);
    } else {
      curAudio.play().then(() => setIsPlaying(true)).catch(e => console.log('Toggle error:', e));
    }
  };

  const handleSeek = (e) => {
    const curAudio = activeSlotRef.current === 'A' ? audioARef.current : audioBRef.current;
    if (!curAudio || !progress.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const seekTime = pct * progress.duration;
    curAudio.currentTime = seekTime;
    setProgress(prev => ({ ...prev, current: seekTime }));
  };

  const percent = progress.duration > 0 ? (progress.current / progress.duration) * 100 : 0;

  return (
    <div className="w-full max-w-xl mx-auto z-30">
      <audio 
        ref={audioARef} 
        src={OMNI_PLAYLIST[0].audioUrl} 
        preload="auto"
        onEnded={() => {
          if (activeSlotRef.current === 'A') {
            setIsPlaying(false);
            onTrackChange((currentTrackIndex + 1) % OMNI_PLAYLIST.length);
          }
        }}
      />
      <audio 
        ref={audioBRef} 
        src={OMNI_PLAYLIST[1].audioUrl} 
        preload="auto"
        onEnded={() => {
          if (activeSlotRef.current === 'B') {
            setIsPlaying(false);
            onTrackChange((currentTrackIndex + 1) % OMNI_PLAYLIST.length);
          }
        }}
      />

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
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-black shadow-lg transition hover:scale-105 active:scale-95"
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
