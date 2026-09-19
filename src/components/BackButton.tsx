import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  variant?: 'arrow' | 'home';
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label = 'Back to Home',
  variant = 'arrow',
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white hover:bg-stone-100 border-2 border-stone-200 hover:border-stone-300 text-stone-800 hover:text-stone-950 font-bold text-base sm:text-lg shadow-xs transition-all active:scale-[0.98] cursor-pointer focus-visible:ring-4 focus-visible:ring-amber-300 ${className}`}
    >
      {variant === 'home' ? (
        <Home className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700 shrink-0" aria-hidden="true" />
      ) : (
        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700 shrink-0" aria-hidden="true" />
      )}
      <span>{label}</span>
    </button>
  );
};
