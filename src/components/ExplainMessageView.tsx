import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Copy,
  Check,
  ShieldAlert,
  Loader2,
  Lightbulb,
} from 'lucide-react';
import { ExplanationResult } from '../types';
import { EXPLAIN_SAMPLES } from '../data/samples';

interface ExplainMessageViewProps {
  onSpeak: (text: string) => void;
  onStopSpeak: () => void;
  isSpeaking: boolean;
  onCheckSafetyInstead: (text: string) => void;
}

export const ExplainMessageView: React.FC<ExplainMessageViewProps> = ({
  onSpeak,
  onStopSpeak,
  isSpeaking,
  onCheckSafetyInstead,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ExplanationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleExplain = async (textToUse?: string) => {
    const message = textToUse || inputText;
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);
    onStopSpeak();

    try {
      const response = await fetch('/api/explain-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message }),
      });

      if (!response.ok) {
        throw new Error('Could not analyze message. Please try again.');
      }

      const data: ExplanationResult = await response.json();
      setResult(data);

      // Auto-read summary if speech is comfortable
      const speechSummary = `Here is what this message means. ${data.summary} ${data.simpleExplanation}`;
      onSpeak(speechSummary);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while explaining this message.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sampleContent: string) => {
    setInputText(sampleContent);
    handleExplain(sampleContent);
  };

  const handleCopy = () => {
    if (!result) return;
    const fullText = `Message Summary: ${result.summary}\n\nExplanation: ${result.simpleExplanation}\n\nRecommended Actions:\n${result.actionAdvice.map(a => `• ${a}`).join('\n')}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-600" />
              <span>Understand Any Confusing Message</span>
            </h2>
            <p className="text-sm text-stone-600 mt-0.5">
              Paste any confusing SMS, bank notice, email, or WhatsApp text below. Saathi will translate it into simple, warm words.
            </p>
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            id="explain-message-input"
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste the confusing message here... (e.g. Bank SMS, bill notice, courier text)"
            className="w-full p-4 rounded-2xl border border-stone-300 bg-stone-50/70 text-stone-900 text-base sm:text-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition resize-y min-h-[120px]"
          />
          {inputText && (
            <button
              type="button"
              onClick={() => {
                setInputText('');
                setResult(null);
                onStopSpeak();
              }}
              className="absolute top-3 right-3 text-xs bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold px-2.5 py-1 rounded-lg transition"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Sample Selector */}
        <div className="mt-4 pt-4 border-t border-stone-100">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Or click a common confusing example to test:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {EXPLAIN_SAMPLES.map((sample) => (
              <button
                key={sample.id}
                id={`sample-btn-${sample.id}`}
                type="button"
                onClick={() => handleSelectSample(sample.content)}
                className="text-left text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-100 hover:bg-stone-200 text-stone-800 transition flex items-center gap-2"
              >
                <span>{sample.label}</span>
                <span className={`text-[11px] px-1.5 py-0.5 rounded-md border ${sample.badgeColor}`}>
                  {sample.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
          <button
            id="submit-explain-message-btn"
            type="button"
            disabled={isLoading || !inputText.trim()}
            onClick={() => handleExplain()}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Simplifying for you...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Explain in Simple Words</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {inputText.trim() && (
            <button
              id="switch-to-safety-from-explain-btn"
              type="button"
              onClick={() => onCheckSafetyInstead(inputText)}
              className="w-full sm:w-auto px-4 py-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-semibold flex items-center justify-center gap-2 transition"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Wait, is this message a scam? Check safety</span>
            </button>
          )}
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <span className="font-bold">Notice:</span> {error}
        </div>
      )}

      {/* Results Section */}
      {result && (
        <section
          id="explain-result-container"
          aria-label="Explanation Result"
          className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-md space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {/* Top Result Banner with Audio Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md">
                Simplified Result
              </span>
              {result.senderType && (
                <span className="ml-2 text-xs font-semibold text-stone-500">
                  Likely Sender: <strong className="text-stone-700">{result.senderType}</strong>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                id="speak-explanation-btn"
                type="button"
                onClick={() => {
                  if (isSpeaking) {
                    onStopSpeak();
                  } else {
                    const speech = `Summary: ${result.summary}. In simple words: ${result.simpleExplanation}. Things to do: ${result.actionAdvice.join('. ')}`;
                    onSpeak(speech);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold shadow-xs transition"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isSpeaking ? 'Stop Voice' : 'Read Aloud to Me'}</span>
              </button>

              <button
                id="copy-explanation-btn"
                type="button"
                onClick={handleCopy}
                title="Copy simplified text"
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* The Bottom Line Summary */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 sm:p-6">
            <h3 className="text-base font-bold text-amber-900 mb-1 flex items-center gap-2">
              <span>🌟 The Bottom Line (In Plain Words):</span>
            </h3>
            <p className="text-lg sm:text-xl font-bold text-stone-900 leading-relaxed">
              {result.summary}
            </p>
            <p className="text-base sm:text-lg text-stone-700 mt-3 leading-relaxed">
              {result.simpleExplanation}
            </p>
          </div>

          {/* Confusing Words Explained */}
          {result.keyTerms && result.keyTerms.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <span>Confusing Words Explained</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.keyTerms.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100/80 transition"
                  >
                    <span className="inline-block font-extrabold text-stone-900 text-base mb-1 bg-amber-100/60 px-2 py-0.5 rounded text-amber-950">
                      {item.term}
                    </span>
                    <p className="text-sm sm:text-base text-stone-700 mt-1 leading-snug">
                      {item.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Checklist */}
          {result.actionAdvice && result.actionAdvice.length > 0 && (
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5">
              <h3 className="text-base sm:text-lg font-bold text-emerald-950 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>What you should do (Simple Next Steps):</span>
              </h3>
              <ul className="space-y-2.5">
                {result.actionAdvice.map((advice, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-base text-stone-800 font-medium">
                      {advice}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bottom helper prompt */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
            <p>💡 Tip: You can always verify an official notice by visiting your local branch or asking a trusted child.</p>
            <button
              type="button"
              onClick={() => onCheckSafetyInstead(inputText)}
              className="text-rose-700 hover:text-rose-800 font-bold underline cursor-pointer"
            >
              Verify message safety rating →
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
