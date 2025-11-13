import { useTranslation } from 'react-i18next';
import { useCountdown } from '@/hooks';
import { CountdownUnit } from '@/components/molecules/CountdownUnit';
import { cn } from '@/lib/cn';

export interface CountdownTimerProps {
  /**
   * Target date for countdown
   */
  targetDate: Date;
  /**
   * Callback when countdown reaches zero
   */
  onComplete?: () => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * CountdownTimer Component
 * 
 * Displays a countdown timer for limited-time offers.
 * Logic separated into useCountdown hook.
 * Composition: uses CountdownUnit molecules.
 * 
 * @example
 * ```tsx
 * <CountdownTimer
 *   targetDate={new Date('2024-12-31')}
 *   onComplete={() => console.log('Offer ended')}
 * />
 * ```
 */
export function CountdownTimer({ targetDate, onComplete, className }: CountdownTimerProps) {
  const { t } = useTranslation();
  const timeLeft = useCountdown({ targetDate, onComplete });

  return (
    <div className={cn('flex items-center justify-center gap-4 md:gap-12', className)}>
      <CountdownUnit value={timeLeft.days} label={t('offers.countdown.days', 'days')} />
      <CountdownUnit value={timeLeft.hours} label={t('offers.countdown.hours', 'hours')} />
      <CountdownUnit value={timeLeft.minutes} label={t('offers.countdown.minutes', 'minutes')} />
    </div>
  );
}

CountdownTimer.displayName = 'CountdownTimer';

