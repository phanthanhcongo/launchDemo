import { useTranslation } from 'react-i18next';
import { Text, Image } from '@/components/atoms';
import { ResponsiveContainer, ResponsiveGrid } from '@/components/ui';
import { cn } from '@/lib/cn';

export interface LifestyleSectionProps {
  className?: string;
}

/**
 * LifestyleSection Component
 * 
 * Describes the lifestyle and philosophy of Nyala Villas
 */
export function LifestyleSection({ className }: LifestyleSectionProps) {
  const { t } = useTranslation();

  return (
    <section
      id="lifestyle"
      className={cn('relative bg-secondary py-20 md:py-32 overflow-hidden', className)}
    >
      {/* Background - Using real villa images */}
      <div className="absolute inset-0">
        <Image
          src="/images/Nyala Villas - Visualisation/02 Two Bed/NYALA VILLAS_2B_INT01_LIVING_SWATCH ARCHITECTS.jpg"
          alt="Lifestyle background"
          objectFit="cover"
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/60" />
      </div>

      {/* Decorative Submark */}
      <div className="absolute left-0 top-0 w-[1167px] h-[1167px] opacity-10">
        <Image
          src="/images/logo-primary.svg"
          alt=""
          objectFit="contain"
          className="w-full h-full"
        />
      </div>

      <ResponsiveContainer size="lg" padding="md" className="relative z-10">
        <ResponsiveGrid cols={{ default: 1, lg: 2 }} gap="xl" className="items-center">
          {/* Left: Gallery Images - Using real villa images */}
          <div className="relative">
            <ResponsiveGrid cols={{ default: 2 }} gap="md">
              <Image
                src="/images/Nyala Villas - Visualisation/02 Two Bed/NYALA VILLAS_EXT02_GARDEN VIEW_SWATCH ARCHITECTS.jpg"
                alt="Nyala Villas Garden View"
                objectFit="cover"
                aspectRatio="4/3"
                className="w-full rounded-lg shadow-lg"
              />
              <Image
                src="/images/Nyala Villas - Visualisation/02 Two Bed/NYALA VILLAS_INT01_LIVING ROOM_SWATCH ARCHITECTS.jpg"
                alt="Nyala Villas Living Room"
                objectFit="cover"
                aspectRatio="4/3"
                className="w-full rounded-lg shadow-lg"
              />
              <Image
                src="/images/Nyala Villas - Visualisation/02 Two Bed/NYALA VILLAS_EXT03_GARDEN SEATING_SWATCH ARCHITECTS.jpg"
                alt="Nyala Villas Garden Seating"
                objectFit="cover"
                aspectRatio="4/3"
                className="w-full rounded-lg shadow-lg"
              />
              <Image
                src="/images/Nyala Villas - Visualisation/02 Two Bed/NYALA VILLAS_INT02_KITCHEN_SWATCH ARCHITECTS.jpg"
                alt="Nyala Villas Kitchen"
                objectFit="cover"
                aspectRatio="4/3"
                className="w-full rounded-lg shadow-lg"
              />
            </ResponsiveGrid>
          </div>

          {/* Right: Text Content */}
          <div className="space-y-6 sm:space-y-8">
            <div className="relative">
              <Image
                src="/images/logo-primary.svg"
                alt="Nyala Villas"
                className="w-full max-w-[471px] mb-8 sm:mb-12"
              />
            </div>

            <Text variant="h2" className="text-left text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              {t('lifestyle.heading')}
            </Text>

            <Text variant="body" className="text-left text-white/95 leading-relaxed text-base sm:text-lg md:text-xl">
              {t('lifestyle.description')}
            </Text>
          </div>
        </ResponsiveGrid>
      </ResponsiveContainer>
    </section>
  );
}

LifestyleSection.displayName = 'LifestyleSection';

