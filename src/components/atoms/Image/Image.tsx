import * as React from 'react';
import { cn } from '@/lib/cn';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * Image source URL
   */
  src: string;
  /**
   * Alt text for accessibility
   */
  alt: string;
  /**
   * Object fit behavior
   */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /**
   * Aspect ratio (e.g., '16/9', '4/3', '1/1')
   */
  aspectRatio?: string;
  /**
   * Loading strategy
   */
  loading?: 'lazy' | 'eager';
}

/**
 * Image Component
 * 
 * Optimized image component with responsive behavior and accessibility.
 * Supports lazy loading and various object-fit options.
 * 
 * @example
 * ```tsx
 * <Image
 *   src="/images/villa.jpg"
 *   alt="One Bedroom Villa"
 *   objectFit="cover"
 *   aspectRatio="16/9"
 * />
 * ```
 */
export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      className,
      src,
      alt,
      objectFit = 'cover',
      aspectRatio,
      loading = 'lazy',
      style,
      ...props
    },
    ref
  ) => {
    const objectFitClass = {
      cover: 'object-cover',
      contain: 'object-contain',
      fill: 'object-fill',
      none: 'object-none',
      'scale-down': 'object-scale-down',
    }[objectFit];

    const combinedStyle = aspectRatio
      ? { ...style, aspectRatio }
      : style;

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        loading={loading}
        className={cn('w-full h-full', objectFitClass, className)}
        style={combinedStyle}
        {...props}
      />
    );
  }
);

Image.displayName = 'Image';

