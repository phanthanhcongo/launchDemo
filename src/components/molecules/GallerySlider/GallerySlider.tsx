import * as React from 'react';
import { Image, Icon } from '@/components/atoms';
import { cn } from '@/lib/cn';

export interface GallerySlide {
  /**
   * Image source URL
   */
  src: string;
  /**
   * Alt text for accessibility
   */
  alt: string;
  /**
   * Optional caption
   */
  caption?: string;
}

export interface GallerySliderProps {
  /**
   * Array of slides to display
   */
  slides: GallerySlide[];
  /**
   * Auto-play interval in milliseconds (0 to disable)
   */
  autoPlayInterval?: number;
  /**
   * Show navigation arrows
   */
  showArrows?: boolean;
  /**
   * Show dots indicator
   */
  showDots?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * GallerySlider Component
 *
 * Image slider/carousel for galleries.
 * Logic separated: uses useState for current slide management.
 *
 * @example
 * ```tsx
 * <GallerySlider
 *   slides={[
 *     { src: '/image1.jpg', alt: 'Image 1' },
 *     { src: '/image2.jpg', alt: 'Image 2' }
 *   ]}
 *   autoPlayInterval={5000}
 * />
 * ```
 */
export function GallerySlider({
  slides,
  autoPlayInterval = 0,
  showArrows = true,
  showDots = true,
  className,
}: GallerySliderProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // Auto-play logic
  React.useEffect(() => {
    if (autoPlayInterval <= 0 || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlayInterval, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className={cn('relative w-full overflow-hidden group', className)}>
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full">
            <Image
              src={slide.src}
              alt={slide.alt}
              objectFit="cover"
              className="w-full h-full"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            {slide.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-surface/80 to-transparent p-4">
                <p className="text-primary text-center">{slide.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface/80 hover:bg-surface rounded-full p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Previous slide"
          >
            <Icon name="chevron-left" size="lg" iconColor="primary" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface/80 hover:bg-surface rounded-full p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Next slide"
          >
            <Icon name="chevron-right" size="lg" iconColor="primary" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                index === currentIndex
                  ? 'bg-primary w-8'
                  : 'bg-primary/30 hover:bg-primary/50'
              )}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
}

GallerySlider.displayName = 'GallerySlider';

