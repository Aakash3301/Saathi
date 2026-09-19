import React, { useState } from 'react';
import { Mic, X, Volume2, Sparkles, Heart, ShieldCheck } from 'lucide-react';
import { VOICE_PROMPTS } from '../data/mockData';

interface TalkToSaathiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpeak: (text: string) => void;
  onStopSpeak: () => void;
  isSpeaking: boolean;
}

export const TalkToSaathiModal: React.FC<TalkToSaathiModalProps> = ({
  isOpen,
  onClose,
  onSpeak,
  onStopSpeak,
  isSpeaking,
}) => {
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [activeAnswer, setActiveAnswer] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelectPrompt = (prompt: string, answer: string) => {
    setActiveQuestion(prompt);
    setActiveAnswer(answer);
    onSpeak(answer);
  };

  const handleSimulatedMicTap = () => {
    setIsListening(true);
    onStopSpeak();

    setTimeout(() => {
      setIsListening(false);
      // Pick a reassuring senior question
      const sample = VOICE_PROMPTS[0];
      setActiveQuestion(sample.prompt);
      setActiveAnswer(sample.response);
      onSpeak(sample.response);
    }, 1200);
  };

  const handleClose = () => {
    onStopSpeak();
    setActiveQuestion(null);
    setActiveAnswer(null);
    setIsListening(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="talk-saathi-title"
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-2 border-amber-300 shadow-2xl space-y-6 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h3 id="talk-saathi-title" className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                Talk to Saathi
              </h3>
              <p className="text-sm sm:text-base text-stone-600 font-medium">
                Ask any question gently. Saathi is listening.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close voice dialogue"
            className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Big Mic Button & Animation */}
        <div className="text-center py-4 space-y-4">
          <div className="relative inline-block">
            {isListening && (
              <div className="absolute -inset-4 rounded-full bg-amber-400/40 animate-ping" />
            )}
            <button
              type="button"
              onClick={handleSimulatedMicTap}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-all shadow-xl cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white scale-105'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              <Mic className="w-12 h-12" />
            </button>
          </div>

          <div>
            <p className="text-lg sm:text-xl font-extrabold text-stone-900">
              {isListening
                ? 'Listening to you patiently...'
                : 'Tap the microphone or choose a question below'}
            </p>
            <p className="text-sm text-stone-500 font-medium mt-1">
              Speak naturally in your own comfortable tone
            </p>
          </div>
        </div>

        {/* Quick Voice Questions */}
        <div className="space-y-2.5">
          <span className="text-xs sm:text-sm font-extrabold text-stone-500 uppercase tracking-wider block">
            Common questions elders ask:
          </span>
          <div className="space-y-2">
            {VOICE_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPrompt(item.prompt, item.response)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  activeQuestion === item.prompt
                    ? 'bg-amber-50 border-amber-500 shadow-xs'
                    : 'bg-stone-50 border-stone-200 hover:bg-amber-50/50 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                  <span className="text-base sm:text-lg font-bold text-stone-900">
                    "{item.prompt}"
                  </span>
                </div>
                <Volume2 className="w-5 h-5 text-amber-700 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Answer Display */}
        {activeAnswer && (
          <div className="p-6 rounded-2xl bg-amber-50/80 border-2 border-amber-300 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 fill-current" />
                Saathi's Spoken Answer:
              </span>
              <button
                type="button"
                onClick={() => {
                  if (isSpeaking) {
                    onStopSpeak();
                  } else {
                    onSpeak(activeAnswer);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isSpeaking ? 'Pause' : 'Listen Again'}</span>
              </button>
            </div>

            <p className="text-lg sm:text-xl font-bold text-stone-900 leading-relaxed">
              {activeAnswer}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Saathi will never ask for your passwords or bank PIN.</span>
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="pt-2 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-base shadow-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
