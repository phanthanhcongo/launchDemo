import { useTranslation } from 'react-i18next';
import { Text, Image } from '@/components/atoms';
import { VillaCard } from '@/components/molecules';
import { ResponsiveContainer, ResponsiveGrid } from '@/components/ui';
import { cn } from '@/lib/cn';
import { ALL_VILLAS, VillaData } from '@/lib/villaData';

export interface VillaSectionProps {
  className?: string;
  onVillaClick?: (villa: VillaData) => void;
}

/**
 * VillaSection Component
 * 
 * Showcases available villa types with images and descriptions
 */
export function VillaSection({ className, onVillaClick }: VillaSectionProps) {
  const { t } = useTranslation();

  // Using villa data with images and VR tours

  return (
    <section
      id="villas"
      className={cn('relative bg-secondary py-20 sm:py-24 md:py-28 lg:py-32 overflow-hidden', className)}
    >
      {/* Background Pattern - Using real villa images */}
      <div className="absolute inset-0 opacity-5">
        <Image
          src="/images/Nyala Villas - Visualisation/01 Nyala One Bed/NYALA VILLAS_1B_EXT01_STREET VIEW_SWATCH ARCHITECTS.jpg"
          alt=""
          objectFit="cover"
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-secondary/95" />
      </div>

      <ResponsiveContainer size="lg" padding="md" className="relative z-10">
        {/* Headings - Centered for Luxury Feel */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20 text-center">
          <Text variant="h1" className="mb-3 sm:mb-4 text-primary font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {t('villas.heading')}
          </Text>
          <Text variant="h3" className="text-primary/80 italic text-lg sm:text-xl md:text-2xl">
            {t('villas.subheading')}
          </Text>
        </div>

        {/* Villa Cards Grid - Enhanced Layout with Stagger Animation */}
        <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 4 }} gap="lg">
          {ALL_VILLAS.map((villa, index) => (
            <div
              key={villa.id}
              className="opacity-0 animate-fade-in-up"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <VillaCard
                villa={villa}
                onClick={onVillaClick}
                className="h-full"
              />
            </div>
          ))}
        </ResponsiveGrid>

        {/* Section Footer - Luxury CTA */}
        <div className="text-center mt-16 sm:mt-20 pt-8 sm:pt-12 border-t border-primary/10">
          <Text variant="body" className="text-primary/80 mb-4 sm:mb-6 text-sm sm:text-base">
            {t('villas.exploreHint', 'Hover over any villa to explore gallery and virtual tour')}
          </Text>
          <Text variant="caption" className="text-primary/60 italic text-xs sm:text-sm">
            {t('villas.availableNow', 'Limited availability • Reserve your villa today')}
          </Text>
        </div>
      </ResponsiveContainer>
    </section>
  );
}

VillaSection.displayName = 'VillaSection';

