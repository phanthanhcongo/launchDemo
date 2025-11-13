import { useTranslation } from 'react-i18next';
import { Text } from '@/components/atoms';
import { UnitCard } from '@/components/molecules';
import { Unit } from '@/lib/unitData';
import { cn } from '@/lib/cn';

export interface UnitGridProps {
  /**
   * Units to display
   */
  units: Unit[];
  /**
   * Currently selected unit ID
   */
  selectedUnitId?: string;
  /**
   * Currently hovered unit ID
   */
  hoveredUnitId?: string;
  /**
   * Callback when unit is selected
   */
  onUnitSelect: (unit: Unit) => void;
  /**
   * Callback when unit is hovered
   */
  onUnitHover?: (unitId: string | undefined) => void;
  /**
   * Callback for shortlist action
   */
  onShortlist?: (unit: Unit) => void;
  /**
   * Callback for reserve action
   */
  onReserve?: (unit: Unit) => void;
  /**
   * Loading state
   */
  isLoading?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * UnitGrid Component
 *
 * Grid layout for unit cards - default view mode.
 * Optimized for visual browsing and quick decision-making.
 * Follows luxury real estate UX patterns.
 *
 * @example
 * ```tsx
 * <UnitGrid
 *   units={filteredUnits}
 *   selectedUnitId={selectedId}
 *   onUnitSelect={handleSelect}
 *   onShortlist={handleShortlist}
 *   onReserve={handleReserve}
 * />
 * ```
 */
export function UnitGrid({
  units,
  selectedUnitId,
  hoveredUnitId,
  onUnitSelect,
  onUnitHover,
  onShortlist,
  onReserve,
  isLoading,
  className,
}: UnitGridProps) {
  const { t } = useTranslation();

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface rounded-lg overflow-hidden shadow-md border border-primary/10"
          >
            {/* Image skeleton */}
            <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 to-primary/10 animate-pulse" />
            
            {/* Content skeleton */}
            <div className="p-5 space-y-4">
              <div className="h-6 bg-primary/10 rounded animate-pulse w-2/3" />
              <div className="h-4 bg-primary/10 rounded animate-pulse w-full" />
              <div className="h-8 bg-primary/10 rounded animate-pulse w-1/2" />
              <div className="flex gap-2">
                <div className="h-10 bg-primary/10 rounded animate-pulse flex-1" />
                <div className="h-10 bg-primary/10 rounded animate-pulse flex-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (units.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-20 px-4', className)}>
        <svg className="w-24 h-24 text-primary/20 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <Text variant="h2" className="text-primary/70 mb-4 text-center">
          {t('listing.empty.title', 'No units match your filters')}
        </Text>
        <Text variant="body" className="text-primary/50 text-center max-w-md mb-8">
          {t('listing.empty.description', 'Try adjusting your search or filters to see more available units.')}
        </Text>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6', className)}>
      {units.map((unit) => (
        <UnitCard
          key={unit.id}
          unit={unit}
          isSelected={selectedUnitId === unit.id}
          isHovered={hoveredUnitId === unit.id}
          onClick={onUnitSelect}
          onHover={onUnitHover}
          onShortlist={onShortlist}
          onReserve={onReserve}
        />
      ))}
    </div>
  );
}

UnitGrid.displayName = 'UnitGrid';
