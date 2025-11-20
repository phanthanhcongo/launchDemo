import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/atoms';
import { authService } from '@/services/authService';
import { cn } from '@/lib/cn';
import { EnvelopeIcon } from '@/components/ui';
import { AuthLayout } from '@/components/organisms';
import { visitTrackingService, VisitAction } from '@/services/visitTrackingService';

const API_BASE = (import.meta.env?.VITE_API_URL as string) || '/api';

/**
 * LoginPage Component
 * 
 * Authentication page with split layout: image/branding left, form right.
 * Uses brand colors: #b4533a, #fff7ed, #cbb89d
 */
export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getToken();
      const expiresAt = authService.getSessionExpires();

      if (token && expiresAt) {
        const expires = new Date(expiresAt);
        const now = new Date();

        if (expires <= now) {
          try {
            await authService.refreshToken();
            await authService.getCurrentUser();
            navigate('/explore');
            return;
          } catch {
            // Refresh failed, continue to login
          }
        } else {
          try {
            await authService.getCurrentUser();
            navigate('/explore');
            return;
          } catch {
            // Session invalid, continue to login
          }
        }
      }

      const savedEmail = authService.getSavedEmail();
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter all required information');
      return;
    }

    setIsLoading(true);

    try {
      await authService.login({ email: email.trim(), password });

      // Log login action
      visitTrackingService.logVisit({
        action: VisitAction.LOGIN,
        metadata: { email: email.trim() },
      });

      if (rememberMe) {
        authService.saveEmail(email.trim());
      } else {
        authService.clearSavedEmail();
      }

      setSuccess('Login successful!');
      
      // Check profile completion and redirect accordingly
      setTimeout(async () => {
        try {
          const token = authService.getToken();
          if (token) {
            const response = await fetch(`${API_BASE}/users/profile`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
              credentials: 'include',
            });

            if (response.ok) {
              const profile = await response.json();
              const requiredFields = [
                'firstName',
                'lastName',
                'phoneNumber',
                'dateOfBirth',
                'gender',
                'address',
                'city',
                'country',
              ];

              const isComplete = requiredFields.every(field => {
                const value = profile[field];
                return value !== null && value !== undefined && value !== '';
              });

              // Get return URL from location state
              const from = (location.state as any)?.from?.pathname;
              
              if (isComplete) {
                // Profile complete, go to explore or return URL
                navigate(from || '/explore');
              } else {
                // Profile incomplete, go to completion page
                navigate('/profile/complete', { state: { from: { pathname: from || '/explore' } } });
              }
            } else {
              // If can't load profile, go to completion page
              navigate('/profile/complete');
            }
          } else {
            navigate('/');
          }
        } catch {
          // On error, go to home
          navigate('/');
        }
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      
      if (errorMessage === 'ACCOUNT_NOT_VERIFIED') {
        navigate(`/verify?email=${encodeURIComponent(email)}`);
        return;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2" style={{ color: '#1f2937' }}>
                Sign In
              </h1>
              <p className="text-lg" style={{ color: '#6b7280' }}>
                Sign In to view the Price List & Plans
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <EnvelopeIcon size="sm" className="text-gray-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b4533a] focus:border-[#b4533a] outline-none transition-all placeholder-gray-400"
                    style={{ color: '#1f2937' }}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b4533a] focus:border-[#b4533a] outline-none transition-all placeholder-gray-400"
                    style={{ color: '#1f2937' }}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#b4533a] focus:outline-none transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
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

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-2 border-gray-300 text-[#b4533a] focus:ring-2 focus:ring-[#b4533a] focus:ring-offset-0 w-4 h-4"
                    disabled={isLoading}
                  />
                  <span style={{ color: '#6b7280' }} className="font-medium">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="hover:underline font-medium transition-colors"
                  style={{ color: '#b4533a' }}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
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
                Sign In
              </Button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 space-y-3">
              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-sm hover:underline font-medium transition-colors"
                  style={{ color: '#6b7280' }}
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="text-center text-sm" style={{ color: '#6b7280' }}>
                Need an account?{' '}
                <Link
                  to="/register"
                  className="underline font-semibold transition-colors hover:text-[#b4533a]"
                  style={{ color: '#b4533a' }}
                >
                  Register
                </Link>
              </div>
            </div>
      </div>
    </AuthLayout>
  );
}

