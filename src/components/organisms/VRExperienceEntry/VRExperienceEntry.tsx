import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Text, Image } from '@/components/atoms';
import { cn } from '@/lib/cn';
import { vrService, type VillaType } from '@/lib/vrService';
import { animationService } from '@/lib/animationService';
import { responsiveService } from '@/lib/responsiveService';

export interface VRExperienceEntryProps {
  /**
   * Whether the VR experience entry is open
   */
  isOpen: boolean;
  /**
   * Callback when VR experience is closed
   */
  onClose: () => void;
  /**
   * Callback when user enters the main experience
   */
  onEnterExperience: () => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * VRExperienceEntry Component
 * 
 * Cinematic entry point for VR experience following luxury real estate standards.
 * Creates a "wow moment" transition from landing to immersive VR exploration.
 * 
 * Flow:
 * 1. Cinematic intro with 3D building fly-through
 * 2. Enter Experience CTA
 * 3. Transition to Virtual Lobby
 * 4. Project overview with interactive elements
 */
export function VRExperienceEntry({ 
  isOpen, 
  onClose, 
  onEnterExperience, 
  className 
}: VRExperienceEntryProps) {
  const { t } = useTranslation();
  const [currentStage, setCurrentStage] = useState<'intro' | 'lobby' | 'overview'>('intro');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);

  // Auto-play cinematic intro
  useEffect(() => {
    if (isOpen) {
      setCurrentStage('intro');
      // Auto-transition to lobby after intro video
      const timer = setTimeout(() => {
        setCurrentStage('lobby');
      }, 4000); // 4s intro video
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEnterExperience = async () => {
    setIsTransitioning(true);
    
    // Smooth transition animation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setCurrentStage('overview');
    setIsTransitioning(false);
    onEnterExperience();
  };

  const toggleAudio = () => {
    setHasAudio(!hasAudio);
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-[10000] bg-surface',
        'flex flex-col overflow-hidden',
        className
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="vr-experience-title"
    >
      {/* Stage 1: Cinematic Intro */}
      {currentStage === 'intro' && (
        <div className="relative w-full h-full bg-gradient-to-b from-primary/90 to-primary">
          {/* Hero Video Background */}
          <div className="absolute inset-0">
            <Image
              src="/images/Nyala Villas - Visualisation/02 Two Bed/NYALA VILLAS_EXT01_FRONT VIEW_SWATCH ARCHITECTS.jpg"
              alt="Nyala Villas Cinematic"
              objectFit="cover"
              className="w-full h-full opacity-60"
            />
            {/* Cinematic overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-primary/60" />
          </div>

          {/* Cinematic Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
            {/* Logo Animation */}
            <div className="mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '1s' }}>
              <Image
                src="/images/logo-white.svg"
                alt="Nyala Villas"
                className="w-32 h-32 md:w-40 md:h-40 mx-auto"
              />
            </div>

            {/* Main Title */}
            <div className="mb-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '1.5s' }}>
              <Text variant="h1" className="text-primary-foreground mb-4 text-4xl md:text-6xl font-light">
                {t('vrEntry.welcome', 'Welcome to')}
              </Text>
              <Text variant="h1" className="text-primary-foreground text-5xl md:text-7xl font-bold tracking-wide">
                NYALA VILLAS
              </Text>
              <Text variant="body" className="text-primary-foreground/80 mt-6 max-w-2xl mx-auto text-lg">
                {t('vrEntry.subtitle', 'Experience luxury living in virtual reality')}
              </Text>
            </div>

            {/* Enter Experience CTA */}
            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '2.5s' }}>
              <Button
                intent="secondary"
                size="lg"
                onClick={handleEnterExperience}
                className="px-12 py-4 text-xl font-medium bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-2xl"
              >
                {t('vrEntry.enterExperience', 'Enter Experience')}
              </Button>
            </div>

            {/* Audio Toggle */}
            <div className="absolute bottom-8 right-8">
              <Button
                intent="ghost"
                size="sm"
                onClick={toggleAudio}
                className="text-primary-foreground/70 hover:text-primary-foreground"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {hasAudio ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M6 10l-4 4h4v4l8-6-8-6v2z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  )}
                </svg>
              </Button>
            </div>

            {/* Close Button */}
            <div className="absolute top-8 right-8">
              <Button
                intent="ghost"
                size="sm"
                onClick={onClose}
                className="text-primary-foreground/70 hover:text-primary-foreground"
                aria-label={t('vrEntry.close', 'Close experience')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stage 2: Virtual Lobby */}
      {currentStage === 'lobby' && (
        <div className="relative w-full h-full bg-surface">
          {/* Lobby Background */}
          <div className="absolute inset-0">
            <Image
              src="/images/Nyala Villas - Visualisation/02 Two Bed/NYALA VILLAS_INT01_LIVING ROOM_SWATCH ARCHITECTS.jpg"
              alt="Virtual Lobby"
              objectFit="cover"
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/50 to-surface/30" />
          </div>

          {/* Lobby Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
            {/* Welcome Message */}
            <div className="text-center mb-12">
              <Text variant="h2" className="text-primary mb-4">
                {t('vrEntry.lobby.welcome', 'Welcome to Your Virtual Showroom')}
              </Text>
              <Text variant="body" className="text-primary/70 max-w-2xl mx-auto">
                {t('vrEntry.lobby.description', 'Explore our luxury villas through immersive virtual reality tours. Choose your preferred villa type to begin.')}
              </Text>
            </div>

            {/* Villa Selection Grid */}
            <div className={cn("grid max-w-6xl w-full", responsiveService.grid.responsive1to4, responsiveService.spacing.gapLg)}>
              {[
                { type: '1-bed' as VillaType, name: vrService.displayNames['1-bed'] },
                { type: '2-bed' as VillaType, name: vrService.displayNames['2-bed'] },
                { type: '3-bed-a' as VillaType, name: vrService.displayNames['3-bed-a'] },
                { type: '3-bed-b' as VillaType, name: vrService.displayNames['3-bed-b'] },
              ].map((villa) => (
                <div
                  key={villa.type}
                  className={cn(
                    "group relative bg-surface/90 backdrop-blur-sm rounded-lg p-6 border border-primary/20 hover:border-primary/40 cursor-pointer",
                    animationService.classes.hoverShadow,
                    "transition-all duration-300"
                  )}
                  style={animationService.createAnimationStyle('medium', 'short')}
                  onClick={() => vrService.openVRTour(villa.type)}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <Text variant="h4" className="text-primary mb-2 font-semibold">
                      {villa.name}
                    </Text>
                    <Text variant="caption" className="text-primary/60">
                      {t('vrEntry.lobby.clickToExplore', 'Click to explore in VR')}
                    </Text>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Options */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Button
                intent="ghost"
                size="md"
                onClick={() => vrService.openExternalUrl('floorplans')}
                className="flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <Text variant="caption">
                  {t('vrEntry.lobby.floorPlans', 'View Floor Plans')}
                </Text>
              </Button>

              <Button
                intent="ghost"
                size="md"
                onClick={() => vrService.openExternalUrl('visualisation')}
                className="flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <Text variant="caption">
                  {t('vrEntry.lobby.visualisation', 'View Visualisations')}
                </Text>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Transition Loading */}
      {isTransitioning && (
        <div className="absolute inset-0 z-20 bg-primary/90 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin mx-auto mb-4" />
            <Text variant="body" className="text-primary-foreground">
              {t('vrEntry.loading', 'Entering virtual experience...')}
            </Text>
          </div>
        </div>
      )}
    </div>
  );
}

VRExperienceEntry.displayName = 'VRExperienceEntry';
