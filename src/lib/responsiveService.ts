/**
 * Responsive Service
 * 
 * Centralized responsive design utilities and breakpoint management.
 * Ensures consistent responsive behavior across all components.
 */

/**
 * Breakpoint Configuration (matches Tailwind CSS)
 */
export const BREAKPOINTS = {
  sm: 640,   // Mobile landscape
  md: 768,   // Tablet
  lg: 1024,  // Desktop
  xl: 1280,  // Large desktop
  '2xl': 1536, // Extra large
} as const;

/**
 * Container Padding Classes
 */
export const CONTAINER_PADDING = {
  mobile: 'px-4',      // 16px
  tablet: 'px-6',      // 24px
  desktop: 'px-8',     // 32px
  wide: 'px-16',       // 64px
  responsive: 'px-4 sm:px-6 md:px-8 lg:px-16', // Responsive padding
} as const;

/**
 * Grid Classes
 */
export const GRID_CLASSES = {
  // Standard responsive grids
  responsive1to3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  responsive1to4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  responsive2to4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  
  // Villa/unit grids
  villaGrid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8',
  unitGrid: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6',
  
  // Gallery grids
  galleryGrid: 'grid-cols-2 md:grid-cols-3 gap-4',
  imageGrid: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
} as const;

/**
 * Spacing Classes
 */
export const SPACING = {
  // Section spacing
  sectionY: 'py-12 md:py-16 lg:py-20',
  sectionX: 'px-4 sm:px-6 md:px-8 lg:px-16',
  section: 'py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-16',
  
  // Component spacing
  componentY: 'py-6 md:py-8',
  componentX: 'px-4 md:px-6',
  component: 'py-6 md:py-8 px-4 md:px-6',
  
  // Gap utilities
  gapSm: 'gap-2 sm:gap-3',
  gapMd: 'gap-4 md:gap-6',
  gapLg: 'gap-6 md:gap-8',
  gapXl: 'gap-8 md:gap-12',
} as const;

/**
 * Typography Responsive Classes
 */
export const TYPOGRAPHY_RESPONSIVE = {
  h1: 'text-4xl md:text-5xl lg:text-6xl',
  h2: 'text-3xl md:text-4xl lg:text-5xl',
  h3: 'text-2xl md:text-3xl lg:text-4xl',
  h4: 'text-xl md:text-2xl lg:text-3xl',
  body: 'text-base md:text-lg',
  caption: 'text-sm md:text-base',
} as const;

/**
 * Hero Section Heights
 */
export const HERO_HEIGHTS = {
  small: 'h-[300px] sm:h-[400px] md:h-[500px]',
  medium: 'h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px]',
  large: 'h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px]',
  full: 'h-screen',
  explore: 'h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px]',
} as const;

/**
 * Modal and Overlay Classes
 */
export const MODAL_CLASSES = {
  backdrop: 'fixed inset-0 bg-primary/50 backdrop-blur-sm',
  container: 'fixed inset-0 flex items-center justify-center p-4',
  content: 'bg-surface rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden',
  mobile: 'max-w-full h-full rounded-none', // Mobile full screen
} as const;

/**
 * Button Responsive Classes
 */
export const BUTTON_RESPONSIVE = {
  // Size variants
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-base md:px-6 md:py-3',
  lg: 'px-6 py-3 text-lg md:px-8 md:py-4',
  
  // Mobile-friendly touch targets
  touch: 'min-h-[44px] min-w-[44px]',
  
  // Responsive widths
  auto: 'w-auto',
  full: 'w-full',
  responsive: 'w-full sm:w-auto',
} as const;

/**
 * Check if current viewport matches breakpoint
 */
export function isBreakpoint(breakpoint: keyof typeof BREAKPOINTS): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS[breakpoint];
}

/**
 * Get current breakpoint
 */
export function getCurrentBreakpoint(): keyof typeof BREAKPOINTS | 'xs' {
  if (typeof window === 'undefined') return 'xs';
  
  const width = window.innerWidth;
  
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
}

/**
 * Media query utility (for use in React components with proper hooks)
 */
export function createMediaQuery(breakpoint: keyof typeof BREAKPOINTS): string {
  return `(min-width: ${BREAKPOINTS[breakpoint]}px)`;
}

/**
 * Responsive Service Interface
 */
export const responsiveService = {
  breakpoints: BREAKPOINTS,
  padding: CONTAINER_PADDING,
  grid: GRID_CLASSES,
  spacing: SPACING,
  typography: TYPOGRAPHY_RESPONSIVE,
  hero: HERO_HEIGHTS,
  modal: MODAL_CLASSES,
  button: BUTTON_RESPONSIVE,
  isBreakpoint,
  getCurrentBreakpoint,
  createMediaQuery,
};
