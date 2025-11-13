/**
 * useReservation Hook
 * 
 * Manages reservation state and operations.
 * Syncs with server and handles realtime updates.
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  lockUnit,
  getReservation,
  updateBuyerInfo,
  confirmReview,
  releaseReservation,
  type LockRequest,
  type BuyerInfo,
  type ReservationDetails,
} from '@/services/reservationService';
import { realtimeService } from '@/services/realtimeService';

export interface UseReservationOptions {
  /**
   * Auto-fetch reservation on mount
   */
  reservationId?: string;
  /**
   * Enable realtime sync
   */
  enableRealtime?: boolean;
  /**
   * Callback when reservation expires
   */
  onExpire?: () => void;
}

export interface UseReservationState {
  reservation: ReservationDetails | null;
  isLoading: boolean;
  error: string | null;
  isLocking: boolean;
  isUpdating: boolean;
}

export interface UseReservationActions {
  lock: (request: LockRequest) => Promise<void>;
  refresh: () => Promise<void>;
  updateBuyer: (info: BuyerInfo) => Promise<void>;
  confirmReview: () => Promise<void>;
  release: () => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for reservation management
 */
export function useReservation(
  options: UseReservationOptions = {}
): [UseReservationState, UseReservationActions] {
  const { reservationId, enableRealtime = true, onExpire } = options;
  const navigate = useNavigate();
  
  const [reservation, setReservation] = useState<ReservationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch reservation details
  const refresh = useCallback(async () => {
    if (!reservationId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getReservation(reservationId);
      setReservation(data);
      
      // Check if expired
      if (data.status === 'expired' || data.status === 'released') {
        onExpire?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reservation');
    } finally {
      setIsLoading(false);
    }
  }, [reservationId, onExpire]);

  // Lock unit (start reservation)
  const lock = useCallback(async (request: LockRequest) => {
    setIsLocking(true);
    setError(null);
    
    try {
      const response = await lockUnit(request);
      
      setReservation({
        reservationId: response.reservationId,
        unitId: response.unitId,
        status: response.status === 'available' ? 'held' : response.status as 'held' | 'sold',
        orderId: response.orderId,
        expiresAt: response.expiresAt,
        serverNow: response.serverNow,
      });
      
      // Navigate to reserve page
      navigate(`/reserve/${response.reservationId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to lock unit');
      throw err;
    } finally {
      setIsLocking(false);
    }
  }, [navigate]);

  // Update buyer information
  const updateBuyer = useCallback(async (info: BuyerInfo) => {
    if (!reservationId) throw new Error('No reservation ID');
    
    setIsUpdating(true);
    setError(null);
    
    try {
      await updateBuyerInfo(reservationId, info);
      
      // Update local state
      if (reservation) {
        setReservation({
          ...reservation,
          buyerInfo: info,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update buyer info');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [reservationId, reservation]);

  // Confirm review step
  const confirmReviewStep = useCallback(async () => {
    if (!reservationId) throw new Error('No reservation ID');
    
    setIsUpdating(true);
    setError(null);
    
    try {
      await confirmReview(reservationId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to confirm review');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [reservationId]);

  // Release reservation
  const release = useCallback(async () => {
    if (!reservationId) throw new Error('No reservation ID');
    
    setIsUpdating(true);
    setError(null);
    
    try {
      await releaseReservation(reservationId);
      
      // Update local state
      if (reservation) {
        setReservation({
          ...reservation,
          status: 'released',
        });
      }
      
      // Navigate back
      navigate('/explore');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to release reservation');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [reservationId, reservation, navigate]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch on mount if reservationId provided
  useEffect(() => {
    if (reservationId) {
      refresh();
    }
  }, [reservationId, refresh]);

  // Setup realtime sync
  useEffect(() => {
    if (!enableRealtime || !reservationId) return;

    // Subscribe to reservation channel
    const unsubscribe = realtimeService.subscribe(
      `reservation:${reservationId}`,
      (event) => {
        switch (event.type) {
          case 'payment_update':
            refresh();
            break;
          case 'hold_tick':
            // Update remaining time
            if (reservation && event.data.remainingMs) {
              setReservation({
                ...reservation,
                remainingMs: event.data.remainingMs as number,
              });
            }
            break;
          default:
            break;
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [enableRealtime, reservationId, reservation, refresh]);

  const state: UseReservationState = {
    reservation,
    isLoading,
    error,
    isLocking,
    isUpdating,
  };

  const actions: UseReservationActions = {
    lock,
    refresh,
    updateBuyer,
    confirmReview: confirmReviewStep,
    release,
    clearError,
  };

  return [state, actions];
}

