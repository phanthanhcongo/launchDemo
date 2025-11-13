/**
 * Color Service
 * 
 * Centralized color system for consistent theming across all components.
 * Ensures design system consistency and easy maintenance.
 */

/**
 * Brand Color Palette
 */
export const BRAND_COLORS = {
  // Primary Colors
  primary: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#1a1a1a', // Main brand color
  },
  
  // Secondary/Accent Colors
  secondary: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
    950: '#422006',
  },
  
  // Status Colors
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  // Surface Colors
  surface: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
    dark: '#1a1a1a',
  },
  
  // Unit Status Colors
  unit: {
    available: '#10b981',
    held: '#f59e0b',
    sold: '#9ca3af',
  },
} as const;

/**
 * Text Color Variants
 */
export const TEXT_COLORS = {
  // Primary text colors
  primary: 'text-primary',
  'primary-foreground': 'text-primary-foreground',
  
  // Secondary text colors
  secondary: 'text-secondary',
  'secondary-foreground': 'text-secondary-foreground',
  
  // Accent colors
  accent: 'text-accent',
  'accent-foreground': 'text-accent-foreground',
  
  // Opacity variants
  'primary-70': 'text-primary/70',
  'primary-60': 'text-primary/60',
  'primary-50': 'text-primary/50',
  'primary-40': 'text-primary/40',
  'primary-30': 'text-primary/30',
  
  'primary-foreground-90': 'text-primary-foreground/90',
  'primary-foreground-80': 'text-primary-foreground/80',
  'primary-foreground-70': 'text-primary-foreground/70',
  
  // Status colors
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  info: 'text-info',
  
  // Unit status colors
  available: 'text-available',
  held: 'text-held',
  sold: 'text-sold',
  
  // Surface colors
  surface: 'text-surface',
  'surface-light': 'text-surface-light',
  'surface-dark': 'text-surface-dark',
} as const;

/**
 * Background Color Variants
 */
export const BACKGROUND_COLORS = {
  // Primary backgrounds
  primary: 'bg-primary',
  'primary-foreground': 'bg-primary-foreground',
  
  // Secondary backgrounds
  secondary: 'bg-secondary',
  'secondary-foreground': 'bg-secondary-foreground',
  
  // Accent backgrounds
  accent: 'bg-accent',
  'accent-foreground': 'bg-accent-foreground',
  
  // Opacity variants
  'primary-5': 'bg-primary/5',
  'primary-10': 'bg-primary/10',
  'primary-20': 'bg-primary/20',
  'primary-30': 'bg-primary/30',
  'primary-50': 'bg-primary/50',
  'primary-80': 'bg-primary/80',
  'primary-90': 'bg-primary/90',
  
  'secondary-5': 'bg-secondary/5',
  'secondary-10': 'bg-secondary/10',
  'secondary-20': 'bg-secondary/20',
  'secondary-90': 'bg-secondary/90',
  
  // Status backgrounds
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  info: 'bg-info',
  
  // Unit status backgrounds
  available: 'bg-available',
  held: 'bg-held',
  sold: 'bg-sold',
  
  // Surface backgrounds
  surface: 'bg-surface',
  'surface-light': 'bg-surface-light',
  'surface-dark': 'bg-surface-dark',
} as const;

/**
 * Border Color Variants
 */
export const BORDER_COLORS = {
  primary: 'border-primary',
  secondary: 'border-secondary',
  accent: 'border-accent',
  border: 'border-border',
  
  // Opacity variants
  'primary-10': 'border-primary/10',
  'primary-20': 'border-primary/20',
  'primary-30': 'border-primary/30',
  'primary-40': 'border-primary/40',
  
  // Status borders
  success: 'border-success',
  warning: 'border-warning',
  error: 'border-error',
  
  // Transparent
  transparent: 'border-transparent',
} as const;

/**
 * Component Color Schemes
 */
export const COMPONENT_SCHEMES = {
  // Button schemes
  button: {
    primary: {
      bg: BACKGROUND_COLORS.primary,
      text: TEXT_COLORS['primary-foreground'],
      border: BORDER_COLORS.primary,
      hover: {
        bg: 'bg-primary/90',
        border: 'border-primary/90',
      },
    },
    secondary: {
      bg: 'bg-transparent',
      text: TEXT_COLORS.primary,
      border: BORDER_COLORS.primary,
      hover: {
        bg: BACKGROUND_COLORS.primary,
        text: TEXT_COLORS['primary-foreground'],
      },
    },
    ghost: {
      bg: 'bg-transparent',
      text: TEXT_COLORS.primary,
      border: BORDER_COLORS.transparent,
      hover: {
        bg: BACKGROUND_COLORS['primary-5'],
      },
    },
  },
  
  // Card schemes
  card: {
    default: {
      bg: BACKGROUND_COLORS.surface,
      text: TEXT_COLORS.primary,
      border: BORDER_COLORS['primary-20'],
      hover: {
        border: BORDER_COLORS['primary-40'],
        shadow: 'shadow-lg',
      },
    },
    elevated: {
      bg: BACKGROUND_COLORS.surface,
      text: TEXT_COLORS.primary,
      border: BORDER_COLORS['primary-20'],
      shadow: 'shadow-lg',
      hover: {
        shadow: 'shadow-xl',
      },
    },
  },
  
  // Input schemes
  input: {
    default: {
      bg: BACKGROUND_COLORS.surface,
      text: TEXT_COLORS.primary,
      border: BORDER_COLORS['primary-20'],
      placeholder: TEXT_COLORS['primary-50'],
      focus: {
        border: BORDER_COLORS.secondary,
        ring: 'ring-secondary/20',
      },
    },
  },
  
  // Status schemes
  status: {
    available: {
      bg: BACKGROUND_COLORS.available,
      text: 'text-white',
      icon: 'text-white',
    },
    held: {
      bg: BACKGROUND_COLORS.held,
      text: 'text-white',
      icon: 'text-white',
    },
    sold: {
      bg: BACKGROUND_COLORS.sold,
      text: 'text-white',
      icon: 'text-white',
    },
  },
} as const;

/**
 * Get text color class
 */
export function getTextColor(variant: keyof typeof TEXT_COLORS): string {
  return TEXT_COLORS[variant];
}

/**
 * Get background color class
 */
export function getBackgroundColor(variant: keyof typeof BACKGROUND_COLORS): string {
  return BACKGROUND_COLORS[variant];
}

/**
 * Get border color class
 */
export function getBorderColor(variant: keyof typeof BORDER_COLORS): string {
  return BORDER_COLORS[variant];
}

/**
 * Get component color scheme
 */
export function getComponentScheme<T extends keyof typeof COMPONENT_SCHEMES>(
  component: T,
  variant: keyof typeof COMPONENT_SCHEMES[T]
): typeof COMPONENT_SCHEMES[T][keyof typeof COMPONENT_SCHEMES[T]] {
  return COMPONENT_SCHEMES[component][variant];
}

/**
 * Color Service Interface
 */
export const colorService = {
  brand: BRAND_COLORS,
  text: TEXT_COLORS,
  background: BACKGROUND_COLORS,
  border: BORDER_COLORS,
  schemes: COMPONENT_SCHEMES,
  getTextColor,
  getBackgroundColor,
  getBorderColor,
  getComponentScheme,
};
