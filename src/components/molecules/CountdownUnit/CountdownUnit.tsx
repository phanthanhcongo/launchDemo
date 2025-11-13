import { Text } from '@/components/atoms';
import { cn } from '@/lib/cn';

export interface CountdownUnitProps {
  /**
   * Numeric value to display
   */
  value: number;
  /**
   * Label for the unit (e.g., "days", "hours")
   */
  label: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * CountdownUnit Component
 *
 * Single unit display for countdown timer.
 * Pure presentational component - receives value as prop.
 *
 * @example
 * ```tsx
 * <CountdownUnit value={12} label="days" />
 * ```
 */
export function CountdownUnit({ value, label, className }: CountdownUnitProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      {/* Value Box */}
      <div className="relative w-[120px] h-[120px] md:w-[150px] md:h-[150px] border border-primary rounded-sm flex items-center justify-center bg-surface/5 backdrop-blur-sm">
        <Text
          variant="h1"
          className="text-5xl md:text-7xl font-normal"
          aria-label={`${value} ${label}`}
        >
          {value.toString().padStart(2, '0')}
        </Text>
      </div>

      {/* Label */}
      <Text variant="menu" className="uppercase text-sm md:text-base tracking-wider">
        {label}
      </Text>
    </div>
  );
}

CountdownUnit.displayName = 'CountdownUnit';

