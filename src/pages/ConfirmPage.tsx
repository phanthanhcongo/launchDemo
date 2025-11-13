/**
 * ConfirmPage Component
 * 
 * Payment confirmation page with 3 states: success, failed, pending.
 * Implements polling for pending payments and receipt display.
 */

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Text, Button } from '@/components/atoms';
import { ReceiptCard, type ReceiptDetails } from '@/components/molecules';
import { VREmbed } from '@/components/VREmbed';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Separator,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveStack
} from '@/components/ui';
import { usePayment } from '@/hooks/usePayment';
import { layoutService } from '@/services';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';

type PaymentStatus = 'success' | 'failed' | 'pending';

/**
 * ConfirmPage Component
 * 
 * Displays payment confirmation with success/failed/pending states.
 * Polls backend for pending payments.
 * 
 * @example
 * ```tsx
 * <Route path="/confirm" element={<ConfirmPage />} />
 * ```
 */
export function ConfirmPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const statusParam = searchParams.get('status') as PaymentStatus | null;
  const orderId = searchParams.get('orderId');
  const unitId = searchParams.get('unit');
  
  const [localStatus, setLocalStatus] = useState<PaymentStatus>(statusParam || 'pending');
  
  // Use payment hook for polling
  const [paymentState, paymentActions] = usePayment({
    orderId: orderId || undefined,
    enablePolling: localStatus === 'pending',
    pollingInterval: 5000, // 5 seconds
    maxPollingDuration: 120000, // 2 minutes
    onSuccess: () => {
      setLocalStatus('success');
    },
    onFail: () => {
      setLocalStatus('failed');
    },
  });

  // Mock receipt data (production: fetch from API)
  const mockReceipt: ReceiptDetails = {
    orderId: orderId || 'RES-2025-000123',
    unitCode: unitId || 'A-206',
    unitType: '2-bed',
    floor: 2,
    amount: 5000,
    currency: 'USD',
    paidAt: new Date().toISOString(),
    buyerName: 'John Doe',
    buyerEmail: 'john@example.com',
    status: localStatus === 'success' ? 'reserved' : 'pending',
  };

  // Handle download receipt
  const handleDownloadReceipt = async () => {
    try {
      await paymentActions.downloadPdf(mockReceipt.orderId);
    } catch (error) {
      console.error('Failed to download receipt:', error);
      alert(t('confirm.downloadError', 'Failed to download receipt. Please try again.'));
    }
  };

  // Handle retry payment
  const handleRetry = () => {
    if (unitId) {
      navigate(`/reserve/${unitId}`);
    } else {
      navigate('/explore');
    }
  };

  // Handle view reservation
  const handleViewReservation = () => {
    navigate('/explore');
  };

  // Handle book call
  const handleBookCall = () => {
    navigate('/?section=contact');
  };

  // Render success state
  if (localStatus === 'success') {
    return (
      <div className={cn(layoutService.page.fullPage, "flex items-center justify-center")}>
        <ResponsiveContainer size="xl" padding="lg" className="py-8 sm:py-12 lg:py-16">
          <div className="space-y-6 sm:space-y-8">
            {/* Success Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={layoutService.status.success.container}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-success/10 mb-4 sm:mb-6"
              >
                <CheckIcon size="xl" className="text-success" />
              </motion.div>
              
              <Text variant="h1" className={layoutService.status.success.title}>
                {t('confirm.success.title', 'Reservation Confirmed')}
              </Text>
              
              <Text variant="body" className={cn(layoutService.status.success.description, "mb-8")}>
                {t('confirm.success.description', 'Your villa has been successfully reserved. We\'ve sent your confirmation and next steps to your email.')}
              </Text>
            </motion.div>

            {/* Main Content Grid */}
            <ResponsiveGrid cols={{ default: 1, lg: 2 }} gap="lg">
              {/* Left Column - Receipt & Actions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="space-y-4 sm:space-y-6"
              >
                {/* Receipt Card */}
                <ReceiptCard receipt={mockReceipt} />

                {/* Action Buttons */}
                <ResponsiveStack direction={{ default: 'col', sm: 'row' }} gap="md">
                  <Button
                    intent="primary"
                    size="lg"
                    onClick={handleDownloadReceipt}
                    className="flex-1 justify-center"
                  >
                    <ArrowDownTrayIcon size="sm" className="mr-2" />
                    <span className="hidden sm:inline">
                      {t('confirm.success.downloadReceipt', 'Download Receipt (PDF)')}
                    </span>
                    <span className="sm:hidden">
                      {t('confirm.success.download', 'Download')}
                    </span>
                  </Button>
                  <Button
                    intent="secondary"
                    size="lg"
                    onClick={handleViewReservation}
                    className="flex-1 justify-center"
                  >
                    <span className="hidden sm:inline">
                      {t('confirm.success.viewReservation', 'View Your Reservation')}
                    </span>
                    <span className="sm:hidden">
                      {t('confirm.success.view', 'View Details')}
                    </span>
                  </Button>
                </ResponsiveStack>

                <div className="text-center">
                  <Button
                    intent="ghost"
                    size="md"
                    onClick={handleBookCall}
                    className="w-full sm:w-auto"
                  >
                    <PhoneIcon size="sm" className="mr-2" />
                    {t('confirm.success.bookCall', 'Book a Welcome Call')}
                  </Button>
                </div>

                {/* Next Steps Note */}
                <Card>
                  <CardContent className="p-4 sm:p-6 text-center">
                    <Text variant="caption" className="text-primary/90">
                      {t('confirm.success.note', 'Our team will contact you within 24 hours to guide you through the next steps.')}
                    </Text>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Right Column - VR Experience */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <VREmbed
                  type="all"
                  showTabs={true}
                  height={350}
                  title="🏡 Experience Your Reserved Villa"
                />
              </motion.div>
            </ResponsiveGrid>

            <Separator className="my-6 sm:my-8" />

            {/* Additional Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <ResponsiveGrid cols={{ default: 1, md: 3 }} gap="md">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                      <CheckIcon size="md" className="text-success flex-shrink-0" />
                      <span>Reservation Secured</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm">
                      Your villa is now reserved and locked for 48 hours while we process your documentation.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                      <EnvelopeIcon size="md" className="text-primary flex-shrink-0" />
                      <span>Next Steps</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm">
                      Check your email for detailed next steps and required documentation for your villa purchase.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                      <ChatBubbleLeftRightIcon size="md" className="text-secondary flex-shrink-0" />
                      <span>Support Available</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm">
                      Our team is available 24/7 to assist you with any questions about your reservation.
                    </CardDescription>
                  </CardContent>
                </Card>
              </ResponsiveGrid>
            </motion.div>
          </div>
        </ResponsiveContainer>
      </div>
    );
  }

  // Render failed state
  if (localStatus === 'failed') {
    return (
      <div className={cn(layoutService.page.fullPage, "flex items-center justify-center")}>
        <ResponsiveContainer size="lg" padding="lg" className="py-8 sm:py-12 lg:py-16">
          <ResponsiveGrid cols={{ default: 1, lg: 2 }} gap="lg" className="items-start">
            {/* Left Column - Error State */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Error Icon */}
              <div className={layoutService.status.error.container}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-error/10 mb-4 sm:mb-6"
                >
                  <XMarkIcon size="xl" className="text-error" />
                </motion.div>

                  <Text variant="h1" className={layoutService.status.error.title}>
                    {t('confirm.failed.title', 'Payment Failed')}
                  </Text>
                  <Text variant="body" className={layoutService.status.error.description}>
                    {t('confirm.failed.description', 'We couldn\'t process your payment.')}
                  </Text>
                </div>

                {/* Remaining time notice */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-warning">
                      <ExclamationTriangleIcon size="md" className="flex-shrink-0" />
                      <span>Reservation Still Active</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Text variant="body" className="text-primary/90 text-sm">
                      {t('confirm.failed.remainingTime', 'You still have time remaining to complete your reservation before the unit is released.')}
                    </Text>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <ResponsiveStack direction={{ default: 'col' }} gap="md">
                  <Button
                    intent="primary"
                    size="lg"
                    onClick={handleRetry}
                    className="w-full justify-center"
                  >
                    {t('confirm.failed.tryAgain', 'Try Again')}
                  </Button>
                  <Button
                    intent="ghost"
                    size="md"
                    onClick={() => navigate('/explore')}
                    className="w-full justify-center"
                  >
                    <span className="hidden sm:inline">
                      {t('confirm.failed.chooseAnother', 'Choose Another Payment Method')}
                    </span>
                    <span className="sm:hidden">
                      {t('confirm.failed.chooseOther', 'Other Payment')}
                    </span>
                  </Button>
                </ResponsiveStack>

                <Separator />

                <div className="text-center">
                  <button
                    onClick={() => window.open('mailto:support@nyalavillas.com', '_blank')}
                    className="text-primary/90 hover:text-primary transition-colors font-medium"
                  >
                    <Text variant="caption">
                      {t('confirm.failed.contactSupport', 'Contact Support')} →
                    </Text>
                  </button>
                </div>
              </motion.div>

            {/* Right Column - VR Experience While Waiting */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <VREmbed
                type="floorplans"
                showTabs={false}
                height={300}
                title="🎮 Explore While You Retry"
              />
              
              <Card className="mt-4 sm:mt-6">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Text variant="caption" className="text-primary/90 text-sm">
                    Take a virtual tour while we help resolve your payment issue
                  </Text>
                </CardContent>
              </Card>
            </motion.div>
          </ResponsiveGrid>
        </ResponsiveContainer>
      </div>
    );
  }

  // Render pending state (default)
  return (
    <div className={cn(layoutService.page.fullPage, "flex items-center justify-center")}>
      <ResponsiveContainer size="lg" padding="lg" className="py-8 sm:py-12 lg:py-16">
        <ResponsiveGrid cols={{ default: 1, lg: 2 }} gap="lg" className="items-start">
          {/* Left Column - Loading State */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Loading Animation */}
            <div className={layoutService.status.loading.container}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-secondary/10 mb-4 sm:mb-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className={cn(layoutService.status.loading.spinner, "w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 border-4 border-primary/30 border-t-primary")}
                />
              </motion.div>

              <Text variant="h1" className={layoutService.status.loading.text}>
                {t('confirm.pending.title', 'Payment Pending')}
              </Text>
              <Text variant="body" className="text-primary/90 max-w-md mx-auto text-sm sm:text-base">
                {t('confirm.pending.description', 'We\'re verifying your payment. This normally takes less than 2 minutes.')}
              </Text>
            </div>

            {/* Status Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-secondary">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ClockIcon size="md" className="flex-shrink-0" />
                  </motion.div>
                  <span>Processing Payment</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 text-secondary">
                  <CheckIcon size="sm" className="animate-pulse flex-shrink-0" />
                  <Text variant="body" className="font-medium text-sm">
                    {t('confirm.pending.locked', 'Your reservation remains locked')}
                  </Text>
                </div>
                <div className="flex items-center gap-2 text-secondary">
                  <EnvelopeIcon size="sm" className="animate-pulse flex-shrink-0" />
                  <Text variant="body" className="font-medium text-sm">
                    {t('confirm.pending.notify', 'We\'ll notify you as soon as your payment clears')}
                  </Text>
                </div>
              </CardContent>
            </Card>

            {/* Polling Status */}
            {paymentState.isPolling && (
              <Card>
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <ArrowPathIcon size="sm" className="animate-spin text-primary" />
                    <Text variant="caption" className="text-primary/80 text-xs sm:text-sm">
                      {t('confirm.pending.checking', 'Checking payment status...')}
                    </Text>
                  </div>
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* Back to explore */}
            <div className="text-center">
              <button
                onClick={() => navigate('/explore')}
                className="text-primary/90 hover:text-primary transition-colors font-medium"
              >
                <Text variant="caption" className="text-xs sm:text-sm">
                  {t('confirm.pending.backToExplore', 'Back to Explore')}
                </Text>
              </button>
            </div>
          </motion.div>

          {/* Right Column - VR Experience While Waiting */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <VREmbed
              type="all"
              showTabs={true}
              height={300}
              title="Experience Your Reserved Villa"
            />
            
            <Card className="mt-4 sm:mt-6">
              <CardContent className="p-4 sm:p-6 text-center">
                <Text variant="caption" className="text-primary/90 text-sm">
                  Take a virtual tour while we process your payment
                </Text>
              </CardContent>
            </Card>
          </motion.div>
        </ResponsiveGrid>
      </ResponsiveContainer>
    </div>
  );
}

ConfirmPage.displayName = 'ConfirmPage';

