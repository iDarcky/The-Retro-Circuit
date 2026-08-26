'use client';

import { useState, FormEvent } from 'react';
import { track } from '@vercel/analytics';
import { subscribeEmail } from '../../app/actions/subscribers';

type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Email capture placed at the end of Finder results — the highest-intent moment in
 * the funnel. Previously capture existed only on the homepage.
 */
export default function FinderEmailCapture() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [message, setMessage] = useState('');

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setStatus('loading');
        const result = await subscribeEmail(email, 'finder_results');
        if (result.success) {
            setStatus('success');
            setEmail('');
            try {
                track('newsletter_signup', { source: 'finder_results' });
            } catch {
                // analytics must never break the form
            }
        } else {
            setStatus('error');
        }
        setMessage(result.message);
    }

    return (
        <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 mb-12">
            <h3 className="font-pixel text-sm text-white uppercase tracking-widest mb-2">
                Get notified when a better match lands
            </h3>
            <p className="font-mono text-xs text-zinc-500 mb-6 max-w-xl">
                New handhelds launch constantly. We&apos;ll email you when something beats your pick
                — or when one of these drops in price. No spam, unsubscribe any time.
            </p>

            {status === 'success' ? (
                <p role="status" className="font-mono text-xs text-emerald-400">{message}</p>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
                    <label htmlFor="finder-email" className="sr-only">Email address</label>
                    <input
                        id="finder-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="flex-1 bg-black border border-white/20 px-4 py-3 font-mono text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500"
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="px-6 py-3 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 disabled:opacity-50 transition-colors"
                    >
                        {status === 'loading' ? 'Sending…' : 'Notify me'}
                    </button>
                </form>
            )}
            {status === 'error' && (
                <p role="alert" className="font-mono text-xs text-rose-400 mt-3">{message}</p>
            )}
        </div>
    );
}
