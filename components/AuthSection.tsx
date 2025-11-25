
import React, { useState, useEffect } from 'react';
import { retroAuth, fetchUserCollection } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';
import Button from './Button';
import { useNavigate, Link } from 'react-router-dom';
import AvatarSelector from './AvatarSelector';
import { RETRO_AVATARS } from '../utils/avatars';
import { UserCollectionItem } from '../types';

type AuthMode = 'LOGIN' | 'SIGNUP' | 'RECOVERY' | 'UPDATE_PASSWORD' | 'PROFILE';

const AuthSection: React.FC = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<AuthMode>('LOGIN');
    
    // Auth State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [user, setUser] = useState<any>(null);
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
                const col = await fetchUserCollection();
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
                const col = await fetchUserCollection();
                setCollection(col);
            } else if (event === "SIGNED_OUT") {
                setUser(null);
                setMode('LOGIN');
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (mode === 'SIGNUP') {
                const { error } = await retroAuth.signUp(email, password, username);
                if (error) throw error;
                setMessage({ type: 'success', text: 'SIGNAL TRANSMITTED. CHECK INBOX (AND JUNK) FOR UPLINK.' });
            } else if (mode === 'LOGIN') {
                const { error } = await retroAuth.signIn(email, password);
                if (error) throw error;
            } else if (mode === 'RECOVERY') {
                const { error } = await retroAuth.resetPassword(email);
                if (error) throw error;
                setMessage({ type: 'success', text: 'RECOVERY KEY TRANSMITTED. CHECK EMAIL TERMINAL.' });
            } else if (mode === 'UPDATE_PASSWORD') {
                const { error } = await retroAuth.updateUserPassword(password);
                if (error) throw error;
                setMessage({ type: 'success', text: 'PASSCODE REWRITTEN. SYSTEM SECURE.' });
                setTimeout(() => {
                    navigate('/news');
                }, 2000);
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message.toUpperCase() || 'ACCESS DENIED' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        await retroAuth.signOut();
        setLoading(false);
        navigate('/login');
    };

    const handleAvatarUpdate = async (newId: string) => {
        setAvatarId(newId);
        await retroAuth.updateAvatar(newId);
        setEditingAvatar(false);
    };

    const UserAvatarSVG = RETRO_AVATARS.find(a => a.id === avatarId)?.svg || RETRO_AVATARS[0].svg;

    if (mode === 'PROFILE' && user) {
        const owned = collection.filter(i => i.status === 'OWN');
        const wanted = collection.filter(i => i.status === 'WANT');

        return (
            <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
                {/* ID CARD */}
                <div className="border-2 border-retro-neon bg-retro-dark shadow-[0_0_20px_rgba(0,255,157,0.2)] flex flex-col md:flex-row">
                    <div className="bg-retro-grid/30 p-8 flex flex-col items-center justify-center border-r border-retro-grid min-w-[200px]">
                        <div className="w-24 h-24 mb-4 relative group cursor-pointer" onClick={() => setEditingAvatar(!editingAvatar)}>
                             <div className="w-full h-full border-2 border-retro-blue rounded-full flex items-center justify-center bg-black overflow-hidden">
                                <UserAvatarSVG className="w-16 h-16 text-retro-neon" />
                             </div>
                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-pixel text-white transition-opacity rounded-full">
                                 EDIT
                             </div>
                        </div>
                        <div className="font-pixel text-retro-neon text-sm mb-1">{user.user_metadata?.username || 'UNKNOWN'}</div>
                        <div className="font-mono text-xs text-gray-500">LEVEL 1 PILOT</div>
                    </div>
                    
                    <div className="p-8 flex-1 space-y-6">
                        {editingAvatar ? (
                            <div>
                                <h3 className="font-pixel text-xs text-retro-blue mb-4">SELECT AVATAR</h3>
                                <AvatarSelector selectedId={avatarId} onSelect={handleAvatarUpdate} />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <div className="font-pixel text-xs text-gray-500 mb-2">COLLECTION</div>
                                    <div className="text-3xl font-mono text-white">{owned.length} <span className="text-sm text-gray-600">ITEMS</span></div>
                                </div>
                                <div>
                                    <div className="font-pixel text-xs text-gray-500 mb-2">WISHLIST</div>
                                    <div className="text-3xl font-mono text-white">{wanted.length} <span className="text-sm text-gray-600">ITEMS</span></div>
                                </div>
                            </div>
                        )}
                        <div className="pt-6 border-t border-retro-grid">
                            <Button onClick={handleLogout} variant="danger" className="text-xs">
                                ABORT SESSION (LOGOUT)
                            </Button>
                        </div>
                    </div>
                </div>

                {/* COLLECTION LISTS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* OWNED */}
                    <div className="border border-retro-grid bg-retro-dark p-4">
                        <h3 className="font-pixel text-retro-neon mb-4 border-b border-retro-grid pb-2">MY HARDWARE</h3>
                        {owned.length === 0 ? (
                            <div className="text-gray-600 font-mono text-sm py-4">NO ITEMS LOGGED.</div>
                        ) : (
                            <div className="space-y-2">
                                {owned.map(item => (
                                    <Link to={`/${item.item_type === 'GAME' ? 'games' : 'consoles'}/${item.item_id}`} key={item.id} className="block bg-retro-grid/20 p-2 hover:bg-retro-grid/40 transition-colors flex items-center gap-3">
                                        <div className="w-8 h-8 bg-black border border-retro-grid flex items-center justify-center">
                                            {item.item_image ? <img src={item.item_image} className="w-full h-full object-cover" /> : '?'}
                                        </div>
                                        <div className="font-mono text-sm text-white">{item.item_name}</div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* WANTED */}
                    <div className="border border-retro-grid bg-retro-dark p-4">
                        <h3 className="font-pixel text-retro-pink mb-4 border-b border-retro-grid pb-2">WISHLIST</h3>
                         {wanted.length === 0 ? (
                            <div className="text-gray-600 font-mono text-sm py-4">NO ITEMS LOGGED.</div>
                        ) : (
                            <div className="space-y-2">
                                {wanted.map(item => (
                                    <Link to={`/${item.item_type === 'GAME' ? 'games' : 'consoles'}/${item.item_id}`} key={item.id} className="block bg-retro-grid/20 p-2 hover:bg-retro-grid/40 transition-colors flex items-center gap-3">
                                        <div className="w-8 h-8 bg-black border border-retro-grid flex items-center justify-center">
                                            {item.item_image ? <img src={item.item_image} className="w-full h-full object-cover" /> : '?'}
                                        </div>
                                        <div className="font-mono text-sm text-white">{item.item_name}</div>
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
        <div className="w-full max-w-md mx-auto p-4">
             <div className="border-4 border-retro-grid bg-retro-dark p-8 relative overflow-hidden">
                <h2 className="text-2xl font-pixel text-center text-retro-neon mb-8 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                    {mode === 'LOGIN' && 'ACCESS CONTROL'}
                    {mode === 'SIGNUP' && 'NEW RECRUIT'}
                    {mode === 'RECOVERY' && 'LOST SIGNAL?'}
                    {mode === 'UPDATE_PASSWORD' && 'RESET CODES'}
                </h2>
                {message && (
                    <div className={`mb-6 p-3 text-xs font-mono border ${
                        message.type === 'error' ? 'border-retro-pink text-retro-pink bg-retro-pink/10' : 'border-retro-neon text-retro-neon bg-retro-neon/10'
                    }`}>
                        {message.type === 'error' ? '⚠ ' : '✔ '} {message.text}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-6">
                    {mode === 'SIGNUP' && (
                        <div>
                            <label className="block font-mono text-xs text-retro-blue mb-2">PILOT NAME</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black/50 border-2 border-retro-grid p-3 text-white font-mono focus:border-retro-neon outline-none transition-colors"
                                placeholder="ENTER ALIAS"
                                required
                            />
                        </div>
                    )}
                    {mode !== 'UPDATE_PASSWORD' && (
                         <div>
                            <label className="block font-mono text-xs text-retro-blue mb-2">EMAIL FREQUENCY</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border-2 border-retro-grid p-3 text-white font-mono focus:border-retro-neon outline-none transition-colors"
                                placeholder="USER@DOMAIN.COM"
                                required
                            />
                        </div>
                    )}
                    {mode !== 'RECOVERY' && (
                        <div>
                            <label className="block font-mono text-xs text-retro-blue mb-2">
                                {mode === 'UPDATE_PASSWORD' ? 'NEW SECURITY CODE' : 'SECURITY CODE'}
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border-2 border-retro-grid p-3 text-white font-mono focus:border-retro-neon outline-none transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    )}
                    <Button type="submit" isLoading={loading} className="w-full">
                        {mode === 'LOGIN' && 'INITIATE UPLINK'}
                        {mode === 'SIGNUP' && 'REGISTER UNIT'}
                        {mode === 'RECOVERY' && 'SEND RESCUE SIGNAL'}
                        {mode === 'UPDATE_PASSWORD' && 'OVERWRITE CODE'}
                    </Button>
                </form>

                <div className="mt-6 flex flex-col gap-2 text-center">
                    {mode === 'LOGIN' && (
                        <>
                            <button onClick={() => { setMode('SIGNUP'); setMessage(null); }} className="text-xs font-mono text-gray-500 hover:text-retro-neon">
                                [ CREATE NEW ACCOUNT ]
                            </button>
                            <button onClick={() => { setMode('RECOVERY'); setMessage(null); }} className="text-xs font-mono text-gray-500 hover:text-retro-pink">
                                [ FORGOT PASSWORD? ]
                            </button>
                        </>
                    )}
                    {(mode === 'SIGNUP' || mode === 'RECOVERY') && (
                        <button onClick={() => { setMode('LOGIN'); setMessage(null); }} className="text-xs font-mono text-gray-500 hover:text-retro-blue">
                            [ RETURN TO LOGIN ]
                        </button>
                    )}
                </div>
             </div>
        </div>
    );
};

export default AuthSection;
