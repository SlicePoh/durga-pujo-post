import React, { useState } from 'react';
import { Volume2, Radio } from 'lucide-react';

export default function NostalgiaSFX() {
  const [activeEffect, setActiveEffect] = useState(null);

  // Web Audio Synthesizers for realistic nostalgic sounds
  const playSlidingDoorSFX = () => {
    try {
      setActiveEffect('door');
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Metallic slide rumble + latch click
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.15));
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.Q.setValueAtTime(3, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.8, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      
      // Heavy metal "KACHAK!" latch click
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
        clickGain.gain.setValueAtTime(1.0, ctx.currentTime);
        clickGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(clickGain);
        clickGain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }, 150);

      setTimeout(() => setActiveEffect(null), 600);
    } catch (e) {
      console.warn('AudioContext error:', e);
      setActiveEffect(null);
    }
  };

  const playHornSFX = () => {
    try {
      setActiveEffect('horn');
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Dual-tone classic Omni pressure horn (380Hz + 440Hz)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(370, ctx.currentTime);
      osc2.frequency.setValueAtTime(435, ctx.currentTime);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.4);
      osc2.stop(ctx.currentTime + 0.4);

      setTimeout(() => setActiveEffect(null), 500);
    } catch (e) {
      console.warn('AudioContext error:', e);
      setActiveEffect(null);
    }
  };

  return (
    <div className="fixed right-5 bottom-28 z-30 flex flex-col gap-2">
      <button
        onClick={playSlidingDoorSFX}
        className={`glass-pill px-3 py-2 rounded-full flex items-center gap-2 text-xs font-medium text-amber-200 shadow-lg transition-all active:scale-95 ${
          activeEffect === 'door' ? 'bg-amber-500/30 ring-2 ring-amber-400 scale-105' : 'hover:bg-white/15'
        }`}
        title="Trigger Omni Sliding Door Sound"
      >
        <Volume2 className="w-4 h-4 text-amber-400 animate-bounce" />
        <span className="hidden sm:inline">Sliding Door</span>
        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">Kachak!</span>
      </button>

      <button
        onClick={playHornSFX}
        className={`glass-pill px-3 py-2 rounded-full flex items-center gap-2 text-xs font-medium text-emerald-200 shadow-lg transition-all active:scale-95 ${
          activeEffect === 'horn' ? 'bg-emerald-500/30 ring-2 ring-emerald-400 scale-105' : 'hover:bg-white/15'
        }`}
        title="Trigger Omni Pressure Horn"
      >
        <Radio className="w-4 h-4 text-emerald-400" />
        <span className="hidden sm:inline">Van Horn</span>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">Pip-Pip!</span>
      </button>
    </div>
  );
}
