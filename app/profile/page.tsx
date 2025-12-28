'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { retroAuth } from '../../lib/auth';
import Button from '../../components/ui/Button';
import AvatarSelector from '../../components/ui/AvatarSelector';
import { RETRO_AVATARS } from '../../data/avatars';
import type { User } from '@supabase/supabase-js';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [avatarId, setAvatarId] = useState('pilot');
    const [editingAvatar, setEditingAvatar] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const currentUser = await retroAuth.getUser();
            if (!currentUser) {
                // If middleware misses it, client-side fallback
                router.push('/login');
                return;
            }

            setUser(currentUser);
            setAvatarId(currentUser.user_metadata?.avatar_id || 'pilot');

            // Check Admin
            const adminStatus = await retroAuth.isAdmin();
            setIsAdmin(adminStatus);
            setLoading(false);
        };
        checkUser();
    }, [router]);

    const handleLogout = async () => {
        await retroAuth.signOut();
        router.push('/');
    };

    const handleAvatarUpdate = async (id: string) => {
        setAvatarId(id);
        await retroAuth.updateAvatar(id);
        setEditingAvatar(false);
    };

    if (loading) {
        return (
            <div className="w-full min-h-[60vh] flex items-center justify-center">
                 <div className="font-mono text-secondary animate-pulse">LOADING PROFILE DATA...</div>
            </div>
        );
    }

    if (!user) return null;

    const CurrentAvatar = RETRO_AVATARS.find(a => a.id === avatarId)?.svg || RETRO_AVATARS[0].svg;

    return (
        <div className="w-full max-w-4xl mx-auto p-4 animate-fadeIn">
            <div className="flex justify-center">
                {/* User Card */}
                <div className="bg-bg-primary border-2 border-border-normal p-6 text-center h-fit w-full max-w-md">
                    <div className="relative inline-block mb-4">
                        <div className="w-24 h-24 border-2 border-secondary rounded-full flex items-center justify-center bg-secondary/10 mx-auto shadow-[0_0_15px_rgba(0,255,157,0.3)]">
                            <CurrentAvatar className="w-16 h-16 text-secondary" />
                        </div>
                        <button
                            onClick={() => setEditingAvatar(!editingAvatar)}
                            className="absolute bottom-0 right-0 bg-primary text-black text-xs px-2 py-1 font-bold border border-white hover:bg-white transition-colors"
                        >
                            EDIT
                        </button>
                    </div>

                    {editingAvatar && (
                        <div className="mb-4 animate-fadeIn bg-black p-2 border border-border-normal">
                            <AvatarSelector selectedId={avatarId} onSelect={handleAvatarUpdate} />
                        </div>
                    )}

                    <h2 className="text-xl font-pixel text-white mb-1 truncate px-2">{user.user_metadata?.username || 'User'}</h2>
                    <div className="text-xs font-mono text-gray-500 mb-6 truncate px-2">{user.email}</div>

                    {isAdmin && (
                        <Link href="/admin">
                            <Button variant="secondary" className="w-full text-xs mb-3 border-accent text-accent hover:bg-accent hover:text-white">
                                ACCESS ADMIN PANEL
                            </Button>
                        </Link>
                    )}

                    <Button onClick={handleLogout} variant="danger" className="w-full text-xs">DISCONNECT</Button>
                </div>
            </div>
        </div>
    );
}
