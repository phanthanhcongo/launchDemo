import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const textVariants = cva('', {
  variants: {
    variant: {
      h1: 'font-primary text-4xl md:text-5xl lg:text-6xl leading-tight text-balance',
      h2: 'font-primary text-3xl md:text-4xl lg:text-5xl leading-tight text-balance',
      h3: 'font-primary text-2xl md:text-3xl lg:text-4xl leading-tight',
      h4: 'font-primary text-xl md:text-2xl lg:text-3xl leading-tight',
      body: 'font-secondary text-base md:text-lg leading-relaxed',
      caption: 'font-secondary text-sm md:text-base leading-normal',
      menu: 'font-primary text-base md:text-lg tracking-wide',
      cta: 'font-primary text-lg md:text-xl tracking-wider text-center',
    },
    color: {
      primary: 'text-primary',
      secondary: 'text-secondary',
      accent: 'text-accent',
      surface: 'text-surface',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
  },
  defaultVariants: {
    variant: 'body',
    color: 'primary',
    align: 'left',
  },
});

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof textVariants> {
  /**
   * HTML element to render
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label';
}

/**
 * Text Component
 * 
 * Typography component with semantic variants matching Figma design system.
 * Automatically uses appropriate fonts (The Seasons for headings, Montserrat for body).
 * 
 * @example
 * ```tsx
 * <Text variant="h1" color="primary">
 *   Welcome to Nyala Villas
 * </Text>
 * ```
 */
export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, variant, color, align, as, children, ...props }, ref) => {
    // Auto-select semantic HTML element based on variant
    const defaultElement = React.useMemo(() => {
      if (as) return as;
      if (variant === 'h1') return 'h1';
      if (variant === 'h2') return 'h2';
      if (variant === 'h3') return 'h3';
      if (variant === 'h4') return 'h4';
      if (variant === 'body') return 'p';
      if (variant === 'caption') return 'span';
      return 'p';
    }, [as, variant]);

    const Component = defaultElement;

    return (
      <Component
        ref={ref as any}
        className={cn(textVariants({ variant, color, align }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = 'Text';

