import React, { useState } from 'react';
import { retroAuth } from '../services/geminiService';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

type AuthMode = 'LOGIN' | 'SIGNUP' | 'RECOVERY';

const AuthSection: React.FC = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<AuthMode>('LOGIN');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (mode === 'SIGNUP') {
                const { error } = await retroAuth.signUp(email, password);
                if (error) throw error;
                setMessage({ type: 'success', text: 'SIGNAL SENT. CHECK YOUR INBOX TO VERIFY UPLINK.' });
            } else if (mode === 'LOGIN') {
                const { error } = await retroAuth.signIn(email, password);
                if (error) throw error;
                // Redirect on success
                navigate('/news');
            } else if (mode === 'RECOVERY') {
                const { error } = await retroAuth.resetPassword(email);
                if (error) throw error;
                setMessage({ type: 'success', text: 'RECOVERY KEY TRANSMITTED. CHECK EMAIL TERMINAL.' });
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message.toUpperCase() || 'ACCESS DENIED' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-full border-2 border-retro-grid bg-retro-dark p-8 relative shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                {/* Decorative bits */}
                <div className="absolute top-2 left-2 w-2 h-2 bg-retro-neon animate-pulse"></div>
                <div className="absolute top-2 right-2 w-2 h-2 bg-retro-neon animate-pulse"></div>
                <div className="absolute bottom-2 left-2 w-2 h-2 bg-retro-neon"></div>
                <div className="absolute bottom-2 right-2 w-2 h-2 bg-retro-neon"></div>

                <div className="text-center mb-8 border-b-2 border-retro-grid pb-4">
                    <h2 className="text-3xl font-pixel text-retro-neon mb-2 drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                        {mode === 'RECOVERY' ? 'SYSTEM RECOVERY' : 'ACCESS CONTROL'}
                    </h2>
                    <p className="font-mono text-retro-blue text-xs uppercase tracking-widest">
                        {mode === 'RECOVERY' ? 'RESTORE LOST CREDENTIALS' : 'SECURE MAINFRAME ENTRY'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                    <div>
                        <label className="block font-mono text-xs text-retro-pink mb-1 uppercase">User ID (Email)</label>
                        <input 
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/50 border-2 border-retro-grid p-3 text-white font-mono focus:border-retro-neon focus:shadow-[0_0_10px_rgba(0,255,157,0.3)] outline-none transition-all"
                            placeholder="USER@RETRO.NET"
                        />
                    </div>

                    {mode !== 'RECOVERY' && (
                        <div>
                            <label className="block font-mono text-xs text-retro-pink mb-1 uppercase">Passcode</label>
                            <input 
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border-2 border-retro-grid p-3 text-white font-mono focus:border-retro-neon focus:shadow-[0_0_10px_rgba(0,255,157,0.3)] outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    )}

                    {message && (
                        <div className={`p-3 border font-mono text-xs text-center ${
                            message.type === 'error' 
                                ? 'border-retro-pink text-retro-pink bg-retro-pink/10' 
                                : 'border-retro-neon text-retro-neon bg-retro-neon/10'
                        }`}>
                            {message.type === 'error' ? '⚠ ' : '✓ '}{message.text}
                        </div>
                    )}

                    <div className="pt-4">
                        <Button type="submit" isLoading={loading} variant={mode === 'SIGNUP' ? "secondary" : "primary"} className="w-full">
                            {mode === 'SIGNUP' ? "INITIATE REGISTRATION" : mode === 'RECOVERY' ? "TRANSMIT RECOVERY KEY" : "AUTHENTICATE"}
                        </Button>
                    </div>
                </form>

                <div className="mt-6 flex flex-col gap-2 text-center">
                    {mode === 'LOGIN' && (
                        <>
                            <button 
                                onClick={() => { setMode('SIGNUP'); setMessage(null); }}
                                className="font-mono text-xs text-gray-500 hover:text-retro-blue underline decoration-dotted uppercase"
                            >
                                REQUEST NEW ACCESS ID (SIGN UP)
                            </button>
                            <button 
                                onClick={() => { setMode('RECOVERY'); setMessage(null); }}
                                className="font-mono text-xs text-gray-500 hover:text-retro-pink underline decoration-dotted uppercase"
                            >
                                LOST PASSCODE?
                            </button>
                        </>
                    )}
                    {(mode === 'SIGNUP' || mode === 'RECOVERY') && (
                        <button 
                            onClick={() => { setMode('LOGIN'); setMessage(null); }}
                            className="font-mono text-xs text-gray-500 hover:text-retro-blue underline decoration-dotted uppercase"
                        >
                            RETURN TO LOGIN
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-8 font-mono text-[10px] text-gray-600 text-center max-w-xs">
                WARNING: UNAUTHORIZED ACCESS IS A VIOLATION OF INTERGALACTIC TREATY 404. ALL ATTEMPTS ARE LOGGED.
            </div>
        </div>
    );
};

export default AuthSection;