import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Text, Icon } from '@/components/atoms';
import { UnitSort } from '@/lib/unitData';
import { cn } from '@/lib/cn';

export interface SortDropdownProps {
  /**
   * Current sort configuration
   */
  sort: UnitSort;
  /**
   * Callback when sort changes
   */
  onSortChange: (sort: UnitSort) => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

const SORT_OPTIONS: { field: UnitSort['field']; label: string }[] = [
  { field: 'price', label: 'Price' },
  { field: 'area', label: 'Area' },
  { field: 'floor', label: 'Floor' },
  { field: 'code', label: 'Unit Code' },
];

/**
 * SortDropdown Component
 *
 * Dropdown for sorting units with direction toggle.
 *
 * @example
 * ```tsx
 * <SortDropdown
 *   sort={{ field: 'price', direction: 'asc' }}
 *   onSortChange={handleSortChange}
 * />
 * ```
 */
export function SortDropdown({ sort, onSortChange, className }: SortDropdownProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLabel = SORT_OPTIONS.find(opt => opt.field === sort.field)?.label || sort.field;

  const handleFieldSelect = (field: UnitSort['field']) => {
    onSortChange({ ...sort, field });
    setIsOpen(false);
  };

  const toggleDirection = () => {
    onSortChange({
      ...sort,
      direction: sort.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Button
            intent="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2"
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            <Text variant="caption">
              {t('explore.sort.label', 'Sort')}: {currentLabel}
            </Text>
            <Icon 
              name={isOpen ? 'chevron-left' : 'chevron-right'} 
              size="sm" 
              iconColor="primary"
              className={cn('transition-transform', isOpen && 'rotate-90')}
            />
          </Button>

          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-[140]"
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute top-full left-0 mt-2 bg-surface border border-primary/20 rounded-lg shadow-lg z-[150] min-w-[200px]">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.field}
                    onClick={() => handleFieldSelect(option.field)}
                    className={cn(
                      'w-full px-4 py-2 text-left hover:bg-primary/10 transition-colors',
                      sort.field === option.field && 'bg-primary/20'
                    )}
                  >
                    <Text variant="caption" className={sort.field === option.field ? 'text-primary font-medium' : 'text-primary'}>
                      {option.label}
                    </Text>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <Button
          intent="ghost"
          size="sm"
          onClick={toggleDirection}
          aria-label={t('explore.sort.toggleDirection', 'Toggle sort direction')}
        >
          <Icon
            name={sort.direction === 'asc' ? 'arrow-down' : 'arrow-down'}
            size="sm"
            iconColor="primary"
            className={cn('transition-transform', sort.direction === 'desc' && 'rotate-180')}
          />
        </Button>
      </div>
    </div>
  );
}

SortDropdown.displayName = 'SortDropdown';
