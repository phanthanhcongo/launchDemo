import { useTranslation } from 'react-i18next';
import { Button, Text } from '@/components/atoms';
import { Unit, formatPrice, formatArea, getUnitStatusColor, getUnitStatusTextColor } from '@/lib/unitData';
import { cn } from '@/lib/cn';
import { useShortlist } from '@/hooks/useShortlist';

export interface UnitCardProps {
  /**
   * Unit data
   */
  unit: Unit;
  /**
   * Whether this card is selected
   */
  isSelected?: boolean;
  /**
   * Whether this card is hovered
   */
  isHovered?: boolean;
  /**
   * Callback when card is clicked
   */
  onClick: (unit: Unit) => void;
  /**
   * Callback when card is hovered
   */
  onHover?: (unitId: string | undefined) => void;
  /**
   * Callback for quick actions
   */
  onShortlist?: (unit: Unit) => void;
  onReserve?: (unit: Unit) => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * UnitCard Component
 *
 * Luxury real estate unit card with 6-layer structure:
 * 1. Wishlist/Shortlist zone with social proof
 * 2. Main 3D render image
 * 3. Unit info header (code, floor, type)
 * 4. Price block (prominent)
 * 5. Attributes row (beds, baths, sizes)
 * 6. CTA zone (More Info + Reserve)
 *
 * @example
 * ```tsx
 * <UnitCard
 *   unit={unit}
 *   isSelected={selectedId === unit.id}
 *   onClick={handleUnitClick}
 *   onShortlist={handleShortlist}
 *   onReserve={handleReserve}
 * />
 * ```
 */
export function UnitCard({
  unit,
  isSelected,
  onClick,
  onHover,
  onShortlist,
  onReserve,
  className,
}: UnitCardProps) {
  const { t } = useTranslation();
  const { isInShortlist } = useShortlist();

  const canReserve = unit.status === 'available';
  const isHeld = unit.status === 'held';
  const isShortlisted = isInShortlist(unit.id);

  // Mock social proof data
  const shortlistedBy = Math.floor(Math.random() * 50) + 10;

  // Get bathrooms count from type
  const getBathrooms = (type: string) => {
    if (type.includes('1-bed')) return 1;
    if (type.includes('2-bed')) return 2;
    if (type.includes('3-bed')) return 2;
    return 1; // default
  };

  // Get unit image from villa visualisation
  const getUnitImage = (type: string): string => {
    const basePath = '/images/Nyala Villas - Visualisation';
    if (type === '1-bed') {
      return `${basePath}/01 Nyala One Bed/NYALA VILLAS_1B_EXT02_FRONT VIEW_SWATCH ARCHITECTS.jpg`;
    }
    if (type === '2-bed') {
      return `${basePath}/02 Two Bed/NYALA VILLAS_EXT01_FRONT VIEW_SWATCH ARCHITECTS.jpg`;
    }
    if (type === '3-bed-a') {
      return `${basePath}/03 Three Bed A/NYALA VILLAS_3A_EXT01_GARDEN ELEVATION_SWATCH ARCHITECTS.jpg`;
    }
    if (type === '3-bed-b') {
      return `${basePath}/04 Three Bed B/NYALA VILLAS_3B_EXT01_GARDEN ELEVATION_SWATCH ARCHITECTS.jpg`;
    }
    return `${basePath}/02 Two Bed/NYALA VILLAS_EXT01_FRONT VIEW_SWATCH ARCHITECTS.jpg`;
  };

  const getFallbackImage = (type: string): string => {
    return getUnitImage(type);
  };

  return (
    <div
      className={cn(
        'relative bg-surface rounded-lg overflow-hidden shadow-md transition-all',
        'hover:shadow-2xl hover:-translate-y-1',
        'border border-primary/10',
        isSelected && 'ring-4 ring-secondary/30 shadow-2xl',
        className
      )}
      onMouseEnter={() => onHover?.(unit.id)}
      onMouseLeave={() => onHover?.(undefined)}
    >
      {/* 1. Wishlist/Shortlist Zone */}
      <div className="absolute top-3 right-3 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShortlist?.(unit);
          }}
          className={cn(
            'p-2 rounded-full bg-gray-200/80 backdrop-blur-sm',
            'hover:bg-gray-300/80 transition-all',
            isShortlisted && 'bg-[#ef4444]/20'
          )}
          aria-label={t('listing.card.addToShortlist', 'Add to shortlist')}
        >
          <svg
            className={cn(
              'w-5 h-5 transition-colors',
              isShortlisted ? 'text-[#ef4444] fill-[#ef4444]' : 'text-gray-600 fill-white'
            )}
            fill={isShortlisted ? 'currentColor' : 'white'}
            stroke={isShortlisted ? 'currentColor' : 'currentColor'}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Social Proof Overlay */}
      {unit.status === 'available' && (
        <div className="absolute top-3 left-3 z-20">
          <Text variant="caption" className="text-white text-xs font-medium">
            SHORTLISTED BY {shortlistedBy} OTHERS
          </Text>
        </div>
      )}

      {/* 2. Main 3D Render Image */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/5 to-primary/10">
        <img
          src={getUnitImage(unit.type)}
          alt={unit.code}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to villa exterior as placeholder
            e.currentTarget.src = getFallbackImage(unit.type);
          }}
        />

        {/* Status overlay */}
        {unit.status !== 'available' && (
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm flex items-center justify-center">
            <div
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-bold uppercase',
                getUnitStatusColor(unit.status),
                getUnitStatusTextColor(unit.status)
              )}
            >
              {t(`explore.unit.status.${unit.status}`, unit.status)}
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 bg-surface">
        {/* 3. Unit Info Header */}
        <div className="mb-3">
          <Text variant="h2" className="text-[#a78b5b] font-light mb-1 text-3xl">
            {unit.code}
          </Text>
          <Text variant="caption" className="text-primary uppercase text-sm tracking-wide">
            {unit.floor} FLOOR · {unit.type.toUpperCase()} · {unit.orientation.toUpperCase()}
          </Text>
        </div>

        {/* 4. Price Block */}
        <div className="mb-3 flex items-baseline gap-2">
          <Text variant="h2" className="text-[#b4533a] font-light">
            {formatPrice(unit.price)}
          </Text>
          <Text variant="caption" className="text-[#b4533a]/60 line-through text-sm">
            {formatPrice(unit.price)}
          </Text>
        </div>

        {/* 5. Attributes Row */}
        <div className="flex items-center gap-4 mb-5">
          {/* Bathrooms */}
          <div className="flex items-center gap-1.5">
            <svg className="w-5 h-5 text-primary/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <Text variant="caption" className="text-primary/90 font-medium">
              {getBathrooms(unit.type)}
            </Text>
          </div>

          {/* Area */}
          <div className="flex items-center gap-1.5">
            <svg className="w-5 h-5 text-primary/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <Text variant="caption" className="text-primary/90 font-medium">
              {formatArea(unit.area)}
            </Text>
          </div>
        </div>

        {/* 6. CTA Zone */}
        <div className="flex gap-4 mt-10">
          {/* MORE INFO */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick(unit);
            }}
            className="
                flex-1 h-[45px]
                border border-[#a85e47]
                text-[#a85e47]
                bg-white
                rounded-full
                text-[16px]
                tracking-[0.2em]
                font-light
                transition
                hover:bg-[#a85e4720]
            "
          >
            MORE INFO
          </button>

          {/* RESERVE */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReserve?.(unit);
            }}
            className="
                flex-1 h-[45px]
                bg-[#b4533a]
                text-white
                rounded-full
                text-[16px]
                tracking-[0.2em]
                font-light
                transition
                hover:bg-[#b4533a]/90
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            disabled={!canReserve}
          >
            RESERVE
          </button>

        </div>

        {/* Held Status */}
        {isHeld && unit.heldUntil && (
          <div className="mt-3 pt-3 border-t border-primary/10">
            <Text variant="caption" className="text-accent">
              {t('explore.unit.heldUntil', 'Held until')}: {unit.heldUntil.toLocaleTimeString()}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}

UnitCard.displayName = 'UnitCard';
