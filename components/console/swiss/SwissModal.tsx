'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconClose } from '../../ui/Icons';

interface SwissModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function SwissModal({ isOpen, onClose, title, children }: SwissModalProps) {
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm animate-fadeIn p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-5xl max-h-[90vh] flex flex-col relative bg-[#09090b] border border-border-subtle animate-slideUp shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b border-border-subtle p-4 sticky top-0 bg-[#09090b] z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-4 bg-orange-500"></div>
                        <h2 className="font-pixel text-xs md:text-sm text-text-primary uppercase tracking-widest">
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-text-primary transition-colors p-2"
                        aria-label="Close"
                    >
                        <IconClose className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-0">
                    {children}
                </div>

                {/* Footer / Status Bar */}
                 <div className="border-t border-border-subtle p-2 bg-bg-primary flex justify-between items-center text-[10px] font-mono text-gray-600 uppercase">
                    <span>STATUS: ACTIVE</span>
                    <span>PRESS ESC TO CLOSE</span>
                </div>
            </div>
        </div>,
        document.body
    );
}
