/**
 * GlobalCountdownBar Component
 * 
 * Sticky top bar displaying reservation countdown timer.
 * Changes color based on urgency (normal → warning → danger).
 */

import { useTranslation } from 'react-i18next';
import { Text, Button } from '@/components/atoms';
import { useReservationCountdown } from '@/hooks/useCountdown';
import { cn } from '@/lib/cn';

export interface GlobalCountdownBarProps {
  /**
   * Expiration timestamp
   */
  expiresAt: string | Date;
  /**
   * Unit code being held
   */
  unitCode?: string;
  /**
   * Server time offset for sync
   */
  serverTimeOffset?: number;
  /**
   * Callback when countdown expires
   */
  onExpire?: () => void;
  /**
   * Callback for view unit action
   */
  onViewUnit?: () => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * GlobalCountdownBar Component
 * 
 * Displays sticky countdown timer at top of page during reservation.
 * Visual feedback changes based on urgency.
 * 
 * @example
 * ```tsx
 * <GlobalCountdownBar
 *   expiresAt="2025-11-10T14:30:00Z"
 *   unitCode="A-101"
 *   onExpire={handleExpire}
 * />
 * ```
 */
export function GlobalCountdownBar({
  expiresAt,
  unitCode,
  serverTimeOffset,
  onExpire,
  onViewUnit,
  className,
}: GlobalCountdownBarProps) {
  const { t } = useTranslation();
  
  const countdown = useReservationCountdown({
    expiresAt,
    serverTimeOffset,
    onExpire,
  });

  // Don't show if expired
  if (countdown.isExpired) {
    return null;
  }

  // Get background color based on warning level
  const getBgColor = () => {
    switch (countdown.warningLevel) {
      case 'danger':
        return 'bg-accent'; // Red
      case 'warning':
        return 'bg-[#F59E0B]'; // Amber/Yellow
      default:
        return 'bg-secondary'; // Gold
    }
  };

  // Animation class for danger zone
  const pulseAnimation = countdown.warningLevel === 'danger' ? 'animate-pulse' : '';

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        getBgColor(),
        'text-surface shadow-lg',
        'transition-colors duration-500',
        pulseAnimation,
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="container mx-auto px-4 md:px-16 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left: Message */}
          <div className="flex items-center gap-3">
            {/* Clock Icon */}
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <div>
              <Text variant="caption" className="font-semibold">
                {unitCode
                  ? t('reserve.countdown.messageWithUnit', 'Unit {{code}} is held for you', { code: unitCode })
                  : t('reserve.countdown.message', 'Your unit is held')}
              </Text>
            </div>
          </div>

          {/* Center: Timer */}
          <div className="flex items-center gap-2">
            <Text variant="h4" className="font-bold tabular-nums">
              {countdown.formatted}
            </Text>
            <Text variant="caption">
              {t('reserve.countdown.remaining', 'remaining')}
            </Text>
          </div>

          {/* Right: Action (optional) */}
          {onViewUnit && (
            <Button
              intent="ghost"
              size="sm"
              onClick={onViewUnit}
              className="bg-surface/10 hover:bg-surface/20 text-surface border-surface/20"
            >
              <Text variant="caption" className="font-medium">
                {t('reserve.countdown.viewUnit', 'View Unit')}
              </Text>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

GlobalCountdownBar.displayName = 'GlobalCountdownBar';

