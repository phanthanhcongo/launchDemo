import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Text, Icon } from '@/components/atoms';
import { cn } from '@/lib/cn';
import { vrService, type VillaType } from '@/lib/vrService';

export interface VRViewerProps {
  /**
   * VR tour URL
   */
  vrUrl: string;
  /**
   * Villa type for VR experience
   */
  villaType: VillaType;
  /**
   * Whether VR viewer is open
   */
  isOpen: boolean;
  /**
   * Callback when VR viewer is closed
   */
  onClose: () => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * VRViewer Component
 *
 * Immersive VR experience viewer with design system consistency.
 * Embeds external VR tour in fullscreen modal overlay.
 *
 * @example
 * ```tsx
 * <VRViewer
 *   vrUrl="https://www.siiastudio.com/Our/VR/NYALA%20VILLAS%202BR/NYALAVILLAS2.htm"
 *   villaType="2-bed"
 *   isOpen={isVROpen}
 *   onClose={() => setIsVROpen(false)}
 * />
 * ```
 */
export function VRViewer({ vrUrl, villaType, isOpen, onClose, className }: VRViewerProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  if (!isOpen) return null;

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const getVillaDisplayName = () => {
    return t(`vr.villa.${villaType.replace('-', '')}`, vrService.getVillaDisplayName(villaType));
  };

  // Navigate to VR URL in new page with enhanced experience
  const handleOpenInNewPage = () => {
    vrService.openVRTour(villaType);
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] bg-surface',
        'flex flex-col',
        className
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="vr-viewer-title"
    >
      {/* VR Viewer Container - Full Screen */}
      <div className="relative w-full h-full bg-surface overflow-hidden">
        {/* Header - Minimal for Full Screen */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-surface/95 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <div>
              <Text variant="h4" className="text-primary" id="vr-viewer-title">
                {t('vr.title', 'Virtual Reality Tour')}
              </Text>
              <Text variant="caption" className="text-primary/70">
                {getVillaDisplayName()}
              </Text>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              intent="secondary"
              size="sm"
              onClick={handleOpenInNewPage}
              className="flex items-center gap-2 backdrop-blur-sm bg-secondary/90 hover:bg-secondary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <Text variant="caption" className="text-surface font-medium">
                {t('vr.openFull', 'Open in New Tab')}
              </Text>
            </Button>

            <Button
              intent="ghost"
              size="sm"
              onClick={onClose}
              className="flex items-center gap-2 backdrop-blur-sm bg-surface/90 hover:bg-surface"
              aria-label={t('vr.close', 'Close VR Tour')}
            >
              <Icon name="close" size="md" iconColor="primary" />
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-surface">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
              <Text variant="body" className="text-primary/70">
                {t('vr.loading', 'Loading virtual tour...')}
              </Text>
            </div>
          </div>
        )}

        {/* VR Iframe - Full Screen */}
        <iframe
          src={vrUrl}
          className="w-full h-full border-0"
          title={`${getVillaDisplayName()} - Virtual Reality Tour`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={handleIframeLoad}
        />

        {/* Footer Controls - Minimal */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-surface/95 to-transparent pointer-events-none">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 text-primary/60 bg-surface/80 backdrop-blur-sm px-4 py-2 rounded-lg pointer-events-auto">
              <div className="w-1 h-1 bg-primary/40 rounded-full animate-pulse" />
              <Text variant="caption">
                {t('vr.instructions', 'Use mouse to navigate • Click and drag to look around')}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

VRViewer.displayName = 'VRViewer';
