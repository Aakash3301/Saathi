import React from 'react';
import { Volume2, VolumeX, ShieldCheck, Heart, Sparkles, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { ExplanationResult, SafetyCheckResult, TaskGuideResult } from '../types';

interface AIResponseCardProps {
  type: 'explain' | 'safety' | 'guide';
  title?: string;
  data: ExplanationResult | SafetyCheckResult | TaskGuideResult;
  isSpeaking: boolean;
  onSpeak: (textToRead: string) => void;
  onStopSpeak: () => void;
  onReset: () => void;
}

export const AIResponseCard: React.FC<AIResponseCardProps> = ({
  type,
  title,
  data,
  isSpeaking,
  onSpeak,
  onStopSpeak,
  onReset,
}) => {
  // Extract text to read aloud based on type
  const getReadableText = (): string => {
    if (type === 'explain') {
      const exp = data as ExplanationResult;
      const terms = exp.keyTerms?.map((t) => `${t.term}: ${t.explanation}`).join('. ') || '';
      const advice = exp.actionAdvice?.join('. ') || '';
      return `${exp.summary}. ${exp.simpleExplanation}. Important terms to know: ${terms}. What you should do: ${advice}`;
    }

    if (type === 'safety') {
      const s = data as SafetyCheckResult;
      const flags = s.redFlags?.length ? `Warning signs: ${s.redFlags.join('. ')}.` : '';
      const actions = s.safeActions?.join('. ') || '';
      return `Safety Verdict: ${s.verdictTitle}. ${s.plainWarning}. ${flags} Safe steps to follow: ${actions}. Golden rule: ${s.goldenRule}`;
    }

    if (type === 'guide') {
      const g = data as TaskGuideResult;
      const steps = g.steps
        ?.map((s) => `Step ${s.stepNumber}: ${s.title}. ${s.instruction}. ${s.visualTip}`)
        .join('. ') || '';
      return `${g.taskTitle}. ${g.overview}. Steps to follow: ${steps}. Remember: ${g.comfortingTip}`;
    }

    return '';
  };

  const handleAudioToggle = () => {
    if (isSpeaking) {
      onStopSpeak();
    } else {
      onSpeak(getReadableText());
    }
  };

  return (
    <article
      id="ai-response-card"
      aria-label="Saathi Response Result"
      className="bg-white rounded-3xl p-6 sm:p-9 border-2 border-amber-200/90 shadow-lg space-y-6 sm:space-y-8 animate-in fade-in zoom-in-98 duration-200"
    >
      {/* Top Banner with Audio Speaker button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500 fill-current" />
              Saathi's Plain Words
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {title || 'Here is what this means for you'}
            </h2>
          </div>
        </div>

        {/* Audio speech button */}
        <button
          type="button"
          id="listen-aloud-btn"
          onClick={handleAudioToggle}
          className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-base sm:text-lg transition-all shadow-sm shrink-0 cursor-pointer ${
            isSpeaking
              ? 'bg-rose-600 hover:bg-rose-700 text-white'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-5 h-5 animate-pulse" />
              <span>Stop Voice</span>
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5" />
              <span>Listen Aloud 🔊</span>
            </>
          )}
        </button>
      </div>

      {/* Content Rendering based on type */}
      {type === 'explain' && (
        <div className="space-y-6">
          {/* Summary Box */}
          {(() => {
            const exp = data as ExplanationResult;
            return (
              <>
                <div className="p-6 rounded-2xl bg-amber-50/70 border-2 border-amber-200 space-y-2">
                  <span className="text-xs sm:text-sm font-extrabold text-amber-900 uppercase tracking-wider">
                    The Main Point (In One Sentence)
                  </span>
                  <p className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-snug">
                    {exp.summary}
                  </p>
                </div>

                {/* Explanation */}
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold text-stone-800">
                    What They Are Saying:
                  </h3>
                  <p className="text-lg sm:text-xl text-stone-700 font-medium leading-relaxed">
                    {exp.simpleExplanation}
                  </p>
                </div>

                {/* Key Terms */}
                {exp.keyTerms && exp.keyTerms.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                      Confusing Words Explained Simply:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {exp.keyTerms.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl border-2 border-stone-200 bg-stone-50/80 space-y-1"
                        >
                          <span className="font-extrabold text-amber-800 text-base sm:text-lg block">
                            📌 {item.term}
                          </span>
                          <p className="text-sm sm:text-base text-stone-700 font-medium leading-normal">
                            {item.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Advice */}
                {exp.actionAdvice && exp.actionAdvice.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                      What Should You Do Next?
                    </h3>
                    <div className="space-y-2.5">
                      {exp.actionAdvice.map((advice, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-emerald-50/80 border-2 border-emerald-200 flex items-start gap-3"
                        >
                          <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
                          <p className="text-base sm:text-lg text-emerald-950 font-bold leading-snug">
                            {advice}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {type === 'safety' && (
        <div className="space-y-6">
          {(() => {
            const s = data as SafetyCheckResult;
            const isDanger = s.safetyLevel === 'DANGER';
            const isCaution = s.safetyLevel === 'CAUTION';

            const bannerStyle = isDanger
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : isCaution
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-emerald-50 border-emerald-300 text-emerald-950';

            const Icon = isDanger ? ShieldAlert : isCaution ? AlertTriangle : ShieldCheck;

            return (
              <>
                {/* Verdict Badge */}
                <div className={`p-6 rounded-2xl border-2 ${bannerStyle} space-y-2`}>
                  <div className="flex items-center gap-3">
                    <Icon className="w-8 h-8 shrink-0" />
                    <div>
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider block">
                        Safety Assessment
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        {s.verdictTitle}
                      </h3>
                    </div>
                  </div>
                  <p className="text-lg sm:text-xl font-medium pt-2 leading-relaxed">
                    {s.plainWarning}
                  </p>
                </div>

                {/* Red Flags if any */}
                {s.redFlags && s.redFlags.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-rose-600" />
                      <span>Warning Signs Spotted:</span>
                    </h3>
                    <div className="space-y-2">
                      {s.redFlags.map((flag, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-base sm:text-lg font-medium flex items-start gap-2.5"
                        >
                          <span className="text-rose-600 font-bold shrink-0">⚠️</span>
                          <span>{flag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Safe Actions */}
                {s.safeActions && s.safeActions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                      What You Should Do Right Now:
                    </h3>
                    <div className="space-y-2.5">
                      {s.safeActions.map((act, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-white border-2 border-stone-200 shadow-xs flex items-start gap-3"
                        >
                          <div className="w-7 h-7 rounded-full bg-stone-900 text-white font-extrabold text-sm flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <p className="text-base sm:text-lg text-stone-900 font-bold leading-snug">
                            {act}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Golden Rule */}
                {s.goldenRule && (
                  <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-300 flex items-center gap-3">
                    <ShieldCheck className="w-7 h-7 text-amber-700 shrink-0" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
                        Saathi's Golden Rule
                      </span>
                      <p className="text-base sm:text-lg font-extrabold text-stone-900">
                        {s.goldenRule}
                      </p>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {type === 'guide' && (
        <div className="space-y-6">
          {(() => {
            const g = data as TaskGuideResult;
            return (
              <>
                <p className="text-lg sm:text-xl text-stone-700 font-medium leading-relaxed">
                  {g.overview}
                </p>

                {/* Steps */}
                <div className="space-y-4">
                  {g.steps?.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-5 sm:p-6 rounded-2xl border-2 border-stone-200 bg-stone-50/70 hover:bg-stone-50 transition space-y-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-amber-600 text-white font-extrabold text-lg flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                          {step.title}
                        </h3>
                      </div>

                      <p className="text-base sm:text-lg text-stone-800 font-medium pl-12 leading-relaxed">
                        {step.instruction}
                      </p>

                      <div className="pl-12 pt-1">
                        <div className="p-3 rounded-xl bg-white border border-amber-200 text-stone-700 text-sm sm:text-base font-semibold flex items-center gap-2">
                          <span className="text-amber-700">👀 What to look for:</span>
                          <span>{step.visualTip}</span>
                        </div>
                      </div>

                      {step.warning && (
                        <div className="pl-12 pt-1">
                          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm sm:text-base font-bold flex items-center gap-2">
                            <span>🛑 Caution:</span>
                            <span>{step.warning}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Comforting Tip */}
                {g.comfortingTip && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center gap-3">
                    <Heart className="w-6 h-6 text-emerald-700 shrink-0" />
                    <p className="text-base sm:text-lg font-bold text-emerald-950">
                      {g.comfortingTip}
                    </p>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* Bottom Action Buttons */}
      <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-stone-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>No rush. Take all the time you need.</span>
        </div>

        <button
          type="button"
          id="check-another-btn"
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-base sm:text-lg shadow-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          Check Another Message or Question
        </button>
      </div>
    </article>
  );
};
