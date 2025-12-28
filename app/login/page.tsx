'use client';

import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { retroAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase/singleton';
import Button from '../../components/ui/Button';

type AuthMode = 'LOGIN' | 'SIGNUP' | 'RECOVERY' | 'UPDATE_PASSWORD';

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<AuthMode>('LOGIN');
    
    // Auth State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    useEffect(() => {
        // If already logged in, redirect to profile
        const checkUser = async () => {
            const currentUser = await retroAuth.getUser();
            if (currentUser) {
                router.replace('/profile');
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
                 // Redirect to profile on sign in
                 router.replace('/profile');
            }
        });
        return () => subscription.unsubscribe();
    }, [router]);

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

                // 2. Success - Redirect handled by onAuthStateChange listener or manual push
                setMessage({ type: 'success', text: 'ACCESS GRANTED. INITIALIZING...' });
                router.push('/profile');
                
            } else if (mode === 'RECOVERY') {
                const { error } = await retroAuth.resetPassword(email);
                if (error) throw error;
                setMessage({ type: 'success', text: 'RECOVERY KEY TRANSMITTED. CHECK EMAIL TERMINAL.' });
            } else if (mode === 'UPDATE_PASSWORD') {
                const { error } = await retroAuth.updateUserPassword(password);
                if (error) throw error;
                setMessage({ type: 'success', text: 'PASSCODE UPDATED. REDIRECTING...' });
                setTimeout(() => router.push('/profile'), 2000);
            }
        } catch (err: any) {
            console.error(err);
            setMessage({ type: 'error', text: err.message || 'AUTHENTICATION FAILED' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 min-h-[60vh] flex flex-col justify-center">
            <div className="border-2 border-border-normal bg-bg-primary p-8 shadow-[0_0_20px_rgba(0,255,157,0.1)] relative overflow-hidden">
                {/* Decorative lines */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>

                <h2 className="text-2xl font-pixel text-center text-secondary mb-6 drop-shadow-md">
                    {mode === 'LOGIN' && 'SYSTEM LOGIN'}
                    {mode === 'SIGNUP' && 'NEW USER REGISTRATION'}
                    {mode === 'RECOVERY' && 'PASSWORD RECOVERY'}
                    {mode === 'UPDATE_PASSWORD' && 'SET NEW PASSWORD'}
                </h2>

                {message && (
                    <div className={`p-3 mb-6 text-xs font-mono border animate-pulse ${
                        message.type === 'error' ? 'border-accent text-accent bg-accent/10' : 'border-secondary text-secondary bg-secondary/10'
                    }`}>
                        &gt; {message.text}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    {mode === 'SIGNUP' && (
                        <div>
                            <label className="block text-xs font-mono text-primary mb-1 tracking-widest">CODENAME</label>
                            <input 
                                type="text" 
                                required 
                                value={username}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                className="w-full bg-black border border-border-normal p-3 text-white font-mono focus:border-secondary outline-none transition-colors"
                                placeholder="ENTER USERNAME"
                            />
                        </div>
                    )}

                    {(mode === 'LOGIN' || mode === 'SIGNUP' || mode === 'RECOVERY') && (
                        <div>
                            <label className="block text-xs font-mono text-primary mb-1 tracking-widest">EMAIL ADDRESS</label>
                            <input 
                                type="email" 
                                required 
                                value={email}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                className="w-full bg-black border border-border-normal p-3 text-white font-mono focus:border-secondary outline-none transition-colors"
                                placeholder="USER@EXAMPLE.COM"
                            />
                        </div>
                    )}

                    {(mode === 'LOGIN' || mode === 'SIGNUP' || mode === 'UPDATE_PASSWORD') && (
                        <div>
                            <label className="block text-xs font-mono text-primary mb-1 tracking-widest">ACCESS CODE</label>
                            <input 
                                type="password" 
                                required 
                                value={password}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                className="w-full bg-black border border-border-normal p-3 text-white font-mono focus:border-secondary outline-none transition-colors"
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

                <div className="mt-6 flex flex-col gap-3 text-center text-xs font-mono text-gray-500 border-t border-border-normal pt-4">
                    {mode === 'LOGIN' && (
                        <>
                            <button onClick={() => { setMode('SIGNUP'); setMessage(null); }} className="hover:text-secondary transition-colors">ESTABLISH NEW ID</button>
                            <button onClick={() => { setMode('RECOVERY'); setMessage(null); }} className="hover:text-accent transition-colors">FORGOT ACCESS CODE?</button>
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
