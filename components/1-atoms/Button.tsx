import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-[var(--primary)] to-[#3b82f6] 
    hover:from-[var(--primary-hover)] hover:to-[var(--primary)]
    text-white shadow-md hover:shadow-lg hover:shadow-[var(--primary)]/20
    border border-transparent
  `,
  secondary: `
    bg-[var(--primary-light)] text-[var(--primary)] 
    hover:bg-[var(--primary)] hover:text-white
    border border-[var(--primary)]/20 hover:border-transparent
  `,
  success: `
    bg-gradient-to-r from-[var(--success)] to-emerald-400
    hover:from-[var(--success-hover)] hover:to-[var(--success)]
    text-white shadow-md hover:shadow-lg hover:shadow-[var(--success)]/20
    border border-transparent
  `,
  danger: `
    bg-gradient-to-r from-[var(--danger)] to-red-400
    hover:from-[var(--danger-hover)] hover:to-[var(--danger)]
    text-white shadow-md hover:shadow-lg hover:shadow-[var(--danger)]/20
    border border-transparent
  `,
  outline: `
    border-2 border-[var(--primary)] text-[var(--primary)] 
    hover:bg-[var(--primary)] hover:text-white
    bg-transparent
  `,
  ghost: `
    text-[var(--text-muted)] hover:text-[var(--text-color)] 
    hover:bg-[var(--button-secondary-bg)]
    border border-transparent
  `,
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-xs font-semibold gap-1.5 rounded-lg',
  md: 'px-5 py-2.5 text-sm font-semibold gap-2 rounded-xl',
  lg: 'px-7 py-3.5 text-base font-semibold gap-2.5 rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses = [
    'inline-flex items-center justify-center',
    'tracking-wide whitespace-nowrap',
    'transition-all duration-200 ease-out',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'active:scale-[0.97]',
  ].join(' ');

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
