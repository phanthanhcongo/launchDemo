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
  selected: Set<string>;
  onToggle: (chip: FilterChip) => void;
  filters: FilterChip[];
  className?: string;
}

export function FilterChips({ selected, onToggle, filters, className }: FilterChipsProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'flex flex-wrap gap-2 sm:gap-5',
        className
      )}
      role="group"
      aria-label={t('explore.filters.label', 'Filter options')}
    >
      {filters.map((chip) => {
        const isSelected = selected.has(chip.id);

        return (
          <button
            key={chip.id}
            onClick={() => onToggle(chip)}
            aria-pressed={isSelected}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
              isSelected
                ? 'bg-[#b4533a] text-[#fff7ed] border-[#b4533a]'
                : ''
            )}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}

FilterChips.displayName = 'FilterChips';
