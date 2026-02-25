'use client';

import { useState } from 'react';
import { RoadmapFeature, Release } from '../../lib/types/domain';
import RoadmapCard from './RoadmapCard';
import { RoadmapForm } from '@/components/admin/RoadmapForm';
import { ReleaseForm } from '@/components/admin/ReleaseForm';
import Modal from '@/components/ui/Modal';
import { deleteRoadmapItem, updateRoadmapItem, deleteRelease } from '@/app/actions/roadmap';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RoadmapViewProps {
  releases: (Release & { roadmap_features: RoadmapFeature[] })[];
  upcomingItems: RoadmapFeature[];
  isAdmin?: boolean;
}

type Tab = 'upcoming' | 'changelog';

export default function RoadmapView({ releases, upcomingItems, isAdmin }: RoadmapViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const router = useRouter();

  // Admin State
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<RoadmapFeature | null>(null);
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const priorityOrder: Record<string, number> = {
      'critical': 0,
      'must-have': 1,
      'nice-to-have': 2
  };

  const sortByPriority = (a: RoadmapFeature, b: RoadmapFeature) => {
      const pA = priorityOrder[a.priority] ?? 99;
      const pB = priorityOrder[b.priority] ?? 99;
      return pA - pB;
  };

  const inProgressItems = upcomingItems.filter(item => item.status === 'in-progress').sort(sortByPriority);
  const plannedItems = upcomingItems.filter(item => item.status !== 'in-progress').sort(sortByPriority);

  // Handlers
  const handleSuccess = (_msg: string) => {
      setIsRoadmapModalOpen(false);
      setIsReleaseModalOpen(false);
      setEditingFeature(null);
      setEditingRelease(null);
      setErrorMsg('');
      router.refresh();
  };

  const handleDeleteFeature = async (id: string) => {
      if (confirm('ARE YOU SURE YOU WANT TO DELETE THIS MISSION?')) {
          await deleteRoadmapItem(id);
          router.refresh();
      }
  };

  const handleCompleteFeature = async (item: RoadmapFeature) => {
       if (confirm(`MARK "${item.title}" AS COMPLETE?`)) {
            await updateRoadmapItem(item.id, { status: 'completed' });
            router.refresh();
       }
  };

  const handleOpenEditFeature = (item: RoadmapFeature) => {
      setEditingFeature(item);
      setIsRoadmapModalOpen(true);
  };

  const handleAddFeature = () => {
      setEditingFeature(null);
      setIsRoadmapModalOpen(true);
  };

  const handleDeleteRelease = async (id: string) => {
      if (confirm('ARE YOU SURE YOU WANT TO DELETE THIS RELEASE?')) {
          await deleteRelease(id);
          router.refresh();
      }
  };

  const handleOpenEditRelease = (release: Release) => {
      setEditingRelease(release);
      setIsReleaseModalOpen(true);
  };

  const handleAddRelease = () => {
      setEditingRelease(null);
      setIsReleaseModalOpen(true);
  };


  return (
    <div className="w-full relative">

      {/* Admin Controls */}
      {isAdmin && (
          <div className="flex justify-end gap-2 mb-6">
              <button
                  onClick={handleAddFeature}
                  className="bg-blue-500/10 border border-blue-500 text-blue-400 px-4 py-2 text-xs font-mono uppercase tracking-widest hover:bg-blue-500 hover:text-black transition-colors flex items-center gap-2"
              >
                  <Plus size={14} /> Add Mission
              </button>
              <button
                  onClick={handleAddRelease}
                  className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 px-4 py-2 text-xs font-mono uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-colors flex items-center gap-2"
              >
                  <Plus size={14} /> Add Release
              </button>
          </div>
      )}

      {/* Tab Switcher */}
      <div className="flex border-b border-white/10 mb-8">
        <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-3 text-sm font-mono uppercase tracking-widest border-b-2 transition-all duration-300 ${
                activeTab === 'upcoming'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-text-secondary hover:text-white hover:bg-white/5'
            }`}
        >
            Incoming Transmissions
            <span className="ml-2 opacity-50 text-[10px]">{upcomingItems.length}</span>
        </button>
        <button
            onClick={() => setActiveTab('changelog')}
            className={`px-6 py-3 text-sm font-mono uppercase tracking-widest border-b-2 transition-all duration-300 ${
                activeTab === 'changelog'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-text-secondary hover:text-white hover:bg-white/5'
            }`}
        >
            Changelog
            <span className="ml-2 opacity-50 text-[10px]">{releases.length}</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'upcoming' ? (
          <div className="animate-fade-in space-y-16">

            {/* In Progress Section */}
            {inProgressItems.length > 0 && (
                <div className="space-y-6">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                        <h3 className="text-sm font-mono uppercase tracking-widest text-blue-400">In Progress</h3>
                        <div className="h-px bg-blue-500/20 flex-1"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {inProgressItems.map((item) => (
                            <RoadmapCard
                                key={item.id}
                                item={item}
                                isAdmin={isAdmin}
                                onEdit={handleOpenEditFeature}
                                onDelete={handleDeleteFeature}
                                onComplete={handleCompleteFeature}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Planned Section */}
            {plannedItems.length > 0 && (
                 <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-2 w-2 bg-zinc-500 rounded-full opacity-50"></div>
                        <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-400">Planned</h3>
                         <div className="h-px bg-white/10 flex-1"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {plannedItems.map((item) => (
                            <RoadmapCard
                                key={item.id}
                                item={item}
                                isAdmin={isAdmin}
                                onEdit={handleOpenEditFeature}
                                onDelete={handleDeleteFeature}
                                onComplete={handleCompleteFeature}
                            />
                        ))}
                    </div>
                </div>
            )}

            {upcomingItems.length === 0 && (
                 <div className="col-span-full py-24 text-center text-text-muted font-mono uppercase tracking-widest opacity-50 border border-dashed border-white/10">
                    No Pending Features
                </div>
            )}
          </div>
      ) : (
          <div className="relative animate-fade-in">
              {/* Continuous Timeline Line */}
              <div className="absolute left-4 top-4 bottom-4 w-px bg-white/10 md:left-1/2 md:-ml-[0.5px]"></div>

              <div className="space-y-12">
                  {releases.map((release, index) => (
                      <div key={release.id} className="relative group">

                          <div className={`flex flex-col md:flex-row items-start justify-between md:gap-24 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                               {/* Empty Spacer for Timeline centering - Added min-w-0 to ensure flex split is respected */}
                               <div className="hidden md:block flex-1 min-w-0"></div>

                               {/* Timeline Dot */}
                               {/* Adjusted absolute positioning:
                                   Mobile: left-4 (matches timeline line)
                                   Desktop: left-1/2
                               */}
                               <div className="absolute left-[11px] md:left-1/2 md:-ml-[5px] top-8 w-2.5 h-2.5 bg-bg-primary border-2 border-emerald-500 rounded-full z-10 group-hover:scale-125 transition-transform shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>

                               {/* Card - Added min-w-0 */}
                               <div className="flex-1 w-full min-w-0 pl-12 md:pl-0">
                                   <div className="bg-white/[0.02] border border-white/10 p-6 md:p-8 hover:border-emerald-500/30 transition-colors relative overflow-hidden group/card">

                                        {/* Admin Controls for Release */}
                                        {isAdmin && (
                                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity bg-black/80 p-1 rounded border border-white/10 backdrop-blur-sm z-20">
                                                <button
                                                    onClick={() => handleOpenEditRelease(release)}
                                                    className="p-1 hover:text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                                                    title="Edit Release"
                                                >
                                                    <Edit size={12} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteRelease(release.id)}
                                                    className="p-1 hover:text-red-400 hover:bg-red-500/20 rounded transition-colors"
                                                    title="Delete Release"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-2 mb-6">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl font-bold font-pixel text-white">v{release.version}</span>
                                                <span className={`text-[10px] border px-2 py-0.5 rounded-full uppercase tracking-widest ${release.is_published ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5' : 'text-amber-500 border-amber-500/30 bg-amber-500/5'}`}>
                                                    {release.is_published ? 'Released' : 'Draft'}
                                                </span>
                                            </div>
                                            <div className="font-mono text-xs text-zinc-500 uppercase tracking-wider">
                                                {new Date(release.release_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                            {release.title && (
                                                <h3 className="text-lg font-bold text-emerald-400 font-mono uppercase tracking-wide mt-1">
                                                    // {release.title}
                                                </h3>
                                            )}
                                        </div>

                                        {release.description && (
                                            <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-light border-l-2 border-white/5 pl-4">
                                                {release.description}
                                            </p>
                                        )}

                                        {release.roadmap_features && release.roadmap_features.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-1">Included Updates</h4>
                                                <ul className="space-y-2">
                                                    {release.roadmap_features.map(feat => (
                                                        <li key={feat.id} className="flex items-start gap-2 text-xs text-zinc-300 font-mono">
                                                            <span className="text-emerald-500 mt-0.5">+</span>
                                                            <span>{feat.title}</span>
                                                            <span className="text-zinc-600 text-[10px] border border-zinc-800 px-1 ml-auto shrink-0 uppercase">{feat.category}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                   </div>
                               </div>
                          </div>
                      </div>
                  ))}
              </div>

              {releases.length === 0 && (
                 <div className="py-24 text-center text-text-muted font-mono uppercase tracking-widest opacity-50 border border-dashed border-white/10">
                    No Release History Logged
                </div>
              )}
          </div>
      )}

      {/* Admin Modals */}
      {isAdmin && (
          <>
            <Modal
                isOpen={isRoadmapModalOpen}
                onClose={() => setIsRoadmapModalOpen(false)}
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

            <Modal
                isOpen={isReleaseModalOpen}
                onClose={() => setIsReleaseModalOpen(false)}
                title={editingRelease ? `EDIT RELEASE: v${editingRelease.version}` : "INITIATE NEW RELEASE"}
            >
                <ReleaseForm
                    initialData={editingRelease}
                    onSuccess={handleSuccess}
                    onError={setErrorMsg}
                />
                 {errorMsg && (
                    <div className="mt-4 p-3 bg-accent/10 border border-accent text-accent font-mono text-xs uppercase font-bold">
                        ERROR: {errorMsg}
                    </div>
                )}
            </Modal>
          </>
      )}
    </div>
  );
}
