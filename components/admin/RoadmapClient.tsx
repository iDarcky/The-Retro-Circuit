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
            {/* Header - Consistent Swiss/Hub Style */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b-2 border-border-normal pb-6 gap-4">
                <div>
                    <h1 className="text-4xl md:text-6xl font-pixel text-secondary mb-2 drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                        MISSION CONTROL
                    </h1>
                    <div className="flex gap-4 font-mono text-xs text-gray-500 uppercase tracking-widest">
                        <Link href="/admin" className="hover:text-white hover:underline">
                            &lt; ROOT TERMINAL
                        </Link>
                        <span>|</span>
                        <p>
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
            <div className="flex gap-2 mb-6 border-b border-border-subtle pb-4 overflow-x-auto">
                {['ALL', 'PLANNED', 'IN_PROGRESS', 'COMPLETED'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`font-mono text-xs px-3 py-1 border transition-colors uppercase tracking-wider ${
                            filter === f
                            ? 'bg-secondary text-black border-secondary font-bold shadow-[0_0_10px_rgba(0,255,157,0.5)]'
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
                        className={`bg-bg-secondary border border-border-normal p-4 flex flex-col md:flex-row justify-between items-start md:items-center group hover:border-white transition-colors relative overflow-hidden ${item.status === 'completed' ? 'opacity-50 hover:opacity-100 grayscale hover:grayscale-0' : ''}`}
                    >
                        <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                            {/* Status Pill */}
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-none uppercase tracking-widest min-w-[100px] text-center border ${
                                item.status === 'completed' ? 'bg-emerald-900/20 text-emerald-500 border-emerald-900' :
                                item.status === 'in-progress' ? 'bg-blue-900/20 text-blue-400 border-blue-900 animate-pulse' :
                                'bg-gray-800/20 text-gray-400 border-gray-700'
                            }`}>
                                {item.status}
                            </span>

                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className={`font-pixel text-sm uppercase ${item.status === 'completed' ? 'line-through text-gray-600 decoration-gray-600' : 'text-white group-hover:text-secondary transition-colors'}`}>
                                        {item.title}
                                    </h3>
                                     <span className={`text-[9px] px-1 py-0.5 border uppercase font-mono tracking-tighter ${
                                        item.priority === 'critical' ? 'text-red-500 border-red-900 bg-red-900/10' :
                                        item.priority === 'must-have' ? 'text-amber-500 border-amber-900 bg-amber-900/10' :
                                        'text-blue-400 border-blue-900 bg-blue-900/10'
                                    }`}>
                                        {item.priority}
                                    </span>
                                </div>
                                <div className="text-[10px] text-gray-500 uppercase flex gap-4 mt-1 font-mono tracking-wider">
                                    <span>CAT: {item.category}</span>
                                    {item.target_date && <span>// DUE: {new Date(item.target_date).toLocaleDateString()}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4 md:mt-0 relative z-10 md:opacity-0 group-hover:opacity-100 transition-opacity justify-end w-full md:w-auto border-t border-border-normal pt-4 md:border-none md:pt-0">
                            {item.status !== 'completed' && (
                                <button
                                    onClick={() => handleComplete(item)}
                                    className="text-[9px] font-mono border border-emerald-900/50 text-emerald-600 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 px-3 py-1 uppercase tracking-widest transition-colors"
                                >
                                    [ COMPLETE ]
                                </button>
                            )}
                            <button
                                onClick={() => handleOpenEdit(item)}
                                className="text-[9px] font-mono border border-border-normal text-gray-400 hover:bg-white hover:text-black hover:border-white px-3 py-1 uppercase tracking-widest transition-colors"
                            >
                                [ EDIT ]
                            </button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="text-[9px] font-mono border border-red-900/30 text-red-800 hover:bg-red-500 hover:text-white hover:border-red-500 px-3 py-1 uppercase tracking-widest transition-colors"
                            >
                                [ X ]
                            </button>
                        </div>
                    </div>
                ))}
                {filteredRoadmap.length === 0 && (
                    <div className="p-12 text-center text-gray-500 font-mono text-xs border border-dashed border-gray-800 uppercase tracking-widest">
                        // NO MISSIONS FOUND WITHIN PARAMETERS.
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
                    <div className="mt-4 p-3 bg-accent/10 border border-accent text-accent font-mono text-xs uppercase font-bold">
                        ERROR: {errorMsg}
                    </div>
                )}
            </Modal>
        </div>
    );
}
