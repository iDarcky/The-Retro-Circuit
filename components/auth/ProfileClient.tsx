'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { retroAuth } from '../../lib/auth';
import Button from '../ui/Button';
import AvatarSelector from '../ui/AvatarSelector';
import { RETRO_AVATARS } from '../../data/avatars';
import type { User } from '@supabase/supabase-js';

type ProfileClientProps = {
    initialUser: User;
    initialAdminStatus: boolean;
};

export default function ProfileClient({ initialUser, initialAdminStatus }: ProfileClientProps) {
    const router = useRouter();
    const [user] = useState<User>(initialUser);
    const [isAdmin] = useState(initialAdminStatus);
    const [avatarId, setAvatarId] = useState(initialUser.user_metadata?.avatar_id || 'pilot');
    const [editingAvatar, setEditingAvatar] = useState(false);

    const handleLogout = async () => {
        await retroAuth.signOut();
        router.push('/');
    };

    const handleAvatarUpdate = async (id: string) => {
        setAvatarId(id);
        await retroAuth.updateAvatar(id);
        setEditingAvatar(false);
    };

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
