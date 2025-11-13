import { useTranslation } from 'react-i18next';
import { Button, Text, Line, Image } from '@/components/atoms';
import { cn } from '@/lib/cn';
import { vrService } from '@/lib/vrService';

export interface HeroProps {
  className?: string;
  onExploreVillas?: () => void;
  onBookCall?: () => void;
}

/**
 * Hero Component
 * 
 * Luxury real estate hero with dual CTAs.
 * Emotion-driven design with clear action paths.
 * Follows international UX standards for high-end properties.
 */
export function Hero({ className, onExploreVillas, onBookCall }: HeroProps) {
  const { t } = useTranslation();

  return (
    <section
      id="home"
      className={cn(
        'relative min-h-screen flex items-center justify-center',
        'bg-surface overflow-hidden',
        className
      )}
    >
      {/* Background Images - Using real villa images */}
      <div className="absolute inset-0">
        <Image
          src="/images/Nyala Villas - Visualisation/02 Two Bed/NYALA VILLAS_EXT01_FRONT VIEW_SWATCH ARCHITECTS.jpg"
          alt="Nyala Villas"
          objectFit="cover"
          className="w-full h-full"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80" />
        <div className="absolute inset-0 bg-primary/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32 pt-40">
        <div className="max-w-[1367px] mx-auto space-y-12 text-center">
          {/* Main Heading */}
          <div className="space-y-6">
            <Text variant="h1" className="text-white drop-shadow-2xl font-bold">
              {t('hero.welcome')}
            </Text>

            {/* Decorative Lines */}
            <div className="flex items-center justify-center gap-4 max-w-[719px] mx-auto">
              <Line className="flex-1 bg-white/60" />
              <Text variant="h2" className="px-4 whitespace-nowrap text-white font-semibold">
                {t('hero.subtitle')}
              </Text>
              <Line className="flex-1 bg-white/60" />
            </div>

            <Text variant="body" className="max-w-[1093px] mx-auto text-white/95 text-lg">
              {t('hero.description')}
            </Text>
          </div>

          {/* Dual CTAs - Luxury Pattern */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button
              intent="primary"
              size="lg"
              onClick={onExploreVillas}
              className="w-full sm:w-auto min-w-[240px]"
            >
              {t('hero.exploreVillas', 'Explore Villas')}
            </Button>
            <Button
              intent="secondary"
              size="lg"
              onClick={onBookCall}
              className="w-full sm:w-auto min-w-[240px]"
            >
              {t('hero.bookCall', 'Book a Discovery Call')}
            </Button>
          </div>

          {/* Secondary Micro-Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-white">
            <button
              onClick={() => vrService.openExternalUrl('vr')}
              className="flex items-center gap-2 hover:text-white/80 transition-colors group"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <Text variant="caption" className="font-medium text-white">
                {t('hero.watchVR', 'Watch Virtual Tour')}
              </Text>
            </button>
            <button
              onClick={() => vrService.openExternalUrl('floorplans')}
              className="flex items-center gap-2 hover:text-white/80 transition-colors group"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <Text variant="caption" className="font-medium text-white">
                {t('hero.viewFloorPlans', 'View Floor Plans')}
              </Text>
            </button>
            <button
              onClick={() => vrService.openExternalUrl('visualisation')}
              className="flex items-center gap-2 hover:text-white/80 transition-colors group"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <Text variant="caption" className="font-medium text-white">
                {t('hero.viewVisualisation', 'View Visualisations')}
              </Text>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white drop-shadow-lg"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

Hero.displayName = 'Hero';

