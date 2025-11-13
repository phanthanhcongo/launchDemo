/**
 * Layout Service
 * 
 * Centralized layout patterns and spacing for absolute consistency across all pages.
 * Ensures uniform page structure, spacing, and responsive behavior.
 */

// Layout service for consistent page layouts

/**
 * Page Layout Patterns
 */
export const PAGE_LAYOUTS = {
  // Full page containers
  fullPage: 'min-h-screen bg-surface',
  fullPageDark: 'min-h-screen bg-surface-dark',
  fullPageLight: 'min-h-screen bg-surface-light',
  
  // Content containers
  container: 'container mx-auto px-4 sm:px-6 md:px-8 lg:px-16',
  containerNarrow: 'container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-4xl',
  containerWide: 'container mx-auto px-4 sm:px-6 md:px-8 lg:px-20 max-w-7xl',
  
  // Section spacing
  sectionY: 'py-12 md:py-16 lg:py-20',
  sectionYLarge: 'py-16 md:py-20 lg:py-24',
  sectionYSmall: 'py-8 md:py-12 lg:py-16',
  
  // Card layouts
  card: 'bg-surface rounded-lg border border-primary/20 shadow-sm',
  cardElevated: 'bg-surface rounded-lg border border-primary/20 shadow-lg',
  cardInteractive: 'bg-surface rounded-lg border border-primary/20 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300',
  
  // Grid layouts
  gridResponsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8',
  gridTwoCol: 'grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8',
  gridThreeCol: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8',
  gridFourCol: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6',
} as const;

/**
 * Page Header Patterns
 */
export const PAGE_HEADERS = {
  // Standard page header
  standard: {
    container: 'py-8 md:py-12 border-b border-primary/10',
    title: 'text-primary mb-4',
    subtitle: 'text-primary/70 max-w-2xl',
  },
  
  // Hero-style header
  hero: {
    container: 'py-16 md:py-20 lg:py-24 text-center',
    title: 'text-primary mb-6',
    subtitle: 'text-primary/80 max-w-3xl mx-auto',
  },
  
  // Compact header
  compact: {
    container: 'py-6 md:py-8 border-b border-primary/10',
    title: 'text-primary mb-2',
    subtitle: 'text-primary/70',
  },
} as const;

/**
 * Form Layout Patterns
 */
export const FORM_LAYOUTS = {
  // Form containers
  container: 'space-y-6',
  section: 'space-y-4',
  row: 'grid grid-cols-1 md:grid-cols-2 gap-4',
  
  // Form elements
  field: 'space-y-2',
  label: 'text-primary font-medium',
  input: 'w-full px-4 py-3 border border-primary/20 rounded-lg bg-surface text-primary placeholder:text-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors',
  textarea: 'w-full px-4 py-3 border border-primary/20 rounded-lg bg-surface text-primary placeholder:text-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors resize-none',
  
  // Form actions
  actions: 'flex flex-col sm:flex-row gap-4 pt-6 border-t border-primary/10',
  actionsEnd: 'flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-primary/10',
  actionsBetween: 'flex flex-col sm:flex-row gap-4 justify-between pt-6 border-t border-primary/10',
} as const;

/**
 * Status and State Patterns
 */
export const STATUS_LAYOUTS = {
  // Loading states
  loading: {
    container: 'flex items-center justify-center py-12',
    spinner: 'w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin',
    text: 'text-primary/70 mt-4',
  },
  
  // Empty states
  empty: {
    container: 'text-center py-12',
    icon: 'w-16 h-16 text-primary/20 mx-auto mb-4',
    title: 'text-primary mb-2',
    description: 'text-primary/70 max-w-md mx-auto',
  },
  
  // Error states
  error: {
    container: 'text-center py-12',
    icon: 'w-16 h-16 text-error mx-auto mb-4',
    title: 'text-primary mb-2',
    description: 'text-primary/70 max-w-md mx-auto',
  },
  
  // Success states
  success: {
    container: 'text-center py-12',
    icon: 'w-16 h-16 text-success mx-auto mb-4',
    title: 'text-primary mb-2',
    description: 'text-primary/70 max-w-md mx-auto',
  },
} as const;

/**
 * Modal and Overlay Patterns
 */
export const MODAL_LAYOUTS = {
  // Modal backdrop
  backdrop: 'fixed inset-0 bg-primary/50 backdrop-blur-sm z-[9998]',
  
  // Modal containers
  container: 'fixed inset-0 flex items-center justify-center p-4 z-[9999]',
  content: 'bg-surface rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden',
  contentLarge: 'bg-surface rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden',
  contentSmall: 'bg-surface rounded-lg shadow-xl max-w-md w-full',
  
  // Modal sections
  header: 'px-6 py-4 border-b border-primary/20',
  body: 'px-6 py-6 overflow-y-auto',
  footer: 'px-6 py-4 border-t border-primary/20 flex items-center justify-end gap-4',
} as const;

/**
 * Navigation and Menu Patterns
 */
export const NAV_LAYOUTS = {
  // Sticky navigation
  sticky: 'sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-primary/20',
  
  // Navigation containers
  container: 'px-4 sm:px-6 md:px-8 lg:px-16 py-4',
  content: 'flex items-center justify-between',
  
  // Menu items
  menu: 'flex items-center gap-6',
  menuItem: 'text-primary/70 hover:text-primary transition-colors',
  menuItemActive: 'text-primary font-semibold',
} as const;

/**
 * Utility Functions
 */

/**
 * Get page layout classes
 */
export function getPageLayout(variant: keyof typeof PAGE_LAYOUTS): string {
  return PAGE_LAYOUTS[variant];
}

/**
 * Get page header classes
 */
export function getPageHeader(variant: keyof typeof PAGE_HEADERS): typeof PAGE_HEADERS[keyof typeof PAGE_HEADERS] {
  return PAGE_HEADERS[variant];
}

/**
 * Get form layout classes
 */
export function getFormLayout(variant: keyof typeof FORM_LAYOUTS): string {
  return FORM_LAYOUTS[variant];
}

/**
 * Get status layout classes
 */
export function getStatusLayout(variant: keyof typeof STATUS_LAYOUTS): typeof STATUS_LAYOUTS[keyof typeof STATUS_LAYOUTS] {
  return STATUS_LAYOUTS[variant];
}

/**
 * Get modal layout classes
 */
export function getModalLayout(variant: keyof typeof MODAL_LAYOUTS): string {
  return MODAL_LAYOUTS[variant];
}

/**
 * Get navigation layout classes
 */
export function getNavLayout(variant: keyof typeof NAV_LAYOUTS): string {
  return NAV_LAYOUTS[variant];
}

/**
 * Layout Service Interface
 */
export const layoutService = {
  page: PAGE_LAYOUTS,
  header: PAGE_HEADERS,
  form: FORM_LAYOUTS,
  status: STATUS_LAYOUTS,
  modal: MODAL_LAYOUTS,
  nav: NAV_LAYOUTS,
  getPageLayout,
  getPageHeader,
  getFormLayout,
  getStatusLayout,
  getModalLayout,
  getNavLayout,
};
