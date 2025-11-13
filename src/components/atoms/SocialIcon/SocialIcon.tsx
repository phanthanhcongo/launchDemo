import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Icon } from '@/components/atoms/Icon';
import { cn } from '@/lib/cn';

const socialIconVariants = cva(
  'inline-flex items-center justify-center rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
  {
    variants: {
      platform: {
        instagram: 'bg-primary text-surface hover:bg-primary/90',
        facebook: 'bg-primary text-surface hover:bg-primary/90',
        twitter: 'bg-primary text-surface hover:bg-primary/90',
        linkedin: 'bg-primary text-surface hover:bg-primary/90',
      },
      size: {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
      },
    },
    defaultVariants: {
      platform: 'instagram',
      size: 'md',
    },
  }
);

export interface SocialIconProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof socialIconVariants> {
  /**
   * Social media platform
   */
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin';
  /**
   * URL to social media profile
   */
  href: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * SocialIcon Component
 *
 * Social media icon link with platform-specific styling.
 *
 * @example
 * ```tsx
 * <SocialIcon
 *   platform="instagram"
 *   href="https://instagram.com/nyalavillas"
 *   size="lg"
 * />
 * ```
 */
export const SocialIcon = React.forwardRef<HTMLAnchorElement, SocialIconProps>(
  ({ platform, size, href, className, ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(socialIconVariants({ platform, size }), className)}
        aria-label={`Visit our ${platform} page`}
        {...props}
      >
        <Icon name="instagram" size={size === 'lg' ? 'lg' : 'md'} iconColor="surface" />
      </a>
    );
  }
);

SocialIcon.displayName = 'SocialIcon';

