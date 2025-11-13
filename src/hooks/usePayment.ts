/**
 * usePayment Hook
 * 
 * Manages payment operations and status polling.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  createPayment,
  getPaymentStatus,
  getReceipt,
  downloadReceipt,
  type CreatePaymentRequest,
  type PaymentStatusResponse,
  type Receipt,
  type PaymentStatus,
} from '@/services/paymentService';

export interface UsePaymentOptions {
  /**
   * Order ID for status polling
   */
  orderId?: string;
  /**
   * Enable auto-polling
   */
  enablePolling?: boolean;
  /**
   * Polling interval in milliseconds
   */
  pollingInterval?: number;
  /**
   * Max polling duration in milliseconds
   */
  maxPollingDuration?: number;
  /**
   * Callback when payment succeeds
   */
  onSuccess?: (receiptId: string) => void;
  /**
   * Callback when payment fails
   */
  onFail?: (reason?: string) => void;
}

export interface UsePaymentState {
  status: PaymentStatus | null;
  receipt: Receipt | null;
  isProcessing: boolean;
  isPolling: boolean;
  error: string | null;
}

export interface UsePaymentActions {
  createCheckout: (request: CreatePaymentRequest) => Promise<void>;
  pollStatus: () => Promise<void>;
  stopPolling: () => void;
  fetchReceipt: (receiptId: string) => Promise<void>;
  downloadPdf: (receiptId: string) => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for payment operations
 */
export function usePayment(
  options: UsePaymentOptions = {}
): [UsePaymentState, UsePaymentActions] {
  const {
    orderId,
    enablePolling = true,
    pollingInterval = 3000,
    maxPollingDuration = 90000, // 90 seconds
    onSuccess,
    onFail,
  } = options;

  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pollingStartTime, setPollingStartTime] = useState<number | null>(null);

  // Create payment checkout
  const createCheckout = useCallback(async (request: CreatePaymentRequest) => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await createPayment(request);
      
      // Redirect to gateway
      window.location.href = response.redirectUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payment');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Poll payment status
  const pollStatus = useCallback(async () => {
    if (!orderId) return;

    try {
      const response: PaymentStatusResponse = await getPaymentStatus(orderId);
      setStatus(response.status);

      // Handle terminal states
      if (response.status === 'SUCCEEDED' && response.receiptId) {
        setIsPolling(false);
        onSuccess?.(response.receiptId);
      } else if (response.status === 'FAILED') {
        setIsPolling(false);
        onFail?.(response.reason);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to poll payment status');
    }
  }, [orderId, onSuccess, onFail]);

  // Stop polling
  const stopPolling = useCallback(() => {
    setIsPolling(false);
    setPollingStartTime(null);
  }, []);

  // Fetch receipt
  const fetchReceipt = useCallback(async (receiptId: string) => {
    try {
      const receiptData = await getReceipt(receiptId);
      setReceipt(receiptData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch receipt');
      throw err;
    }
  }, []);

  // Download receipt PDF
  const downloadPdf = useCallback(async (receiptId: string) => {
    try {
      const blob = await downloadReceipt(receiptId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${receiptId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download receipt');
      throw err;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-polling effect
  useEffect(() => {
    if (!enablePolling || !orderId || status === 'SUCCEEDED' || status === 'FAILED') {
      return;
    }

    // Start polling
    setIsPolling(true);
    setPollingStartTime(Date.now());

    const interval = setInterval(() => {
      // Check max duration
      if (pollingStartTime && Date.now() - pollingStartTime > maxPollingDuration) {
        stopPolling();
        return;
      }

      pollStatus();
    }, pollingInterval);

    // Initial poll
    pollStatus();

    return () => {
      clearInterval(interval);
    };
  }, [
    enablePolling,
    orderId,
    status,
    pollingInterval,
    maxPollingDuration,
    pollingStartTime,
    pollStatus,
    stopPolling,
  ]);

  const state: UsePaymentState = {
    status,
    receipt,
    isProcessing,
    isPolling,
    error,
  };

  const actions: UsePaymentActions = {
    createCheckout,
    pollStatus,
    stopPolling,
    fetchReceipt,
    downloadPdf,
    clearError,
  };

  return [state, actions];
}

