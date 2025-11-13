import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Text, Image, Icon } from '@/components/atoms';
import { cn } from '@/lib/cn';

export interface VillaImage {
  /**
   * Image source path
   */
  src: string;
  /**
   * Image alt text
   */
  alt: string;
  /**
   * Image category (exterior, interior, etc.)
   */
  category: 'exterior' | 'interior';
  /**
   * Room/area name
   */
  room?: string;
}

export interface VillaGalleryProps {
  /**
   * Villa type identifier
   */
  villaType: '1-bed' | '2-bed' | '3-bed-a' | '3-bed-b';
  /**
   * Array of villa images
   */
  images: VillaImage[];
  /**
   * Whether gallery is open
   */
  isOpen: boolean;
  /**
   * Callback when gallery is closed
   */
  onClose: () => void;
  /**
   * Callback when VR tour is requested
   */
  onOpenVR?: () => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * VillaGallery Component
 *
 * Interactive image gallery for villa visualization.
 * Displays high-quality renders with categorization and VR integration.
 *
 * @example
 * ```tsx
 * <VillaGallery
 *   villaType="2-bed"
 *   images={villaImages}
 *   isOpen={isGalleryOpen}
 *   onClose={() => setIsGalleryOpen(false)}
 *   onOpenVR={() => setIsVROpen(true)}
 * />
 * ```
 */
export function VillaGallery({
  villaType,
  images,
  isOpen,
  onClose,
  onOpenVR,
  className,
}: VillaGalleryProps) {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filter, setFilter] = useState<'all' | 'exterior' | 'interior'>('all');

  if (!isOpen) return null;

  const filteredImages = images.filter((img) => 
    filter === 'all' || img.category === filter
  );

  const currentImage = filteredImages[selectedIndex] || filteredImages[0];

  const getVillaDisplayName = () => {
    const names = {
      '1-bed': t('villas.oneBed.title', 'One-Bedroom Villa'),
      '2-bed': t('villas.twoBed.title', 'Two-Bedroom Villa'),
      '3-bed-a': t('villas.threeBedA.title', 'Three-Bedroom Villa A'),
      '3-bed-b': t('villas.threeBedB.title', 'Three-Bedroom Villa B'),
    };
    return names[villaType];
  };

  const goToPrevious = () => {
    setSelectedIndex((prev) => 
      prev === 0 ? filteredImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setSelectedIndex((prev) => 
      prev === filteredImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-[9998] bg-surface/95 backdrop-blur-md',
        'flex items-center justify-center p-4',
        className
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-title"
    >
      <div className="relative w-full h-full max-w-7xl max-h-[90vh] bg-surface rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-4 bg-surface border-b border-primary/20">
          <div className="flex items-center gap-4">
            <div>
              <Text variant="h4" className="text-primary" id="gallery-title">
                {getVillaDisplayName()}
              </Text>
              <Text variant="caption" className="text-primary/70">
                {t('gallery.subtitle', 'Architectural Visualization')}
              </Text>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenVR && (
              <Button
                intent="secondary"
                size="sm"
                onClick={onOpenVR}
                className="flex items-center gap-2"
              >
                <Text variant="caption">
                  {t('gallery.openVR', 'Virtual Tour')}
                </Text>
              </Button>
            )}

            <Button
              intent="ghost"
              size="sm"
              onClick={onClose}
              aria-label={t('gallery.close', 'Close Gallery')}
            >
              <Icon name="close" size="md" iconColor="primary" />
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-4 bg-surface/50 border-b border-primary/10">
          {(['all', 'exterior', 'interior'] as const).map((filterType) => (
            <Button
              key={filterType}
              intent={filter === filterType ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => {
                setFilter(filterType);
                setSelectedIndex(0);
              }}
              className="capitalize"
            >
              <Text variant="caption">
                {t(`gallery.filter.${filterType}`, filterType)}
              </Text>
            </Button>
          ))}
        </div>

        {/* Main Image Display */}
        <div className="relative flex-1 bg-surface/20" style={{ height: 'calc(100% - 200px)' }}>
          {currentImage && (
            <>
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                objectFit="contain"
                className="w-full h-full"
              />

              {/* Navigation Arrows */}
              {filteredImages.length > 1 && (
                <>
                  <Button
                    intent="ghost"
                    size="sm"
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-surface/80 hover:bg-surface"
                    aria-label={t('gallery.previous', 'Previous image')}
                  >
                    <Icon name="chevron-left" size="lg" iconColor="primary" />
                  </Button>

                  <Button
                    intent="ghost"
                    size="sm"
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-surface/80 hover:bg-surface"
                    aria-label={t('gallery.next', 'Next image')}
                  >
                    <Icon name="chevron-right" size="lg" iconColor="primary" />
                  </Button>
                </>
              )}

              {/* Image Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Text variant="body" className="text-primary font-medium">
                      {currentImage.room || t(`gallery.category.${currentImage.category}`, currentImage.category)}
                    </Text>
                    <Text variant="caption" className="text-primary/70">
                      {t('gallery.imageCount', '{{current}} of {{total}}', {
                        current: selectedIndex + 1,
                        total: filteredImages.length,
                      })}
                    </Text>
                  </div>

                  <div className="flex items-center gap-1">
                    <div className={cn(
                      'px-2 py-1 rounded text-xs uppercase tracking-wide',
                      currentImage.category === 'exterior' 
                        ? 'bg-secondary/20 text-secondary' 
                        : 'bg-primary/20 text-primary'
                    )}>
                      {t(`gallery.category.${currentImage.category}`, currentImage.category)}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        <div className="p-4 bg-surface border-t border-primary/20">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filteredImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                  index === selectedIndex
                    ? 'border-primary shadow-lg'
                    : 'border-primary/20 hover:border-primary/40'
                )}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  objectFit="cover"
                  className="w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
        aria-label={t('gallery.closeBackdrop', 'Click to close gallery')}
      />
    </div>
  );
}

VillaGallery.displayName = 'VillaGallery';
