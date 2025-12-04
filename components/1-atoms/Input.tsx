import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = false, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const hasError = !!error;

    const containerClass = fullWidth ? 'w-full' : '';

    const inputClasses = [
      'w-full px-4 py-3.5 rounded-xl',
      'bg-[var(--card-bg)] text-[var(--text-color)]',
      'border-2 transition-all duration-200 ease-out',
      'placeholder:text-[var(--text-light)]',
      'focus:outline-none focus:ring-4',
      'text-[15px]',
      hasError
        ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger-light)]'
        : 'border-[var(--border-color)] hover:border-[var(--border-hover)] focus:border-[var(--primary)] focus:ring-[var(--primary-light)]',
      leftIcon ? 'pl-12' : '',
      rightIcon ? 'pr-12' : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <div className={containerClass}>
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-2.5 text-sm font-semibold text-[var(--text-color)] tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--primary)]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-[var(--danger)] flex items-center gap-1.5 font-medium animate-slideUp">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-[var(--text-muted)]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
