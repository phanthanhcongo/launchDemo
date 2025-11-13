import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const lineVariants = cva('border-0', {
  variants: {
    orientation: {
      horizontal: 'w-full h-px',
      vertical: 'h-full w-px',
    },
    color: {
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      accent: 'bg-accent',
      border: 'bg-border',
    },
    thickness: {
      thin: '',
      medium: '',
      thick: '',
    },
  },
  compoundVariants: [
    {
      orientation: 'horizontal',
      thickness: 'thin',
      className: 'h-px',
    },
    {
      orientation: 'horizontal',
      thickness: 'medium',
      className: 'h-0.5',
    },
    {
      orientation: 'horizontal',
      thickness: 'thick',
      className: 'h-1',
    },
    {
      orientation: 'vertical',
      thickness: 'thin',
      className: 'w-px',
    },
    {
      orientation: 'vertical',
      thickness: 'medium',
      className: 'w-0.5',
    },
    {
      orientation: 'vertical',
      thickness: 'thick',
      className: 'w-1',
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    color: 'primary',
    thickness: 'thin',
  },
});

export interface LineProps
  extends Omit<React.HTMLAttributes<HTMLHRElement>, 'color'>,
    VariantProps<typeof lineVariants> {
  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;
}

/**
 * Line Component
 * 
 * Decorative line element for visual separation and design accents.
 * Used throughout the Nyala Villas design for elegant dividers.
 * 
 * @example
 * ```tsx
 * <Line orientation="horizontal" color="primary" />
 * ```
 */
export const Line = React.forwardRef<HTMLHRElement, LineProps>(
  ({ className, orientation, color, thickness, ...props }, ref) => {
    return (
      <hr
        ref={ref}
        className={cn(lineVariants({ orientation, color, thickness }), className)}
        role="separator"
        aria-orientation={orientation || undefined}
        {...props}
      />
    );
  }
);

Line.displayName = 'Line';

