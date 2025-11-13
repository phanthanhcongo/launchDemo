import { useTranslation } from 'react-i18next';
import { Text } from '@/components/atoms';
import { cn } from '@/lib/cn';

export interface StatusSummaryBarProps {
  /**
   * Total number of units
   */
  totalUnits: number;
  /**
   * Number of units sold
   */
  soldUnits: number;
  /**
   * Number of units held/reserved
   */
  heldUnits?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * StatusSummaryBar Component
 *
 * Displays progression of unit sales with urgency messaging.
 * Creates FOMO and encourages quick decision-making.
 *
 * @example
 * ```tsx
 * <StatusSummaryBar
 *   totalUnits={151}
 *   soldUnits={110}
 *   heldUnits={8}
 * />
 * ```
 */
export function StatusSummaryBar({
  totalUnits,
  soldUnits,
  heldUnits = 0,
  className,
}: StatusSummaryBarProps) {
  const { t } = useTranslation();
  
  const availableUnits = totalUnits - soldUnits - heldUnits;
  const soldPercentage = Math.round((soldUnits / totalUnits) * 100);

  return (
    <div
      className={cn(
        'bg-surface border-b border-primary/10 py-4 md:py-6',
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          {/* Main Status */}
          <div className="text-center md:text-left flex-1">
            <Text variant="h2" className="text-primary font-medium">
              {soldUnits} {t('listing.statusBar.of', 'OF')} {totalUnits} {t('listing.statusBar.units', 'UNITS')}{' '}
              <Text as="span" variant="h2" className="text-primary font-semibold">
                {t('listing.statusBar.sold', 'SOLD')}
              </Text>
            </Text>
            <Text variant="caption" className="text-primary/60 mt-2">
              {t('listing.statusBar.subtitle', '{{percentage}}% sold • {{available}} units available', {
                percentage: soldPercentage,
                available: availableUnits,
              })}
            </Text>
          </div>

          {/* Progress Bar */}
          <div className="w-full md:w-auto md:min-w-[280px] lg:min-w-[320px]">
            <div className="relative h-2 md:h-3 bg-primary/10 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-sold to-sold/80 rounded-full transition-all duration-500"
                style={{ width: `${soldPercentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <Text variant="caption" className="text-primary/80 font-medium">
                {t('listing.statusBar.available', 'Available')}: {availableUnits}
              </Text>
              {heldUnits > 0 && (
                <Text variant="caption" className="text-primary/80 font-medium">
                  {t('listing.statusBar.held', 'Held')}: {heldUnits}
                </Text>
              )}
              <Text variant="caption" className="text-primary/80 font-medium">
                {t('listing.statusBar.sold', 'Sold')}: {soldUnits}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

StatusSummaryBar.displayName = 'StatusSummaryBar';
