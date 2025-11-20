import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms';
import { authService } from '@/services/authService';
import { AdminPagination, PaginationInfo, UnitModal, ConfirmDialog } from '../components';
import { cn } from '@/lib/cn';

const API_BASE = ((import.meta as any).env?.VITE_API_URL as string) || '/api';

export function UnitsSection() {
  const [units, setUnits] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [filters, setFilters] = useState({ projectId: '', status: '', includeDeleted: false });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState<any | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    message: string;
    unitId: string;
    position: { top: number; left: number };
  } | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchUnits();
  }, [page, filters]);

  const fetchProjects = async () => {
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
    }
  };

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const token = authService.getToken();
      if (!token) return;

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(filters.projectId && { projectId: filters.projectId }),
        ...(filters.status && { status: filters.status }),
        ...(filters.includeDeleted && { includeDeleted: 'true' }),
      });

      const response = await fetch(`${API_BASE}/admin/units?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUnits(data.data || []);
        setPagination(data.pagination || {
          page: data.page || page,
          limit: data.limit || 20,
          total: data.total || 0,
          totalPages: data.totalPages || Math.ceil((data.total || 0) / 20),
        });
      }
    } catch (error) {
      console.error('Failed to fetch units:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>, unitId: string) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setConfirmDialog({
      show: true,
      message: 'Are you sure you want to mark this unit as deleted? The unit will be hidden but data will be preserved.',
      unitId,
      position: {
        top: buttonRect.bottom + 8,
        left: buttonRect.left,
      },
    });
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDialog) return;

    const { unitId } = confirmDialog;
    setConfirmDialog(null);

    try {
      const token = authService.getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE}/admin/units/${unitId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (response.ok) {
        setAlert({ message: 'Unit marked as deleted successfully', type: 'success' });
        fetchUnits();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || 'Failed to delete unit';
        setAlert({
          message: errorMessage.replace(/https?:\/\/[^\s]+/g, '').replace(/localhost[^\s]*/gi, '').trim() || 'Failed to delete unit',
          type: 'error',
        });
      }
    } catch (error: any) {
      console.error('Failed to delete unit:', error);
      const errorMessage = error?.message || 'Failed to delete unit';
      setAlert({
        message: errorMessage.replace(/https?:\/\/[^\s]+/g, '').replace(/localhost[^\s]*/gi, '').trim() || 'Failed to delete unit',
        type: 'error',
      });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDialog(null);
  };

  const handleRestore = async (unitId: string) => {
    try {
      const token = authService.getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE}/admin/units/${unitId}/restore`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (response.ok) {
        setAlert({ message: 'Unit restored successfully', type: 'success' });
        fetchUnits();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || 'Failed to restore unit';
        setAlert({
          message: errorMessage.replace(/https?:\/\/[^\s]+/g, '').replace(/localhost[^\s]*/gi, '').trim() || 'Failed to restore unit',
          type: 'error',
        });
      }
    } catch (error: any) {
      console.error('Failed to restore unit:', error);
      const errorMessage = error?.message || 'Failed to restore unit';
      setAlert({
        message: errorMessage.replace(/https?:\/\/[^\s]+/g, '').replace(/localhost[^\s]*/gi, '').trim() || 'Failed to restore unit',
        type: 'error',
      });
    }
  };

  const handleEdit = (unit: any) => {
    setEditingUnit(unit);
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setEditingUnit(null);
  };

  const handleModalSuccess = () => {
    setShowCreateModal(false);
    setEditingUnit(null);
    setAlert({ message: editingUnit ? 'Unit updated successfully' : 'Unit created successfully', type: 'success' });
    fetchUnits();
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
        <h3 className="text-xl font-semibold">Units Management</h3>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            + Create Unit
          </Button>
        </div>
      </div>

      <div className="mb-6 flex gap-2 flex-wrap">
        <select
          value={filters.projectId}
          onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Status</option>
          <option value="AVAILABLE">Available</option>
          <option value="LOCKED">Locked</option>
          <option value="RESERVED">Reserved</option>
          <option value="SOLD">Sold</option>
          <option value="UNAVAILABLE">Unavailable</option>
        </select>
        <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={filters.includeDeleted}
            onChange={(e) => setFilters({ ...filters, includeDeleted: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Show Deleted</span>
        </label>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading units...</p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deleted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {units.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No units found
                    </td>
                  </tr>
                ) : (
                  units.map((unit) => {
                    const statusColors = {
                      AVAILABLE: 'bg-green-100 text-green-800',
                      LOCKED: 'bg-yellow-100 text-yellow-800',
                      RESERVED: 'bg-blue-100 text-blue-800',
                      SOLD: 'bg-gray-100 text-gray-800',
                      UNAVAILABLE: 'bg-red-100 text-red-800',
                    };
                    const isDeleted = unit.isDeleted === true;

                    return (
                      <tr 
                        key={unit.id} 
                        className={cn(
                          'hover:bg-gray-50',
                          isDeleted && 'opacity-60 bg-gray-50'
                        )}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {unit.unitNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {unit.project?.name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{unit.unitType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${Number(unit.price).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={cn(
                              'px-2 py-1 text-xs font-semibold rounded-full',
                              statusColors[unit.status as keyof typeof statusColors] ||
                                'bg-gray-100 text-gray-800'
                            )}
                          >
                            {unit.status}
                          </span>
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
                              onClick={() => handleRestore(unit.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Restore unit"
                            >
                              Restore
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(unit)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                Edit
                              </button>
                              <button
                                onClick={(e) => handleDeleteClick(e, unit.id)}
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

      {(showCreateModal || editingUnit) && (
        <UnitModal
          unit={editingUnit}
          projects={projects}
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

