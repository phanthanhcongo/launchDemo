import { useTranslation } from 'react-i18next';
import { Button, Text, Image } from '@/components/atoms';
import { ResponsiveContainer, ResponsiveGrid } from '@/components/ui';
import { cn } from '@/lib/cn';

export interface InvestmentSectionProps {
  className?: string;
  onDownloadClick?: () => void;
}

/**
 * InvestmentSection Component
 * 
 * Hard-selling conversion section with 3-column tiles.
 * Highlights ROI, capital growth, and flexible payment plans.
 */
export function InvestmentSection({ className, onDownloadClick }: InvestmentSectionProps) {
  const { t } = useTranslation();

  const investmentTiles = [
    {
      id: 'rental-roi',
      stat: '16%',
      titleKey: 'investment.tiles.rentalROI.title',
      descKey: 'investment.tiles.rentalROI.description',
    },
    {
      id: 'capital-growth',
      stat: '30%',
      titleKey: 'investment.tiles.capitalGrowth.title',
      descKey: 'investment.tiles.capitalGrowth.description',
    },
    {
      id: 'flexible-payment',
      stat: '12',
      titleKey: 'investment.tiles.flexiblePayment.title',
      descKey: 'investment.tiles.flexiblePayment.description',
    },
  ];

  return (
    <section
      id="investment"
      className={cn('relative bg-primary py-20 md:py-32 overflow-hidden', className)}
    >
      {/* Background - Using real villa images */}
      <div className="absolute inset-0">
        <Image
          src="/images/Nyala Villas - Visualisation/03 Three Bed A/NYALA VILLAS_3A_EXT01_GARDEN ELEVATION_SWATCH ARCHITECTS.jpg"
          alt="Nyala Villas Investment"
          objectFit="cover"
          className="w-full h-full opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/85 to-black/90" />
      </div>

      <ResponsiveContainer size="lg" padding="md" className="relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <Text variant="h1" className="mb-4 sm:mb-6 text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {t('investment.heading')}
          </Text>
          <Text variant="body" className="max-w-4xl mx-auto text-white/95 text-base sm:text-lg md:text-xl">
            {t('investment.description')}
          </Text>
        </div>

        {/* 3-Column Investment Tiles */}
        <ResponsiveGrid cols={{ default: 1, md: 3 }} gap="lg" className="mb-12 sm:mb-16">
          {investmentTiles.map((tile, index) => (
            <div
              key={tile.id}
              className={cn(
                'bg-surface/10 backdrop-blur-sm rounded-lg p-8 text-center',
                'border border-white/30',
                'hover:bg-surface/15 hover:border-white/50',
                'transition-all duration-500',
                'opacity-0 animate-fade-in-up'
              )}
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              {/* Stat */}
              <div className="mb-4">
                <Text variant="h1" className="text-6xl font-bold text-white">
                  {tile.stat}
                  {tile.id === 'flexible-payment' ? (
                    <Text as="span" variant="h3" className="ml-1 text-white">
                      mo
                    </Text>
                  ) : (
                    <Text as="span" variant="h3" className="text-white">
                      %
                    </Text>
                  )}
                </Text>
              </div>

              {/* Title */}
              <Text variant="h4" className="mb-4 font-semibold text-white">
                {t(tile.titleKey)}
              </Text>

              {/* Description */}
              <Text variant="body" className="text-sm leading-relaxed text-white/90">
                {t(tile.descKey)}
              </Text>
            </div>
          ))}
        </ResponsiveGrid>

        {/* CTA Zone - Two Paths */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Button
            intent="secondary"
            size="lg"
            onClick={onDownloadClick}
            className={
              cn("w-full sm:w-auto min-w-[240px]",
                "text-white backdrop-blur-sm text-white backdrop-blur-sm",
                "bg-[#b4533acc] hover:bg-[#b4533aee] border border-none")
            }
          >
            {t('investment.downloadGuide', 'Download Investment Guide')}
          </Button>
          <Button
            intent="primary"
            size="lg"
            className="w-full sm:w-auto min-w-[240px]"
          >
            {t('investment.scheduleConsultation', 'Schedule a Consultation')}
          </Button>
        </div>
      </ResponsiveContainer>
    </section>
  );
}

InvestmentSection.displayName = 'InvestmentSection';

