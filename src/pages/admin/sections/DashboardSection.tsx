import { useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { cn } from '@/lib/cn';
import { StatisticsChart } from '../components/StatisticsChart';

const API_BASE = ((import.meta as any).env?.VITE_API_URL as string) || '/api';

export interface DashboardSectionProps {
  onNavigateToSection: (section: string) => void;
}

export function DashboardSection({ onNavigateToSection }: DashboardSectionProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = authService.getToken();
        if (!token) return;

        const [usersRes, projectsRes, unitsRes, reservationsRes] = await Promise.all([
          fetch(`${API_BASE}/admin/users?limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include',
          }).catch(() => ({ json: async () => ({ pagination: { total: 0 } }) })),
          fetch(`${API_BASE}/admin/projects?limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include',
          }).catch(() => ({ json: async () => ({ pagination: { total: 0 } }) })),
          fetch(`${API_BASE}/admin/units?limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include',
          }).catch(() => ({ json: async () => ({ pagination: { total: 0 } }) })),
          fetch(`${API_BASE}/admin/reservations?status=CONFIRMED&limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include',
          }).catch(() => ({ json: async () => ({ pagination: { total: 0 } }) })),
        ]);

        const [usersData, projectsData, unitsData, reservationsData] = await Promise.all([
          usersRes.json(),
          projectsRes.json(),
          unitsRes.json(),
          reservationsRes.json(),
        ]);

        setStats({
          totalUsers: usersData.pagination?.total || usersData.total || 0,
          totalProjects: projectsData.pagination?.total || projectsData.total || 0,
          totalUnits: unitsData.pagination?.total || unitsData.total || 0,
          totalReservations: reservationsData.pagination?.total || reservationsData.total || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-2xl p-8">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, borderColor: 'border-l-blue-500' },
    { label: 'Total Projects', value: stats?.totalProjects || 0, borderColor: 'border-l-green-500' },
    { label: 'Total Units', value: stats?.totalUnits || 0, borderColor: 'border-l-purple-500' },
    { label: 'Active Reservations', value: stats?.totalReservations || 0, borderColor: 'border-l-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={cn('bg-white shadow-lg rounded-2xl p-6 border-l-4', card.borderColor)}
          >
            <p className="text-sm text-gray-600 mb-2">{card.label}</p>
            <p className="text-3xl font-bold text-gray-800">{card.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <StatisticsChart />

      <div className="bg-white shadow-lg rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigateToSection('users')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition text-center"
          >
            <p className="font-semibold text-gray-800">Manage Users</p>
            <p className="text-sm text-gray-600 mt-1">View and edit user accounts</p>
          </button>
          <button
            onClick={() => onNavigateToSection('projects')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 transition text-center"
          >
            <p className="font-semibold text-gray-800">Manage Projects</p>
            <p className="text-sm text-gray-600 mt-1">Create and edit projects</p>
          </button>
          <button
            onClick={() => onNavigateToSection('reservations')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 transition text-center"
          >
            <p className="font-semibold text-gray-800">View Reservations</p>
            <p className="text-sm text-gray-600 mt-1">Monitor all reservations</p>
          </button>
        </div>
      </div>
    </div>
  );
}

