'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 animate-fadeIn p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-bg-primary border border-white shadow-2xl flex flex-col relative animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center bg-bg-primary border-b border-white/10 p-4 sticky top-0 z-10">
                    <h2 className="font-mono font-bold text-sm md:text-base text-white uppercase tracking-widest">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-white font-mono text-xs uppercase px-4 py-1 border border-transparent hover:border-white transition-all"
                        aria-label="Close"
                    >
                        [ESC]
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto bg-bg-primary">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
