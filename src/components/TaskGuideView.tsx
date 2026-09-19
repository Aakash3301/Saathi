import React, { useState } from 'react';
import {
  Compass,
  Volume2,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Eye,
  AlertCircle,
  Sparkles,
  Loader2,
  Video,
  Receipt,
  MapPin,
  Pill,
  PhoneOff,
  ZoomIn,
  Smile,
} from 'lucide-react';
import { TaskGuideResult, TaskStep } from '../types';
import { TASK_SAMPLES } from '../data/samples';

interface TaskGuideViewProps {
  onSpeak: (text: string) => void;
  onStopSpeak: () => void;
  isSpeaking: boolean;
}

export const TaskGuideView: React.FC<TaskGuideViewProps> = ({
  onSpeak,
  onStopSpeak,
  isSpeaking,
}) => {
  const [taskInput, setTaskInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [guide, setGuide] = useState<TaskGuideResult | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateGuide = async (taskToUse?: string) => {
    const query = taskToUse || taskInput;
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    onStopSpeak();

    try {
      const response = await fetch('/api/task-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: query }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate task guide. Please try again.');
      }

      const data: TaskGuideResult = await response.json();
      setGuide(data);

      // Read first step aloud
      if (data.steps && data.steps.length > 0) {
        const firstStep = data.steps[0];
        const speech = `${data.overview}. Step 1: ${firstStep.title}. ${firstStep.instruction}. Look for: ${firstStep.visualTip}`;
        onSpeak(speech);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while creating the guide.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sampleTitle: string) => {
    setTaskInput(sampleTitle);
    handleGenerateGuide(sampleTitle);
  };

  const handleSpeakCurrentStep = (step: TaskStep) => {
    const speech = `Step ${step.stepNumber}: ${step.title}. ${step.instruction}. Look for: ${step.visualTip}.${step.warning ? ` Warning: ${step.warning}` : ''}`;
    onSpeak(speech);
  };

  const handleNextStep = () => {
    if (!guide) return;
    onStopSpeak();
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps([...completedSteps, currentStepIndex]);
    }
    if (currentStepIndex < guide.steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      handleSpeakCurrentStep(guide.steps[nextIndex]);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      onStopSpeak();
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      if (guide) {
        handleSpeakCurrentStep(guide.steps[prevIndex]);
      }
    }
  };

  // Helper icon renderer for common tasks
  const getTaskIcon = (iconName: string) => {
    switch (iconName) {
      case 'Video':
        return <Video className="w-5 h-5 text-emerald-600" />;
      case 'Receipt':
        return <Receipt className="w-5 h-5 text-amber-600" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5 text-rose-600" />;
      case 'Pill':
        return <Pill className="w-5 h-5 text-purple-600" />;
      case 'PhoneOff':
        return <PhoneOff className="w-5 h-5 text-stone-600" />;
      case 'ZoomIn':
      default:
        return <ZoomIn className="w-5 h-5 text-blue-600" />;
    }
  };

  const currentStep = guide ? guide.steps[currentStepIndex] : null;

  return (
    <div className="space-y-6">
      {/* Input / Task Selection Section */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
            <Compass className="w-6 h-6 text-emerald-600" />
            <span>Step-by-Step Guidance for Everyday Tasks</span>
          </h2>
          <p className="text-sm text-stone-600 mt-0.5">
            Choose a common task or describe what you want to do. Saathi breaks it down into gentle, numbered steps you can follow one at a time.
          </p>
        </div>

        {/* Preset Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-5">
          {TASK_SAMPLES.map((task) => (
            <button
              key={task.id}
              id={`task-card-${task.id}`}
              type="button"
              onClick={() => handleSelectSample(task.title)}
              className="text-left p-3.5 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-stone-100 hover:border-emerald-300 transition flex items-start gap-3 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-stone-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                {getTaskIcon(task.iconName)}
              </div>
              <div className="min-w-0">
                <span className="block font-bold text-sm text-stone-900 leading-snug group-hover:text-emerald-800">
                  {task.title}
                </span>
                <span className="block text-xs text-stone-500 mt-0.5 line-clamp-1">
                  {task.description}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <div className="pt-4 border-t border-stone-100">
          <label htmlFor="custom-task-input" className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            Or type any other task you want help with:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="custom-task-input"
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="e.g. How to set a morning medicine alarm on phone, How to attach a photo..."
              className="flex-1 p-3.5 rounded-2xl border border-stone-300 bg-stone-50 text-stone-900 text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGenerateGuide();
              }}
            />
            <button
              id="generate-guide-btn"
              type="button"
              disabled={isLoading || !taskInput.trim()}
              onClick={() => handleGenerateGuide()}
              className="px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-base flex items-center justify-center gap-2 shadow-sm transition shrink-0 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Preparing guide...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Guide Me Step-by-Step</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      {/* Active Guide Viewer */}
      {guide && currentStep && (
        <section
          id="task-guide-stepper"
          aria-label="Step-by-step guidance"
          className="bg-white rounded-3xl p-5 sm:p-8 border border-stone-200 shadow-md space-y-6 animate-in fade-in duration-300"
        >
          {/* Header of the Task */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
            <div>
              <span className="text-xs uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
                Step-by-Step Guide
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
                {guide.taskTitle}
              </h3>
              <p className="text-sm text-stone-600 mt-0.5 font-medium">
                {guide.overview}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="speak-current-step-btn"
                type="button"
                onClick={() => {
                  if (isSpeaking) {
                    onStopSpeak();
                  } else {
                    handleSpeakCurrentStep(currentStep);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-xs transition"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isSpeaking ? 'Stop Voice' : 'Read Step Aloud'}</span>
              </button>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            {guide.steps.map((step, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isDone = completedSteps.includes(idx);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    handleSpeakCurrentStep(guide.steps[idx]);
                  }}
                  className="flex-1 text-center group cursor-pointer"
                >
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isCurrent
                        ? 'bg-emerald-600'
                        : isDone
                        ? 'bg-emerald-300'
                        : 'bg-stone-200'
                    }`}
                  />
                  <span
                    className={`block text-[11px] sm:text-xs font-bold mt-1.5 transition ${
                      isCurrent
                        ? 'text-emerald-800'
                        : isDone
                        ? 'text-emerald-600'
                        : 'text-stone-400'
                    }`}
                  >
                    Step {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Current Step Spotlight Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-stone-50 border-2 border-emerald-500/30 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Step {currentStep.stepNumber} of {guide.steps.length}
              </span>
              <span className="text-xs text-stone-500 font-semibold">
                {currentStepIndex === guide.steps.length - 1 ? 'Final Step' : 'In Progress'}
              </span>
            </div>

            <h4 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-snug">
              {currentStep.title}
            </h4>

            <p className="text-lg sm:text-xl text-stone-800 font-medium leading-relaxed">
              {currentStep.instruction}
            </p>

            {/* Visual tip (Look for this icon/button) */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  👀 What to look for on your screen:
                </p>
                <p className="text-base text-stone-800 font-semibold mt-0.5">
                  {currentStep.visualTip}
                </p>
              </div>
            </div>

            {/* Warning if any */}
            {currentStep.warning && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                    Safety Caution:
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-rose-950 mt-0.5">
                    {currentStep.warning}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              id="prev-step-btn"
              type="button"
              disabled={currentStepIndex === 0}
              onClick={handlePrevStep}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-stone-300 bg-white hover:bg-stone-100 disabled:opacity-40 text-stone-800 font-bold text-base flex items-center justify-center gap-2 transition"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous Step</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {currentStepIndex < guide.steps.length - 1 ? (
                <button
                  id="next-step-btn"
                  type="button"
                  onClick={handleNextStep}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-100 text-emerald-900 font-bold text-base">
                  <CheckCircle className="w-5 h-5 text-emerald-700" />
                  <span>Task Complete! Wonderful job.</span>
                </div>
              )}
            </div>
          </div>

          {/* Comforting Closing Tip */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
            <Smile className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base text-stone-800 font-medium">
              <strong className="text-amber-900">Saathi's Encouragement: </strong>
              {guide.comfortingTip}
            </p>
          </div>
        </section>
      )}
    </div>
  );
};
