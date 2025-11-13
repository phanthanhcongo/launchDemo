import { useTranslation } from 'react-i18next';
import { Button, Text } from '@/components/atoms';
import { cn } from '@/lib/cn';

export interface FilterChip {
  id: string;
  label: string;
  value: string | number;
  category: 'type' | 'status' | 'floor' | 'orientation';
}

export interface FilterChipsProps {
  /**
   * Selected filter values
   */
  selected: Set<string>;
  /**
   * Callback when filter is toggled
   */
  onToggle: (chip: FilterChip) => void;
  /**
   * Available filters to display
   */
  filters: FilterChip[];
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * FilterChips Component
 *
 * Quick filter chips for unit exploration.
 * Supports multiple selection with visual feedback.
 *
 * @example
 * ```tsx
 * <FilterChips
 *   selected={selectedFilters}
 *   onToggle={handleToggleFilter}
 *   filters={availableFilters}
 * />
 * ```
 */
export function FilterChips({ selected, onToggle, filters, className }: FilterChipsProps) {
  const { t } = useTranslation();

  return (
    <div className={cn('flex flex-wrap gap-2 sm:gap-3', className)} role="group" aria-label={t('explore.filters.label', 'Filter options')}>
      {filters.map((chip) => {
        const isSelected = selected.has(chip.id);
        
        return (
          <Button
            key={chip.id}
            intent={isSelected ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onToggle(chip)}
            className={cn(
              'transition-all',
              isSelected && 'ring-2 ring-primary'
            )}
            aria-pressed={isSelected}
          >
            <Text variant="caption">
              {chip.label}
            </Text>
          </Button>
        );
      })}
    </div>
  );
}

FilterChips.displayName = 'FilterChips';
