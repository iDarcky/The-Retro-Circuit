'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RoadmapFeature } from '@/lib/types';
import Button from '@/components/ui/Button';
import { RoadmapForm } from '@/components/admin/RoadmapForm';
import Modal from '@/components/ui/Modal';
import { deleteRoadmapItem, updateRoadmapItem } from '@/app/actions';

interface RoadmapClientProps {
    initialRoadmap: RoadmapFeature[];
}

export default function RoadmapClient({ initialRoadmap }: RoadmapClientProps) {
    const router = useRouter();
    const [roadmap, setRoadmap] = useState(initialRoadmap);
    const [filter, setFilter] = useState<'ALL' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFeature, setEditingFeature] = useState<RoadmapFeature | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        setRoadmap(initialRoadmap);
    }, [initialRoadmap]);

    const filteredRoadmap = roadmap.filter(item => {
        if (filter === 'ALL') return true;
        return item.status.toUpperCase().replace('-', '_') === filter;
    });

    const handleOpenCreate = () => {
        setEditingFeature(null);
        setErrorMsg(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (item: RoadmapFeature) => {
        setEditingFeature(item);
        setErrorMsg(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('DELETE MISSION? THIS ACTION CANNOT BE UNDONE.')) {
            await deleteRoadmapItem(id);
            router.refresh();
        }
    };

    const handleComplete = async (item: RoadmapFeature) => {
        if (confirm(`MARK "${item.title}" AS COMPLETED?`)) {
            await updateRoadmapItem(item.id, {
                status: 'completed',
                target_date: new Date().toISOString()
            });
            router.refresh();
        }
    };

    const handleSuccess = (_msg: string) => {
        setIsModalOpen(false);
        router.refresh();
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b-2 border-border-normal pb-6 gap-4">
                <div>
                    <h1 className="text-4xl md:text-6xl font-pixel text-secondary mb-2 drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                        MISSION CONTROL
                    </h1>
                    <div className="flex gap-4">
                        <Link href="/admin" className="font-mono text-xs text-gray-500 hover:text-white hover:underline">
                            &lt; ROOT TERMINAL
                        </Link>
                        <p className="font-mono text-xs text-gray-500 tracking-widest">
                            // TOTAL MISSIONS: {roadmap.length}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="secondary" className="text-xs" onClick={handleOpenCreate}>
                         + NEW MISSION
                    </Button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2 mb-6 border-b border-border-subtle pb-4">
                {['ALL', 'PLANNED', 'IN_PROGRESS', 'COMPLETED'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`font-mono text-xs px-3 py-1 border transition-colors ${
                            filter === f
                            ? 'bg-secondary text-black border-secondary font-bold'
                            : 'bg-black text-gray-500 border-gray-800 hover:text-white hover:border-gray-600'
                        }`}
                    >
                        {f.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="grid gap-2">
                {filteredRoadmap.map((item) => (
                    <div
                        key={item.id}
                        className={`bg-bg-secondary border border-border-normal p-4 flex flex-col md:flex-row justify-between items-start md:items-center group hover:border-white transition-colors ${item.status === 'completed' ? 'opacity-50 hover:opacity-100' : ''}`}
                    >
                        <div className="flex items-center gap-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider min-w-[100px] text-center ${
                                item.status === 'completed' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-900' :
                                item.status === 'in-progress' ? 'bg-blue-900/50 text-blue-400 border border-blue-900' :
                                'bg-gray-800/50 text-gray-400 border border-gray-700'
                            }`}>
                                {item.status}
                            </span>
                            <div>
                                <h3 className={`font-mono text-sm font-bold ${item.status === 'completed' ? 'line-through text-gray-500' : 'text-white'}`}>
                                    {item.title}
                                </h3>
                                <div className="text-[10px] text-gray-500 uppercase flex gap-2 mt-1">
                                    <span>{item.category}</span>
                                    {item.target_date && <span>// DUE: {new Date(item.target_date).toLocaleDateString()}</span>}
                                    <span className={`ml-2 px-1 rounded-sm text-black font-bold ${
                                        item.priority === 'critical' ? 'bg-red-500' :
                                        item.priority === 'must-have' ? 'bg-amber-500' :
                                        'bg-blue-300'
                                    }`}>
                                        {item.priority}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.status !== 'completed' && (
                                <button
                                    onClick={() => handleComplete(item)}
                                    className="text-[10px] font-mono border border-emerald-900 bg-emerald-900/20 text-emerald-400 hover:bg-emerald-900/40 px-2 py-1 uppercase tracking-wider"
                                >
                                    Finish
                                </button>
                            )}
                            <button
                                onClick={() => handleOpenEdit(item)}
                                className="text-[10px] font-mono border border-blue-900 bg-blue-900/20 text-blue-400 hover:bg-blue-900/40 px-2 py-1 uppercase tracking-wider"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="text-[10px] font-mono border border-red-900 bg-red-900/20 text-red-400 hover:bg-red-900/40 px-2 py-1 uppercase tracking-wider"
                            >
                                Del
                            </button>
                        </div>
                    </div>
                ))}
                {filteredRoadmap.length === 0 && (
                    <div className="p-8 text-center text-gray-500 font-mono text-xs border border-dashed border-gray-800">
                        NO MISSIONS FOUND within parameters.
                    </div>
                )}
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingFeature ? `EDIT MISSION: ${editingFeature.title}` : "INITIATE NEW MISSION"}
            >
                <RoadmapForm
                    initialData={editingFeature}
                    onSuccess={handleSuccess}
                    onError={setErrorMsg}
                />
                 {errorMsg && (
                    <div className="mt-4 p-3 bg-accent/10 border border-accent text-accent font-mono text-xs">
                        ERROR: {errorMsg}
                    </div>
                )}
            </Modal>
        </div>
    );
}
