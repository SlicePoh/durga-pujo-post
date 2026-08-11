import React, { useState } from 'react';
import { X, Play, Music, Sparkles, Plus, ExternalLink } from 'lucide-react';
import { PUJA_PLAYLIST, SPOTIFY_PLAYLIST_URL, YOUTUBE_MUSIC_PLAYLIST_URL } from '../data/playlist';

export default function PlaylistDrawer({ isOpen, onClose, currentTrackIndex, onSelectTrack, onCustomYoutubeUrl }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customInput, setCustomInput] = useState('');

  if (!isOpen) return null;

  const filteredPlaylist = PUJA_PLAYLIST.filter(track => 
    track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    track.movie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    onCustomYoutubeUrl(customInput.trim());
    setCustomInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] glass-panel rounded-3xl p-6 flex flex-col overflow-hidden shadow-2xl border border-white/20">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Durga Puja Playlist</h2>
              <p className="text-xs text-white/60">Songs to serenade your pandal hopping · Sharod Utsob</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-3 py-3">
          <a 
            href={SPOTIFY_PLAYLIST_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="glass-pill flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 transition"
          >
            <span>Spotify Full Playlist</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
          <a 
            href={YOUTUBE_MUSIC_PLAYLIST_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="glass-pill flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-medium text-red-300 hover:bg-red-500/20 transition"
          >
            <span>YT Music Playlist</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>

        {/* Search & Custom Input */}
        <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
          <input 
            type="text" 
            placeholder="Search song, artist, movie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-amber-400/60"
          />
        </div>

        {/* Custom YouTube Link Submission Form */}
        <form onSubmit={handleAddCustom} className="flex gap-2 mb-4">
          <input 
            type="text" 
            placeholder="Paste custom YouTube URL or Video ID..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400/60"
          />
          <button 
            type="submit"
            className="px-3 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-semibold hover:bg-amber-400 flex items-center gap-1 transition active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Play Song</span>
          </button>
        </form>

        {/* Track List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
          {filteredPlaylist.map((track, idx) => {
            const originalIndex = PUJA_PLAYLIST.findIndex(t => t.id === track.id);
            const isPlaying = originalIndex === currentTrackIndex;

            return (
              <div 
                key={track.id}
                onClick={() => {
                  onSelectTrack(originalIndex);
                  onClose();
                }}
                className={`group flex items-center gap-3.5 p-2.5 rounded-2xl cursor-pointer transition-all ${
                  isPlaying 
                    ? 'bg-amber-500/20 border border-amber-400/50 shadow-md' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm">
                  <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-amber-400 animate-spin-slow" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${isPlaying ? 'text-amber-300' : 'text-white'}`}>
                    {track.title}
                  </p>
                  <p className="text-xs text-white/60 truncate">
                    {track.artist} • <span className="text-amber-200/80">{track.movie}</span>
                  </p>
                  <p className="text-[11px] text-amber-300/60 truncate italic mt-0.5">
                    "{track.tagline}"
                  </p>
                </div>

                <button className={`p-2 rounded-full shrink-0 transition ${
                  isPlaying ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-white group-hover:bg-white/20'
                }`}>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
