/**
 * Reservation Service
 * 
 * Handles API calls for unit reservation/lock operations.
 * All endpoints are idempotent using Idempotency-Key header.
 */

export interface LockRequest {
  unitId: string;
  userId: string;
}

export interface LockResponse {
  reservationId: string;
  unitId: string;
  status: 'held' | 'available' | 'sold';
  orderId: string;
  holdSeconds: number;
  expiresAt: string; // ISO 8601
  serverNow: string; // ISO 8601
}

export interface BuyerInfo {
  fullName: string;
  email: string;
  phone: string;
  nationality?: string;
  passportId?: string;
  note?: string;
}

export interface ReservationDetails {
  reservationId: string;
  unitId: string;
  status: 'held' | 'expired' | 'sold' | 'released';
  orderId: string;
  expiresAt: string;
  serverNow: string;
  buyerInfo?: BuyerInfo;
  remainingMs?: number;
}

// const API_BASE = (import.meta.env?.VITE_API_URL as string) || '/api';

/**
 * Generate idempotency key for request
 */
// function generateIdempotencyKey(prefix: string, ...parts: string[]): string {
//   return `${prefix}-${parts.join('-')}-${Date.now()}`;
// }

/**
 * Lock a unit (start reservation)
 */
export async function lockUnit(request: LockRequest): Promise<LockResponse> {
  // const idempotencyKey = generateIdempotencyKey('LOCK', request.unitId, request.userId);
  
  // TODO: Replace with actual API call
  // For now, return mock data
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes
  
  return {
    reservationId: `RSV_${Date.now()}`,
    unitId: request.unitId,
    status: 'held',
    orderId: `RES-2025-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
    holdSeconds: 600,
    expiresAt: expiresAt.toISOString(),
    serverNow: now.toISOString(),
  };
  
  /* Production code:
  const response = await fetch(`${API_BASE}/reservations/lock`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    if (response.status === 409) {
      const error = await response.json();
      throw new Error(`Unit already held. Remaining: ${error.remainingMs}ms`);
    }
    throw new Error('Failed to lock unit');
  }
  
  return response.json();
  */
}

/**
 * Get reservation details
 */
export async function getReservation(_reservationId: string): Promise<ReservationDetails> {
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 8 * 60 * 1000); // 8 minutes remaining
  
  return {
    reservationId: _reservationId,
    unitId: 'unit-1',
    status: 'held',
    orderId: `RES-2025-000123`,
    expiresAt: expiresAt.toISOString(),
    serverNow: now.toISOString(),
    remainingMs: 8 * 60 * 1000,
  };
  
  /* Production code:
  const response = await fetch(`${API_BASE}/reservations/${reservationId}`);
  if (!response.ok) throw new Error('Failed to get reservation');
  return response.json();
  */
}

/**
 * Update buyer information
 */
export async function updateBuyerInfo(
  _reservationId: string,
  _buyerInfo: BuyerInfo
): Promise<void> {
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  /* Production code:
  const response = await fetch(`${API_BASE}/reservations/${reservationId}/buyer`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buyerInfo),
  });
  
  if (!response.ok) throw new Error('Failed to update buyer info');
  */
}

/**
 * Confirm review step (accept terms)
 */
export async function confirmReview(_reservationId: string): Promise<void> {
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 200));
  
  /* Production code:
  const response = await fetch(`${API_BASE}/reservations/${reservationId}/confirm-review`, {
    method: 'PATCH',
  });
  
  if (!response.ok) throw new Error('Failed to confirm review');
  */
}

/**
 * Release/cancel reservation
 */
export async function releaseReservation(_reservationId: string): Promise<void> {
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 200));
  
  /* Production code:
  const response = await fetch(`${API_BASE}/reservations/${reservationId}/release`, {
    method: 'POST',
  });
  
  if (!response.ok) throw new Error('Failed to release reservation');
  */
}

