import { useRef, useState, useEffect, useCallback } from 'react';

export function useAudioCrossfade({ onFadeStart, onFadeComplete }) {
  const videoRef = useRef(null);
  const [introState, setIntroState] = useState({
    videoTime: 0,
    isCrossfading: false,
    crossfadeDone: false,
    videoVolume: 1.0,
    musicVolume: 0.0
  });

  const fadeStartFired = useRef(false);
  const fadeCompleteFired = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;

      if (currentTime < 6.0) {
        // First 6 seconds: Video audio at 100%, Music at 0%
        if (!video.muted) {
          video.volume = 1.0;
        }
        setIntroState({
          videoTime: currentTime,
          isCrossfading: false,
          crossfadeDone: false,
          videoVolume: 1.0,
          musicVolume: 0.0
        });
      } else if (currentTime >= 6.0 && currentTime <= 8.5) {
        // 6s to 8.5s: Linear crossfade
        const progress = Math.min(1.0, Math.max(0.0, (currentTime - 6.0) / 2.5));
        const videoVol = Math.max(0.0, 1.0 - progress);
        const musicVol = Math.min(1.0, progress * 0.85);

        if (!video.muted) {
          video.volume = videoVol;
        }

        if (!fadeStartFired.current) {
          fadeStartFired.current = true;
          onFadeStart?.();
        }

        setIntroState({
          videoTime: currentTime,
          isCrossfading: true,
          crossfadeDone: false,
          videoVolume: videoVol,
          musicVolume: musicVol
        });
      } else if (currentTime > 8.5) {
        // Past 8.5 seconds: Video silenced, Music playing at target volume
        if (!video.muted) {
          video.volume = 0.0;
        }

        if (!fadeCompleteFired.current) {
          fadeCompleteFired.current = true;
          onFadeComplete?.();
        }

        setIntroState({
          videoTime: currentTime,
          isCrossfading: false,
          crossfadeDone: true,
          videoVolume: 0.0,
          musicVolume: 0.85
        });
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [onFadeStart, onFadeComplete]);

  const replayIntro = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      fadeStartFired.current = false;
      fadeCompleteFired.current = false;
      video.currentTime = 0;
      video.volume = 1.0;
      video.play().catch(err => console.log('Video play error:', err));
    }
  }, []);

  return {
    videoRef,
    introState,
    replayIntro
  };
}
