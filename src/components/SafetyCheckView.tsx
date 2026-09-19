import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Volume2,
  Lock,
  PhoneCall,
  Loader2,
  CheckCircle,
  XCircle,
  Lightbulb,
  ExternalLink,
  ShieldX,
} from 'lucide-react';
import { SafetyCheckResult } from '../types';
import { SAFETY_SAMPLES } from '../data/samples';

interface SafetyCheckViewProps {
  initialText?: string;
  onSpeak: (text: string) => void;
  onStopSpeak: () => void;
  isSpeaking: boolean;
  onOpenEmergencyModal: () => void;
}

export const SafetyCheckView: React.FC<SafetyCheckViewProps> = ({
  initialText,
  onSpeak,
  onStopSpeak,
  isSpeaking,
  onOpenEmergencyModal,
}) => {
  const [inputText, setInputText] = useState<string>(initialText || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SafetyCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialText && initialText !== inputText) {
      setInputText(initialText);
      handleCheckSafety(initialText);
    }
  }, [initialText]);

  const handleCheckSafety = async (textToUse?: string) => {
    const message = textToUse || inputText;
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);
    onStopSpeak();

    try {
      const response = await fetch('/api/check-safety', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message }),
      });

      if (!response.ok) {
        throw new Error('Safety analysis failed. Please try again.');
      }

      const data: SafetyCheckResult = await response.json();
      setResult(data);

      // Auto-read safety verdict
      const speech = `Safety Verdict: ${data.verdictTitle}. ${data.plainWarning}. Golden rule: ${data.goldenRule}`;
      onSpeak(speech);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while checking safety.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sampleContent: string) => {
    setInputText(sampleContent);
    handleCheckSafety(sampleContent);
  };

  const getVerdictStyles = (level: 'SAFE' | 'CAUTION' | 'DANGER') => {
    switch (level) {
      case 'DANGER':
        return {
          bg: 'bg-rose-50 border-rose-300',
          badge: 'bg-rose-700 text-white',
          text: 'text-rose-950',
          icon: ShieldAlert,
          iconColor: 'text-rose-600',
          meterColor: 'bg-rose-600',
        };
      case 'CAUTION':
        return {
          bg: 'bg-amber-50 border-amber-300',
          badge: 'bg-amber-600 text-white',
          text: 'text-amber-950',
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
          meterColor: 'bg-amber-500',
        };
      case 'SAFE':
      default:
        return {
          bg: 'bg-emerald-50 border-emerald-300',
          badge: 'bg-emerald-700 text-white',
          text: 'text-emerald-950',
          icon: ShieldCheck,
          iconColor: 'text-emerald-600',
          meterColor: 'bg-emerald-600',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-rose-600" />
              <span>Safety & Scam Warning Detector</span>
            </h2>
            <p className="text-sm text-stone-600 mt-0.5">
              Received a suspicious text, WhatsApp forward, lottery message, or bank warning? Check if it is safe or a scam.
            </p>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            id="safety-message-input"
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste the suspicious message here... (e.g. 'Electricity will be disconnected tonight', 'You won 25 Lakhs', 'Account blocked')"
            className="w-full p-4 rounded-2xl border border-stone-300 bg-stone-50/70 text-stone-900 text-base sm:text-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition resize-y min-h-[120px]"
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
            <span>Click any real-world scenario to test the scam detector:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {SAFETY_SAMPLES.map((sample) => (
              <button
                key={sample.id}
                id={`safety-sample-btn-${sample.id}`}
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
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            id="submit-safety-check-btn"
            type="button"
            disabled={isLoading || !inputText.trim()}
            onClick={() => handleCheckSafety()}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Checking safety signs...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-5 h-5" />
                <span>Check Safety & Scam Signs</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenEmergencyModal}
            className="text-xs sm:text-sm text-stone-600 hover:text-rose-700 underline font-semibold flex items-center gap-1.5"
          >
            <Lock className="w-4 h-4 text-rose-600" />
            <span>Already shared info or lost money? Click for emergency steps</span>
          </button>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      {/* Results Section */}
      {result && (
        <section
          id="safety-result-container"
          aria-label="Safety Analysis Result"
          className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {/* Main Verdict Card */}
          {(() => {
            const styles = getVerdictStyles(result.safetyLevel);
            const VerdictIcon = styles.icon;

            return (
              <div className={`rounded-3xl p-6 sm:p-7 border-2 ${styles.bg} shadow-md`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-stone-200">
                      <VerdictIcon className={`w-8 h-8 ${styles.iconColor}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs uppercase tracking-wider font-extrabold px-3 py-1 rounded-full ${styles.badge}`}>
                          {result.safetyLevel === 'DANGER' ? 'HIGH ALERT: SCAM DETECTED' : result.safetyLevel === 'CAUTION' ? 'CAUTION: UNVERIFIED' : 'AUTHENTIC NOTIFICATION'}
                        </span>
                      </div>
                      <h3 className={`text-xl sm:text-2xl font-extrabold ${styles.text} mt-1`}>
                        {result.verdictTitle}
                      </h3>
                    </div>
                  </div>

                  {/* Audio read button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      id="speak-safety-verdict-btn"
                      type="button"
                      onClick={() => {
                        if (isSpeaking) {
                          onStopSpeak();
                        } else {
                          const speech = `Safety Verdict: ${result.verdictTitle}. ${result.plainWarning}. Safe actions: ${result.safeActions.join('. ')}. Remember: ${result.goldenRule}`;
                          onSpeak(speech);
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-bold shadow-xs transition"
                    >
                      <Volume2 className="w-4 h-4 text-amber-400" />
                      <span>{isSpeaking ? 'Stop Voice' : 'Read Verdict Aloud'}</span>
                    </button>
                  </div>
                </div>

                {/* Plain Warning text */}
                <div className="mt-4">
                  <p className="text-base sm:text-lg font-bold text-stone-900 leading-relaxed">
                    {result.plainWarning}
                  </p>
                </div>

                {/* Red Flags spotted */}
                {result.redFlags && result.redFlags.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-stone-200/80">
                    <h4 className="text-sm font-extrabold text-stone-800 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                      <ShieldX className="w-4 h-4 text-rose-600" />
                      <span>Warning Signs Spotted in this Message:</span>
                    </h4>
                    <div className="space-y-2">
                      {result.redFlags.map((flag, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-rose-950 font-medium bg-white/70 p-3 rounded-xl border border-rose-200/70">
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                          <span>{flag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Action Plan (What you should do right now) */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>What You Must Do Right Now:</span>
            </h3>

            <div className="space-y-3">
              {result.safeActions.map((action, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="w-7 h-7 rounded-xl bg-stone-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-base sm:text-lg font-semibold text-stone-800">
                    {action}
                  </p>
                </div>
              ))}
            </div>

            {/* Golden Rule banner */}
            <div className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs uppercase font-extrabold tracking-wider text-amber-800">
                  Golden Rule for Your Digital Safety
                </p>
                <p className="text-sm sm:text-base font-bold text-stone-900 mt-0.5">
                  {result.goldenRule}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
