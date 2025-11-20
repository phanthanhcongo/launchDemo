import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon } from '@/components/ui';
import { authService } from '@/services/authService';
import { cn } from '@/lib/cn';

export interface UserMenuProps {
  className?: string;
}

/**
 * UserMenu Component
 * 
 * User icon with dropdown menu for authenticated users.
 * Shows: My Shortlist, My Profile, Admin Panel (if admin), Sign Out
 */
export function UserMenu({ className }: UserMenuProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userRole, setUserRole] = React.useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Check authentication status and user role
  React.useEffect(() => {
    const checkAuth = async () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        try {
          const user = await authService.getCurrentUser();
          // Normalize role to uppercase for consistent comparison
          const normalizedRole = user.role?.toUpperCase().trim();
          setUserRole(normalizedRole || null);
        } catch (error) {
          console.error('UserMenu - Error getting user:', error);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    };

    checkAuth();
    // Check periodically (every 30 seconds)
    const interval = setInterval(checkAuth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleMyShortlist = () => {
    setIsOpen(false);
    // TODO: Navigate to shortlist page when created
    navigate('/explore?shortlist=true');
  };

  const handleMyProfile = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  const handleAdmin = () => {
    setIsOpen(false);
    navigate('/admin');
  };

  const handleSignOut = () => {
    setIsOpen(false);
    authService.logout();
    navigate('/login');
  };

  // Check if user is admin (case-insensitive)
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

  return (
    <div ref={menuRef} className={cn('relative', className)}>
      {/* User Icon Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'p-2 rounded bg-gray-200 hover:bg-gray-300',
          'transition-colors focus-ring',
          'flex items-center justify-center',
          'w-10 h-10'
        )}
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <UserIcon size="md" className="text-gray-600" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute right-0 mt-2 w-48 bg-gray-100 rounded-lg shadow-lg',
            'border border-gray-300 overflow-hidden',
            'z-50'
          )}
        >
          <div className="py-1">
            <button
              type="button"
              onClick={handleMyShortlist}
              className={cn(
                'w-full px-4 py-2.5 text-sm text-gray-700',
                'hover:bg-gray-200 transition-colors',
                'text-center'
              )}
            >
              My Shortlist
            </button>
            <button
              type="button"
              onClick={handleMyProfile}
              className={cn(
                'w-full px-4 py-2.5 text-sm text-gray-700',
                'hover:bg-gray-200 transition-colors',
                'text-center'
              )}
            >
              My Profile
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={handleAdmin}
                className={cn(
                  'w-full px-4 py-2.5 text-sm text-gray-700',
                  'hover:bg-gray-200 transition-colors',
                  'text-center'
                )}
              >
                Admin Panel
              </button>
            )}
            <div className="border-t border-gray-300 my-1" />
            <button
              type="button"
              onClick={handleSignOut}
              className={cn(
                'w-full px-4 py-2.5 text-sm text-gray-700',
                'hover:bg-gray-200 transition-colors',
                'text-center'
              )}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

UserMenu.displayName = 'UserMenu';

