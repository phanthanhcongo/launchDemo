/**
 * ShortlistTray Component
 * 
 * Slide-in tray showing user's shortlisted units with quick actions
 */

import { useTranslation } from 'react-i18next';
import { useShortlist } from '@/hooks/useShortlist';
import { Unit } from '@/lib/unitData';
import { Text, Button, Image } from '@/components/atoms';
import { cn } from '@/lib/cn';
import { formatPrice } from '@/lib/unitData';

export interface ShortlistTrayProps {
  /**
   * All units (to get full unit data)
   */
  units: Unit[];
  /**
   * Callback when unit is clicked
   */
  onUnitClick?: (unit: Unit) => void;
  /**
   * Callback to generate share link
   */
  onShare?: (link: string) => void;
  /**
   * Whether tray is open
   */
  isOpen: boolean;
  /**
   * Callback to close tray
   */
  onClose: () => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ShortlistTray Component
 * 
 * Displays shortlisted units in a slide-in tray with thumbnails,
 * quick compare, and share functionality.
 * 
 * @example
 * ```tsx
 * <ShortlistTray
 *   units={allUnits}
 *   isOpen={isTrayOpen}
 *   onClose={() => setIsTrayOpen(false)}
 *   onUnitClick={handleUnitSelect}
 * />
 * ```
 */
export function ShortlistTray({
  units,
  onUnitClick,
  onShare,
  isOpen,
  onClose,
  className,
}: ShortlistTrayProps) {
  const { t } = useTranslation();
  const { shortlistIds, removeFromShortlist, generateShareLink } = useShortlist();

  const shortlistedUnits = units.filter(unit => shortlistIds.has(unit.id));

  const handleShare = () => {
    const link = generateShareLink();
    if (onShare) {
      onShare(link);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(link).then(() => {
        alert(t('shortlist.shareCopied', 'Share link copied to clipboard!'));
      });
    }
  };

  const getUnitImage = (unit: Unit): string => {
    const basePath = '/images/Nyala Villas - Visualisation';
    if (unit.type === '1-bed') {
      return `${basePath}/01 Nyala One Bed/NYALA VILLAS_1B_EXT02_FRONT VIEW_SWATCH ARCHITECTS.jpg`;
    }
    if (unit.type === '2-bed') {
      return `${basePath}/02 Two Bed/NYALA VILLAS_EXT01_FRONT VIEW_SWATCH ARCHITECTS.jpg`;
    }
    if (unit.type === '3-bed-a') {
      return `${basePath}/03 Three Bed A/NYALA VILLAS_3A_EXT01_GARDEN ELEVATION_SWATCH ARCHITECTS.jpg`;
    }
    if (unit.type === '3-bed-b') {
      return `${basePath}/04 Three Bed B/NYALA VILLAS_3B_EXT01_GARDEN ELEVATION_SWATCH ARCHITECTS.jpg`;
    }
    return `${basePath}/02 Two Bed/NYALA VILLAS_EXT01_FRONT VIEW_SWATCH ARCHITECTS.jpg`;
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[9997] transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Tray */}
      <div
        className={cn(
          'fixed right-0 top-0 bottom-0 w-full max-w-md bg-surface border-l border-primary/20 shadow-2xl z-[9998]',
          'transform transition-transform duration-300 ease-out-expo',
          'flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/20">
          <div>
            <Text variant="h3" className="text-primary font-semibold">
              {t('shortlist.title', 'Shortlist')}
            </Text>
            <Text variant="caption" className="text-primary/60">
              {t('shortlist.count', '{{count}} units', { count: shortlistedUnits.length })}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            {shortlistedUnits.length > 0 && (
              <Button
                intent="ghost"
                size="sm"
                onClick={handleShare}
                aria-label={t('shortlist.share', 'Share shortlist')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </Button>
            )}
            <Button
              intent="ghost"
              size="sm"
              onClick={onClose}
              aria-label={t('shortlist.close', 'Close shortlist')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {shortlistedUnits.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <svg className="w-16 h-16 text-primary/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <Text variant="h4" className="text-primary/70 mb-2">
                {t('shortlist.empty.title', 'Your shortlist is empty')}
              </Text>
              <Text variant="body" className="text-primary/50">
                {t('shortlist.empty.description', 'Add units to compare and share')}
              </Text>
            </div>
          ) : (
            <div className="space-y-3">
              {shortlistedUnits.map((unit) => (
                <div
                  key={unit.id}
                  className={cn(
                    'group relative p-4 rounded-lg border border-primary/20',
                    'hover:border-primary/40 hover:shadow-md transition-all',
                    'bg-surface'
                  )}
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-primary/5">
                      <Image
                        src={getUnitImage(unit)}
                        alt={unit.code}
                        objectFit="cover"
                        className="w-full h-full"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Text variant="body" className="font-semibold text-primary mb-1">
                            {unit.code}
                          </Text>
                          <Text variant="caption" className="text-primary/60">
                            {t(`villas.${unit.type.replace('-', '')}.title`, unit.type)} • Floor {unit.floor}
                          </Text>
                        </div>
                        <button
                          onClick={() => removeFromShortlist(unit.id)}
                          className="flex-shrink-0 p-1 hover:bg-primary/10 rounded transition-colors"
                          aria-label={t('shortlist.remove', 'Remove from shortlist')}
                        >
                          <svg className="w-4 h-4 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <Text variant="h4" className="text-secondary font-bold mb-2">
                        {formatPrice(unit.price)}
                      </Text>
                      <Button
                        intent="ghost"
                        size="sm"
                        onClick={() => onUnitClick?.(unit)}
                        className="w-full mt-2"
                      >
                        {t('shortlist.viewDetails', 'View Details')}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

ShortlistTray.displayName = 'ShortlistTray';

