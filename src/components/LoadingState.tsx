import React from 'react';
import { Loader2, Heart, Shield } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Saathi is reading and thinking gently...',
  subMessage = 'Please take your time. There is no hurry, and your information is completely private.',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="p-8 sm:p-12 rounded-3xl bg-white border-2 border-amber-200/80 shadow-md text-center space-y-5 max-w-xl mx-auto my-6 animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-amber-100 animate-ping opacity-30" />
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shadow-inner">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
          {message}
        </h3>
        <p className="text-base sm:text-lg text-stone-600 font-medium leading-relaxed max-w-md mx-auto">
          {subMessage}
        </p>
      </div>

      <div className="pt-4 border-t border-stone-100 flex items-center justify-center gap-4 text-xs sm:text-sm font-semibold text-stone-500">
        <span className="inline-flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-rose-500 fill-current" />
          Patient Companion
        </span>
        <span>•</span>
        <span className="inline-flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-600" />
          100% Secure & Private
        </span>
      </div>
    </div>
  );
};
