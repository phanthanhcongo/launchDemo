import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/atoms';
import { authService } from '@/services/authService';

const API_BASE = (import.meta.env?.VITE_API_URL as string) || '/api';

export interface UnitModalProps {
  unit?: any;
  projects: any[];
  onClose: () => void;
  onSuccess: () => void;
}

export function UnitModal({ unit, projects, onClose, onSuccess }: UnitModalProps) {
  const isEdit = !!unit;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    projectId: unit?.projectId || projects[0]?.id || '',
    unitNumber: unit?.unitNumber || '',
    unitType: unit?.unitType || '',
    floor: unit?.floor || '',
    size: unit?.size || 0,
    bedrooms: unit?.bedrooms || 0,
    bathrooms: unit?.bathrooms || 0,
    price: unit?.price || 0,
    status: unit?.status || 'AVAILABLE',
    description: unit?.description || '',
    floorPlanUrl: unit?.floorPlanUrl || '',
    imageUrls: unit?.imageUrls?.join('\n') || '',
    xPosition: unit?.xPosition || '',
    yPosition: unit?.yPosition || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = authService.getToken();
      if (!token) throw new Error('No authentication token');

      const url = isEdit 
        ? `${API_BASE}/admin/units/${unit.id}`
        : `${API_BASE}/admin/units`;
      
      const method = isEdit ? 'PATCH' : 'POST';

      const payload: any = {
        ...formData,
        floor: formData.floor ? parseInt(formData.floor.toString()) : undefined,
        size: parseFloat(formData.size.toString()),
        bedrooms: parseInt(formData.bedrooms.toString()),
        bathrooms: parseFloat(formData.bathrooms.toString()),
        price: parseFloat(formData.price.toString()),
        xPosition: formData.xPosition ? parseInt(formData.xPosition.toString()) : undefined,
        yPosition: formData.yPosition ? parseInt(formData.yPosition.toString()) : undefined,
        imageUrls: formData.imageUrls ? formData.imageUrls.split('\n').filter((url: string) => url.trim()) : undefined,
      };

      // Remove empty optional fields
      Object.keys(payload).forEach(key => {
        if (payload[key] === '' || payload[key] === undefined) {
          delete payload[key];
        }
      });

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || errorData.message || 'Failed to save unit');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save unit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Edit Unit' : 'Create New Unit'}
          </h3>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Project <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isEdit}
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Unit Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.unitNumber}
                onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Unit Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.unitType}
                onChange={(e) => setFormData({ ...formData, unitType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 1BR, 2BR, 3BR"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Floor
              </label>
              <input
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Size (sqm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Bedrooms <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Bathrooms <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                required
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="AVAILABLE">Available</option>
                <option value="LOCKED">Locked</option>
                <option value="RESERVED">Reserved</option>
                <option value="SOLD">Sold</option>
                <option value="UNAVAILABLE">Unavailable</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                X Position
              </label>
              <input
                type="number"
                value={formData.xPosition}
                onChange={(e) => setFormData({ ...formData, xPosition: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Y Position
              </label>
              <input
                type="number"
                value={formData.yPosition}
                onChange={(e) => setFormData({ ...formData, yPosition: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Floor Plan URL
            </label>
            <input
              type="url"
              value={formData.floorPlanUrl}
              onChange={(e) => setFormData({ ...formData, floorPlanUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Image URLs (one per line)
            </label>
            <textarea
              value={formData.imageUrls}
              onChange={(e) => setFormData({ ...formData, imageUrls: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            />
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
              {isEdit ? 'Update Unit' : 'Create Unit'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

