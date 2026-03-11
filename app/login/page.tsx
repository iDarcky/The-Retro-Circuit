'use client';

import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { retroAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase/singleton';
import SwissButton from '@/components/console/swiss/SwissButton';

export default function LoginPage() {
    const router = useRouter();

    // Auth State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_IN" && session) {
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
            // 1. Perform Login
            const { error } = await retroAuth.signIn(email, password);
            if (error) throw error;

            // 2. Success - Redirect handled by onAuthStateChange listener or manual push
            setMessage({ type: 'success', text: 'ACCESS GRANTED. INITIALIZING...' });
            router.push('/profile');

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
                    SYSTEM LOGIN
                </h2>

                {message && (
                    <div className={`p-3 mb-6 text-xs font-mono border animate-pulse ${message.type === 'error' ? 'border-accent text-accent bg-accent/10' : 'border-secondary text-secondary bg-secondary/10'
                        }`}>
                        &gt; {message.text}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-xs font-mono text-primary mb-1 tracking-widest">EMAIL ADDRESS</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            className="w-full bg-black border border-border-normal p-3 text-white font-mono focus:border-secondary outline-none transition-colors"
                            placeholder="USER@EXAMPLE.COM"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs font-mono text-primary mb-1 tracking-widest">ACCESS CODE</label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            className="w-full bg-black border border-border-normal p-3 text-white font-mono focus:border-secondary outline-none transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <SwissButton type="submit" isLoading={loading} className="w-full mt-6">
                        INITIATE CONNECTION
                    </SwissButton>
                </form>
            </div>
        </div>
    );
}
