import { useTranslation } from 'react-i18next';
import { Button, Text, Image } from '@/components/atoms';
import { CountdownTimer } from '@/components/molecules';
import { cn } from '@/lib/cn';

export interface OffersSectionProps {
  className?: string;
  targetDate?: Date;
  onClaimClick?: () => void;
}

/**
 * OffersSection Component
 * 
 * Urgency-driven pre-sale section with countdown timer.
 * Follows luxury real estate conversion patterns.
 */
export function OffersSection({
  className,
  targetDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
  onClaimClick,
}: OffersSectionProps) {
  const { t } = useTranslation();

  return (
    <section
      id="offers"
      className={cn('relative bg-surface py-20 md:py-32 overflow-hidden border-y border-primary/10', className)}
    >
      {/* Background - Using real villa images */}
      <div className="absolute inset-0">
        <Image
          src="/images/Nyala Villas - Visualisation/01 Nyala One Bed/NYALA VILLAS_1B_EXT02_FRONT VIEW_SWATCH ARCHITECTS.jpg"
          alt="Nyala Villas Pre-Sale"
          objectFit="cover"
          className="w-full h-full opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface/98 via-surface/95 to-surface/98" />
      </div>

      {/* Decorative Submark */}
      <div className="absolute left-[311px] top-[1209px] w-[343px] h-[343px]">
        <Image src="/images/offers-submark.svg" alt="" objectFit="contain" className="opacity-50" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-16">
        {/* Header - Centered */}
        <div className="text-center mb-12 md:mb-16">
          <Text variant="h1" className="mb-4 text-primary font-bold text-center">
            {t('offers.countdown.heading', 'Pre-Sale Opportunity Ending Soon')}
          </Text>
          <Text variant="body" className="text-primary/80 max-w-2xl mx-auto text-lg text-center">
            {t('offers.countdown.subtitle', 'Limited availability at exclusive pre-launch pricing')}
          </Text>
        </div>

        {/* Countdown Timer - Prominent */}
        <div className="mb-16">
          <CountdownTimer targetDate={targetDate} />
        </div>

        {/* Offer Details - Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          {/* Left: Image - Using real villa images */}
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden shadow-2xl">
            <Image
              src="/images/Nyala Villas - Visualisation/03 Three Bed A/NYALA VILLAS_3A_INT02_LIVING ROOM_SWATCH ARCHITECTS.jpg"
              alt="Nyala Villas Pre-Sale"
              objectFit="cover"
              className="w-full h-full"
            />
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            <Text variant="h3" className="text-primary font-bold">
              {t('offers.heading', 'Explore the Beauty of Nyala Villas')}
            </Text>

            <Text variant="body" className="text-primary/90 leading-relaxed text-lg">
              {t('offers.description')}
            </Text>

            {/* Key Points */}
            <div className="space-y-3 py-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <Text variant="body" className="text-primary/80">
                  {t('offers.point1', 'Only 3 of 6 units remaining')}
                </Text>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <Text variant="body" className="text-primary/80">
                  {t('offers.point2', 'Starting at $359K with 12-month interest-free payment')}
                </Text>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <Text variant="body" className="text-primary/80">
                  {t('offers.point3', 'Price increases $20K at each construction milestone')}
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* CTA - Prominent */}
        <div className="text-center">
          <Button 
            intent="primary" 
            size="lg" 
            onClick={onClaimClick}
            className="min-w-[320px] shadow-xl"
          >
            {t('offers.cta')}
          </Button>
        </div>
      </div>
    </section>
  );
}

OffersSection.displayName = 'OffersSection';

