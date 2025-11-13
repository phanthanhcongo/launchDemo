import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';
import { Unit } from '@/lib/unitData';
import { Text } from '@/components/atoms';

export interface SearchBarProps {
  /**
   * Search query value
   */
  value: string;
  /**
   * Callback when search changes
   */
  onChange: (value: string) => void;
  /**
   * Callback when unit is selected from suggestions
   */
  onUnitSelect?: (unit: Unit) => void;
  /**
   * Units to search through
   */
  units?: Unit[];
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * SearchBar Component with Auto-Suggest
 *
 * Search input with auto-suggest dropdown showing matching units.
 * Supports keyboard navigation and click selection.
 *
 * @example
 * ```tsx
 * <SearchBar
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   units={allUnits}
 *   onUnitSelect={handleUnitSelect}
 * />
 * ```
 */
export function SearchBar({ 
  value, 
  onChange, 
  onUnitSelect,
  units = [],
  placeholder, 
  className 
}: SearchBarProps) {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter matching units
  const suggestions = value.trim().length > 0
    ? units.filter(unit => {
        const query = value.toLowerCase();
        return (
          unit.code.toLowerCase().includes(query) ||
          unit.type.toLowerCase().includes(query) ||
          unit.floor.toString().includes(query) ||
          unit.orientation.toLowerCase().includes(query)
        );
      }).slice(0, 5) // Limit to 5 suggestions
    : [];

  const showSuggestions = isFocused && suggestions.length > 0;

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSelectUnit(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsFocused(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelectUnit = (unit: Unit) => {
    onChange(unit.code);
    setIsFocused(false);
    inputRef.current?.blur();
    onUnitSelect?.(unit);
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && suggestionsRef.current) {
      const highlightedElement = suggestionsRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  return (
    <div className={cn('relative w-full', className)}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Delay to allow click on suggestion
            setTimeout(() => setIsFocused(false), 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t('explore.search.placeholder', 'Search by unit code...')}
          className={cn(
            'w-full px-4 py-3 pl-12',
            'bg-surface border border-primary/20 rounded-lg',
            'text-primary placeholder:text-primary/50',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            'transition-colors'
          )}
          aria-label={t('explore.search.label', 'Search units')}
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-controls="search-suggestions"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <svg
            className="w-5 h-5 text-primary/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Auto-suggest Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          id="search-suggestions"
          className="absolute z-[200] w-full mt-2 bg-surface border border-primary/20 rounded-lg shadow-lg max-h-64 overflow-y-auto"
          role="listbox"
        >
          {suggestions.map((unit, index) => (
            <button
              key={unit.id}
              type="button"
              onClick={() => handleSelectUnit(unit)}
              className={cn(
                'w-full px-4 py-3 text-left hover:bg-primary/5 transition-colors',
                'flex items-center justify-between',
                index === highlightedIndex && 'bg-primary/10'
              )}
              role="option"
              aria-selected={index === highlightedIndex}
            >
              <div className="flex flex-col">
                <Text variant="body" className="font-medium text-primary">
                  {unit.code}
                </Text>
                <Text variant="caption" className="text-primary/60">
                  {t(`villas.${unit.type.replace('-', '')}.title`, unit.type)} • Floor {unit.floor}
                </Text>
              </div>
              <div className="text-right">
                <Text variant="caption" className="text-primary/70 font-medium">
                  ${unit.price.toLocaleString()}
                </Text>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

SearchBar.displayName = 'SearchBar';
