'use client';

import { type FC } from 'react';
import { RoadmapFeature } from '../../lib/types/domain';
import { Clock, Zap, AlertTriangle, Star, ThumbsUp, Check, Edit, Trash2 } from 'lucide-react';

interface RoadmapCardProps {
    item: RoadmapFeature;
    isAdmin?: boolean;
    onEdit?: (item: RoadmapFeature) => void;
    onDelete?: (id: string) => void;
    onComplete?: (item: RoadmapFeature) => void;
}

const RoadmapCard: FC<RoadmapCardProps> = ({ item, isAdmin, onEdit, onDelete, onComplete }) => {
    let statusColor = '';
    let StatusIcon = Zap;
    let opacity = 'opacity-100';
    let accentColor = '';

    // Priority Coloring
    switch (item.priority) {
        case 'critical':
            statusColor = 'text-orange-400 border-orange-500/30 bg-orange-500/5 shadow-[0_0_10px_-2px_rgba(249,115,22,0.1)] hover:bg-orange-500/10 hover:border-orange-500/50';
            accentColor = 'bg-orange-500';
            StatusIcon = AlertTriangle;
            break;
        case 'must-have':
            statusColor = 'text-blue-400 border-blue-500/30 bg-blue-500/5 shadow-[0_0_10px_-2px_rgba(59,130,246,0.1)] hover:bg-blue-500/10 hover:border-blue-500/50';
            accentColor = 'bg-blue-500';
            StatusIcon = Star;
            break;
        case 'nice-to-have':
            statusColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_10px_-2px_rgba(16,185,129,0.1)] hover:bg-emerald-500/10 hover:border-emerald-500/50';
            accentColor = 'bg-emerald-500';
            StatusIcon = ThumbsUp;
            break;
        default:
            statusColor = 'text-zinc-400 border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20';
            accentColor = 'bg-zinc-500';
            StatusIcon = Zap;
    }

    if (item.status === 'in-progress') {
        StatusIcon = Clock;
    }

    return (
        <div className={`relative p-6 rounded-none border transition-all duration-300 group flex flex-col justify-between h-full gap-4 ${statusColor} ${opacity}`}>

            {/* Top Bar: Category & Status */}
            <div className="flex justify-between items-start">
                <div className="text-[10px] font-mono uppercase tracking-widest opacity-70 border border-white/10 px-2 py-0.5 rounded-full">
                    {item.category || 'Roadmap'}
                </div>
                <div className="mt-1 flex items-center gap-2">
                    <StatusIcon size={16} />
                </div>
            </div>

            {/* Content */}
            <div>
                <h4 className="text-sm font-bold uppercase tracking-wide mb-2 flex items-center gap-2">
                    {item.title}
                    {item.status === 'in-progress' && (
                        <span className="flex h-1.5 w-1.5 relative" title="In Progress">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${accentColor.replace('bg-', 'bg-')}`}></span>
                            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${accentColor}`}></span>
                        </span>
                    )}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed font-light">{item.description}</p>
            </div>

            {/* Footer: Date or ID */}
            <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                <div className={`h-0.5 w-8 ${accentColor} opacity-50`}></div>
                {item.target_date && <div className="text-[9px] font-mono uppercase tracking-widest opacity-50">{new Date(item.target_date).toLocaleDateString()}</div>}
            </div>

            {/* Admin Controls */}
            {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 p-1 rounded border border-white/10 backdrop-blur-sm z-20">
                    {item.status !== 'completed' && onComplete && (
                        <button
                            onClick={(e) => { e.preventDefault(); onComplete(item); }}
                            className="p-1 hover:text-emerald-400 hover:bg-emerald-500/20 rounded transition-colors"
                            title="Mark Complete"
                            aria-label="Mark Complete"
                        >
                            <Check size={12} />
                        </button>
                    )}
                    {onEdit && (
                        <button
                            onClick={(e) => { e.preventDefault(); onEdit(item); }}
                            className="p-1 hover:text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                            title="Edit"
                            aria-label="Edit Item"
                        >
                            <Edit size={12} />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={(e) => { e.preventDefault(); onDelete(item.id); }}
                            className="p-1 hover:text-red-400 hover:bg-red-500/20 rounded transition-colors"
                            title="Delete"
                            aria-label="Delete Item"
                        >
                            <Trash2 size={12} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default RoadmapCard;
