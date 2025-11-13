import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-primary tracking-wider transition-all focus-ring disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none',
  {
    variants: {
      intent: {
        primary:
          'bg-primary border border-primary text-white hover:bg-primary/90 hover:border-primary/90',
        secondary:
          'bg-transparent border border-primary text-primary hover:bg-primary hover:text-white',
        ghost: 'bg-transparent text-primary hover:bg-primary/10',
      },
      size: {
        sm: 'h-9 px-4 text-sm rounded-md',
        md: 'h-11 px-6 text-base rounded-lg',
        lg: 'h-12 px-8 text-lg rounded-lg',
      },
      state: {
        default: '',
        loading: 'pointer-events-none opacity-70',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
      state: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Render as a different element using Radix Slot
   */
  asChild?: boolean;
  /**
   * Loading state for async operations
   */
  isLoading?: boolean;
}

/**
 * Button Component
 * 
 * Primary interactive element with multiple variants and states.
 * Follows Nyala Villas brand design system.
 * 
 * @example
 * ```tsx
 * <Button intent="primary" size="md">
 *   Reserve Your Villa Now
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, intent, size, state, isLoading, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const currentState = isLoading ? 'loading' : state;

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ intent, size, state: currentState }), className)}
        aria-busy={isLoading || state === 'loading'}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

