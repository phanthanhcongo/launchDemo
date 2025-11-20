import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/atoms';
import { cn } from '@/lib/cn';
import { AuthLayout } from '@/components/organisms';

const API_BASE = (import.meta.env?.VITE_API_URL as string) || '/api';

/**
 * RegisterPage Component
 * 
 * User registration page with email and password.
 */
type InterestOption = 'buying_to_live' | 'buying_as_investment' | 'buying_for_holiday' | 'not_a_buyer';

const INTEREST_OPTIONS: { value: InterestOption; label: string }[] = [
  { value: 'buying_to_live', label: 'Buying to live' },
  { value: 'buying_as_investment', label: 'Buying as an investment' },
  { value: 'buying_for_holiday', label: 'Buying for a holiday apartment' },
  { value: 'not_a_buyer', label: 'Not a buyer - just curious' },
];

export function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [interest, setInterest] = useState<InterestOption | ''>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setError('Please enter your email');
      return false;
    }

    if (!password) {
      setError('Please enter your password');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Password confirmation does not match');
      return false;
    }

    if (!interest) {
      setError('Please select your interest');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim(),
          password,
          confirmPassword,
          interest,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || 'Registration failed';
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Save OTP expiration time to localStorage
      if (data.otpExpiresAt) {
        localStorage.setItem(`otp_expires_${email}`, data.otpExpiresAt);
      }

      const message = data.isNewUser !== undefined
        ? (data.isNewUser
          ? 'Registration successful! Redirecting...'
          : 'New OTP code has been sent. Redirecting...')
        : 'Registration successful! Redirecting...';

      setSuccess(message);

      // Redirect after 1 second
      setTimeout(() => {
        navigate(`/verify?email=${encodeURIComponent(email)}`);
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1f2937' }}>Register</h1>
          <p className="text-base" style={{ color: '#6b7280' }}>Create an account to continue</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b4533a] focus:border-[#b4533a] outline-none transition-all placeholder-gray-400"
              style={{ color: '#1f2937' }}
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b4533a] focus:border-[#b4533a] outline-none transition-all placeholder-gray-400"
              style={{ color: '#1f2937' }}
              disabled={isLoading}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b4533a] focus:border-[#b4533a] outline-none transition-all placeholder-gray-400"
              style={{ color: '#1f2937' }}
              disabled={isLoading}
            />
          </div>

          {/* Interest Dropdown */}
          <div className="relative">
            <label htmlFor="interest" className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
              I am interested in
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={cn(
                  'w-full px-4 py-3 text-left border-2 rounded-lg focus:ring-2 focus:ring-[#b4533a] focus:border-[#b4533a] outline-none transition-all flex items-center justify-between',
                  interest ? 'border-gray-200' : 'border-gray-200',
                  isDropdownOpen && 'border-[#b4533a] ring-2 ring-[#b4533a]'
                )}
                style={{ 
                  color: interest ? '#1f2937' : '#9ca3af',
                  backgroundColor: '#ffffff'
                }}
                disabled={isLoading}
              >
                <span>
                  {interest 
                    ? INTEREST_OPTIONS.find(opt => opt.value === interest)?.label 
                    : 'Select an option'}
                </span>
                <svg
                  className={cn(
                    'w-5 h-5 transition-transform',
                    isDropdownOpen && 'transform rotate-180'
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    {INTEREST_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setInterest(option.value);
                          setIsDropdownOpen(false);
                          setError(null);
                        }}
                        className={cn(
                          'w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors',
                          interest === option.value && 'bg-gray-100'
                        )}
                        style={{ color: '#1f2937' }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Register button */}
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
            Register
          </Button>
        </form>

        {/* Extra links */}
        <div className="mt-8 text-center text-sm" style={{ color: '#6b7280' }}>
          <p>
            Already have an account?{' '}
            <Link to="/login" className="underline font-semibold transition-colors hover:text-[#b4533a]" style={{ color: '#b4533a' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

