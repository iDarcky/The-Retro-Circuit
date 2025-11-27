import { useState, useEffect, type FC, type FormEvent } from 'react';
import { retroAuth, fetchUserCollection } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';
import Button from './Button';
import { useNavigate, Link } from 'react-router-dom';
import AvatarSelector from './AvatarSelector';
import { RETRO_AVATARS } from '../utils/avatars';
import { UserCollectionItem } from '../types';

type AuthMode = 'LOGIN' | 'SIGNUP' | 'RECOVERY' | 'UPDATE_PASSWORD' | 'PROFILE';

const AuthSection: FC = () => {
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
                const { error } = await retroAuth.signIn(email, password);
                if (error) throw error;
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
            setMessage({ type: 'error', text: err.message || 'AUTHENTICATION FAILED' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await retroAuth.signOut();
        navigate('/');
    };

    const handleAvatarUpdate = async (id: string) => {
        setAvatarId(id);
        await retroAuth.updateAvatar(id);
        setEditingAvatar(false);
    };

    if (mode === 'PROFILE' && user) {
        const CurrentAvatar = RETRO_AVATARS.find(a => a.id === avatarId)?.svg || RETRO_AVATARS[0].svg;

        return (
            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* User Card */}
                    <div className="bg-retro-dark border-2 border-retro-grid p-6 text-center">
                        <div className="relative inline-block mb-4">
                            <div className="w-24 h-24 border-2 border-retro-neon rounded-full flex items-center justify-center bg-retro-neon/10 mx-auto">
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
                            <div className="mb-4 animate-fadeIn">
                                <AvatarSelector selectedId={avatarId} onSelect={handleAvatarUpdate} />
                            </div>
                        )}

                        <h2 className="text-xl font-pixel text-white mb-1">{user.user_metadata?.username || user.email?.split('@')[0]}</h2>
                        <div className="text-xs font-mono text-gray-500 mb-6">{user.email}</div>
                        
                        <Button onClick={handleLogout} variant="danger" className="w-full text-xs">DISCONNECT</Button>
                    </div>

                    {/* Collection */}
                    <div className="md:col-span-2">
                        <h3 className="font-pixel text-retro-blue mb-4 text-xl border-b border-retro-grid pb-2">MY COLLECTION</h3>
                        
                        {collection.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-gray-800 text-gray-600 font-mono">
                                NO ITEMS IN INVENTORY.
                                <br />
                                <Link to="/games" className="text-retro-neon underline mt-2 inline-block">BROWSE GAMES</Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {collection.map((item) => (
                                    <Link 
                                        key={item.id} 
                                        to={item.item_type === 'GAME' ? `/games/${item.item_id}` : `/consoles/${item.item_id}`}
                                        className="flex items-center gap-3 p-3 border border-retro-grid bg-black/40 hover:bg-retro-grid/20 transition-colors group"
                                    >
                                        <div className="w-12 h-12 bg-black flex-shrink-0 flex items-center justify-center border border-gray-800">
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
                                                    {item.status}
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
            <div className="border-2 border-retro-grid bg-retro-dark p-8 shadow-[0_0_20px_rgba(0,255,157,0.1)]">
                <h2 className="text-2xl font-pixel text-center text-retro-neon mb-6">
                    {mode === 'LOGIN' && 'SYSTEM LOGIN'}
                    {mode === 'SIGNUP' && 'NEW USER REGISTRATION'}
                    {mode === 'RECOVERY' && 'PASSWORD RECOVERY'}
                    {mode === 'UPDATE_PASSWORD' && 'SET NEW PASSWORD'}
                </h2>

                {message && (
                    <div className={`p-3 mb-6 text-xs font-mono border ${
                        message.type === 'error' ? 'border-retro-pink text-retro-pink bg-retro-pink/10' : 'border-retro-neon text-retro-neon bg-retro-neon/10'
                    }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    {mode === 'SIGNUP' && (
                        <div>
                            <label className="block text-xs font-mono text-retro-blue mb-1">CODENAME (USERNAME)</label>
                            <input 
                                type="text" 
                                required 
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="w-full bg-black border border-retro-grid p-2 text-white font-mono focus:border-retro-neon outline-none"
                            />
                        </div>
                    )}

                    {(mode === 'LOGIN' || mode === 'SIGNUP' || mode === 'RECOVERY') && (
                        <div>
                            <label className="block text-xs font-mono text-retro-blue mb-1">EMAIL FREQUENCY</label>
                            <input 
                                type="email" 
                                required 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-black border border-retro-grid p-2 text-white font-mono focus:border-retro-neon outline-none"
                            />
                        </div>
                    )}

                    {(mode === 'LOGIN' || mode === 'SIGNUP' || mode === 'UPDATE_PASSWORD') && (
                        <div>
                            <label className="block text-xs font-mono text-retro-blue mb-1">SECURITY CODE</label>
                            <input 
                                type="password" 
                                required 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-black border border-retro-grid p-2 text-white font-mono focus:border-retro-neon outline-none"
                            />
                        </div>
                    )}

                    <Button type="submit" isLoading={loading} className="w-full">
                        {mode === 'LOGIN' && 'CONNECT'}
                        {mode === 'SIGNUP' && 'REGISTER'}
                        {mode === 'RECOVERY' && 'SEND LINK'}
                        {mode === 'UPDATE_PASSWORD' && 'UPDATE'}
                    </Button>
                </form>

                <div className="mt-6 flex flex-col gap-2 text-center text-xs font-mono text-gray-500">
                    {mode === 'LOGIN' && (
                        <>
                            <button onClick={() => setMode('SIGNUP')} className="hover:text-white">CREATE NEW ACCOUNT</button>
                            <button onClick={() => setMode('RECOVERY')} className="hover:text-white">LOST PASSWORD?</button>
                        </>
                    )}
                    {(mode === 'SIGNUP' || mode === 'RECOVERY') && (
                        <button onClick={() => setMode('LOGIN')} className="hover:text-white">RETURN TO LOGIN</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthSection;