import React, { InputHTMLAttributes, forwardRef } from 'react';
import styles from '@/app/forms.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const hasError = !!error;

    const baseStyles =
      'px-4 py-3 border rounded-lg transition-all outline-none focus:ring-2 focus:border-transparent';
    const darkModeStyles = 'text-black dark:text-white bg-white dark:bg-gray-700 border-blue-200 dark:border-gray-600 dark:bg-[var(--page-bg)] dark:text-[var(--text-color)]';
    const errorStyles = hasError
      ? 'border-red-500 focus:ring-red-500'
      : 'border-blue-200 dark:border-gray-600 focus:ring-blue-500';
    const widthStyle = fullWidth ? 'w-full' : '';
    const paddingStyles = `${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`;

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label htmlFor={inputId} className={`${styles.label} mb-1`}>
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`${baseStyles} ${darkModeStyles} ${errorStyles} ${widthStyle} ${paddingStyles} ${className}`}
            style={{
              backgroundColor: 'var(--page-bg)',
              color: 'var(--text-color)',
              borderColor: hasError ? undefined : 'var(--border-color)'
            }}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
