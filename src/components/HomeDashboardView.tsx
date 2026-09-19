import React from 'react';
import { FileText, ShieldAlert, Smartphone, Calendar, Mic, Sparkles, HeartHandshake } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { ScreenId } from '../types';

interface HomeDashboardViewProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenVoiceModal: () => void;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  onNavigate,
  onOpenVoiceModal,
}) => {
  // Determine gentle greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning 👋';
    if (hour < 17) return 'Good afternoon 👋';
    return 'Good evening 👋';
  };

  return (
    <div className="space-y-8 sm:space-y-10 animate-in fade-in duration-200">
      {/* Hero Section */}
      <section
        aria-label="Welcome Greeting"
        className="bg-linear-to-br from-amber-500/15 via-orange-500/10 to-emerald-500/10 rounded-3xl p-6 sm:p-10 border-2 border-amber-200/90 shadow-sm relative overflow-hidden"
      >
        <div className="max-w-2xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-amber-200 text-stone-800 text-xs sm:text-sm font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Always here to assist with patience & care</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
            {getGreeting()}
          </h2>

          <p className="text-xl sm:text-2xl text-stone-700 font-semibold leading-relaxed">
            How can I help you today?
          </p>
        </div>

        <div className="hidden sm:block absolute right-8 bottom-6 opacity-15 pointer-events-none">
          <HeartHandshake className="w-40 h-40 text-amber-700" />
        </div>
      </section>

      {/* Four Large Cards */}
      <section aria-label="Main Features" className="space-y-4">
        <h3 className="sr-only">Choose an action</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* 1. Explain This */}
          <FeatureCard
            id="feature-card-explain"
            icon={<FileText className="w-8 h-8 sm:w-9 sm:h-9" />}
            title="Explain This"
            description="Understand a message, bill or document"
            badge="Plain Words"
            colorScheme="amber"
            onClick={() => onNavigate('explain')}
          />

          {/* 2. Is This Safe? */}
          <FeatureCard
            id="feature-card-safety"
            icon={<ShieldAlert className="w-8 h-8 sm:w-9 sm:h-9" />}
            title="Is This Safe?"
            description="Check a suspicious SMS, email or message"
            badge="Fraud Shield"
            colorScheme="emerald"
            onClick={() => onNavigate('safety')}
          />

          {/* 3. Help Me Do This */}
          <FeatureCard
            id="feature-card-guide"
            icon={<Smartphone className="w-8 h-8 sm:w-9 sm:h-9" />}
            title="Help Me Do This"
            description="Get simple step-by-step guidance"
            badge="Guided Steps"
            colorScheme="sky"
            onClick={() => onNavigate('guide')}
          />

          {/* 4. My Day */}
          <FeatureCard
            id="feature-card-myday"
            icon={<Calendar className="w-8 h-8 sm:w-9 sm:h-9" />}
            title="My Day"
            description="See today's important tasks"
            badge="Daily Schedule"
            colorScheme="purple"
            onClick={() => onNavigate('myday')}
          />
        </div>
      </section>

      {/* Bottom Large "🎤 Talk to Saathi" Button */}
      <section aria-label="Voice Interaction" className="pt-2">
        <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-amber-600 via-amber-700 to-orange-700 text-white shadow-lg text-center space-y-4 border-2 border-amber-500/50">
          <div className="space-y-1">
            <span className="text-xs sm:text-sm uppercase tracking-widest font-bold text-amber-200">
              Prefer speaking instead of typing?
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Talk directly with your Saathi
            </h3>
            <p className="text-base sm:text-lg text-amber-100 font-medium max-w-lg mx-auto">
              Ask any question out loud, like asking a son, daughter, or caring friend.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              id="talk-to-saathi-btn"
              onClick={onOpenVoiceModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-4 sm:py-5 rounded-2xl bg-white hover:bg-amber-50 text-stone-950 font-extrabold text-xl sm:text-2xl shadow-xl transition-all active:scale-[0.98] cursor-pointer hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
            >
              <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center animate-pulse">
                <Mic className="w-6 h-6" />
              </div>
              <span>Talk to Saathi</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
