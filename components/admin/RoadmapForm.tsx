'use client';

import { useState, useEffect } from 'react';
import { RoadmapFeature } from '../../lib/types/domain';
import { createRoadmapItem, updateRoadmapItem } from '../../app/actions/roadmap';
import { Calendar, ChevronDown, AlignLeft } from 'lucide-react';

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
        priority: 'must-have',
        title: '',
        description: '',
        category: '',
        target_date: ''
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
        onSuccess(initialData ? 'MISSION UPDATED' : 'MISSION INITIATED');
      } else {
        await createRoadmapItem(formData as any);
        onSuccess('MISSION INITIATED');
        setFormData({ status: 'planned', priority: 'must-have', title: '', description: '', category: '', target_date: '' });
      }
    } catch (err: any) {
      onError(err.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  // Base input styles mimicking the screenshot
  const inputClass = "w-full bg-black border border-white/20 p-3 pl-4 font-mono text-sm text-white focus:border-white outline-none transition-colors placeholder:text-white/30 tracking-wider h-12 rounded-none";
  const labelClass = "block text-[10px] uppercase text-zinc-500 mb-1.5 tracking-widest font-mono ml-1";
  const selectClass = "w-full bg-black border border-white/20 p-3 pl-4 font-mono text-sm text-white focus:border-white outline-none transition-colors appearance-none tracking-wider h-12 uppercase rounded-none cursor-pointer";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">

        {/* Title - Full Width */}
        <div className="md:col-span-2">
          <label className={labelClass}>TITLE</label>
          <div className="relative">
            <input
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              className={inputClass}
              placeholder="FEATURE NAME"
              required
              autoComplete="off"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none">
              <AlignLeft size={16} />
            </div>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className={labelClass}>CATEGORY</label>
          <input
            name="category"
            value={formData.category || ''}
            onChange={handleChange}
            className={inputClass}
            placeholder="E.G. SEARCH, UI, CORE"
            required
            autoComplete="off"
          />
        </div>

        {/* Target Date */}
        <div>
          <label className={labelClass}>TARGET DATE (OPTIONAL)</label>
          <div className="relative">
            <input
              type="date"
              name="target_date"
              value={formData.target_date ? new Date(formData.target_date).toISOString().split('T')[0] : ''}
              onChange={handleChange}
              className={inputClass}
              placeholder="mm / dd / yyyy"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none">
              <Calendar size={16} />
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className={labelClass}>STATUS</label>
          <div className="relative">
            <select
              name="status"
              value={formData.status || 'planned'}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="planned">⇅ PLANNED</option>
              <option value="in-progress">⇅ IN PROGRESS</option>
              <option value="completed">⇅ COMPLETED</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className={labelClass}>PRIORITY</label>
          <div className="relative">
             <select
              name="priority"
              value={formData.priority || 'must-have'}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="critical">⇅ CRITICAL</option>
              <option value="must-have">⇅ MUST HAVE</option>
              <option value="nice-to-have">⇅ NICE TO HAVE</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* Description - Full Width */}
        <div className="md:col-span-2">
          <label className={labelClass}>DESCRIPTION</label>
          <div className="relative">
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              className={`${inputClass} h-32 resize-none pt-3`}
              placeholder="DETAILS..."
              required
            />
             {/* Decorative corner accent for text area */}
            <div className="absolute bottom-2 right-2 w-2 h-2 border-r border-b border-white/20 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-6 mt-2 border-t border-white/10 flex justify-end">
        <button
            type="submit"
            disabled={loading}
            className="bg-black border border-white text-white hover:bg-white hover:text-black font-mono tracking-widest px-8 py-3 text-xs uppercase transition-colors"
        >
          {loading ? 'PROCESSING...' : (initialData ? 'UPDATE MISSION' : 'ADD MISSION')}
        </button>
      </div>
    </form>
  );
}
