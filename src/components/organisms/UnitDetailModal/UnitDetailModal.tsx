import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Text, Icon, Image } from '@/components/atoms';
import { Unit, formatPrice, formatArea, getUnitStatusColor, getUnitStatusTextColor } from '@/lib/unitData';
import { cn } from '@/lib/cn';
import { useCountdown } from '@/hooks';
import { vrService, type VillaType } from '@/lib/vrService';

export interface UnitDetailModalProps {
  /**
   * Unit to display
   */
  unit: Unit | null;
  /**
   * Whether modal is open
   */
  isOpen: boolean;
  /**
   * Callback when modal is closed
   */
  onClose: () => void;
  /**
   * Callback for shortlist action
   */
  onShortlist?: (unit: Unit) => void;
  /**
   * Callback for reserve action
   */
  onReserve?: (unit: Unit) => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

type TabId = 'overview' | 'payment' | 'gallery' | 'documents';

/**
 * UnitDetailModal Component
 *
 * Detailed unit information modal with tabs.
 * Shows overview, payment info, gallery, and documents.
 *
 * @example
 * ```tsx
 * <UnitDetailModal
 *   unit={selectedUnit}
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   onShortlist={handleShortlist}
 *   onReserve={handleReserve}
 * />
 * ```
 */
export function UnitDetailModal({
  unit,
  isOpen,
  onClose,
  onShortlist,
  onReserve,
  className,
}: UnitDetailModalProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  if (!isOpen || !unit) return null;

  const canReserve = unit.status === 'available';
  const isHeld = unit.status === 'held';
  const isSold = unit.status === 'sold';

  // Countdown for held units
  const timeLeft = unit.heldUntil && isHeld
    ? useCountdown({ targetDate: unit.heldUntil })
    : null;

  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: t('unitDetail.tabs.overview', 'Overview') },
    { id: 'payment', label: t('unitDetail.tabs.payment', 'Payment Info') },
    { id: 'gallery', label: t('unitDetail.tabs.gallery', 'Gallery') },
    { id: 'documents', label: t('unitDetail.tabs.documents', 'Documents') },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-primary/20 backdrop-blur-sm"
        onClick={onClose}
        aria-label={t('unitDetail.closeBackdrop', 'Click to close')}
      />
      
