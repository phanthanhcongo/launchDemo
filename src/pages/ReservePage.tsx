/**
 * ReservePage Component
 * 
 * Reservation flow with 3-step stepper: Info → Review → Payment
 * Features:
 * - Global countdown bar
 * - Unit summary
 * - Progress stepper
 * - Form validation
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Text, Button } from '@/components/atoms';
import { GlobalCountdownBar } from '@/components/molecules';
import { 
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveStack,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@/components/ui';
import { useReservation } from '@/hooks/useReservation';
import { MOCK_UNITS } from '@/lib/unitData';
import { layoutService } from '@/services';
import { cn } from '@/lib/cn';

/**
 * ReservePage Component
 * 
 * Full reservation flow implementation.
 * 
 * @example
 * ```tsx
 * <Route path="/reserve/:unitId" element={<ReservePage />} />
 * ```
 */
export function ReservePage() {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [currentStep, setCurrentStep] = useState<'info' | 'review' | 'payment'>('info');
  
  // Get unit details
  const unit = MOCK_UNITS.find(u => u.id === unitId);
  
  // Reservation hook (will integrate with lock API)
  const [,] = useReservation({
    enableRealtime: true,
    onExpire: () => {
      alert(t('reserve.expired', 'Your reservation has expired'));
      navigate('/explore');
    },
  });

  // Auto-lock unit on mount (production)
  useEffect(() => {
    if (!unit) {
      navigate('/explore');
      return;
    }

    // In production: call reservationActions.lock({ unitId: unit.id, userId: currentUserId })
    // For now, we'll simulate a reservation
    console.log('Starting reservation for unit:', unit.code);
  }, [unit, navigate]);

  if (!unit) {
    return (
      <div className={cn(layoutService.page.fullPage, "flex items-center justify-center")}>
        <div className={layoutService.status.empty.container}>
          <Text variant="h2" className={layoutService.status.empty.title}>
            {t('reserve.unitNotFound', 'Unit not found')}
          </Text>
          <Button intent="primary" onClick={() => navigate('/explore')}>
            {t('reserve.backToExplore', 'Back to Explore')}
          </Button>
        </div>
      </div>
    );
  }

  // Mock expiration time (10 minutes from now)
  const mockExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const handleExpire = () => {
    alert(t('reserve.expired', 'Your reservation has expired'));
    navigate('/explore');
  };

  const handleCancel = () => {
    if (confirm(t('reserve.confirmCancel', 'Are you sure you want to cancel this reservation?'))) {
      navigate('/explore');
    }
  };

  return (
    <div className={layoutService.page.fullPageLight}>
      {/* Global Countdown Bar */}
      <GlobalCountdownBar
        expiresAt={mockExpiresAt}
        unitCode={unit.code}
        onExpire={handleExpire}
        onViewUnit={() => navigate(`/explore?unit=${unit.id}`)}
      />

      {/* Main Content - Responsive spacing */}
      <div className="pt-12 sm:pt-16">
        <ResponsiveContainer size="full" padding="md" className="py-4 sm:py-6 lg:py-8">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8 py-6 sm:py-8 md:py-12 border-b border-primary/10">
            <ResponsiveStack 
              direction={{ default: 'col', sm: 'row' }} 
              align="start" 
              justify="between" 
              gap="md" 
              className="mb-4"
            >
              <Text variant="h1" className="text-primary font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                {t('reserve.title', 'Reserve Your Villa')}
              </Text>
              <Button intent="ghost" onClick={handleCancel} size="sm">
                <span className="hidden sm:inline">{t('reserve.cancel', 'Cancel')}</span>
                <span className="sm:hidden">✕</span>
              </Button>
            </ResponsiveStack>
            
            {/* Progress Stepper */}
            <div className="flex items-center gap-4 mb-8">
              <div className={`flex items-center gap-2 ${currentStep === 'info' ? 'text-primary' : 'text-primary/50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'info' ? 'bg-secondary text-surface' : 'bg-primary/10'}`}>
                  1
                </div>
                <Text variant="body" className="hidden sm:inline">
                  {t('reserve.step.info', 'Your Info')}
                </Text>
              </div>
              <div className="flex-1 h-0.5 bg-primary/20" />
              <div className={`flex items-center gap-2 ${currentStep === 'review' ? 'text-primary' : 'text-primary/50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'review' ? 'bg-secondary text-surface' : 'bg-primary/10'}`}>
                  2
                </div>
                <Text variant="body" className="hidden sm:inline">
                  {t('reserve.step.review', 'Review')}
                </Text>
              </div>
              <div className="flex-1 h-0.5 bg-primary/20" />
              <div className={`flex items-center gap-2 ${currentStep === 'payment' ? 'text-primary' : 'text-primary/50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'payment' ? 'bg-secondary text-surface' : 'bg-primary/10'}`}>
                  3
                </div>
                <Text variant="body" className="hidden sm:inline">
                  {t('reserve.step.payment', 'Payment')}
                </Text>
              </div>
            </div>
          </div>

          {/* Two Column Layout - Responsive */}
          <ResponsiveGrid cols={{ default: 1, lg: 3 }} gap="lg">
            {/* Left: Unit Summary (Sticky) */}
            <div className="lg:col-span-1">
              <div className={cn(layoutService.page.cardElevated, "p-4 sm:p-6 lg:sticky lg:top-24")}>
                <Text variant="h3" className="text-primary mb-3 sm:mb-4 text-lg sm:text-xl">
                  {t('reserve.summary', 'Reservation Summary')}
                </Text>
                
                {/* Unit Details */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-primary/10">
                  <div>
                    <Text variant="caption" className="text-primary/50 mb-1 text-xs sm:text-sm">
                      {t('reserve.unitCode', 'Unit Code')}
                    </Text>
                    <Text variant="body" className="text-primary font-semibold text-sm sm:text-base">
                      {unit.code}
                    </Text>
                  </div>
                  <div>
                    <Text variant="caption" className="text-primary/50 mb-1 text-xs sm:text-sm">
                      {t('reserve.type', 'Type')}
                    </Text>
                    <Text variant="body" className="text-primary text-sm sm:text-base">
                      {t(`villas.${unit.type.replace('-', '')}.title`, unit.type)}
                    </Text>
                  </div>
                  <div>
                    <Text variant="caption" className="text-primary/50 mb-1 text-xs sm:text-sm">
                      {t('reserve.floor', 'Floor')}
                    </Text>
                    <Text variant="body" className="text-primary text-sm sm:text-base">
                      {unit.floor}
                    </Text>
                  </div>
                  <div>
                    <Text variant="caption" className="text-primary/50 mb-1 text-xs sm:text-sm">
                      {t('reserve.area', 'Area')}
                    </Text>
                    <Text variant="body" className="text-primary text-sm sm:text-base">
                      {unit.area} m²
                    </Text>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4 sm:mb-6">
                  <Text variant="caption" className="text-primary/50 mb-1 text-xs sm:text-sm">
                    {t('reserve.totalPrice', 'Total Price')}
                  </Text>
                  <Text variant="h2" className="text-secondary font-bold text-xl sm:text-2xl">
                    ${unit.price.toLocaleString()}
                  </Text>
                </div>

                {/* Reservation Fee Notice */}
                <div className={cn(layoutService.page.card, "p-4")}>
                  <Text variant="caption" className="text-primary/70">
                    {t('reserve.feeNotice', 'A reservation fee will be required to proceed with payment.')}
                  </Text>
                </div>
              </div>
            </div>

            {/* Right: Step Content */}
            <div className="lg:col-span-2">
              <div className={cn(layoutService.page.cardElevated, "p-4 sm:p-6 lg:p-8")}>
                {currentStep === 'info' && (
                  <div>
                    <Text variant="h2" className="text-primary mb-4 sm:mb-6 text-lg sm:text-xl lg:text-2xl">
                      {t('reserve.info.title', 'Your Information')}
                    </Text>
                    <Text variant="body" className="text-primary/70 mb-6 sm:mb-8 text-sm sm:text-base">
                      {t('reserve.info.description', 'Please provide your contact information to proceed with the reservation.')}
                    </Text>

                    {/* Form (to be implemented) */}
                    <div className={layoutService.form.container}>
                      <Text variant="body" className="text-primary/50 italic text-sm sm:text-base">
                        {t('reserve.comingSoon', 'Full form implementation coming soon...')}
                      </Text>
                      
                      <ResponsiveStack 
                        direction={{ default: 'col', sm: 'row' }} 
                        justify="end" 
                        gap="md" 
                        className="mt-6 sm:mt-8"
                      >
                        <Button intent="ghost" onClick={handleCancel} size="md">
                          {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button intent="primary" onClick={() => setCurrentStep('review')} size="md">
                          <span>{t('common.next', 'Next')}</span>
                          <ArrowRightIcon size="sm" className="ml-2" />
                        </Button>
                      </ResponsiveStack>
                    </div>
                  </div>
                )}

                {currentStep === 'review' && (
                  <div>
                    <Text variant="h2" className="text-primary mb-4 sm:mb-6 text-lg sm:text-xl lg:text-2xl">
                      {t('reserve.review.title', 'Review & Confirm')}
                    </Text>
                    <Text variant="body" className="text-primary/70 mb-6 sm:mb-8 text-sm sm:text-base">
                      {t('reserve.review.description', 'Please review your information and accept the terms.')}
                    </Text>

                    <div className={layoutService.form.container}>
                      <Text variant="body" className="text-primary/50 italic text-sm sm:text-base">
                        {t('reserve.comingSoon', 'Full review implementation coming soon...')}
                      </Text>

                      <ResponsiveStack 
                        direction={{ default: 'col', sm: 'row' }} 
                        justify="between" 
                        gap="md" 
                        className="mt-6 sm:mt-8"
                      >
                        <Button intent="ghost" onClick={() => setCurrentStep('info')} size="md">
                          <ArrowLeftIcon size="sm" className="mr-2" />
                          <span>{t('common.back', 'Back')}</span>
                        </Button>
                        <Button intent="primary" onClick={() => setCurrentStep('payment')} size="md">
                          <span>{t('reserve.proceedToPayment', 'Proceed to Payment')}</span>
                          <ArrowRightIcon size="sm" className="ml-2" />
                        </Button>
                      </ResponsiveStack>
                    </div>
                  </div>
                )}

                {currentStep === 'payment' && (
                  <div>
                    <Text variant="h2" className="text-primary mb-4 sm:mb-6 text-lg sm:text-xl lg:text-2xl">
                      {t('reserve.payment.title', 'Payment')}
                    </Text>
                    <Text variant="body" className="text-primary/70 mb-6 sm:mb-8 text-sm sm:text-base">
                      {t('reserve.payment.description', 'Select your payment method to complete the reservation.')}
                    </Text>

                    <div className={layoutService.form.container}>
                      <Text variant="body" className="text-primary/50 italic text-sm sm:text-base">
                        {t('reserve.comingSoon', 'Full payment implementation coming soon...')}
                      </Text>

                      <ResponsiveStack 
                        direction={{ default: 'col', sm: 'row' }} 
                        justify="between" 
                        gap="md" 
                        className="mt-6 sm:mt-8"
                      >
                        <Button intent="ghost" onClick={() => setCurrentStep('review')} size="md">
                          <ArrowLeftIcon size="sm" className="mr-2" />
                          <span>{t('common.back', 'Back')}</span>
                        </Button>
                        <Button intent="primary" onClick={() => navigate('/confirm?orderId=mock-123')} size="md">
                          <span>{t('reserve.completePayment', 'Complete Payment')}</span>
                        </Button>
                      </ResponsiveStack>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ResponsiveGrid>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

ReservePage.displayName = 'ReservePage';

