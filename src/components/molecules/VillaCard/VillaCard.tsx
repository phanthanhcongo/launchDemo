import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Image, Text } from '@/components/atoms';
import { VillaGallery, VRViewer } from '@/components/molecules';
import { VillaData } from '@/lib/villaData';
import { cn } from '@/lib/cn';

export interface VillaCardProps {
  /**
   * Villa data including images and VR URL
   */
  villa: VillaData;
  /**
   * Card aspect ratio
   */
  aspectRatio?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Click handler for card
   */
  onClick?: (villa: VillaData) => void;
}

/**
 * VillaCard Component
 * 
 * Interactive villa card with gallery and VR tour integration.
 * Displays villa information with hover actions and immersive experiences.
 * 
 * @example
 * ```tsx
 * <VillaCard
 *   villa={TWO_BED_VILLA}
 *   onClick={(villa) => console.log('Villa clicked:', villa.name)}
 * />
 * ```
 */
export function VillaCard({
  villa,
  aspectRatio = '2/3',
  className,
  onClick,
}: VillaCardProps) {
  const { t } = useTranslation();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isVROpen, setIsVROpen] = useState(false);

  // Use the first image as the card preview
  const previewImage = villa.images[0]?.src || '/images/villa-placeholder.jpg';

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onClick?.(villa);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(villa);
    }
  };

  return (
    <>
      <div
        className={cn(
          'group relative overflow-hidden border border-primary/30 cursor-pointer',
          'transition-all duration-500 ease-out',
          'hover:scale-[1.02] hover:border-primary hover:shadow-2xl',
          'focus-within:scale-[1.02] focus-within:border-primary focus-within:shadow-2xl',
          'focus-within:ring-2 focus-within:ring-primary/20',
          className
        )}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`Explore ${villa.name}`}
      >
        {/* Image */}
        <div className="relative w-full" style={{ aspectRatio }}>
          <Image
            src={previewImage}
            alt={villa.name}
            objectFit="cover"
            className="transition-transform duration-700 ease-out group-hover:scale-110"
          />
          
          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent group-hover:from-surface/95 group-hover:via-surface/70 transition-all duration-500" />
          
          {/* Subtle overlay on hover for better button visibility */}
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Hover Actions - Enhanced UX */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
            <div className="flex flex-col gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
              <Button
                intent="primary"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsGalleryOpen(true);
                }}
                className="backdrop-blur-md bg-surface/95 hover:bg-surface shadow-lg px-6 py-3 min-w-[160px] transition-all duration-300 hover:scale-105"
              >
                <Text variant="caption" className="font-medium">
                  {t('villas.viewGallery', 'View Gallery')}
                </Text>
              </Button>

              <Button
                intent="secondary"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVROpen(true);
                }}
                className="backdrop-blur-md bg-secondary/95 hover:bg-secondary shadow-lg px-6 py-3 min-w-[160px] transition-all duration-300 hover:scale-105"
              >
                <Text variant="caption" className="text-surface font-medium">
                  {t('villas.virtualTour', 'Virtual Tour')}
                </Text>
              </Button>
            </div>
          </div>
        </div>

        {/* Text Content - Enhanced */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 space-y-2 transform translate-y-0 group-hover:translate-y-0 transition-transform duration-500">
          <Text variant="h3" color="primary" className="text-left font-medium group-hover:font-semibold transition-all duration-300">
            {t(`villas.${villa.type.replace('-', '')}.title`, villa.name)}
          </Text>
          <Text variant="body" color="primary" className="text-left text-primary/90 group-hover:text-primary transition-colors duration-300">
            {t(`villas.${villa.type.replace('-', '')}.subtitle`, villa.subtitle)}
          </Text>

          {/* Image Count Indicator - Fixed */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-primary/30">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: Math.min(villa.images.length, 5) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-primary/80 rounded-full transition-all duration-300 group-hover:bg-primary"
                  />
                ))}
                {villa.images.length > 5 && (
                  <Text variant="caption" className="text-primary/90 ml-1 font-medium">
                    +{villa.images.length - 5}
                  </Text>
                )}
              </div>
              <Text variant="caption" className="text-primary/90 font-medium">
                {villa.images.length} {t('villas.images', 'images')}
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Villa Gallery Modal */}
      <VillaGallery
        villaType={villa.type}
        images={villa.images}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onOpenVR={() => {
          setIsGalleryOpen(false);
          setIsVROpen(true);
        }}
      />

      {/* VR Viewer Modal */}
      <VRViewer
        vrUrl={villa.vrUrl}
        villaType={villa.type}
        isOpen={isVROpen}
        onClose={() => setIsVROpen(false)}
      />
    </>
  );
}

VillaCard.displayName = 'VillaCard';

