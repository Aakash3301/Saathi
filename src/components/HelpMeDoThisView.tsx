import React, { useState } from 'react';
import { Smartphone, Sparkles, Video, CreditCard, MapPin, Pill } from 'lucide-react';
import { BackButton } from './BackButton';
import { PrimaryButton } from './PrimaryButton';
import { LoadingState } from './LoadingState';
import { AIResponseCard } from './AIResponseCard';
import { TASK_PRESETS, MOCK_TASK_GUIDES } from '../data/mockData';
import { TaskGuideResult } from '../types';

interface HelpMeDoThisViewProps {
  onBack: () => void;
  onSpeak: (text: string) => void;
  onStopSpeak: () => void;
  isSpeaking: boolean;
}

export const HelpMeDoThisView: React.FC<HelpMeDoThisViewProps> = ({
  onBack,
  onSpeak,
  onStopSpeak,
  isSpeaking,
}) => {
  const [taskInput, setTaskInput] = useState<string>('');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TaskGuideResult | null>(null);

  const handleSelectPreset = (id: string, text: string) => {
    setSelectedPresetId(id);
    setTaskInput(text);
    setResult(null);
  };

  const handleGetGuide = () => {
    if (!taskInput.trim()) return;

    setIsLoading(true);
    onStopSpeak();

    // Simulated calm thinking period using mock data
    setTimeout(() => {
      const match = selectedPresetId
        ? MOCK_TASK_GUIDES[selectedPresetId]
        : MOCK_TASK_GUIDES.default;

      setResult(match || MOCK_TASK_GUIDES.default);
      setIsLoading(false);
    }, 600);
  };

  const handleReset = () => {
    onStopSpeak();
    setResult(null);
    setTaskInput('');
    setSelectedPresetId(null);
  };

  const presetIcons: Record<string, React.ReactNode> = {
    'whatsapp-call': <Video className="w-5 h-5 text-sky-700" />,
    'pay-bill': <CreditCard className="w-5 h-5 text-emerald-700" />,
    'share-location': <MapPin className="w-5 h-5 text-amber-700" />,
    'order-medicine': <Pill className="w-5 h-5 text-purple-700" />,
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header & Back Action */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <BackButton onClick={onBack} label="Back to Home" />

        <div className="flex items-center gap-2 text-sky-800 font-bold text-sm sm:text-base">
          <Smartphone className="w-5 h-5 text-sky-700" />
          <span>Help Me Do This</span>
        </div>
      </div>

      {/* Screen Title & Friendly Reassurance */}
      <div className="space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
            📱
          </span>
          <span>Simple Step-by-Step Guidance</span>
        </h2>
        <p className="text-lg sm:text-xl text-stone-700 font-medium leading-relaxed">
          Want to do something on your phone or computer? Choose one of the common tasks below or type your own question. We will guide you gently, step by step.
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <LoadingState
          message="Saathi is preparing your step-by-step guide..."
          subMessage="Organizing clear instructions and screen visual cues so you never feel lost."
        />
      )}

      {/* Result Card (AI Result View) */}
      {!isLoading && result && (
        <AIResponseCard
          type="guide"
          title={result.taskTitle}
          data={result}
          isSpeaking={isSpeaking}
          onSpeak={onSpeak}
          onStopSpeak={onStopSpeak}
          onReset={handleReset}
        />
      )}

      {/* Task Input Section */}
      {!isLoading && !result && (
        <section
          aria-label="Task Selection Section"
          className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-stone-200 shadow-sm space-y-6"
        >
          {/* 4 Large Preset Task Buttons */}
          <div className="space-y-3">
            <span className="text-xs sm:text-sm font-extrabold text-stone-500 uppercase tracking-wider block">
              Popular tasks for seniors:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {TASK_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.id, preset.text)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                    selectedPresetId === preset.id
                      ? 'bg-sky-50 border-sky-600 ring-2 ring-sky-200 shadow-sm'
                      : 'bg-stone-50 border-stone-200 hover:bg-sky-50/40 hover:border-sky-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center shrink-0 shadow-2xs">
                    {presetIcons[preset.id] || <Smartphone className="w-5 h-5 text-sky-700" />}
                  </div>
                  <div>
                    <span className="text-base sm:text-lg font-extrabold text-stone-900 block leading-snug">
                      {preset.label}
                    </span>
                    <span className="text-xs sm:text-sm text-stone-600 font-medium">
                      {preset.tag}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Task Input */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <label
              htmlFor="task-custom-input"
              className="text-base sm:text-lg font-bold text-stone-900 block"
            >
              Or ask for any other digital task:
            </label>
            <input
              id="task-custom-input"
              type="text"
              value={taskInput}
              onChange={(e) => {
                setTaskInput(e.target.value);
                setSelectedPresetId(null);
              }}
              placeholder="e.g. How to connect my phone to home WiFi, How to take a screenshot..."
              className="w-full p-4 sm:p-5 rounded-2xl border-2 border-stone-300 focus:border-sky-600 focus:ring-4 focus:ring-sky-200 text-stone-900 text-lg sm:text-xl font-medium bg-stone-50/50 focus:bg-white transition-all outline-none"
            />
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            <PrimaryButton
              id="task-submit-btn"
              type="button"
              disabled={!taskInput.trim()}
              onClick={handleGetGuide}
              icon={<Sparkles className="w-6 h-6" />}
              className="w-full sm:w-auto"
            >
              Show Step-by-Step Guide
            </PrimaryButton>
          </div>
        </section>
      )}
    </div>
  );
};
