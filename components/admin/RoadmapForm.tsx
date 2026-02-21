'use client';

import { useState, useEffect } from 'react';
import { RoadmapFeature } from '../../lib/types/domain';
import { createRoadmapItem, updateRoadmapItem } from '../../lib/api/roadmap';
import Button from '../ui/Button';

interface RoadmapFormProps {
  initialData?: RoadmapFeature | null;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function RoadmapForm({ initialData, onSuccess, onError }: RoadmapFormProps) {
  const [formData, setFormData] = useState<Partial<RoadmapFeature>>({
    status: 'planned',
    priority: 'must-have'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
        setFormData({
            status: 'planned',
            priority: 'must-have'
        });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData?.id) {
        await updateRoadmapItem(initialData.id, formData);
        onSuccess(`Updated item: ${formData.title}`);
      } else {
        await createRoadmapItem(formData as any);
        onSuccess(`Created item: ${formData.title}`);
        setFormData({ status: 'planned', priority: 'must-have', title: '', description: '', category: '' });
      }
    } catch (err: any) {
      onError(err.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-black border border-gray-700 p-3 font-mono text-sm text-white focus:border-secondary outline-none transition-colors";
  const labelClass = "block text-[10px] uppercase text-gray-500 mb-1 tracking-wider";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className={labelClass}>Title</label>
            <input
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              className={inputClass}
              placeholder="FEATURE NAME"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>Category</label>
            <input
              name="category"
              value={formData.category || ''}
              onChange={handleChange}
              className={inputClass}
              placeholder="E.G. SEARCH, UI, CORE"
              required
            />
          </div>

          {/* Target Date */}
          <div>
            <label className={labelClass}>Target Date (Optional)</label>
            <input
              type="date"
              name="target_date"
              value={formData.target_date || ''}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Status */}
          <div>
            <label className={labelClass}>Status</label>
            <select
              name="status"
              value={formData.status || 'planned'}
              onChange={handleChange}
              className={inputClass}
            >
                <option value="planned">PLANNED</option>
                <option value="in-progress">IN PROGRESS</option>
                <option value="completed">COMPLETED</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className={labelClass}>Priority</label>
            <select
              name="priority"
              value={formData.priority || 'must-have'}
              onChange={handleChange}
              className={inputClass}
            >
                <option value="critical">CRITICAL</option>
                <option value="must-have">MUST HAVE</option>
                <option value="nice-to-have">NICE TO HAVE</option>
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              className={`${inputClass} h-32`}
              placeholder="DETAILS..."
              required
            />
          </div>
      </div>

      <div className="pt-4 border-t border-gray-800 flex justify-end">
        <Button variant="primary" type="submit" isLoading={loading}>
            {initialData ? 'UPDATE MISSION' : 'ADD MISSION'}
        </Button>
      </div>
    </form>
  );
}
