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
            const admin = await retroAuth.isAdmin();
            setIsAdmin(admin);
        };
        checkAuth();
    }, []);

    if (!isAdmin) return null;

    return (
        <Link 
            href={`/admin?tab=VARIANTS&mode=edit&variant_id=${variantId}&console_id=${consoleId}`}
            className="fixed top-20 right-4 z-50 group"
        >
            <div className="bg-black/90 border border-retro-neon px-3 py-1.5 flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,157,0.3)] hover:bg-retro-neon hover:text-black transition-colors">
                <div className="w-2 h-2 bg-retro-neon rounded-full animate-pulse group-hover:bg-black"></div>
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider">
                    [ EDIT VARIANT ]
                </span>
            </div>
        </Link>
    );
};

export default AdminEditTrigger;