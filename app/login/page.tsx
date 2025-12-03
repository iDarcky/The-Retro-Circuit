'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchUserCollection } from '../../lib/api';
import { retroAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase/singleton';
import Button from '../../components/ui/Button';
import AvatarSelector from '../../components/ui/AvatarSelector';
import { RETRO_AVATARS } from '../../data/avatars';
import { UserCollectionItem } from '../../lib/types';
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
    
    // Collection State
    const [collection, setCollection] = useState<UserCollectionItem[]>([]);
    
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
                
                // Check Admin & Collection
                const [adminStatus, col] = await Promise.all([
                    retroAuth.isAdmin(),
                    fetchUserCollection()
                ]);
                setIsAdmin(adminStatus);
                setCollection(col);
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
                
                const [adminStatus, col] = await Promise.all([
                    retroAuth.isAdmin(),
                    fetchUserCollection()
                ]);
                setIsAdmin(adminStatus);
                setCollection(col);
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

                // 2. Check Admin Status specifically for redirection
                // We re-fetch user here to ensure we have the latest token claims if needed
                const adminCheck = await retroAuth.isAdmin();
                
                if (adminCheck) {
                    // Admin Redirect: Use window.location to force full refresh and ensure middleware cookies are set
                    window.location.href = "/admin";
                    return;
                }
                
                // Normal User: Stay on profile
                setMessage({ type: 'success', text: 'ACCESS GRANTED.' });

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* User Card */}
                    <div className="bg-retro-dark border-2 border-retro-grid p-6 text-center h-fit">
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

                    {/* Collection */}
                    <div className="md:col-span-2">
                        <h3 className="font-pixel text-retro-blue mb-4 text-xl border-b border-retro-grid pb-2">MY COLLECTION</h3>
                        
                        {collection.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-gray-800 text-gray-600 font-mono">
                                NO ITEMS IN INVENTORY.
                                <br />
                                <Link href="/archive" className="text-retro-neon underline mt-2 inline-block">BROWSE GAMES</Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                                {collection.map((item) => (
                                    <Link 
                                        key={item.id} 
                                        href={item.item_type === 'GAME' ? `/archive/${item.item_id}` : `/console/${item.item_id}`}
                                        className="flex items-center gap-3 p-3 border border-retro-grid bg-black/40 hover:bg-retro-grid/20 transition-colors group relative overflow-hidden"
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.status === 'OWN' ? 'bg-retro-neon' : 'bg-retro-pink'}`}></div>
                                        <div className="w-12 h-12 bg-black flex-shrink-0 flex items-center justify-center border border-gray-800 ml-2">
                                            {item.item_image ? (
                                                <img src={item.item_image} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-[10px] text-gray-600">IMG</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-pixel text-white truncate group-hover:text-retro-neon">{item.item_name}</div>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className={`text-[10px] font-mono px-1 ${item.status === 'OWN' ? 'bg-retro-neon/20 text-retro-neon' : 'bg-retro-pink/20 text-retro-pink'}`}>
                                                    {item.status === 'OWN' ? 'OWNED' : 'WISHLIST'}
                                                </span>
                                                <span className="text-[9px] font-mono text-gray-500">{item.item_type}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
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
                                onChange={e => setUsername(e.target.value)}
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
                                onChange={e => setEmail(e.target.value)}
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
                                onChange={e => setPassword(e.target.value)}
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