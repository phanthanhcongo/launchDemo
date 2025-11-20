import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms';
import { authService } from '@/services/authService';
import { AdminPagination, PaginationInfo, ProjectModal, ConfirmDialog } from '../components';
import { cn } from '@/lib/cn';

const API_BASE = (import.meta.env?.VITE_API_URL as string) || '/api';

export function ProjectsSection() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    message: string;
    projectId: string;
    position: { top: number; left: number };
  } | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [page, search, includeDeleted]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = authService.getToken();
      if (!token) return;

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
        ...(includeDeleted && { includeDeleted: 'true' }),
      });

      const response = await fetch(`${API_BASE}/admin/projects?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);
        setPagination(data.pagination || {
          page: data.page || page,
          limit: data.limit || 20,
          total: data.total || 0,
          totalPages: data.totalPages || Math.ceil((data.total || 0) / 20),
        });
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>, projectId: string) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setConfirmDialog({
      show: true,
      message: 'Are you sure you want to mark this project as deleted? This will also delete all related units, reservations, and shortlists. Active reservations will be cancelled, and paid reservations will be marked for refund. All data will be preserved and can be restored later. Note: Actual refunds must be processed separately via payment gateway.',
      projectId,
      position: {
        top: buttonRect.bottom + 8,
        left: buttonRect.left,
      },
    });
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDialog) return;

    const { projectId } = confirmDialog;
    setConfirmDialog(null);

    try {
      const token = authService.getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE}/admin/projects/${projectId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (response.ok) {
        setAlert({ message: 'Project marked as deleted successfully', type: 'success' });
        fetchProjects();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || 'Failed to delete project';
        setAlert({
          message: errorMessage.replace(/https?:\/\/[^\s]+/g, '').replace(/localhost[^\s]*/gi, '').trim() || 'Failed to delete project',
          type: 'error',
        });
      }
    } catch (error: any) {
      console.error('Failed to delete project:', error);
      const errorMessage = error?.message || 'Failed to delete project';
      setAlert({
        message: errorMessage.replace(/https?:\/\/[^\s]+/g, '').replace(/localhost[^\s]*/gi, '').trim() || 'Failed to delete project',
        type: 'error',
      });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDialog(null);
  };

  const handleRestore = async (projectId: string) => {
    try {
      const token = authService.getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE}/admin/projects/${projectId}/restore`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (response.ok) {
        setAlert({ message: 'Project restored successfully', type: 'success' });
        fetchProjects();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || 'Failed to restore project';
        setAlert({
          message: errorMessage.replace(/https?:\/\/[^\s]+/g, '').replace(/localhost[^\s]*/gi, '').trim() || 'Failed to restore project',
          type: 'error',
        });
      }
    } catch (error: any) {
      console.error('Failed to restore project:', error);
      const errorMessage = error?.message || 'Failed to restore project';
      setAlert({
        message: errorMessage.replace(/https?:\/\/[^\s]+/g, '').replace(/localhost[^\s]*/gi, '').trim() || 'Failed to restore project',
        type: 'error',
      });
    }
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setEditingProject(null);
  };

  const handleModalSuccess = () => {
    setShowCreateModal(false);
    setEditingProject(null);
    setAlert({ message: editingProject ? 'Project updated successfully' : 'Project created successfully', type: 'success' });
    fetchProjects();
  };

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

      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <h3 className="text-xl font-semibold">Projects Management</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={includeDeleted}
              onChange={(e) => setIncludeDeleted(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Show Deleted</span>
          </label>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            + Create Project
          </Button>
        </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Launch Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Units</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deleted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No projects found
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => {
                    const statusColors = {
                      UPCOMING: 'bg-yellow-100 text-yellow-800',
                      LIVE: 'bg-green-100 text-green-800',
                      CLOSED: 'bg-gray-100 text-gray-800',
                    };
                    const isDeleted = project.isDeleted === true;

                    return (
                      <tr 
                        key={project.id} 
                        className={cn(
                          'hover:bg-gray-50',
                          isDeleted && 'opacity-60 bg-gray-50'
                        )}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {project.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.slug}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={cn(
                              'px-2 py-1 text-xs font-semibold rounded-full',
                              statusColors[project.status as keyof typeof statusColors] ||
                                'bg-gray-100 text-gray-800'
                            )}
                          >
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(project.launchDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project._count?.units || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={cn(
                              'px-2 py-1 text-xs font-semibold rounded-full',
                              isDeleted ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-800'
                            )}
                          >
                            {isDeleted ? 'Deleted' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {isDeleted ? (
                            <button
                              onClick={() => handleRestore(project.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Restore project"
                            >
                              Restore
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(project)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                Edit
                              </button>
                              <button
                                onClick={(e) => handleDeleteClick(e, project.id)}
                                className="text-red-600 hover:text-red-900 relative"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {pagination && (
            <AdminPagination pagination={pagination} onPageChange={(newPage) => setPage(newPage)} />
          )}
        </>
      )}

      {(showCreateModal || editingProject) && (
        <ProjectModal
          project={editingProject}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}

      {confirmDialog?.show && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          position={confirmDialog.position}
        />
      )}
    </div>
  );
}

