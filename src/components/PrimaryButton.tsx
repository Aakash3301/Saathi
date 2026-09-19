import React from 'react';
import { Loader2 } from 'lucide-react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'default' | 'large';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  icon,
  isLoading = false,
  loadingText,
  variant = 'primary',
  size = 'large',
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-bold tracking-tight rounded-2xl transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer select-none text-center shadow-sm';

  const sizeStyles =
    size === 'large'
      ? 'min-h-[58px] px-7 py-4 text-lg sm:text-xl gap-3'
      : 'min-h-[48px] px-5 py-3 text-base sm:text-lg gap-2.5';

  const variantStyles = {
    primary:
      'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-900/10 focus-visible:ring-4 focus-visible:ring-amber-300',
    secondary:
      'bg-stone-100 hover:bg-stone-200 text-stone-900 border-2 border-stone-300 focus-visible:ring-4 focus-visible:ring-stone-400',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/10 focus-visible:ring-4 focus-visible:ring-rose-300',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/10 focus-visible:ring-4 focus-visible:ring-emerald-300',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-6 h-6 animate-spin shrink-0" aria-hidden="true" />
          <span>{loadingText || 'Thinking gently...'}</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};
