import React, { useState } from 'react';
import { HeartHandshake, Settings, Type, ShieldAlert, X, Volume2 } from 'lucide-react';
import { FontSizeMode, SpeechSpeed } from '../types';

interface HeaderProps {
  fontSize: FontSizeMode;
  setFontSize: (size: FontSizeMode) => void;
  speechSpeed: SpeechSpeed;
  setSpeechSpeed: (speed: SpeechSpeed) => void;
  onOpenEmergencyModal: () => void;
  onGoHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  fontSize,
  setFontSize,
  speechSpeed,
  setSpeechSpeed,
  onOpenEmergencyModal,
  onGoHome,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  return (
    <header className="border-b border-stone-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand identity: Saathi logo/name + "Your Digital Companion" */}
        <button
          type="button"
          onClick={onGoHome}
          className="flex items-center gap-3.5 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 rounded-2xl p-1 -m-1"
          title="Go to Home Dashboard"
        >
          <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 text-amber-800 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <HeartHandshake className="w-7 h-7 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Saathi <span className="text-amber-700 text-lg sm:text-xl font-medium">साथी</span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-bold text-stone-600">
              Your Digital Companion
            </p>
          </div>
        </button>

        {/* Right side: Emergency help + Small accessibility/settings icon */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Emergency Scam / Help button */}
          <button
            id="emergency-fraud-help-btn"
            type="button"
            onClick={onOpenEmergencyModal}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 shadow-xs transition-colors cursor-pointer"
            title="Emergency Scam Helpline 1930"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Fraud Help?</span>
          </button>

          {/* Small Accessibility / Settings Icon */}
          <div className="relative">
            <button
              id="accessibility-settings-btn"
              type="button"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              aria-label="Accessibility and Text Settings"
              aria-expanded={isSettingsOpen}
              className={`p-2.5 sm:p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                isSettingsOpen
                  ? 'bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-300'
                  : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700'
              }`}
              title="Accessibility & Font Size"
            >
              <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Accessibility Dropdown Panel */}
            {isSettingsOpen && (
              <div
                role="dialog"
                aria-label="Accessibility Settings"
                className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl p-5 border-2 border-stone-300 shadow-2xl z-50 space-y-4 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2 font-extrabold text-stone-900 text-base sm:text-lg">
                    <Settings className="w-5 h-5 text-amber-700" />
                    <span>Display & Sound Settings</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(false)}
                    className="p-1 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Font Size Selector */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-stone-800">
                    <Type className="w-4 h-4 text-amber-700" />
                    <span>Letter / Font Size:</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFontSize('normal')}
                      className={`p-2 rounded-xl text-center text-xs font-bold border-2 transition ${
                        fontSize === 'normal'
                          ? 'border-amber-600 bg-amber-50 text-amber-900'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span className="block text-sm">A</span>
                      Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSize('large')}
                      className={`p-2 rounded-xl text-center text-xs font-bold border-2 transition ${
                        fontSize === 'large'
                          ? 'border-amber-600 bg-amber-50 text-amber-900'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span className="block text-base">A+</span>
                      Large
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSize('extralarge')}
                      className={`p-2 rounded-xl text-center text-xs font-bold border-2 transition ${
                        fontSize === 'extralarge'
                          ? 'border-amber-600 bg-amber-50 text-amber-900'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span className="block text-lg">A++</span>
                      X-Large
                    </button>
                  </div>
                </div>

                {/* Voice Reading Speed */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-2 text-sm font-bold text-stone-800">
                    <Volume2 className="w-4 h-4 text-amber-700" />
                    <span>Voice Reading Speed:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSpeechSpeed('slow')}
                      className={`p-2 rounded-xl text-center text-xs font-bold border-2 transition ${
                        speechSpeed === 'slow'
                          ? 'border-amber-600 bg-amber-50 text-amber-900'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      🐢 Gentle & Slow
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpeechSpeed('normal')}
                      className={`p-2 rounded-xl text-center text-xs font-bold border-2 transition ${
                        speechSpeed === 'normal'
                          ? 'border-amber-600 bg-amber-50 text-amber-900'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      🏃 Regular Pace
                    </button>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs sm:text-sm hover:bg-stone-800 transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
