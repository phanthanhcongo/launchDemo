/**
 * ReceiptCard Component
 * 
 * Displays reservation receipt details.
 * Reusable in confirmation page and email preview.
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/atoms';
import { cn } from '@/lib/cn';

export interface ReceiptDetails {
  orderId: string;
  unitCode: string;
  unitType: string;
  floor: number;
  amount: number;
  currency: string;
  paidAt: string;
  buyerName: string;
  buyerEmail: string;
  status: 'reserved' | 'confirmed' | 'pending';
}

export interface ReceiptCardProps {
  receipt: ReceiptDetails;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ReceiptCard Component
 * 
 * Displays formatted receipt information.
 * 
 * @example
 * ```tsx
 * <ReceiptCard receipt={receiptData} />
 * ```
 */
export function ReceiptCard({ receipt, className, style }: ReceiptCardProps) {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  return (
    <div
      className={cn(
        'bg-surface rounded-lg border border-primary/20 shadow-lg overflow-hidden',
        className
      )}
      style={style}
    >
      {/* Header */}
      <div className="bg-primary/5 px-6 py-4 border-b border-primary/10">
        <Text variant="h4" className="text-primary font-semibold">
          {t('confirm.receipt.title', 'Reservation Receipt')}
        </Text>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Order ID */}
        <div className="flex items-center justify-between pb-4 border-b border-primary/10">
          <Text variant="caption" className="text-primary/50">
            {t('confirm.receipt.orderId', 'Order ID')}
          </Text>
          <Text variant="body" className="text-primary font-mono font-semibold">
            {receipt.orderId}
          </Text>
        </div>

        {/* Unit Details */}
        <div>
          <Text variant="caption" className="text-primary/50 mb-3 block">
            {t('confirm.receipt.unitDetails', 'Unit Details')}
          </Text>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Text variant="body" className="text-primary/70">
                {t('confirm.receipt.unit', 'Unit')}
              </Text>
              <Text variant="body" className="text-primary font-semibold">
                {receipt.unitCode}
              </Text>
            </div>
            <div className="flex items-center justify-between">
              <Text variant="body" className="text-primary/70">
                {t('confirm.receipt.type', 'Type')}
              </Text>
              <Text variant="body" className="text-primary">
                {t(`villas.${receipt.unitType.replace('-', '')}.title`, receipt.unitType)}
              </Text>
            </div>
            <div className="flex items-center justify-between">
              <Text variant="body" className="text-primary/70">
                {t('confirm.receipt.floor', 'Floor')}
              </Text>
              <Text variant="body" className="text-primary">
                {receipt.floor}
              </Text>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div>
          <Text variant="caption" className="text-primary/50 mb-3 block">
            {t('confirm.receipt.paymentDetails', 'Payment Details')}
          </Text>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Text variant="body" className="text-primary/70">
                {t('confirm.receipt.amount', 'Amount Paid')}
              </Text>
              <Text variant="h3" className="text-secondary font-bold">
                {formatAmount(receipt.amount, receipt.currency)}
              </Text>
            </div>
            <div className="flex items-center justify-between">
              <Text variant="body" className="text-primary/70">
                {t('confirm.receipt.time', 'Time')}
              </Text>
              <Text variant="body" className="text-primary">
                {formatDate(receipt.paidAt)}
              </Text>
            </div>
            <div className="flex items-center justify-between">
              <Text variant="body" className="text-primary/70">
                {t('confirm.receipt.status', 'Status')}
              </Text>
              <div className="px-3 py-1 bg-secondary/10 text-secondary rounded-md">
                <Text variant="caption" className="font-semibold uppercase">
                  {t(`confirm.receipt.status.${receipt.status}`, receipt.status)}
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* Buyer Details */}
        <div>
          <Text variant="caption" className="text-primary/50 mb-3 block">
            {t('confirm.receipt.buyerDetails', 'Buyer Information')}
          </Text>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Text variant="body" className="text-primary/70">
                {t('confirm.receipt.name', 'Name')}
              </Text>
              <Text variant="body" className="text-primary">
                {receipt.buyerName}
              </Text>
            </div>
            <div className="flex items-center justify-between">
              <Text variant="body" className="text-primary/70">
                {t('confirm.receipt.email', 'Email')}
              </Text>
              <Text variant="body" className="text-primary">
                {receipt.buyerEmail}
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-primary/5 px-6 py-4 border-t border-primary/10">
        <Text variant="caption" className="text-primary/50 text-center block">
          {t('confirm.receipt.note', 'A confirmation email has been sent to your registered email address.')}
        </Text>
      </div>
    </div>
  );
}

ReceiptCard.displayName = 'ReceiptCard';

