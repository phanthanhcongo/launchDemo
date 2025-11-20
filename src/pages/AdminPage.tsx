import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { AdminSidebar, AdminAlert } from './admin/components';
import {
  DashboardSection,
  UsersSection,
  ProjectsSection,
  UnitsSection,
  ReservationsSection,
  LaunchTimeSection,
  OTPSection,
  ActivityLogsSection,
} from './admin/sections';

const API_BASE = ((import.meta as any).env?.VITE_API_URL as string) || '/api';

const SECTION_INFO = {
  dashboard: { title: 'Dashboard', desc: 'Overview of your system' },
  users: { title: 'Users Management', desc: 'Manage users and their roles' },
  projects: { title: 'Projects Management', desc: 'Create and manage projects' },
  units: { title: 'Units/Villas Management', desc: 'Manage units and villas' },
  reservations: { title: 'Reservations Management', desc: 'View and manage reservations' },
  'launch-time': { title: 'Launch Time Management', desc: 'Set launch date, time, and timezone for projects' },
  otp: { title: 'OTP Monitor', desc: 'Monitor email OTPs' },
  'activity-logs': { title: 'Activity Logs', desc: 'View system activity logs' },
};

/**
 * AdminPage Component
 * 
 * Admin panel for managing users, projects, units, and reservations.
 */
export function AdminPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userInfo = await authService.getCurrentUser();
        if (userInfo.role !== 'ADMIN' && userInfo.role !== 'SUPER_ADMIN') {
          navigate('/');
          return;
        }
      } catch {
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = authService.getToken();
      if (token) {
        try {
          await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
          });
        } catch {
          // Ignore
        }
      }
    } catch {
      // Ignore
    } finally {
      authService.logout();
      navigate('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const sectionInfo = SECTION_INFO[activeSection as keyof typeof SECTION_INFO] || {
    title: 'Admin Panel',
    desc: '',
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-8 pb-4">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800">{sectionInfo.title}</h2>
            <p className="text-gray-600 mt-1">{sectionInfo.desc}</p>
          </div>

          <AdminAlert message={alert?.message || null} type={alert?.type} onClose={() => setAlert(null)} />
        </div>

        {/* Section Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          {activeSection === 'dashboard' && (
            <DashboardSection onNavigateToSection={setActiveSection} />
          )}
          {activeSection === 'users' && <UsersSection />}
          {activeSection === 'projects' && <ProjectsSection />}
          {activeSection === 'units' && <UnitsSection />}
          {activeSection === 'reservations' && <ReservationsSection />}
          {activeSection === 'launch-time' && <LaunchTimeSection />}
          {activeSection === 'otp' && <OTPSection />}
          {activeSection === 'activity-logs' && <ActivityLogsSection />}
        </div>
      </main>
    </div>
  );
}
