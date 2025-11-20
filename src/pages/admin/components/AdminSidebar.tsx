import { Link } from 'react-router-dom';
import { Button } from '@/components/atoms';
import { cn } from '@/lib/cn';

export interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

const sections = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'projects', label: 'Projects', icon: '🏢' },
  { id: 'units', label: 'Units/Villas', icon: '🏠' },
  { id: 'reservations', label: 'Reservations', icon: '📋' },
  { id: 'launch-time', label: 'Launch Time', icon: '⏰' },
  { id: 'otp', label: 'OTP Monitor', icon: '🔐' },
  { id: 'activity-logs', label: 'Activity Logs', icon: '📝' },
];

export function AdminSidebar({ activeSection, onSectionChange, onLogout }: AdminSidebarProps) {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">LaunchBase</h1>
        <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={cn(
              'w-full text-left px-4 py-3 rounded-lg transition cursor-pointer',
              'hover:bg-gray-800',
              activeSection === section.id ? 'bg-gray-800' : ''
            )}
          >
            <span className="flex items-center">
              <span className="mr-3">{section.icon}</span>
              {section.label}
            </span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-2">
        <Link
          to="/"
          className="block w-full px-4 py-2 text-center bg-gray-800 hover:bg-gray-700 rounded-lg transition text-sm"
        >
          Back to Dashboard
        </Link>
        <Button
          onClick={onLogout}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}

