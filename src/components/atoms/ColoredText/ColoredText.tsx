import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import { colorService } from '@/lib/colorService';

const coloredTextVariants = cva('', {
  variants: {
    color: {
      // Primary colors
      primary: colorService.text.primary,
      'primary-foreground': colorService.text['primary-foreground'],
      'primary-70': colorService.text['primary-70'],
      'primary-60': colorService.text['primary-60'],
      'primary-50': colorService.text['primary-50'],
      
      // Secondary colors
      secondary: colorService.text.secondary,
      'secondary-foreground': colorService.text['secondary-foreground'],
      
      // Accent colors
      accent: colorService.text.accent,
      'accent-foreground': colorService.text['accent-foreground'],
      
      // Status colors
      success: colorService.text.success,
      warning: colorService.text.warning,
      error: colorService.text.error,
      info: colorService.text.info,
      
      // Unit status colors
      available: colorService.text.available,
      held: colorService.text.held,
      sold: colorService.text.sold,
      
      // Surface colors
      surface: colorService.text.surface,
      'surface-light': colorService.text['surface-light'],
      'surface-dark': colorService.text['surface-dark'],
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
    },
  },
  defaultVariants: {
    color: 'primary',
    weight: 'normal',
    size: 'base',
  },
});

export interface ColoredTextProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
    VariantProps<typeof coloredTextVariants> {
  /**
   * HTML element to render
   */
  as?: 'span' | 'div' | 'p' | 'label';
}

/**
 * ColoredText Component
 * 
 * Utility component for applying consistent colors to text elements.
 * Uses the centralized color service for design system consistency.
 * 
 * @example
 * ```tsx
 * <ColoredText color="primary-70" weight="medium">
 *   Secondary text
 * </ColoredText>
 * ```
 */
export function ColoredText({
  color,
  weight,
  size,
  className,
  as: Component = 'span',
  children,
  ...props
}: ColoredTextProps) {
  return (
    <Component
      className={cn(coloredTextVariants({ color, weight, size }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}

ColoredText.displayName = 'ColoredText';
