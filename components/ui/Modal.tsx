'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    /**
     * Fill the whole viewport instead of a centred dialog. Use for long data-entry forms
     * (e.g. the variant spec editor) where the extra width and height matter.
     * Full-screen modals also ignore backdrop clicks so a stray click can't discard a
     * half-filled form.
     */
    fullScreen?: boolean;
}

export default function Modal({ isOpen, onClose, title, children, fullScreen = false }: ModalProps) {
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
                        ? 'w-full h-full bg-bg-primary border-0 flex flex-col relative animate-fadeIn'
                        : 'w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-bg-primary border-2 border-secondary shadow-[0_0_30px_rgba(0,255,157,0.1)] flex flex-col relative animate-slideUp'
                }
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center bg-black border-b border-secondary p-4 sticky top-0 z-10 backdrop-blur-md">
                    <h2 className="font-pixel text-sm md:text-lg text-secondary uppercase tracking-widest drop-shadow-[0_0_5px_rgba(0,255,157,0.5)]">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-secondary hover:text-white font-mono text-xl leading-none px-4 py-1 border border-transparent hover:border-secondary transition-all"
                        aria-label="Close"
                    >
                        [ESC]
                    </button>
                </div>

                {/* Content */}
                <div className={fullScreen ? 'flex-1 overflow-y-auto p-6 md:p-8' : 'p-6 overflow-y-auto'}>
                    {fullScreen ? <div className="max-w-[1600px] mx-auto">{children}</div> : children}
                </div>
            </div>
        </div>,
        document.body
    );
}
