'use client';

import { useEffect, useState, type FC } from 'react';
import Link from 'next/link';
import { retroAuth } from '../../lib/auth';

interface AdminEditTriggerProps {
    variantId: string;
    consoleId: string;
}

const AdminEditTrigger: FC<AdminEditTriggerProps> = ({ variantId, consoleId }) => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            // Secure check: Verifies session AND admin role
            const admin = await retroAuth.isAdmin();
            setIsAdmin(admin);
        };
        checkAuth();
    }, []);

    if (!isAdmin) return null;

    return (
        <Link 
            href={`/admin?tab=VARIANTS&mode=edit&variant_id=${variantId}&console_id=${consoleId}`}
            className="fixed top-24 right-6 z-50 group"
        >
            <div className="bg-black/90 border border-cyan-400 px-4 py-2 flex items-center gap-3 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:bg-cyan-400 hover:text-black transition-all duration-300 backdrop-blur-sm clip-path-slant">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse group-hover:bg-black"></div>
                <span className="font-mono text-xs text-cyan-400 group-hover:text-black uppercase font-bold tracking-widest">
                    EDIT PROTOCOL
                </span>
            </div>
        </Link>
    );
};

export default AdminEditTrigger;