import { useTranslation } from 'react-i18next';
import { Text } from '@/components/atoms';
import { ResponsiveContainer, ResponsiveGrid } from '@/components/ui';
import { cn } from '@/lib/cn';


export interface ValuePropositionProps {
  className?: string;
}

const VALUE_PROPS = [
  {
    id: 'eco-luxury',
    icon: 'leaf',
    titleKey: 'valueProps.ecoLuxury.title',
    descKey: 'valueProps.ecoLuxury.description',
  },
  {
    id: 'prime-location',
    icon: 'location',
    titleKey: 'valueProps.primeLocation.title',
    descKey: 'valueProps.primeLocation.description',
  },
  {
    id: 'strong-roi',
    icon: 'chart',
    titleKey: 'valueProps.strongROI.title',
    descKey: 'valueProps.strongROI.description',
  },
];

/**
 * ValueProposition Component
 *
 * Displays 3 key USP tiles immediately after hero.
 * Establishes trust and gives users reasons to stay.
 *
 * @example
 * ```tsx
 * <ValueProposition />
 * ```
 */
export function ValueProposition({ className }: ValuePropositionProps) {
  const { t } = useTranslation();

  return (
    <section
      className={cn(
        'relative bg-surface py-16 sm:py-20 md:py-24 lg:py-28',
        'border-y border-primary/10',
        'bg-[#fff7ed] backdrop-blur-md',
        className
      )}
    >
      <ResponsiveContainer size="lg" padding="md">
        <ResponsiveGrid cols={{ default: 1, md: 3 }} gap="lg">
          {VALUE_PROPS.map((prop, index) => (
            <div
              key={prop.id}
              className={cn(
                "text-center space-y-4 sm:space-y-6 p-4 sm:p-6 rounded-lg",
                "transition-all duration-500",
                "bg-white border border-primary/10",
                "shadow-[0_8px_10px_0_#8B4513aa]",
                "hover:-translate-y-2 hover:scale-[1.03]",
                "hover:shadow-[0_20px_35px_-5px_#8B4513aa]",
                "hover:bg-primary/5",
                "opacity-0 animate-fade-in-up"
              )}
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                  <div className="w-8 h-8 text-secondary">
                    {prop.icon === 'leaf' && (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636a9 9 0 1112.728 0z" />
                      </svg>
                    )}
                    {prop.icon === 'location' && (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    )}
                    {prop.icon === 'chart' && (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 010 5.814z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.25 22.12l3.299-3.299a3.75 3.75 0 005.303-5.303l-3.299-3.299a3.75 3.75 0 00-5.303 5.303z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Title */}
              <Text variant="h4" className="text-primary font-bold text-lg sm:text-xl text-center">
                {t(prop.titleKey)}
              </Text>

              {/* Description */}
              <Text variant="body" className="text-primary/80 leading-relaxed text-sm sm:text-base text-center">
                {t(prop.descKey)}
              </Text>
            </div>
          ))}
        </ResponsiveGrid>
      </ResponsiveContainer>
    </section>
  );
}

ValueProposition.displayName = 'ValueProposition';
