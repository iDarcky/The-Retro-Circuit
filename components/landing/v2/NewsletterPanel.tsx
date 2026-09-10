'use client';

import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { subscribeEmail } from '../../../app/actions/subscribers';

type Status = 'idle' | 'loading' | 'success' | 'error';

/* The newsletter, given a section instead of a strip.
 *
 * Two changes over the old EmailCTA, both deliberate. It is violet rather than rose,
 * because in this system rose means error, danger and legal, and a signup form is
 * none of those. And the copy says what the email contains rather than asking the
 * reader to "stay in the loop".
 */
export default function NewsletterPanel({ deviceCount }: { deviceCount: number }) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [message, setMessage] = useState('');

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        const result = await subscribeEmail(email, 'homepage');

        if (result.success) {
            setStatus('success');
            setMessage(result.message);
            setEmail('');
        } else {
            setStatus('error');
            setMessage(result.message);
        }
    }

    return (
        <section className="border-b border-border-subtle px-6 py-12 md:px-12 md:py-16">
            <div className="mx-auto max-w-[1600px]">
                <div className="grid gap-8 border border-violet-500/40 bg-bg-secondary/40 p-6 md:grid-cols-2 md:items-center md:gap-12 md:p-10">
                    <div>
                        <h2 className="font-mono text-2xl font-bold tracking-tight text-white md:text-3xl">
                            New devices, once a month
                        </h2>
                        <p className="mt-3 max-w-md text-text-secondary">
                            What went into the catalogue, what the specs turned out to be, and which
                            releases are worth waiting for. Nothing else.
                        </p>
                    </div>

                    <div>
                        {status === 'success' ? (
                            <p className="border border-violet-500 bg-violet-600/10 px-4 py-4 font-mono text-sm text-violet-300">
                                {message}
                            </p>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                                <label htmlFor="landing-newsletter" className="font-mono text-[11px] uppercase tracking-widest text-text-muted">
                                    Email address
                                </label>
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <input
                                        id="landing-newsletter"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (status === 'error') setStatus('idle');
                                        }}
                                        aria-describedby="landing-newsletter-note"
                                        aria-invalid={status === 'error'}
                                        className="min-w-0 flex-1 border border-border-normal bg-bg-primary px-4 py-3 font-mono text-sm text-white transition-colors placeholder:text-text-muted focus:border-violet-500 focus:outline-none"
                                        placeholder="you@example.com"
                                    />
                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="inline-flex items-center justify-center gap-2 border border-violet-500 bg-violet-600 px-6 py-3 font-mono text-sm uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe'}
                                    </button>
                                </div>
                                <p id="landing-newsletter-note" className="font-mono text-[11px] text-text-muted">
                                    {deviceCount} devices catalogued so far. Unsubscribe in one click.
                                </p>
                                {status === 'error' && (
                                    <p role="alert" className="font-mono text-xs text-rose-400">
                                        {message}
                                    </p>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
