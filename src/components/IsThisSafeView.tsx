import React, { useState } from 'react';
import { ShieldAlert, Sparkles, Clipboard, RotateCcw, AlertTriangle } from 'lucide-react';
import { BackButton } from './BackButton';
import { PrimaryButton } from './PrimaryButton';
import { LoadingState } from './LoadingState';
import { AIResponseCard } from './AIResponseCard';
import { SAFETY_PRESETS, MOCK_SAFETY_RESULTS } from '../data/mockData';
import { SafetyCheckResult } from '../types';

interface IsThisSafeViewProps {
  onBack: () => void;
  onSpeak: (text: string) => void;
  onStopSpeak: () => void;
  isSpeaking: boolean;
  onOpenEmergencyModal: () => void;
}

export const IsThisSafeView: React.FC<IsThisSafeViewProps> = ({
  onBack,
  onSpeak,
  onStopSpeak,
  isSpeaking,
  onOpenEmergencyModal,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SafetyCheckResult | null>(null);

  const handleSelectPreset = (id: string, text: string) => {
    setSelectedPresetId(id);
    setInputText(text);
    setResult(null);
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const clip = await navigator.clipboard.readText();
        if (clip) {
          setInputText(clip);
          setSelectedPresetId(null);
        }
      }
    } catch {
      // Graceful fallback
    }
  };

  const handleCheckSafety = () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    onStopSpeak();

    // Simulated calm thinking period using mock data
    setTimeout(() => {
      const match = selectedPresetId
        ? MOCK_SAFETY_RESULTS[selectedPresetId]
        : MOCK_SAFETY_RESULTS.default;

      setResult(match || MOCK_SAFETY_RESULTS.default);
      setIsLoading(false);
    }, 600);
  };

  const handleReset = () => {
    onStopSpeak();
    setResult(null);
    setInputText('');
    setSelectedPresetId(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header & Back Action */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <BackButton onClick={onBack} label="Back to Home" />

        <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm sm:text-base">
          <ShieldAlert className="w-5 h-5 text-emerald-700" />
          <span>Is This Safe?</span>
        </div>
      </div>

      {/* Screen Title & Friendly Reassurance */}
      <div className="space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            🛡️
          </span>
          <span>Check if a Message is Safe or a Scam</span>
        </h2>
        <p className="text-lg sm:text-xl text-stone-700 font-medium leading-relaxed">
          Received a scary message threatening disconnection, asking for an OTP, or claiming you won prize money? Check it here before you click anything.
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <LoadingState
          message="Saathi is inspecting the message for fraud traps..."
          subMessage="Checking sender identity, links, urgency tricks, and bank safety rules."
        />
      )}

      {/* Result Card (AI Result View) */}
      {!isLoading && result && (
        <AIResponseCard
          type="safety"
          title="Safety Verification Result"
          data={result}
          isSpeaking={isSpeaking}
          onSpeak={onSpeak}
          onStopSpeak={onStopSpeak}
          onReset={handleReset}
        />
      )}

      {/* Input Section */}
      {!isLoading && !result && (
        <section
          aria-label="Safety Check Input Section"
          className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-stone-200 shadow-sm space-y-6"
        >
          {/* Quick Examples */}
          <div className="space-y-2.5">
            <span className="text-xs sm:text-sm font-extrabold text-stone-500 uppercase tracking-wider block">
              Try an example message:
            </span>
            <div className="flex flex-wrap gap-2.5">
              {SAFETY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.id, preset.text)}
                  className={`px-4 py-2.5 rounded-2xl text-sm sm:text-base font-bold border-2 transition-all cursor-pointer ${
                    selectedPresetId === preset.id
                      ? 'bg-emerald-100 border-emerald-600 text-emerald-950 shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-emerald-50/50 hover:border-emerald-300'
                  }`}
                >
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="safety-input-text"
                className="text-base sm:text-lg font-bold text-stone-900"
              >
                Paste or type the suspicious message here:
              </label>
              <button
                type="button"
                onClick={handlePaste}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-bold transition cursor-pointer"
                title="Paste text from clipboard"
              >
                <Clipboard className="w-4 h-4" />
                <span>Paste Text</span>
              </button>
            </div>

            <textarea
              id="safety-input-text"
              rows={4}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setSelectedPresetId(null);
              }}
              placeholder="e.g. 'URGENT: Your electricity connection will be cut tonight at 9:30 PM due to pending bill. Call power officer...'"
              className="w-full p-4 sm:p-5 rounded-2xl border-2 border-stone-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-200 text-stone-900 text-lg sm:text-xl font-medium bg-stone-50/50 focus:bg-white transition-all outline-none resize-y min-h-[140px]"
            />
          </div>

          {/* Panic banner link */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-rose-900">
              <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0" />
              <span className="text-sm sm:text-base font-semibold">
                Did you already enter your UPI PIN or transfer money?
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenEmergencyModal}
              className="text-xs sm:text-sm font-extrabold text-rose-700 hover:text-rose-900 underline shrink-0 cursor-pointer"
            >
              Open Emergency Fraud Steps
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            {inputText && (
              <button
                type="button"
                onClick={() => {
                  setInputText('');
                  setSelectedPresetId(null);
                }}
                className="text-sm sm:text-base font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Clear text</span>
              </button>
            )}

            <PrimaryButton
              id="safety-submit-btn"
              type="button"
              variant="success"
              disabled={!inputText.trim()}
              onClick={handleCheckSafety}
              icon={<Sparkles className="w-6 h-6" />}
              className="w-full sm:w-auto"
            >
              Check Safety Now
            </PrimaryButton>
          </div>
        </section>
      )}
    </div>
  );
};