      <div
        className={cn(
          'fixed inset-0 z-[9999]',
          'flex items-center justify-center p-4',
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="unit-detail-title"
      >
        <div className="relative w-full max-w-4xl max-h-[90vh] bg-surface rounded-lg shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/20">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Text variant="h3" className="text-primary" id="unit-detail-title">
                  {unit.code}
                </Text>
                <div
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium uppercase',
                    getUnitStatusColor(unit.status),
                    getUnitStatusTextColor(unit.status)
                  )}
                >
                  {t(`explore.unit.status.${unit.status}`, unit.status)}
                </div>
              </div>
              <Text variant="caption" className="text-primary/70">
                {t(`villas.${unit.type.replace('-', '')}.title`, unit.type)} • Floor {unit.floor}
              </Text>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Share Button */}
            <Button
              intent="ghost"
              size="sm"
              onClick={() => {
                navigator.share?.({
                  title: unit.code,
                  text: `Check out ${unit.code} at Nyala Villas`,
                  url: window.location.href,
                });
              }}
              aria-label={t('unitDetail.share', 'Share unit')}
            >
              <Icon name="menu" size="md" iconColor="primary" />
            </Button>

            {/* Close Button */}
            <Button
              intent="ghost"
              size="sm"
              onClick={onClose}
              aria-label={t('unitDetail.close', 'Close')}
            >
              <Icon name="close" size="md" iconColor="primary" />
            </Button>
          </div>
        </div>

        {/* Countdown Bar (if held) */}
        {isHeld && timeLeft && (
          <div className="bg-accent/20 border-b border-accent/30 px-6 py-3">
            <div className="flex items-center justify-between">
              <Text variant="caption" className="text-accent font-medium">
                {t('unitDetail.held.countdown', 'Held for')}:
              </Text>
              <Text variant="body" className="text-accent font-bold">
                {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </Text>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-primary/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-6 py-4 text-sm font-medium transition-colors',
                'border-b-2',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-primary/50 hover:text-primary/70'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Text variant="h4" className="text-primary mb-4">
                    {t('unitDetail.overview.details', 'Unit Details')}
                  </Text>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Text variant="body" className="text-primary/70">
                        {t('explore.unit.type', 'Type')}:
                      </Text>
                      <Text variant="body" className="text-primary font-medium">
                        {t(`villas.${unit.type.replace('-', '')}.title`, unit.type)}
                      </Text>
                    </div>
                    <div className="flex justify-between">
                      <Text variant="body" className="text-primary/70">
                        {t('explore.unit.area', 'Area')}:
                      </Text>
                      <Text variant="body" className="text-primary font-medium">
                        {formatArea(unit.area)}
                      </Text>
                    </div>
                    <div className="flex justify-between">
                      <Text variant="body" className="text-primary/70">
                        {t('explore.unit.orientation', 'Orientation')}:
                      </Text>
                      <Text variant="body" className="text-primary font-medium capitalize">
                        {unit.orientation}
                      </Text>
                    </div>
                    <div className="flex justify-between">
                      <Text variant="body" className="text-primary/70">
                        {t('explore.unit.floor', 'Floor')}:
                      </Text>
                      <Text variant="body" className="text-primary font-medium">
                        {unit.floor}
                      </Text>
                    </div>
                  </div>
                </div>

                <div>
                  <Text variant="h4" className="text-primary mb-4">
                    {t('unitDetail.overview.pricing', 'Pricing')}
                  </Text>
                  <div className="space-y-3">
                    <div>
                      <Text variant="h2" className="text-secondary">
                        {formatPrice(unit.price)}
                      </Text>
                    </div>
                    {unit.features && unit.features.length > 0 && (
                      <div>
                        <Text variant="body" className="text-primary/70 mb-2">
                          {t('unitDetail.overview.features', 'Features')}:
                        </Text>
                        <ul className="list-disc list-inside space-y-1">
                          {unit.features.map((feature, idx) => (
                            <li key={idx}>
                              <Text variant="caption" className="text-primary/70">
                                {feature}
                              </Text>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <Text variant="h4" className="text-primary mb-4">
                {t('unitDetail.payment.title', 'Payment Information')}
              </Text>
              <Text variant="body" className="text-primary/70">
                {t('unitDetail.payment.description', 'Payment details and financing options will be displayed here.')}
              </Text>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <Text variant="h4" className="text-primary">
                  {t('unitDetail.gallery.title', 'Unit Gallery & VR Experience')}
                </Text>
                <Button
                  intent="secondary"
                  size="sm"
                  onClick={() => vrService.openVRTour(unit.type as VillaType)}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <Text variant="caption">
                    {t('unitDetail.gallery.vrTour', 'VR Tour')}
                  </Text>
                </Button>
              </div>

              {/* VR Experience Card */}
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 border border-primary/20 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <Text variant="h4" className="text-primary mb-2">
                      {t('unitDetail.gallery.vrExperience', 'Immersive VR Experience')}
                    </Text>
                    <Text variant="body" className="text-primary/70">
                      {t('unitDetail.gallery.vrDescription', 'Step inside this villa with our 360° virtual reality tour. Experience the space as if you were there.')}
                    </Text>
                  </div>
                </div>
              </div>

              {unit.images && unit.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {unit.images.map((img, idx) => (
                    <Image
                      key={idx}
                      src={img}
                      alt={`${unit.code} - Image ${idx + 1}`}
                      className="rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => {
                        // Open image in lightbox or modal
                        window.open(img, '_blank');
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-primary/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <Text variant="body" className="text-primary/50 mb-4">
                    {t('unitDetail.gallery.empty', 'Gallery images coming soon')}
                  </Text>
                  <Button
                    intent="ghost"
                    size="sm"
                    onClick={() => vrService.openExternalUrl('visualisation')}
                  >
                    {t('unitDetail.gallery.viewVisualisation', 'View Visualisations')}
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <Text variant="h4" className="text-primary mb-4">
                {t('unitDetail.documents.title', 'Documents')}
              </Text>
              <Text variant="body" className="text-primary/50">
                {t('unitDetail.documents.empty', 'No documents available')}
              </Text>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-primary/20 flex items-center justify-between gap-4">
          {isHeld && unit.heldBy && (
            <Button
              intent="ghost"
              size="md"
              onClick={() => {
                // TODO: Implement notification request
                console.log('Request notification when unit becomes available');
              }}
            >
              <Text variant="caption">
                {t('unitDetail.notify', 'Notify when available')}
              </Text>
            </Button>
          )}

          <div className="flex gap-3 ml-auto">
            <Button
              intent="ghost"
              size="md"
              onClick={() => onShortlist?.(unit)}
              disabled={isSold}
            >
              <Text variant="caption">
                {t('explore.unit.shortlist', 'Add to Shortlist')}
              </Text>
            </Button>

            <Button
              intent="primary"
              size="md"
              onClick={() => onReserve?.(unit)}
              disabled={!canReserve}
            >
              <Text variant="caption">
                {t('explore.unit.reserve', 'Reserve Now')}
              </Text>
            </Button>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}

UnitDetailModal.displayName = 'UnitDetailModal';
