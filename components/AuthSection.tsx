
import React, { useState, useEffect } from 'react';
import { retroAuth } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

type AuthMode = 'LOGIN' | 'SIGNUP' | 'RECOVERY' | 'UPDATE_PASSWORD' | 'PROFILE';

const AuthSection: React.FC = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<AuthMode>('LOGIN');
    
    // Auth State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [user, setUser] = useState<any>(null);
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    // Initial check for recovery mode & Session
    useEffect(() => {
        // 1. Check current user session
        const checkUser = async () => {
            const currentUser = await retroAuth.getUser();
            if (currentUser) {
                setUser(currentUser);
                setMode('PROFILE');
            }
        };
        checkUser();

        // 2. Check if index.tsx set the recovery flag
        if (sessionStorage.getItem('retro_recovery_pending') === 'true') {
            setMode('UPDATE_PASSWORD');
            setMessage({ type: 'success', text: 'IDENTITY VERIFIED. ENTER NEW PASSCODE.' });
            sessionStorage.removeItem('retro_recovery_pending');
        }

        // 3. Listen for real-time auth events
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "PASSWORD_RECOVERY") {
                setMode('UPDATE_PASSWORD');
                setMessage({ type: 'success', text: 'IDENTITY VERIFIED. ENTER NEW PASSCODE.' });
            } else if (event === "SIGNED_IN" && session) {
                setUser(session.user);
                setMode('PROFILE');
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
                // Redirect/State change handled by onAuthStateChange
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

    // RENDER: PROFILE VIEW
    if (mode === 'PROFILE' && user) {
        return (
            <div className="w-full max-w-lg mx-auto p-4 border-2 border-retro-neon bg-retro-dark shadow-[0_0_20px_rgba(0,255,157,0.2)] text-center">
                <div className="bg-retro-neon text-retro-dark font-pixel py-2 mb-6">
                    PILOT CREDENTIALS
                </div>
                
                <div className="w-24 h-24 mx-auto bg-retro-grid/50 border-2 border-retro-blue rounded-full flex items-center justify-center mb-6 overflow-hidden relative group">
                    <svg className="w-12 h-12 text-retro-neon group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <div className="absolute inset-0 border-2 border-retro-blue rounded-full animate-pulse-fast"></div>
                </div>

                <div className="space-y-4 mb-8 text-left px-8 font-mono text-retro-blue">
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">CODENAME</label>
                        <div className="border-b border-retro-grid pb-1">{user.user_metadata?.username || 'UNKNOWN'}</div>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">EMAIL FREQUENCY</label>
                        <div className="border-b border-retro-grid pb-1">{user.email}</div>
                    </div>
                </div>

                <Button onClick={handleLogout} variant="danger" isLoading={loading}>
                    ABORT SESSION (LOGOUT)
                </Button>
            </div>
        );
    }

    // RENDER: AUTH FORMS
    return (
        <div className="w-full max-w-md mx-auto p-4">
             <div className="border-4 border-retro-grid bg-retro-dark p-8 relative overflow-hidden">
                {/* Header */}
                <h2 className="text-2xl font-pixel text-center text-retro-neon mb-8 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                    {mode === 'LOGIN' && 'ACCESS CONTROL'}
                    {mode === 'SIGNUP' && 'NEW RECRUIT'}
                    {mode === 'RECOVERY' && 'LOST SIGNAL?'}
                    {mode === 'UPDATE_PASSWORD' && 'RESET CODES'}
                </h2>

                {/* Message Display */}
                {message && (
                    <div className={`mb-6 p-3 text-xs font-mono border ${
                        message.type === 'error' ? 'border-retro-pink text-retro-pink bg-retro-pink/10' : 'border-retro-neon text-retro-neon bg-retro-neon/10'
                    }`}>
                        {message.type === 'error' ? '⚠ ' : '✔ '} {message.text}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-6">
                    {/* Username Field - Only for Signup */}
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

                    {/* Email Field - Not for Update Password */}
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

                    {/* Password Field - Not for Recovery */}
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

                {/* Footer Links */}
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
