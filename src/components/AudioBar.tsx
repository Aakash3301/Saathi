import React from 'react';
import { Volume2, VolumeX, Pause, Play, Turtle, Rabbit } from 'lucide-react';
import { SpeechSpeed } from '../types';

interface AudioBarProps {
  isSpeaking: boolean;
  isPaused: boolean;
  speed: SpeechSpeed;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onToggleSpeed: () => void;
  textSnippet?: string;
}

export const AudioBar: React.FC<AudioBarProps> = ({
  isSpeaking,
  isPaused,
  speed,
  onPause,
  onResume,
  onStop,
  onToggleSpeed,
  textSnippet,
}) => {
  if (!isSpeaking && !isPaused) return null;

  return (
    <aside
      id="saathi-audio-player-bar"
      aria-label="Audio Reader Bar"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-2xl bg-stone-900/95 text-stone-100 px-5 py-3.5 rounded-2xl shadow-2xl border border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
        <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 animate-pulse">
          <Volume2 className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
            {isPaused ? 'Voice Paused' : 'Reading Aloud for You'}
          </p>
          <p className="text-sm text-stone-300 truncate max-w-xs sm:max-w-md">
            {textSnippet || 'Reading text...'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
        <button
          id="toggle-speech-speed-btn"
          type="button"
          onClick={onToggleSpeed}
          title={speed === 'slow' ? 'Switch to normal reading speed' : 'Switch to gentle slow speed'}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 transition"
        >
          {speed === 'slow' ? (
            <>
              <Turtle className="w-3.5 h-3.5 text-amber-400" />
              <span>Gentle (0.8x)</span>
            </>
          ) : (
            <>
              <Rabbit className="w-3.5 h-3.5 text-stone-300" />
              <span>Normal (1.0x)</span>
            </>
          )}
        </button>

        {isPaused ? (
          <button
            id="resume-voice-btn"
            type="button"
            onClick={onResume}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition shadow"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Resume</span>
          </button>
        ) : (
          <button
            id="pause-voice-btn"
            type="button"
            onClick={onPause}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-stone-700 hover:bg-stone-600 text-stone-100 transition"
          >
            <Pause className="w-4 h-4" />
            <span>Pause</span>
          </button>
        )}

        <button
          id="stop-voice-btn"
          type="button"
          onClick={onStop}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-red-900/40 hover:bg-red-900/60 text-red-200 border border-red-700/50 transition"
        >
          <VolumeX className="w-4 h-4" />
          <span>Stop</span>
        </button>
      </div>
    </aside>
  );
};
