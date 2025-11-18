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

  const modes: { id: ViewMode; label: string; icon: (active: boolean) => JSX.Element }[] = [
    {
      id: 'grid',
      label: t('listing.viewMode.grid', 'Grid'),
      icon: (active) => (
        <Squares2X2Icon
          size="md"
          className={active ? 'text-[#fff7ed]' : 'text-[#b4533a]'}
        />
      ),
    },
    {
      id: 'plan',
      label: t('listing.viewMode.plan', 'Plan'),
      icon: (active) => (
        <MapIcon
          size="md"
          className={active ? 'text-[#fff7ed]' : 'text-[#b4533a]'}
        />
      ),
    },
    {
      id: 'list',
      label: t('listing.viewMode.list', 'List'),
      icon: (active) => (
        <Bars3Icon
          size="md"
          className={active ? 'text-[#fff7ed]' : 'text-[#b4533a]'}
        />
      ),
    },
  ];

  return (
    <div className={cn(
      'inline-flex items-center gap-2 rounded-lg p-1 bg-[#fff7ed]',
      className
    )}>
      {modes.map((item) => {
        const active = mode === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            aria-label={item.label}
            aria-pressed={active}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200',
              active
                ? 'bg-[#b4533a] text-[#fff7ed]'
                : 'text-[#b4533a]'
            )}
          >
            {item.icon(active)}

            <Text
              variant="caption"
              className={cn(
                'hidden sm:block font-medium',
                active ? 'text-[#fff7ed]' : 'text-[#b4533a]'
              )}
            >
              {item.label}
            </Text>
          </button>
        );
      })}
    </div>
  );
}


ViewModeToggle.displayName = 'ViewModeToggle';
