import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Text, Icon } from '@/components/atoms';
import { UnitSort } from '@/lib/unitData';
import { cn } from '@/lib/cn';

export interface SortDropdownProps {
  sort: UnitSort;
  onSortChange: (sort: UnitSort) => void;
  className?: string;
}

const SORT_OPTIONS = [
  { field: 'price', label: 'Price' },
  { field: 'area', label: 'Area' },
  { field: 'floor', label: 'Floor' },
  { field: 'code', label: 'Unit Code' },
] as const;


export function SortDropdown({ sort, onSortChange, className }: SortDropdownProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLabel =
    SORT_OPTIONS.find((opt) => opt.field === sort.field)?.label || sort.field;

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
    <div className={cn('relative text-[#fff7ed]', className)}>
      <div className="flex items-center gap-3">

        {/* MAIN BUTTON */}
        <div className="relative">
          <Button
            intent="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-[#fff7ed]"
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            <Text variant="caption" className="text-[#fff7ed]">
              {t('explore.sort.label', 'Sort')}: {currentLabel}
            </Text>

            <Icon
              name={isOpen ? 'chevron-left' : 'chevron-right'}
              size="sm"
              className={cn(
                'text-[#fff7ed] transition-transform',
                isOpen && 'rotate-90'
              )}
            />
          </Button>

          {/* DROPDOWN */}
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-[140]"
                onClick={() => setIsOpen(false)}
              />

              <div
                className="
                  absolute top-full left-0 mt-2 z-[150]
                  min-w-[200px]
                  bg-white/10 backdrop-blur-xl
                  border border-white/30
                  rounded-lg shadow-lg
                "
              >
                {SORT_OPTIONS.map((option) => {
                  const active = option.field === sort.field;

                  return (
                    <button
                      key={option.field}
                      onClick={() => handleFieldSelect(option.field)}
                      className={cn(
                        'w-full px-4 py-2 text-left transition-colors',
                        active
                          ? 'bg-white/20 font-semibold'
                          : 'hover:bg-white/10'
                      )}
                    >
                      <Text
                        variant="caption"
                        className={cn(
                          active ? 'text-[#fff7ed]' : 'text-[#fff7ed]/80'
                        )}
                      >
                        {option.label}
                      </Text>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* SORT DIRECTION BUTTON */}
        <Button intent="ghost" size="sm" onClick={toggleDirection}>
          <Icon
            name="arrow-down"
            size="sm"
            className={cn(
              'text-[#fff7ed] transition-transform',
              sort.direction === 'desc' && 'rotate-180'
            )}
          />
        </Button>
      </div>
    </div>
  );
}

SortDropdown.displayName = 'SortDropdown';
