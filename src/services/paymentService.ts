/**
 * Payment Service
 * 
 * Handles payment gateway integration (Stripe, Paystack).
 */

export type PaymentGateway = 'stripe' | 'paystack' | 'bank_transfer';
export type PaymentStatus = 'PENDING' | 'REQUIRES_ACTION' | 'SUCCEEDED' | 'FAILED';

export interface CreatePaymentRequest {
  orderId: string;
  reservationId: string;
  unitId: string;
  amount: number;
  currency: string;
  gateway: PaymentGateway;
}

export interface CreatePaymentResponse {
  redirectUrl: string;
  sessionId?: string;
}

export interface PaymentStatusResponse {
  orderId: string;
  status: PaymentStatus;
  reason?: string;
  remainingHoldMs?: number;
  receiptId?: string;
}

export interface Receipt {
  receiptId: string;
  orderId: string;
  unitId: string;
  amount: number;
  currency: string;
  paidAt: string;
  buyer: {
    name: string;
    email: string;
    phone: string;
  };
  unit: {
    code: string;
    type: string;
    floor: number;
  };
}

// const API_BASE = (import.meta.env?.VITE_API_URL as string) || '/api';

/**
 * Generate idempotency key for payment
 */
// function generatePaymentKey(orderId: string): string {
//   return `PAY-${orderId}`;
// }

/**
 * Create payment checkout session
 */
export async function createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse> {
  // const idempotencyKey = generatePaymentKey(request.orderId);
  
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock redirect URL based on gateway
  const mockUrls: Record<PaymentGateway, string> = {
    stripe: `https://checkout.stripe.com/pay/mock_${request.orderId}`,
    paystack: `https://checkout.paystack.com/mock_${request.orderId}`,
    bank_transfer: `/confirm?orderId=${request.orderId}&status=pending`,
  };
  
  return {
    redirectUrl: mockUrls[request.gateway],
    sessionId: `sess_${Date.now()}`,
  };
  
  /* Production code:
  const response = await fetch(`${API_BASE}/payments/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) throw new Error('Failed to create payment');
  return response.json();
  */
}

/**
 * Get payment status (for polling)
 */
export async function getPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock different statuses based on time
  const rand = Math.random();
  let status: PaymentStatus = 'PENDING';
  
  if (rand > 0.7) {
    status = 'SUCCEEDED';
  } else if (rand > 0.6) {
    status = 'FAILED';
  } else if (rand > 0.5) {
    status = 'REQUIRES_ACTION';
  }
  
  return {
    orderId,
    status,
    reason: status === 'FAILED' ? 'insufficient_funds' : undefined,
    remainingHoldMs: status === 'FAILED' ? 5 * 60 * 1000 : undefined,
    receiptId: status === 'SUCCEEDED' ? `RCPT-${Date.now()}` : undefined,
  };
  
  /* Production code:
  const response = await fetch(`${API_BASE}/payments/status?orderId=${orderId}`);
  if (!response.ok) throw new Error('Failed to get payment status');
  return response.json();
  */
}

/**
 * Get receipt details
 */
export async function getReceipt(receiptId: string): Promise<Receipt> {
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    receiptId,
    orderId: 'RES-2025-000123',
    unitId: 'unit-1',
    amount: 359000,
    currency: 'USD',
    paidAt: new Date().toISOString(),
    buyer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
    },
    unit: {
      code: 'A-101',
      type: '1-bed',
      floor: 1,
    },
  };
  
  /* Production code:
  const response = await fetch(`${API_BASE}/receipts/${receiptId}`);
  if (!response.ok) throw new Error('Failed to get receipt');
  return response.json();
  */
}

/**
 * Download receipt as PDF
 */
export async function downloadReceipt(_receiptId: string): Promise<Blob> {
  // TODO: Replace with actual API call
  /* Production code:
  const response = await fetch(`${API_BASE}/receipts/${receiptId}/pdf`);
  if (!response.ok) throw new Error('Failed to download receipt');
  return response.blob();
  */
  
  // Mock: return empty blob
  return new Blob(['Mock PDF content'], { type: 'application/pdf' });
}

