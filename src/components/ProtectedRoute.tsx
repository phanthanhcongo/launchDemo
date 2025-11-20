import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '@/services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireProfileComplete?: boolean;
}

const API_BASE = ((import.meta as any).env?.VITE_API_URL as string) || '/api';

/**
 * Check if user profile is complete
 */
async function checkProfileComplete(): Promise<boolean> {
  try {
    const token = authService.getToken();
    if (!token) return false;

    const response = await fetch(`${API_BASE}/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) return false;

    const profile = await response.json();
    
    // Check required fields
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

    return requiredFields.every(field => {
      const value = profile[field];
      return value !== null && value !== undefined && value !== '';
    });
  } catch {
    return false;
  }
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true,
  requireProfileComplete = false 
}: ProtectedRouteProps) {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (requireAuth) {
          const user = await authService.getCurrentUser();
          setIsAuthenticated(!!user);

          if (requireProfileComplete && user) {
            const complete = await checkProfileComplete();
            setIsProfileComplete(complete);
          } else {
            setIsProfileComplete(true); // Skip check if not required
          }
        } else {
          setIsAuthenticated(true);
          setIsProfileComplete(true);
        }
      } catch {
        setIsAuthenticated(false);
        setIsProfileComplete(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [requireAuth, requireProfileComplete]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireProfileComplete && !isProfileComplete) {
    // Redirect to profile completion page
    return <Navigate to="/profile/complete" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

