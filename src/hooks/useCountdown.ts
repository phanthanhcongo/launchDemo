/**
 * useCountdown Hook
 * 
 * Simple countdown timer for offers/promotions (days, hours, minutes).
 * For reservation countdowns with server sync, use useReservationCountdown.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export interface SimpleCountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export interface SimpleCountdownOptions {
  /**
   * Target date for countdown
   */
  targetDate: Date;
  /**
   * Callback when countdown reaches zero
   */
  onComplete?: () => void;
}

/**
 * Calculate time remaining
 */
function calculateTimeLeft(targetDate: Date): SimpleCountdownState {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const difference = target - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
  };
}

/**
 * Simple countdown hook for offers/promotions
 */
export function useCountdown(options: SimpleCountdownOptions): SimpleCountdownState {
  const { targetDate, onComplete } = options;
  
  const [timeLeft, setTimeLeft] = useState<SimpleCountdownState>(() => 
    calculateTimeLeft(targetDate)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.isExpired) {
        clearInterval(timer);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  return timeLeft;
}

// ============================================================================
// RESERVATION COUNTDOWN (with server sync)
// ============================================================================

export interface ReservationCountdownState {
  /**
   * Remaining time in milliseconds
   */
  remainingMs: number;
  /**
   * Remaining time formatted as MM:SS
   */
  formatted: string;
  /**
   * Whether countdown has expired
   */
  isExpired: boolean;
  /**
   * Warning level based on remaining time
   * - normal: > 2 minutes
   * - warning: 30s - 2min
   * - danger: < 30s
   */
  warningLevel: 'normal' | 'warning' | 'danger';
}

export interface UseReservationCountdownOptions {
  /**
   * Target expiration time (ISO 8601 string or Date)
   */
  expiresAt: string | Date;
  /**
   * Server time offset in milliseconds (for sync)
   * Calculate as: serverNow - clientNow
   */
  serverTimeOffset?: number;
  /**
   * Callback when countdown expires
   */
  onExpire?: () => void;
  /**
   * Callback when entering warning zone (< 2 minutes)
   */
  onWarning?: () => void;
  /**
   * Callback when entering danger zone (< 30 seconds)
   */
  onDanger?: () => void;
}

/**
 * Format milliseconds to MM:SS
 */
function formatTime(ms: number): string {
  if (ms <= 0) return '00:00';
  
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Get warning level based on remaining time
 */
function getWarningLevel(ms: number): 'normal' | 'warning' | 'danger' {
  if (ms < 30 * 1000) return 'danger'; // < 30s
  if (ms < 2 * 60 * 1000) return 'warning'; // < 2min
  return 'normal';
}

/**
 * Custom hook for reservation countdown with server sync
 */
export function useReservationCountdown(
  options: UseReservationCountdownOptions
): ReservationCountdownState {
  const { expiresAt, serverTimeOffset = 0, onExpire, onWarning, onDanger } = options;
  
  const [remainingMs, setRemainingMs] = useState<number>(() => {
    const target = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
    const now = Date.now() + serverTimeOffset;
    return Math.max(0, target.getTime() - now);
  });

  const [isExpired, setIsExpired] = useState(false);
  const [warningLevel, setWarningLevel] = useState<'normal' | 'warning' | 'danger'>('normal');
  
  // Track callback states to prevent repeated calls
  const hasCalledWarning = useRef(false);
  const hasCalledDanger = useRef(false);
  const hasCalledExpire = useRef(false);

  // Calculate remaining time
  const updateRemaining = useCallback(() => {
    const target = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
    const now = Date.now() + serverTimeOffset;
    const remaining = Math.max(0, target.getTime() - now);
    
    setRemainingMs(remaining);
    
    // Update warning level
    const level = getWarningLevel(remaining);
    setWarningLevel(level);
    
    // Trigger callbacks
    if (remaining === 0 && !hasCalledExpire.current) {
      hasCalledExpire.current = true;
      setIsExpired(true);
      onExpire?.();
    } else if (level === 'danger' && !hasCalledDanger.current) {
      hasCalledDanger.current = true;
      onDanger?.();
    } else if (level === 'warning' && !hasCalledWarning.current) {
      hasCalledWarning.current = true;
      onWarning?.();
    }
    
    return remaining;
  }, [expiresAt, serverTimeOffset, onExpire, onWarning, onDanger]);

  // Update every second
  useEffect(() => {
    updateRemaining();
    
    const interval = setInterval(() => {
      const remaining = updateRemaining();
      
      // Stop interval when expired
      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [updateRemaining]);

  return {
    remainingMs,
    formatted: formatTime(remainingMs),
    isExpired,
    warningLevel,
  };
}
