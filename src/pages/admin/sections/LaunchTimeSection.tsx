import { useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { cn } from '@/lib/cn';

const API_BASE = ((import.meta as any).env?.VITE_API_URL as string) || '/api';

export function LaunchTimeSection() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [formData, setFormData] = useState({
    launchDate: '',
    launchTime: '',
    timezone: 'UTC',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = authService.getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE}/admin/projects?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setAlert({ message: 'Failed to load projects', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    // Format date for input (YYYY-MM-DD)
    const launchDate = project.launchDate 
      ? new Date(project.launchDate).toISOString().split('T')[0]
      : '';
    
    setFormData({
      launchDate,
      launchTime: project.launchTime || '',
      timezone: project.timezone || 'UTC',
    });
  };

  const handleCancel = () => {
    setEditingProject(null);
    setFormData({ launchDate: '', launchTime: '', timezone: 'UTC' });
  };

  const handleSave = async () => {
    if (!editingProject) return;

    try {
      const token = authService.getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE}/admin/projects/${editingProject.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          launchDate: formData.launchDate,
          launchTime: formData.launchTime,
          timezone: formData.timezone,
        }),
      });

      if (response.ok) {
        setAlert({ message: 'Launch time updated successfully', type: 'success' });
        setEditingProject(null);
        setFormData({ launchDate: '', launchTime: '', timezone: 'UTC' });
        fetchProjects();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || 'Failed to update launch time';
        setAlert({
          message: errorMessage.replace(/https?:\/\/[^\s]+/g, '').replace(/localhost[^\s]*/gi, '').trim() || 'Failed to update launch time',
          type: 'error',
        });
      }
    } catch (error: any) {
      console.error('Failed to update launch time:', error);
      const errorMessage = error?.message || 'Failed to update launch time';
      setAlert({
        message: errorMessage.replace(/https?:\/\/[^\s]+/g, '').replace(/localhost[^\s]*/gi, '').trim() || 'Failed to update launch time',
        type: 'error',
      });
    }
  };

  const formatDateTime = (date: string, time: string, timezone: string) => {
    if (!date) return '-';
    try {
      const dateTime = new Date(`${date}T${time || '00:00'}`);
      return dateTime.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: timezone,
        timeZoneName: 'short',
      });
    } catch {
      return `${date} ${time || ''} (${timezone})`;
    }
  };

  const commonTimezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Dubai',
    'Asia/Singapore',
    'Asia/Hong_Kong',
    'Asia/Tokyo',
    'Australia/Sydney',
  ];

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 h-full flex flex-col">
      {alert && (
        <div
          className={cn(
            'mb-6 p-4 rounded-lg',
            alert.type === 'error'
              ? 'bg-red-50 border border-red-200 text-red-800'
              : 'bg-green-50 border border-green-200 text-green-800'
          )}
        >
          {alert.message}
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold">Launch Time Management</h3>
        <p className="text-sm text-gray-600 mt-1">Set launch date, time, and timezone for projects</p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Launch Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Launch Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timezone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Formatted DateTime</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No projects found
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => {
                    const isEditing = editingProject?.id === project.id;
                    const launchDate = project.launchDate 
                      ? new Date(project.launchDate).toISOString().split('T')[0]
                      : '';

                    return (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {project.name}
                        </td>
                        {isEditing ? (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="date"
                                value={formData.launchDate}
                                onChange={(e) => setFormData({ ...formData, launchDate: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="time"
                                value={formData.launchTime}
                                onChange={(e) => setFormData({ ...formData, launchTime: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={formData.timezone}
                                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              >
                                {commonTimezones.map((tz) => (
                                  <option key={tz} value={tz}>
                                    {tz}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formData.launchDate 
                                ? formatDateTime(formData.launchDate, formData.launchTime, formData.timezone)
                                : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={handleSave}
                                className="text-green-600 hover:text-green-900 mr-3"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancel}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                Cancel
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {launchDate || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {project.launchTime || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {project.timezone || 'UTC'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDateTime(launchDate, project.launchTime || '', project.timezone || 'UTC')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleEdit(project)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Edit
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

