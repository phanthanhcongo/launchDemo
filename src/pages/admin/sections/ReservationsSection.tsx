import { useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { AdminPagination, PaginationInfo } from '../components';
import { cn } from '@/lib/cn';

const API_BASE = ((import.meta as any).env?.VITE_API_URL as string) || '/api';

export function ReservationsSection() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [filters, setFilters] = useState({ status: '', paymentStatus: '' });
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
  const [tempStatus, setTempStatus] = useState<string>('');
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  } | null>(null);

  useEffect(() => {
    fetchReservations();
  }, [page, filters]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const token = authService.getToken();
      if (!token) return;

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(filters.status && { status: filters.status }),
        ...(filters.paymentStatus && { paymentStatus: filters.paymentStatus }),
      });

      const response = await fetch(`${API_BASE}/admin/reservations?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const reservationsData = data.data || [];
        console.log('Fetched reservations:', reservationsData.length);
        console.log('Payment statuses:', reservationsData.map((r: any) => r.paymentStatus));
        setReservations(reservationsData);
        setPagination(data.pagination || {
          page: data.page || page,
          limit: data.limit || 20,
          total: data.total || 0,
          totalPages: data.totalPages || Math.ceil((data.total || 0) / 20),
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to fetch reservations:', errorData);
      }
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEditStatus = (reservationId: string, currentStatus: string) => {
    setEditingStatusId(reservationId);
    setTempStatus(currentStatus);
  };

  const handleCancelEditStatus = () => {
    setEditingStatusId(null);
    setTempStatus('');
  };

  const handleConfirmStatusChange = (reservationId: string, newStatus: string, oldStatus: string) => {
    if (newStatus === oldStatus) {
      handleCancelEditStatus();
      return;
    }

    setConfirmDialog({
      show: true,
      message: `Are you sure you want to change status from ${oldStatus} to ${newStatus}?`,
      onConfirm: async () => {
        setConfirmDialog(null);
        setUpdatingStatusId(reservationId);
        setEditingStatusId(null);
        
        try {
          const token = authService.getToken();
          if (!token) {
            setAlert({ message: 'Authentication required', type: 'error' });
            return;
          }

          const response = await fetch(`${API_BASE}/admin/reservations/${reservationId}/status`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ status: newStatus }),
          });

          if (response.ok) {
            setAlert({ message: `Reservation status updated to ${newStatus} successfully`, type: 'success' });
            fetchReservations();
            setTimeout(() => setAlert(null), 3000);
          } else {
            const errorData = await response.json().catch(() => ({}));
            setAlert({ 
              message: errorData.message || 'Failed to update reservation status', 
              type: 'error' 
            });
            setTimeout(() => setAlert(null), 5000);
          }
        } catch (error) {
          console.error('Failed to update status:', error);
          setAlert({ 
            message: 'An error occurred while updating reservation status', 
            type: 'error' 
          });
          setTimeout(() => setAlert(null), 5000);
        } finally {
          setUpdatingStatusId(null);
        }
      },
      onCancel: () => {
        setConfirmDialog(null);
        handleCancelEditStatus();
      },
    });
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 h-full flex flex-col">
      {confirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Status Change</h3>
            <p className="text-gray-700 mb-6">{confirmDialog.message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={confirmDialog.onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {alert && (
        <div
          className={cn(
            'mb-6 p-4 rounded-lg relative',
            alert.type === 'error'
              ? 'bg-red-50 border border-red-200 text-red-800'
              : 'bg-green-50 border border-green-200 text-green-800'
          )}
        >
          <button
            onClick={() => setAlert(null)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div>{alert.message}</div>
        </div>
      )}

      <div className="mb-6 flex gap-2 flex-wrap">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="EXPIRED">Expired</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="FAILED">Failed</option>
        </select>
        <select
          value={filters.paymentStatus}
          onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Payment Status</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SUCCEEDED">Succeeded</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading reservations...</p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No reservations found
                    </td>
                  </tr>
                ) : (
                  reservations.map((reservation) => {
                    const statusColors = {
                      PENDING: 'bg-yellow-100 text-yellow-800',
                      CONFIRMED: 'bg-green-100 text-green-800',
                      EXPIRED: 'bg-gray-100 text-gray-800',
                      CANCELLED: 'bg-red-100 text-red-800',
                      FAILED: 'bg-red-100 text-red-800',
                    };

                    const paymentColors: Record<string, string> = {
                      PENDING: 'bg-yellow-100 text-yellow-800',
                      PROCESSING: 'bg-blue-100 text-blue-800',
                      SUCCEEDED: 'bg-green-100 text-green-800',
                      FAILED: 'bg-red-100 text-red-800',
                      REFUNDED: 'bg-purple-100 text-purple-800',
                    };

                    const userName = reservation.user
                      ? `${reservation.user.firstName || ''} ${reservation.user.lastName || ''}`.trim()
                      : '-';
                    const unitNumber = reservation.unit?.unitNumber || '-';
                    const depositAmount = reservation.depositAmount
                      ? Number(reservation.depositAmount).toLocaleString()
                      : '0';

                    return (
                      <tr key={reservation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {reservation.id ? reservation.id.substring(0, 8) + '...' : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{userName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{unitNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingStatusId === reservation.id ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={tempStatus}
                                onChange={(e) => setTempStatus(e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="CANCELLED">CANCELLED</option>
                                <option value="EXPIRED">EXPIRED</option>
                                <option value="FAILED">FAILED</option>
                              </select>
                              <button
                                onClick={() => handleConfirmStatusChange(reservation.id, tempStatus, reservation.status)}
                                disabled={updatingStatusId === reservation.id}
                                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                              >
                                ✓
                              </button>
                              <button
                                onClick={handleCancelEditStatus}
                                disabled={updatingStatusId === reservation.id}
                                className="px-2 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500 disabled:opacity-50"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <span
                              onClick={() => !updatingStatusId && handleStartEditStatus(reservation.id, reservation.status)}
                              className={cn(
                                'px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity',
                                statusColors[reservation.status as keyof typeof statusColors] ||
                                  'bg-gray-100 text-gray-800',
                                updatingStatusId === reservation.id && 'opacity-50 cursor-not-allowed'
                              )}
                            >
                              {reservation.status || '-'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={cn(
                              'px-2 py-1 text-xs font-semibold rounded-full',
                              reservation.paymentStatus && paymentColors[reservation.paymentStatus]
                                ? paymentColors[reservation.paymentStatus]
                                : 'bg-gray-100 text-gray-800'
                            )}
                          >
                            {reservation.paymentStatus || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${depositAmount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className="text-gray-400 text-xs">Click status to edit</span>
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
    </div>
  );
}

