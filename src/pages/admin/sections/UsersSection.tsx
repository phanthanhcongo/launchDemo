import { useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { AdminPagination, PaginationInfo, UserModal, ConfirmDialog } from '../components';
import { cn } from '@/lib/cn';

const API_BASE = ((import.meta as any).env?.VITE_API_URL as string) || '/api';

export function UsersSection() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [filters, setFilters] = useState({ role: '', isVerified: '', includeDeleted: false });
  const [alert, setAlert] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    message: string;
    userId: string;
    userEmail: string;
    position: { top: number; left: number };
  } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [page, search, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = authService.getToken();
      if (!token) return;

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
        ...(filters.role && { role: filters.role }),
        ...(filters.isVerified && { isVerified: filters.isVerified }),
        ...(filters.includeDeleted && { includeDeleted: 'true' }),
      });

      const response = await fetch(`${API_BASE}/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
        setPagination(data.pagination || {
          page: data.page || page,
          limit: data.limit || 20,
          total: data.total || 0,
          totalPages: data.totalPages || Math.ceil((data.total || 0) / 20),
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setAlert({
          message: errorData.error?.message || errorData.message || 'Failed to load users',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setAlert({ message: 'Failed to load users', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: any) => {
    // Prevent editing ADMIN or SUPER_ADMIN users
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      setAlert({
        message: 'Cannot edit ADMIN or SUPER_ADMIN users',
        type: 'error',
      });
      return;
    }
    setEditingUser(user);
  };

  const handleModalClose = () => {
    setEditingUser(null);
  };

  const handleModalSuccess = () => {
    setEditingUser(null);
    setAlert({ message: 'User updated successfully', type: 'success' });
    fetchUsers();
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>, userId: string, userEmail: string) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
      setConfirmDialog({
      show: true,
      message: `Are you sure you want to mark user "${userEmail}" as deleted? The user will be hidden but data will be preserved.`,
      userId,
      userEmail,
      position: {
        top: buttonRect.bottom + 8,
        left: buttonRect.left,
      },
    });
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDialog) return;

    const { userId } = confirmDialog;
    setConfirmDialog(null);

    try {
      const token = authService.getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (response.ok) {
        setAlert({ message: 'User marked as deleted successfully', type: 'success' });
        fetchUsers();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || 'Failed to delete user';
        setAlert({
          message: errorMessage.replace(/https?:\/\/[^\s]+/g, '').replace(/localhost[^\s]*/gi, '').trim() || 'Failed to delete user',
          type: 'error',
        });
      }
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      const errorMessage = error?.message || 'Failed to delete user';
      setAlert({
        message: errorMessage.replace(/https?:\/\/[^\s]+/g, '').replace(/localhost[^\s]*/gi, '').trim() || 'Failed to delete user',
        type: 'error',
      });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDialog(null);
  };

  const handleRestore = async (userId: string) => {
    try {
      const token = authService.getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE}/admin/users/${userId}/restore`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (response.ok) {
        setAlert({ message: 'User restored successfully', type: 'success' });
        fetchUsers();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || 'Failed to restore user';
        setAlert({
          message: errorMessage.replace(/https?:\/\/[^\s]+/g, '').replace(/localhost[^\s]*/gi, '').trim() || 'Failed to restore user',
          type: 'error',
        });
      }
    } catch (error: any) {
      console.error('Failed to restore user:', error);
      const errorMessage = error?.message || 'Failed to restore user';
      setAlert({
        message: errorMessage.replace(/https?:\/\/[^\s]+/g, '').replace(/localhost[^\s]*/gi, '').trim() || 'Failed to restore user',
        type: 'error',
      });
    }
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

      <div className="mb-6 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">All Roles</option>
            <option value="BUYER">Buyer</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
          <select
            value={filters.isVerified}
            onChange={(e) => setFilters({ ...filters, isVerified: e.target.value })}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">All Status</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
          <label className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={filters.includeDeleted}
              onChange={(e) => setFilters({ ...filters, includeDeleted: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Show Deleted</span>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
                    const isDeleted = user.isDeleted === true;
                    return (
                      <tr 
                        key={user.id} 
                        className={cn(
                          'hover:bg-gray-50',
                          isDeleted && 'opacity-60 bg-gray-50'
                        )}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.firstName || user.lastName
                            ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                            : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.phoneNumber || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={cn(
                              'px-2 py-1 text-xs font-semibold rounded-full',
                              user.role === 'SUPER_ADMIN'
                                ? 'bg-purple-100 text-purple-800'
                                : user.role === 'ADMIN'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            )}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={cn(
                              'px-2 py-1 text-xs font-semibold rounded-full',
                              user.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            )}
                          >
                            {user.isVerified ? 'Verified' : 'Not Verified'}
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
                              onClick={() => handleRestore(user.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Restore user"
                            >
                              Restore
                            </button>
                          ) : !isAdmin ? (
                            <>
                              <button
                                onClick={() => handleEdit(user)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                                title="Edit user"
                              >
                                Edit
                              </button>
                              <button
                                onClick={(e) => handleDeleteClick(e, user.id, user.email || 'this user')}
                                className="text-red-600 hover:text-red-900 relative"
                                title="Delete user"
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
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

      {editingUser && (
        <UserModal
          user={editingUser}
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

