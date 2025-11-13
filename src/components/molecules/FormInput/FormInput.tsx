import * as React from 'react';
import { cn } from '@/lib/cn';
import { Text } from '@/components/atoms';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Input label
   */
  label: string;
  /**
   * Error message
   */
  error?: string;
  /**
   * Helper text
   */
  helperText?: string;
}

/**
 * FormInput Component
 * 
 * Styled form input with label, error states, and helper text.
 * Matches Nyala Villas contact form design.
 * 
 * @example
 * ```tsx
 * <FormInput
 *   label="first name"
 *   name="firstName"
 *   required
 * />
 * ```
 */
export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || `input-${label.replace(/\s+/g, '-')}`;
    const hasError = Boolean(error);

    return (
      <div className="w-full space-y-2">
        <div className="space-y-1">
          <label htmlFor={inputId} className="block">
            <Text
              as="span"
              variant="h4"
              className="text-primary uppercase"
            >
              {label}
            </Text>
          </label>
          <Text
            as="span"
            variant="caption"
            className="block text-primary/50"
          >
            {helperText || label}
          </Text>
        </div>

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-transparent border-b border-primary/25 py-3 px-0',
              'text-primary font-montserrat text-base',
              'placeholder:text-primary/50 placeholder:font-montserrat placeholder:text-sm',
              'focus:outline-none focus:border-primary transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              hasError && 'border-error focus:border-error',
              className
            )}
            aria-invalid={hasError}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
        </div>

        {error && (
          <Text
            id={`${inputId}-error`}
            variant="caption"
            className="text-error"
            role="alert"
          >
            {error}
          </Text>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

