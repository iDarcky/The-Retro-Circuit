'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconClose } from '../../ui/Icons';

interface SwissModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    /**
     * Fill the whole viewport instead of a centred dialog. Use for long data-entry forms
     * — the variant spec editor is 112 fields over 37 steps — where the extra width and
     * height matter.
     *
     * Full-screen modals also ignore backdrop clicks, so a stray click cannot discard a
     * half-filled form. That guard came from the `Modal` this component replaced and is
     * the reason the prop had to be ported rather than dropped: without it, one misplaced
     * click in the variant editor loses the lot.
     */
    fullScreen?: boolean;
}

export default function SwissModal({ isOpen, onClose, title, children, fullScreen = false }: SwissModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Close on ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden'; // Lock scroll
        }

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = ''; // Unlock scroll
        };
    }, [isOpen, onClose]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn ${fullScreen ? '' : 'p-4'}`}
            onClick={fullScreen ? undefined : onClose}
        >
            <div
                className={
                    fullScreen
                        ? 'w-full h-full flex flex-col relative bg-[#09090b] border-0 animate-fadeIn'
                        : 'w-full max-w-5xl max-h-[90vh] flex flex-col relative bg-[#09090b] border border-white/10 animate-slideUp'
                }
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b border-white/10 p-4 sticky top-0 bg-[#09090b] z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-4 bg-orange-500"></div>
                        <h2 className="font-pixel text-xs md:text-sm text-white uppercase tracking-widest">
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white transition-colors p-2"
                        aria-label="Close"
                    >
                        <IconClose className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className={`flex-1 overflow-y-auto overflow-x-hidden ${fullScreen ? 'p-6 md:p-8' : 'p-0'}`}>
                    {fullScreen ? <div className="max-w-[1600px] mx-auto">{children}</div> : children}
                </div>

                {/* Footer / Status Bar */}
                 <div className="border-t border-white/10 p-2 bg-black flex justify-between items-center text-[10px] font-mono text-gray-600 uppercase">
                    <span>STATUS: ACTIVE</span>
                    <span>PRESS ESC TO CLOSE</span>
                </div>
            </div>
        </div>,
        document.body
    );
}
