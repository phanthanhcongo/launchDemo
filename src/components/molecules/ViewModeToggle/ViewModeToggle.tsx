import { useTranslation } from 'react-i18next';
import { Text } from '@/components/atoms';
import { cn } from '@/lib/cn';
import { Squares2X2Icon, MapIcon, Bars3Icon } from '@/components/ui';

export type ViewMode = 'grid' | 'plan' | 'list';

export interface ViewModeToggleProps {
  /**
   * Current view mode
   */
  mode: ViewMode;
  /**
   * Callback when mode changes
   */
  onChange: (mode: ViewMode) => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ViewModeToggle Component
 *
 * Allows switching between Grid, Plan, and List views.
 * Grid is default for image-driven browsing.
 * Plan for layout-focused users.
 * List for comparison-focused users.
 *
 * @example
 * ```tsx
 * <ViewModeToggle
 *   mode={viewMode}
 *   onChange={setViewMode}
 * />
 * ```
 */
export function ViewModeToggle({ mode, onChange, className }: ViewModeToggleProps) {
  const { t } = useTranslation();

  const modes: { id: ViewMode; label: string; icon: JSX.Element }[] = [
    {
      id: 'grid',
      label: t('listing.viewMode.grid', 'Grid'),
      icon: <Squares2X2Icon size="md" />,
    },
    {
      id: 'plan',
      label: t('listing.viewMode.plan', 'Plan'),
      icon: <MapIcon size="md" />,
    },
    {
      id: 'list',
      label: t('listing.viewMode.list', 'List'),
      icon: <Bars3Icon size="md" />,
    },
  ];

  return (
    <div className={cn('inline-flex items-center gap-2 bg-surface border border-primary/20 rounded-lg p-1', className)}>
      {modes.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200',
            'hover:bg-primary/5',
            mode === item.id
              ? 'bg-primary text-surface shadow-md'
              : 'text-primary/70'
          )}
          aria-label={item.label}
          aria-pressed={mode === item.id}
        >
          {item.icon}
          <Text variant="caption" className="hidden sm:block font-medium">
            {item.label}
          </Text>
        </button>
      ))}
    </div>
  );
}

ViewModeToggle.displayName = 'ViewModeToggle';
