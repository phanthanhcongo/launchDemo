import { useTranslation } from 'react-i18next';
import { Text } from '@/components/atoms';
import { UnitCard } from '@/components/molecules';
import { Unit } from '@/lib/unitData';
import { cn } from '@/lib/cn';

export interface UnitListProps {
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
   * Additional CSS classes
   */
  className?: string;
}

/**
 * UnitList Component
 *
 * Scrollable list of unit cards with selection and hover states.
 * Supports infinite scroll and pagination.
 *
 * @example
 * ```tsx
 * <UnitList
 *   units={filteredUnits}
 *   selectedUnitId={selectedId}
 *   onUnitSelect={handleSelect}
 *   onShortlist={handleShortlist}
 *   onReserve={handleReserve}
 * />
 * ```
 */
export function UnitList({
  units,
  selectedUnitId,
  hoveredUnitId,
  onUnitSelect,
  onUnitHover,
  onShortlist,
  onReserve,
  className,
}: UnitListProps) {
  const { t } = useTranslation();

  if (units.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center h-full p-8', className)}>
        <Text variant="h3" className="text-primary/70 mb-4">
          {t('explore.list.empty.title', 'No units found')}
        </Text>
        <Text variant="body" className="text-primary/50 text-center max-w-md">
          {t('explore.list.empty.description', 'Try adjusting your filters to see more units.')}
        </Text>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Results Summary */}
      <div className="sticky top-0 z-10 bg-surface/95 backdrop-blur-sm border-b border-primary/20 px-4 py-3">
        <Text variant="caption" className="text-primary/70">
          {t('explore.list.results', '{{count}} units found', { count: units.length })}
        </Text>
      </div>

      {/* Unit Cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
    </div>
  );
}

UnitList.displayName = 'UnitList';
