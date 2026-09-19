import React, { useState } from 'react';
import { HelpCircle, Volume2, Sparkles, Loader2, MessageSquare, ShieldCheck, Heart } from 'lucide-react';

interface AskSaathiViewProps {
  onSpeak: (text: string) => void;
  onStopSpeak: () => void;
  isSpeaking: boolean;
}

const COMMON_SENIOR_QUESTIONS = [
  "Can someone steal my money just by me answering a phone call?",
  "What is an OTP and why should I never share it on the phone?",
  "A caller says they are from my bank manager's office. Should I believe them?",
  "How do I know if an online shopping website is real or fake?",
  "Someone sent me a QR code to receive money. Is it safe to scan?",
  "Why is my phone ringing repeatedly from unknown foreign numbers?"
];

export const AskSaathiView: React.FC<AskSaathiViewProps> = ({
  onSpeak,
  onStopSpeak,
  isSpeaking,
}) => {
  const [question, setQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async (queryToAsk?: string) => {
    const q = queryToAsk || question;
    if (!q.trim()) return;

    setIsLoading(true);
    setError(null);
    onStopSpeak();

    try {
      const response = await fetch('/api/ask-saathi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });

      if (!response.ok) {
        throw new Error('Could not get answer. Please try again.');
      }

      const data = await response.json();
      setAnswer(data.answer);
      onSpeak(data.answer);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuestion = (q: string) => {
    setQuestion(q);
    handleAsk(q);
  };

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-sky-600" />
            <span>Ask Saathi Any Doubt or Question</span>
          </h2>
          <p className="text-sm text-stone-600 mt-0.5">
            Never feel hesitant or embarrassed. There is no silly question when it comes to your peace of mind and digital safety.
          </p>
        </div>

        {/* Input */}
        <div className="relative">
          <textarea
            id="ask-saathi-input"
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything (e.g. 'Can someone withdraw money if I share my account number?', 'Is it safe to pay electricity online?')"
            className="w-full p-4 rounded-2xl border border-stone-300 bg-stone-50 text-stone-900 text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition resize-y min-h-[90px]"
          />
        </div>

        {/* Common Senior Questions */}
        <div className="mt-4 pt-4 border-t border-stone-100">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5">
            Frequently Asked Questions by Elders:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {COMMON_SENIOR_QUESTIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectQuestion(item)}
                className="text-left p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-sky-50 hover:border-sky-300 text-xs sm:text-sm font-semibold text-stone-800 transition flex items-start gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{item}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="mt-5 flex justify-end">
          <button
            id="ask-saathi-submit-btn"
            type="button"
            disabled={isLoading || !question.trim()}
            onClick={() => handleAsk()}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-sky-700 hover:bg-sky-800 disabled:opacity-50 text-white font-bold text-base flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Thinking gently...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Ask Saathi</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
          {error}
        </div>
      )}

      {/* Answer */}
      {answer && (
        <section
          id="ask-saathi-answer-container"
          aria-label="Saathi's response"
          className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-200 shadow-md space-y-4 animate-in fade-in duration-300"
        >
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2 text-sky-800 font-bold">
              <Heart className="w-5 h-5 fill-rose-100 text-rose-600" />
              <span>Saathi's Warm Guidance</span>
            </div>

            <button
              id="speak-answer-btn"
              type="button"
              onClick={() => {
                if (isSpeaking) {
                  onStopSpeak();
                } else {
                  onSpeak(answer);
                }
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold transition shadow-xs"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isSpeaking ? 'Stop Voice' : 'Read Aloud'}</span>
            </button>
          </div>

          <p className="text-lg sm:text-xl text-stone-800 font-medium leading-relaxed">
            {answer}
          </p>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <p className="text-sm font-semibold text-emerald-950">
              Always trust your instincts: When in doubt, stop, pause, and talk to your children or trusted bank branch.
            </p>
          </div>
        </section>
      )}
    </div>
  );
};
