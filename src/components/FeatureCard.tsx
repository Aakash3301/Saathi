import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  colorScheme: 'amber' | 'emerald' | 'sky' | 'purple';
  onClick: () => void;
  id?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  badge,
  colorScheme,
  onClick,
  id,
}) => {
  const schemeStyles = {
    amber: {
      border: 'border-amber-200 hover:border-amber-400',
      bg: 'bg-white hover:bg-amber-50/50',
      iconBg: 'bg-amber-100 text-amber-800',
      title: 'text-stone-900',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      arrowBg: 'bg-amber-100 text-amber-800 group-hover:bg-amber-600 group-hover:text-white',
    },
    emerald: {
      border: 'border-emerald-200 hover:border-emerald-400',
      bg: 'bg-white hover:bg-emerald-50/50',
      iconBg: 'bg-emerald-100 text-emerald-800',
      title: 'text-stone-900',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      arrowBg: 'bg-emerald-100 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white',
    },
    sky: {
      border: 'border-sky-200 hover:border-sky-400',
      bg: 'bg-white hover:bg-sky-50/50',
      iconBg: 'bg-sky-100 text-sky-800',
      title: 'text-stone-900',
      badge: 'bg-sky-100 text-sky-800 border-sky-200',
      arrowBg: 'bg-sky-100 text-sky-800 group-hover:bg-sky-600 group-hover:text-white',
    },
    purple: {
      border: 'border-purple-200 hover:border-purple-400',
      bg: 'bg-white hover:bg-purple-50/50',
      iconBg: 'bg-purple-100 text-purple-800',
      title: 'text-stone-900',
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
      arrowBg: 'bg-purple-100 text-purple-800 group-hover:bg-purple-600 group-hover:text-white',
    },
  };

  const currentTheme = schemeStyles[colorScheme];

  return (
    <button
      type="button"
      id={id}
      onClick={onClick}
      className={`group w-full text-left p-6 sm:p-8 rounded-3xl border-2 ${currentTheme.border} ${currentTheme.bg} shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.99] flex flex-col justify-between min-h-[200px] sm:min-h-[220px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 cursor-pointer`}
    >
      <div>
        <div className="flex items-center justify-between gap-4 mb-4 sm:mb-5">
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 ${currentTheme.iconBg} transition-transform group-hover:scale-105`}
          >
            {icon}
          </div>

          {badge && (
            <span
              className={`px-3 py-1 rounded-full text-xs sm:text-sm font-bold border ${currentTheme.badge}`}
            >
              {badge}
            </span>
          )}
        </div>

        <h3 className={`text-xl sm:text-2xl font-extrabold ${currentTheme.title} mb-2 tracking-tight`}>
          {title}
        </h3>

        <p className="text-base sm:text-lg text-stone-700 font-medium leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
        <span className="text-sm sm:text-base font-bold text-stone-600 group-hover:text-stone-900 transition-colors">
          Tap to Open
        </span>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${currentTheme.arrowBg}`}
        >
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </button>
  );
};
