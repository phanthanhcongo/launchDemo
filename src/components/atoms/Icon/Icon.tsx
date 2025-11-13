import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const iconVariants = cva('inline-flex items-center justify-center transition-colors', {
  variants: {
    size: {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    },
    iconColor: {
      primary: 'text-primary',
      secondary: 'text-secondary',
      surface: 'text-surface',
      muted: 'text-text-muted',
    },
  },
  defaultVariants: {
    size: 'md',
    iconColor: 'primary',
  },
});

export interface IconProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, 'color'>,
    VariantProps<typeof iconVariants> {
  /**
   * Icon name/type
   */
  name: 'instagram' | 'arrow-down' | 'chevron-right' | 'chevron-left' | 'close' | 'menu';
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Icon Component
 *
 * Reusable icon component with variants for size and color.
 * Uses inline SVG for better performance and styling control.
 *
 * @example
 * ```tsx
 * <Icon name="instagram" size="lg" color="primary" />
 * ```
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, size, iconColor, className, ...props }, ref) => {
    const iconPaths: Record<IconProps['name'], React.ReactNode> = {
      instagram: (
        <>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </>
      ),
      'arrow-down': (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </>
      ),
      'chevron-right': (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </>
      ),
      'chevron-left': (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </>
      ),
      close: (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </>
      ),
      menu: (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </>
      ),
    };

    return (
      <svg
        ref={ref}
        className={cn(iconVariants({ size, iconColor }), className)}
        fill={name === 'instagram' ? 'currentColor' : 'none'}
        stroke={name !== 'instagram' ? 'currentColor' : undefined}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        {...props}
      >
        {iconPaths[name]}
      </svg>
    );
  }
);

Icon.displayName = 'Icon';

