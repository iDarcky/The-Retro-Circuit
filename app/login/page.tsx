'use client';

import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { retroAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase/singleton';
import Button from '../../components/ui/Button';
import AvatarSelector from '../../components/ui/AvatarSelector';
import { RETRO_AVATARS } from '../../data/avatars';
import type { User } from '@supabase/supabase-js';

type AuthMode = 'LOGIN' | 'SIGNUP' | 'RECOVERY' | 'UPDATE_PASSWORD' | 'PROFILE';

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<AuthMode>('LOGIN');
    
    // Auth State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [avatarId, setAvatarId] = useState('pilot');
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
    const [editingAvatar, setEditingAvatar] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const currentUser = await retroAuth.getUser();
            if (currentUser) {
                setUser(currentUser);
                setMode('PROFILE');
                setAvatarId(currentUser.user_metadata?.avatar_id || 'pilot');
                
                // Check Admin
                const adminStatus = await retroAuth.isAdmin();
                setIsAdmin(adminStatus);
            }
        };
        checkUser();

        if (sessionStorage.getItem('retro_recovery_pending') === 'true') {
            setMode('UPDATE_PASSWORD');
            setMessage({ type: 'success', text: 'IDENTITY VERIFIED. ENTER NEW PASSCODE.' });
            sessionStorage.removeItem('retro_recovery_pending');
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "PASSWORD_RECOVERY") {
                setMode('UPDATE_PASSWORD');
                setMessage({ type: 'success', text: 'IDENTITY VERIFIED. ENTER NEW PASSCODE.' });
            } else if (event === "SIGNED_IN" && session) {
                setUser(session.user);
                setAvatarId(session.user.user_metadata?.avatar_id || 'pilot');
                setMode('PROFILE');
                
                const adminStatus = await retroAuth.isAdmin();
                setIsAdmin(adminStatus);
            } else if (event === "SIGNED_OUT") {
                setUser(null);
                setMode('LOGIN');
                setIsAdmin(false);
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleAuth = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (mode === 'SIGNUP') {
                const { error } = await retroAuth.signUp(email, password, username);
                if (error) throw error;
                setMessage({ type: 'success', text: 'SIGNAL TRANSMITTED. CHECK INBOX (AND JUNK) FOR UPLINK.' });
            } else if (mode === 'LOGIN') {
                // 1. Perform Login
                const { error } = await retroAuth.signIn(email, password);
                if (error) throw error;

                // 2. Refresh Admin Status but DO NOT REDIRECT
                const adminCheck = await retroAuth.isAdmin();
                setIsAdmin(adminCheck);
                
                // 3. Set Success Message
                setMessage({ type: 'success', text: 'ACCESS GRANTED. INITIALIZING PROFILE...' });
                
                // Mode switch happens automatically via onAuthStateChange listener

            } else if (mode === 'RECOVERY') {
                const { error } = await retroAuth.resetPassword(email);
                if (error) throw error;
                setMessage({ type: 'success', text: 'RECOVERY KEY TRANSMITTED. CHECK EMAIL TERMINAL.' });
            } else if (mode === 'UPDATE_PASSWORD') {
                const { error } = await retroAuth.updateUserPassword(password);
                if (error) throw error;
                setMessage({ type: 'success', text: 'PASSCODE UPDATED. REDIRECTING...' });
                setTimeout(() => setMode('PROFILE'), 2000);
            }
        } catch (err: any) {
            console.error(err);
            setMessage({ type: 'error', text: err.message || 'AUTHENTICATION FAILED' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await retroAuth.signOut();
        router.push('/');
    };

    const handleAvatarUpdate = async (id: string) => {
        setAvatarId(id);
        await retroAuth.updateAvatar(id);
        setEditingAvatar(false);
    };

    if (mode === 'PROFILE' && user) {
        const CurrentAvatar = RETRO_AVATARS.find(a => a.id === avatarId)?.svg || RETRO_AVATARS[0].svg;

        return (
            <div className="w-full max-w-4xl mx-auto p-4 animate-fadeIn">
                <div className="flex justify-center">
                    {/* User Card */}
                    <div className="bg-retro-dark border-2 border-retro-grid p-6 text-center h-fit w-full max-w-md">
                        <div className="relative inline-block mb-4">
                            <div className="w-24 h-24 border-2 border-retro-neon rounded-full flex items-center justify-center bg-retro-neon/10 mx-auto shadow-[0_0_15px_rgba(0,255,157,0.3)]">
                                <CurrentAvatar className="w-16 h-16 text-retro-neon" />
                            </div>
                            <button 
                                onClick={() => setEditingAvatar(!editingAvatar)}
                                className="absolute bottom-0 right-0 bg-retro-blue text-black text-xs px-2 py-1 font-bold border border-white hover:bg-white transition-colors"
                            >
                                EDIT
                            </button>
                        </div>
                        
                        {editingAvatar && (
                            <div className="mb-4 animate-fadeIn bg-black p-2 border border-retro-grid">
                                <AvatarSelector selectedId={avatarId} onSelect={handleAvatarUpdate} />
                            </div>
                        )}

                        <h2 className="text-xl font-pixel text-white mb-1 truncate px-2">{user.user_metadata?.username || 'User'}</h2>
                        <div className="text-xs font-mono text-gray-500 mb-6 truncate px-2">{user.email}</div>
                        
                        {isAdmin && (
                            <Link href="/admin">
                                <Button variant="secondary" className="w-full text-xs mb-3 border-retro-pink text-retro-pink hover:bg-retro-pink hover:text-white">
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

    return (
        <div className="w-full max-w-md mx-auto p-4 min-h-[60vh] flex flex-col justify-center">
            <div className="border-2 border-retro-grid bg-retro-dark p-8 shadow-[0_0_20px_rgba(0,255,157,0.1)] relative overflow-hidden">
                {/* Decorative lines */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-retro-neon to-retro-blue"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-retro-blue to-retro-neon"></div>

                <h2 className="text-2xl font-pixel text-center text-retro-neon mb-6 drop-shadow-md">
                    {mode === 'LOGIN' && 'SYSTEM LOGIN'}
                    {mode === 'SIGNUP' && 'NEW USER REGISTRATION'}
                    {mode === 'RECOVERY' && 'PASSWORD RECOVERY'}
                    {mode === 'UPDATE_PASSWORD' && 'SET NEW PASSWORD'}
                </h2>

                {message && (
                    <div className={`p-3 mb-6 text-xs font-mono border animate-pulse ${
                        message.type === 'error' ? 'border-retro-pink text-retro-pink bg-retro-pink/10' : 'border-retro-neon text-retro-neon bg-retro-neon/10'
                    }`}>
                        &gt; {message.text}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    {mode === 'SIGNUP' && (
                        <div>
                            <label className="block text-xs font-mono text-retro-blue mb-1 tracking-widest">CODENAME</label>
                            <input 
                                type="text" 
                                required 
                                value={username}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                className="w-full bg-black border border-retro-grid p-3 text-white font-mono focus:border-retro-neon outline-none transition-colors"
                                placeholder="ENTER USERNAME"
                            />
                        </div>
                    )}

                    {(mode === 'LOGIN' || mode === 'SIGNUP' || mode === 'RECOVERY') && (
                        <div>
                            <label className="block text-xs font-mono text-retro-blue mb-1 tracking-widest">EMAIL ADDRESS</label>
                            <input 
                                type="email" 
                                required 
                                value={email}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                className="w-full bg-black border border-retro-grid p-3 text-white font-mono focus:border-retro-neon outline-none transition-colors"
                                placeholder="USER@EXAMPLE.COM"
                            />
                        </div>
                    )}

                    {(mode === 'LOGIN' || mode === 'SIGNUP' || mode === 'UPDATE_PASSWORD') && (
                        <div>
                            <label className="block text-xs font-mono text-retro-blue mb-1 tracking-widest">ACCESS CODE</label>
                            <input 
                                type="password" 
                                required 
                                value={password}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                className="w-full bg-black border border-retro-grid p-3 text-white font-mono focus:border-retro-neon outline-none transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    )}

                    <Button type="submit" isLoading={loading} className="w-full mt-6">
                        {mode === 'LOGIN' && 'INITIATE CONNECTION'}
                        {mode === 'SIGNUP' && 'CREATE ID'}
                        {mode === 'RECOVERY' && 'TRANSMIT LINK'}
                        {mode === 'UPDATE_PASSWORD' && 'UPDATE CREDENTIALS'}
                    </Button>
                </form>

                <div className="mt-6 flex flex-col gap-3 text-center text-xs font-mono text-gray-500 border-t border-retro-grid pt-4">
                    {mode === 'LOGIN' && (
                        <>
                            <button onClick={() => { setMode('SIGNUP'); setMessage(null); }} className="hover:text-retro-neon transition-colors">ESTABLISH NEW ID</button>
                            <button onClick={() => { setMode('RECOVERY'); setMessage(null); }} className="hover:text-retro-pink transition-colors">FORGOT ACCESS CODE?</button>
                        </>
                    )}
                    {(mode === 'SIGNUP' || mode === 'RECOVERY') && (
                        <button onClick={() => { setMode('LOGIN'); setMessage(null); }} className="hover:text-white transition-colors">RETURN TO LOGIN</button>
                    )}
                </div>
            </div>
        </div>
    );
}
