/**
 * Animation Service
 * 
 * Centralized animation configurations and utilities.
 * Ensures consistent motion design across all components.
 */

/**
 * Animation Durations (in milliseconds)
 */
export const ANIMATION_DURATIONS = {
  fast: 200,      // Hovers, focus states
  medium: 300,    // Cards, buttons
  slow: 500,      // Modals, page transitions
  extra: 800,     // Complex animations
} as const;

/**
 * Animation Delays (in milliseconds)
 */
export const ANIMATION_DELAYS = {
  none: 0,
  short: 100,
  medium: 200,
  long: 300,
  stagger: 150,   // For staggered animations
} as const;

/**
 * Easing Functions
 */
export const EASING = {
  default: 'ease-out',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bouncy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
} as const;

/**
 * CSS Animation Classes
 */
export const ANIMATION_CLASSES = {
  // Fade animations
  fadeIn: 'animate-fade-in',
  fadeInUp: 'animate-fade-in-up',
  fadeInDown: 'animate-fade-in-down',
  fadeInLeft: 'animate-fade-in-left',
  fadeInRight: 'animate-fade-in-right',
  
  // Scale animations
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',
  
  // Utility animations
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
  
  // Hover effects
  hoverScale: 'hover:scale-105 transition-transform duration-300',
  hoverShadow: 'hover:shadow-lg transition-shadow duration-300',
  hoverLift: 'hover:-translate-y-1 transition-transform duration-300',
} as const;

/**
 * Stagger Animation Utility
 * Creates staggered animation delays for lists
 */
export function getStaggerDelay(index: number, baseDelay: number = ANIMATION_DELAYS.stagger): string {
  return `${baseDelay * index}ms`;
}

/**
 * Generate animation style object
 */
export function createAnimationStyle(
  duration: keyof typeof ANIMATION_DURATIONS = 'medium',
  delay: keyof typeof ANIMATION_DELAYS = 'none',
  easing: keyof typeof EASING = 'default'
): React.CSSProperties {
  return {
    animationDuration: `${ANIMATION_DURATIONS[duration]}ms`,
    animationDelay: `${ANIMATION_DELAYS[delay]}ms`,
    animationTimingFunction: EASING[easing],
  };
}

/**
 * Intersection Observer for scroll animations
 */
export function createScrollObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
}

/**
 * Animation Service Interface
 */
export const animationService = {
  durations: ANIMATION_DURATIONS,
  delays: ANIMATION_DELAYS,
  easing: EASING,
  classes: ANIMATION_CLASSES,
  getStaggerDelay,
  createAnimationStyle,
  createScrollObserver,
};
