import React, { useState } from 'react';
import { FileText, Sparkles, Clipboard, RotateCcw } from 'lucide-react';
import { BackButton } from './BackButton';
import { PrimaryButton } from './PrimaryButton';
import { LoadingState } from './LoadingState';
import { AIResponseCard } from './AIResponseCard';
import { EXPLAIN_PRESETS, MOCK_EXPLANATIONS } from '../data/mockData';
import { ExplanationResult } from '../types';

interface ExplainThisViewProps {
  onBack: () => void;
  onSpeak: (text: string) => void;
  onStopSpeak: () => void;
  isSpeaking: boolean;
}

export const ExplainThisView: React.FC<ExplainThisViewProps> = ({
  onBack,
  onSpeak,
  onStopSpeak,
  isSpeaking,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ExplanationResult | null>(null);

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
      // Graceful fallback if permission not granted
    }
  };

  const handleExplain = () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    onStopSpeak();

    // Simulated calm thinking period using mock data
    setTimeout(() => {
      const match = selectedPresetId
        ? MOCK_EXPLANATIONS[selectedPresetId]
        : MOCK_EXPLANATIONS.default;

      setResult(match || MOCK_EXPLANATIONS.default);
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

        <div className="flex items-center gap-2 text-amber-800 font-bold text-sm sm:text-base">
          <FileText className="w-5 h-5 text-amber-700" />
          <span>Explain This</span>
        </div>
      </div>

      {/* Screen Title & Friendly Reassurance */}
      <div className="space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            📄
          </span>
          <span>Understand Any Message or Bill</span>
        </h2>
        <p className="text-lg sm:text-xl text-stone-700 font-medium leading-relaxed">
          Received a confusing SMS, bank notice, or document with complicated words? Paste or type it here. Saathi will translate it into simple, friendly language.
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <LoadingState
          message="Saathi is reading and simplifying your message..."
          subMessage="Breaking down the official jargon so you have complete peace of mind."
        />
      )}

      {/* Result Card (AI Result View) */}
      {!isLoading && result && (
        <AIResponseCard
          type="explain"
          title="Explanation in Simple Words"
          data={result}
          isSpeaking={isSpeaking}
          onSpeak={onSpeak}
          onStopSpeak={onStopSpeak}
          onReset={handleReset}
        />
      )}

      {/* Input Section (shown when no result or when editing) */}
      {!isLoading && !result && (
        <section
          aria-label="Message Input Section"
          className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-stone-200 shadow-sm space-y-6"
        >
          {/* Quick Examples */}
          <div className="space-y-2.5">
            <span className="text-xs sm:text-sm font-extrabold text-stone-500 uppercase tracking-wider block">
              Try an example message:
            </span>
            <div className="flex flex-wrap gap-2.5">
              {EXPLAIN_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.id, preset.text)}
                  className={`px-4 py-2.5 rounded-2xl text-sm sm:text-base font-bold border-2 transition-all cursor-pointer ${
                    selectedPresetId === preset.id
                      ? 'bg-amber-100 border-amber-500 text-amber-950 shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-amber-50/50 hover:border-amber-300'
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
                htmlFor="explain-input-text"
                className="text-base sm:text-lg font-bold text-stone-900"
              >
                Paste or type the message here:
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
              id="explain-input-text"
              rows={4}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setSelectedPresetId(null);
              }}
              placeholder="e.g. 'Dear Customer, as per RBI directive your account 4821 requires periodic Re-KYC compliance...'"
              className="w-full p-4 sm:p-5 rounded-2xl border-2 border-stone-300 focus:border-amber-600 focus:ring-4 focus:ring-amber-200 text-stone-900 text-lg sm:text-xl font-medium bg-stone-50/50 focus:bg-white transition-all outline-none resize-y min-h-[140px]"
            />
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
              id="explain-submit-btn"
              type="button"
              disabled={!inputText.trim()}
              onClick={handleExplain}
              icon={<Sparkles className="w-6 h-6" />}
              className="w-full sm:w-auto"
            >
              Explain in Simple Words
            </PrimaryButton>
          </div>
        </section>
      )}
    </div>
  );
};
