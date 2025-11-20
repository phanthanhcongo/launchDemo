import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/atoms';
import { cn } from '@/lib/cn';
import { AuthLayout } from '@/components/organisms';

const API_BASE = (import.meta.env?.VITE_API_URL as string) || '/api';

/**
 * VerifyPage Component
 * 
 * OTP verification page for account activation.
 */
export function VerifyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email) {
      setError('Invalid email. Please register again.');
      setTimeout(() => {
        navigate('/register');
      }, 2000);
      return;
    }

    // Auto send OTP on mount
    autoSendOtp();
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const autoSendOtp = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.otpExpiresAt) {
          localStorage.setItem(`otp_expires_${email}`, data.otpExpiresAt);
        }
        setCountdown(60);
        setCanResend(false);
      }
    } catch (err) {
      console.error('Auto send OTP failed:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!otp || otp.length !== 6) {
      setError('Please enter all 6 digits of the OTP code');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: otp,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || 'Invalid OTP code';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setSuccess(data.message || 'Verification successful!');

      // Clear OTP expiration
      localStorage.removeItem(`otp_expires_${email}`);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid OTP code';
      setError(errorMessage);
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Unable to resend OTP code');
      }

      const data = await response.json();
      setSuccess(data.message || 'New OTP code has been sent to your email');

      if (data.otpExpiresAt) {
        localStorage.setItem(`otp_expires_${email}`, data.otpExpiresAt);
      }

      setOtp('');
      setCountdown(60);
      setCanResend(false);
    } catch (err) {
      setError('Unable to resend OTP code. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1f2937' }}>Verify OTP</h1>
          <p className="text-base mb-2" style={{ color: '#6b7280' }}>Enter the 6-digit code sent to you</p>
          <p className="text-sm font-medium" style={{ color: '#9ca3af' }}>Email: {email}</p>
        </div>

        {/* Alert */}
        {(error || success) && (
          <div
            className={cn(
              'mb-6 p-4 rounded-lg text-sm',
              error ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
            )}
          >
            {error || success}
          </div>
        )}

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
              OTP Code
            </label>
            <input
              id="otp"
              type="text"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setOtp(value);
                setError(null);
              }}
              placeholder="000000"
              className="w-full px-4 py-3 text-center text-2xl tracking-widest font-medium border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b4533a] focus:border-[#b4533a] outline-none transition-all"
              style={{ color: '#1f2937' }}
              disabled={isLoading}
              autoFocus
            />
          </div>

          <Button
            type="submit"
            className="w-full py-3.5 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            style={{ backgroundColor: '#b4533a' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#9a4530';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#b4533a';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Verify
          </Button>

          <Button
            type="button"
            onClick={handleResendOtp}
            className="w-full py-3 border-2 rounded-lg font-semibold transition-all"
            style={{ 
              backgroundColor: canResend ? '#cbb89d' : '#f3f4f6',
              color: canResend ? '#1f2937' : '#9ca3af',
              borderColor: canResend ? '#cbb89d' : '#e5e7eb'
            }}
            disabled={!canResend || isLoading}
          >
            {canResend ? 'Resend OTP Code' : `Resend OTP Code (${countdown}s)`}
          </Button>

          {/* Countdown Timer */}
          {countdown > 0 && (
            <div className="text-center">
              <p className="text-sm" style={{ color: '#6b7280' }}>
                OTP expires in: <span className="font-semibold" style={{ color: '#b4533a' }}>
                  {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                </span>
              </p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm" style={{ color: '#6b7280' }}>
          <p>
            Already have an account? <Link to="/login" className="underline font-semibold transition-colors hover:text-[#b4533a]" style={{ color: '#b4533a' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

