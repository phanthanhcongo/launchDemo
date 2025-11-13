import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/atoms';
import { cn } from '@/lib/cn';

export interface NavigationItem {
  /**
   * Navigation item label key (for i18n)
   */
  labelKey: string;
  /**
   * Target section ID or href
   */
  href: string;
  /**
   * Whether this item is currently active
   */
  isActive?: boolean;
}

export interface NavigationProps {
  /**
   * Array of navigation items
   */
  items: NavigationItem[];
  /**
   * Callback when navigation item is clicked
   */
  onItemClick?: (href: string) => void;
  /**
   * Navigation orientation
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Navigation Component
 *
 * Reusable navigation menu component.
 * Pure presentational - receives items and click handler as props.
 *
 * @example
 * ```tsx
 * <Navigation
 *   items={[
 *     { labelKey: 'nav.home', href: '#home' },
 *     { labelKey: 'nav.about', href: '#about' }
 *   ]}
 *   onItemClick={(href) => scrollToSection(href)}
 * />
 * ```
 */
export function Navigation({
  items,
  onItemClick,
  orientation = 'horizontal',
  className,
}: NavigationProps) {
  const { t } = useTranslation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onItemClick?.(href);
  };

  return (
    <nav
      className={cn(
        'flex gap-6',
        orientation === 'vertical' ? 'flex-col' : 'flex-row items-center',
        className
      )}
      role="navigation"
    >
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          onClick={(e) => handleClick(e, item.href)}
          className={cn(
            'transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-2 py-1',
            item.isActive ? 'text-primary font-semibold' : 'text-primary/70'
          )}
          aria-current={item.isActive ? 'page' : undefined}
        >
          <Text variant="menu" className="uppercase tracking-wider">
            {t(item.labelKey)}
          </Text>
        </a>
      ))}
    </nav>
  );
}

Navigation.displayName = 'Navigation';

