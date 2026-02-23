'use client';

import { useState, useEffect } from 'react';
import { Release, RoadmapFeature } from '../../lib/types/domain';
import Button from '../ui/Button';
import { createRelease, updateRelease, fetchRoadmapItems, updateRoadmapItem } from '../../app/actions/roadmap';

interface ReleaseFormProps {
    initialData?: Release | null;
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export const ReleaseForm = ({ initialData, onSuccess, onError }: ReleaseFormProps) => {
    const [formData, setFormData] = useState<Partial<Release>>({
        version: '',
        title: '',
        description: '',
        release_date: new Date().toISOString().split('T')[0],
        is_published: false
    });

    const [availableFeatures, setAvailableFeatures] = useState<RoadmapFeature[]>([]);
    const [selectedFeatureIds, setSelectedFeatureIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                version: initialData.version,
                title: initialData.title || '',
                description: initialData.description || '',
                release_date: initialData.release_date ? new Date(initialData.release_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                is_published: initialData.is_published
            });
        }

        // Fetch completed features to assign
        fetchRoadmapItems().then(items => {
            const completed = items.filter(i => i.status === 'completed');
            setAvailableFeatures(completed);

            if (initialData) {
                // If editing, find features assigned to this release
                const assigned = completed.filter(i => i.release_id === initialData.id);
                setSelectedFeatureIds(new Set(assigned.map(i => i.id)));
            }
        });
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let releaseId = initialData?.id;

            if (initialData) {
                await updateRelease(initialData.id, formData);
            } else {
                const newRelease = await createRelease(formData as Omit<Release, 'id' | 'created_at' | 'updated_at'>);
                releaseId = newRelease.id;
            }

            // Update feature associations
            if (releaseId) {
                // 1. Assign selected
                for (const featureId of Array.from(selectedFeatureIds)) {
                     await updateRoadmapItem(featureId, { release_id: releaseId });
                }

                // 2. Unassign deselected (only if editing)
                if (initialData) {
                    const previouslyAssigned = availableFeatures.filter(i => i.release_id === initialData.id).map(i => i.id);
                    const toUnassign = previouslyAssigned.filter(id => !selectedFeatureIds.has(id));

                    for (const featureId of toUnassign) {
                        await updateRoadmapItem(featureId, { release_id: null });
                    }
                }
            }

            onSuccess(initialData ? 'RELEASE UPDATED' : 'RELEASE CREATED');
        } catch (err) {
            onError('FAILED TO SAVE RELEASE');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleFeature = (id: string) => {
        const next = new Set(selectedFeatureIds);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setSelectedFeatureIds(next);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Version Tag</label>
                    <input
                        required
                        type="text"
                        value={formData.version}
                        onChange={e => setFormData({ ...formData, version: e.target.value })}
                        className="w-full bg-black border border-gray-800 p-2 font-mono text-sm text-white focus:border-emerald-500 outline-none uppercase"
                        placeholder="e.g. 0.5.0"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Release Date</label>
                    <input
                        type="date"
                        value={formData.release_date}
                        onChange={e => setFormData({ ...formData, release_date: e.target.value })}
                        className="w-full bg-black border border-gray-800 p-2 font-mono text-sm text-white focus:border-emerald-500 outline-none uppercase"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Update Title (Optional)</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-black border border-gray-800 p-2 font-mono text-sm text-white focus:border-emerald-500 outline-none uppercase"
                    placeholder="THE UI UPDATE"
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Description / Patch Notes</label>
                <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-black border border-gray-800 p-2 font-mono text-sm text-white focus:border-emerald-500 outline-none h-32 uppercase"
                    placeholder="Brief summary of changes..."
                />
            </div>

            <div className="space-y-2">
                 <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Included Features (Completed Items)</label>
                 <div className="bg-black border border-gray-800 p-4 max-h-48 overflow-y-auto space-y-2">
                    {availableFeatures.length === 0 ? (
                        <div className="text-gray-600 text-xs font-mono">NO COMPLETED FEATURES FOUND</div>
                    ) : (
                        availableFeatures.map(feature => (
                            <label key={feature.id} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-900 p-1">
                                <input
                                    type="checkbox"
                                    checked={selectedFeatureIds.has(feature.id)}
                                    onChange={() => toggleFeature(feature.id)}
                                    className="accent-emerald-500 bg-black border-gray-700"
                                />
                                <div className="flex-1">
                                    <div className="text-xs font-mono text-gray-300 group-hover:text-white uppercase">{feature.title}</div>
                                    <div className="text-[9px] font-mono text-gray-600 flex gap-2">
                                        <span>{feature.category}</span>
                                        {feature.release_id && feature.release_id !== initialData?.id && (
                                            <span className="text-amber-500">(ASSIGNED TO OTHER RELEASE)</span>
                                        )}
                                    </div>
                                </div>
                            </label>
                        ))
                    )}
                 </div>
            </div>

            <div className="flex items-center gap-3 border-t border-gray-800 pt-4">
                <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 bg-black border-gray-700"
                />
                <label htmlFor="is_published" className="text-xs font-mono text-emerald-500 uppercase tracking-widest cursor-pointer select-none">
                    PUBLISH RELEASE IMMEDIATELY
                </label>
            </div>

            <div className="pt-4 border-t border-gray-800">
                <Button type="submit" variant="primary" disabled={loading} className="w-full">
                    {loading ? 'PROCESSING...' : (initialData ? 'SAVE CHANGES' : 'INITIATE RELEASE')}
                </Button>
            </div>
        </form>
    );
};
