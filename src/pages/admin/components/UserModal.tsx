import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/atoms';
import { authService } from '@/services/authService';

const API_BASE = ((import.meta as any).env?.VITE_API_URL as string) || '/api';

export interface UserModalProps {
  user: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function UserModal({ user, onClose, onSuccess }: UserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    role: user?.role || 'BUYER',
    isVerified: user?.isVerified ?? false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = authService.getToken();
      if (!token) throw new Error('No authentication token');

      // Update role if changed
      if (formData.role !== user.role) {
        const roleResponse = await fetch(`${API_BASE}/admin/users/${user.id}/role`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ role: formData.role }),
        });

        if (!roleResponse.ok) {
          const errorData = await roleResponse.json().catch(() => ({}));
          throw new Error(errorData.error?.message || errorData.message || 'Failed to update user role');
        }
      }

      // Update status if changed
      if (formData.isVerified !== user.isVerified) {
        const statusResponse = await fetch(`${API_BASE}/admin/users/${user.id}/status`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ isVerified: formData.isVerified }),
        });

        if (!statusResponse.ok) {
          const errorData = await statusResponse.json().catch(() => ({}));
          throw new Error(errorData.error?.message || errorData.message || 'Failed to update user status');
        }
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Edit User</h3>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-6 space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Email</p>
            <p className="text-base font-medium text-gray-900">{user.email || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Name</p>
            <p className="text-base font-medium text-gray-900">
              {user.firstName || user.lastName
                ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Phone</p>
            <p className="text-base font-medium text-gray-900">{user.phoneNumber || '-'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={user.role === 'SUPER_ADMIN'}
            >
              <option value="BUYER">Buyer</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN" disabled={user.role !== 'SUPER_ADMIN'}>
                Super Admin
              </option>
            </select>
            {user.role === 'SUPER_ADMIN' && (
              <p className="mt-1 text-sm text-gray-500">Super Admin role cannot be changed</p>
            )}
          </div>

          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isVerified}
                onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-gray-700">Verified Account</span>
            </label>
            <p className="mt-1 text-sm text-gray-500">
              Verified users can access all features. Unverified users may have limited access.
            </p>
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t">
            <Button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              isLoading={loading}
              disabled={loading}
            >
              Update User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

