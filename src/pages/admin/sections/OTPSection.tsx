import { useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { cn } from '@/lib/cn';

const API_BASE = ((import.meta as any).env?.VITE_API_URL as string) || '/api';

export function OTPSection() {
  const [emailOtps, setEmailOtps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailSearch, setEmailSearch] = useState('');

  useEffect(() => {
    fetchOTPs();
  }, [emailSearch]);

  const fetchOTPs = async () => {
    setLoading(true);
    try {
      const token = authService.getToken();
      if (!token) return;

      const params = new URLSearchParams({ limit: '20' });
      if (emailSearch) params.append('email', emailSearch);

      const response = await fetch(`${API_BASE}/admin/email-otps?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setEmailOtps(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch OTPs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white rounded-lg shadow flex flex-col h-full">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold">Email OTP Monitor</h3>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by email..."
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Code</th>
                  <th className="px-4 py-2 text-left">Verified</th>
                  <th className="px-4 py-2 text-left">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : emailOtps.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                      No email OTPs found
                    </td>
                  </tr>
                ) : (
                  emailOtps.map((otp) => (
                    <tr key={otp.id}>
                      <td className="px-4 py-2 text-sm">{otp.email}</td>
                      <td className="px-4 py-2 text-sm font-mono">{otp.code}</td>
                      <td className="px-4 py-2">
                        <span
                          className={cn(
                            'px-2 py-1 text-xs rounded-full',
                            otp.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          )}
                        >
                          {otp.verified ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {new Date(otp.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

