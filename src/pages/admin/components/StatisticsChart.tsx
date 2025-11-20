import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { authService } from '@/services/authService';

const API_BASE = ((import.meta as any).env?.VITE_API_URL as string) || '/api';

interface ChartDataPoint {
  date: string;
  registrations: number;
  visits: number;
}

interface StatisticsData {
  period: string;
  days: number;
  startDate: string;
  endDate: string;
  data: ChartDataPoint[];
  summary: {
    totalRegistrations: number;
    totalVisits: number;
    averageRegistrationsPerDay: string;
    averageVisitsPerDay: string;
  };
}

export function StatisticsChart() {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const token = authService.getToken();
        if (!token) return;

        const response = await fetch(
          `${API_BASE}/admin/statistics?period=${period}&days=${days}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
    
    // Refresh data every 30 seconds to see real-time updates
    const interval = setInterval(fetchStatistics, 30000);
    
    return () => clearInterval(interval);
  }, [period, days]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

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

  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-2xl p-8">
        <p className="text-gray-600 text-center">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Statistics Overview</h3>
        
        {/* Period selector */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Period:</label>
            <select
              value={period}
              onChange={(e) => {
                setPeriod(e.target.value as any);
                const periodDays: Record<string, number> = {
                  day: 7,
                  week: 7,
                  month: 30,
                  year: 365,
                };
                setDays(periodDays[e.target.value] || 30);
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="day">Last 7 Days</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium mb-1">Total Visits</p>
            <p className="text-2xl font-bold text-blue-800">{data.summary.totalVisits.toLocaleString()}</p>
            <p className="text-xs text-blue-600 mt-1">
              Avg: {data.summary.averageVisitsPerDay}/day
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium mb-1">New Registrations</p>
            <p className="text-2xl font-bold text-green-800">{data.summary.totalRegistrations.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">
              Avg: {data.summary.averageRegistrationsPerDay}/day
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px',
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="visits"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              name="Visits"
            />
            <Line
              type="monotone"
              dataKey="registrations"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
              name="New Registrations"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

