import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/atoms';
import { cn } from '@/lib/cn';
import { AuthLayout } from '@/components/organisms';

const API_BASE = (import.meta.env?.VITE_API_URL as string) || '/api';

/**
 * ForgotPasswordPage Component
 * 
 * Multi-step password reset flow:
 * Step 1: Request OTP
 * Step 2: Verify OTP
 * Step 3: Reset Password
 */
export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/forgot-password/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || 'An error occurred';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setSuccess(data.message || 'OTP code has been sent');
      setTimeout(() => {
        setStep(2);
        setError(null);
        setSuccess(null);
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter all 6 digits of the OTP code');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/forgot-password/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          code: otpCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || 'Invalid OTP code';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setSuccess(data.message || 'Verification successful!');
      setTimeout(() => {
        setStep(3);
        setError(null);
        setSuccess(null);
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid OTP code';
      setError(errorMessage);
      setOtpCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Password confirmation does not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/forgot-password/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          code: otpCode,
          newPassword,
          confirmPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || 'An error occurred';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setSuccess(data.message || 'Password reset successful!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/forgot-password/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!response.ok) {
        throw new Error('Unable to resend OTP code');
      }

      const data = await response.json();
      setSuccess(data.message || 'New OTP code has been sent');
      setOtpCode('');
    } catch (err) {
      setError('Unable to resend OTP code. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1f2937' }}>Forgot Password</h1>
          <p className="text-base" style={{ color: '#6b7280' }}>
            {step === 1 && 'Enter your email to reset your password'}
            {step === 2 && `OTP code has been sent to: ${email}`}
            {step === 3 && 'Enter your new password'}
          </p>
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

        {/* Step 1: Request OTP */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b4533a] focus:border-[#b4533a] outline-none transition-all placeholder-gray-400"
                style={{ color: '#1f2937' }}
                disabled={isLoading}
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
              Send OTP Code
            </Button>
          </form>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                OTP Code
              </label>
              <input
                id="otp"
                type="text"
                maxLength={6}
                required
                value={otpCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setOtpCode(value);
                }}
                placeholder="000000"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b4533a] focus:border-[#b4533a] outline-none text-center text-2xl tracking-widest transition-all"
                style={{ color: '#1f2937' }}
                disabled={isLoading}
              />
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-sm font-medium transition-colors hover:underline"
                style={{ color: '#b4533a' }}
                disabled={isLoading}
              >
                Resend OTP Code
              </button>
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
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b4533a] focus:border-[#b4533a] outline-none transition-all placeholder-gray-400"
                  style={{ color: '#1f2937' }}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#b4533a] transition-colors"
                >
                  {showNewPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b4533a] focus:border-[#b4533a] outline-none transition-all placeholder-gray-400"
                  style={{ color: '#1f2937' }}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#b4533a] transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
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
              Reset Password
            </Button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}

