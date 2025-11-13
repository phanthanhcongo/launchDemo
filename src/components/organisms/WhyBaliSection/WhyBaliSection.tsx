import { useTranslation } from 'react-i18next';
import * as React from 'react';
import { Button, Text, Image } from '@/components/atoms';
import { cn } from '@/lib/cn';
import { WHY_BALI_POINTS } from '@/lib/constants';

export interface WhyBaliSectionProps {
  className?: string;
  onScheduleClick?: () => void;
}

/**
 * WhyBaliSection Component
 * 
 * Explains the benefits of investing in Bali with Nyala Villas
 */
export function WhyBaliSection({ className, onScheduleClick }: WhyBaliSectionProps) {
  const { t } = useTranslation();

  return (
    <section
      id="why-bali"
      className={cn('relative bg-primary py-20 md:py-32 overflow-hidden', className)}
    >
      {/* Background - Using real villa images */}
      <div className="absolute inset-0">
        <Image
          src="/images/Nyala Villas - Visualisation/01 Nyala One Bed/NYALA VILLAS_1B_EXT03_ROOF TERRACE_SWATCH ARCHITECTS.jpg"
          alt="Why Bali background"
          objectFit="cover"
          className="w-full h-full opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-primary/95" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Image - Using real villa images */}
          <div className="relative">
            <Image
              src="/images/Nyala Villas - Visualisation/04 Three Bed B/NYALA VILLAS_3B_EXT01_GARDEN ELEVATION_SWATCH ARCHITECTS.jpg"
              alt="Why Bali - Nyala Villas"
              objectFit="cover"
              aspectRatio="16/9"
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Right: Content */}
          <div className="space-y-12">
            <Text variant="h2" className="text-left text-white font-bold">
              {t('whyBali.heading')}
            </Text>

            {/* Points with Separators */}
            <div className="flex gap-8 items-start">
              {WHY_BALI_POINTS.map((point, index) => (
                <React.Fragment key={point.title}>
                  <div className="flex-1 space-y-4">
                    <Text variant="body" className="text-center font-bold uppercase text-2xl text-white">
                      {t(`whyBali.points.${Object.keys(WHY_BALI_POINTS)[index]}.title`, point.title)}
                    </Text>
                    <Text variant="body" className="text-left text-white/95">
                      {t(
                        `whyBali.points.${Object.keys(WHY_BALI_POINTS)[index]}.description`,
                        point.description
                      )}
                    </Text>
                  </div>
                  {index < WHY_BALI_POINTS.length - 1 && (
                    <div className="flex-shrink-0">
                      <Image
                        src="/images/why-bali-line.svg"
                        alt=""
                        className="h-[175px] w-px"
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            <Button
              intent="secondary"
              size="lg"
              onClick={onScheduleClick}
              className="mt-8"
            >
              {t('whyBali.cta')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

WhyBaliSection.displayName = 'WhyBaliSection';

