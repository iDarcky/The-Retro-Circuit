'use client';

/* The Finder, redesigned: Bit hosts eight quick questions, reacts to each answer and
 * presents the match. Same URL parameters and server action as the original Finder,
 * so links, analytics and the matching logic are shared. */

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Check, RotateCcw } from 'lucide-react';
import Bit from '../brand/Bit';
import { DOT_GRID } from '../arena-v2/fx';
import { QUESTIONS, checkBudgetConflict } from '../finder/FinderFlow';
import { getFinderResults, type FinderResultConsole } from '../../app/finder/actions';
import { getBuyUrl } from '../../lib/affiliate';
import AffiliateLink from '../console/AffiliateLink';
import { pairKey } from '../../lib/arena/indexable';
import * as LINES from './bit-lines';

type Q = { id: string; question: string; subtitle?: string; multiSelect?: boolean; isOptional?: boolean; isBonus?: boolean; options: { id: string; label: string; description?: string }[] };
const QS = QUESTIONS as Q[];

/** Which URL parameter each step writes. */
const PARAM = ['profile', 'form_factor_pref', 'target_tier', 'budget_band', 'portability_pref', 'setup_answer', 'features', 'aesthetic_pref'];

const KEY_BG = ['bg-violet-500', 'bg-cyan-500', 'bg-rose-500', 'bg-orange-500'];
const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500';

/* ---------- Bit with a speech bubble ---------- */

function Host({ says, sub, mood = 'idle' }: { says: string; sub?: string | null; mood?: 'idle' | 'happy' | 'worried' }) {
    return (
        <div className="flex items-end gap-3 lg:flex-col lg:items-start lg:gap-4" aria-live="polite">
            <div className="shrink-0 lg:order-2">
                <span className="lg:hidden"><Bit size={64} /></span>
                <span className="hidden lg:block"><Bit size={190} /></span>
            </div>
            <div
                key={says}
                className={`relative lg:order-1 border-2 px-4 py-3 motion-safe:animate-[floatIn_350ms_ease-out_both] ${mood === 'worried' ? 'border-orange-500 bg-orange-500 text-black' : 'border-white bg-white text-black'} mb-4 lg:mb-0 max-w-[30ch]`}
            >
                <p className="font-pixel text-[10px] lg:text-[11px] leading-relaxed">{says}</p>
                {sub && <p className="mt-2 text-[13px] leading-snug text-zinc-700">{sub}</p>}
                {/* stepped tail: points left at Bit on phones, down on desktop */}
                <span className={`absolute w-2 h-2 -left-2.5 bottom-3 lg:left-10 lg:-bottom-2.5 ${mood === 'worried' ? 'bg-orange-500' : 'bg-white'}`} />
                <span className={`absolute w-2 h-2 -left-[18px] bottom-1 lg:left-8 lg:bottom-auto lg:-bottom-[18px] ${mood === 'worried' ? 'bg-orange-500' : 'bg-white'}`} />
            </div>
        </div>
    );
}

/* ---------- Progress: eight blocks in the signal colours ---------- */

function Progress({ step }: { step: number }) {
    return (
        <div className="flex items-center gap-3">
            <span className="font-pixel text-[10px] text-text-secondary shrink-0">{String(Math.min(step + 1, QS.length)).padStart(2, '0')} / {String(QS.length).padStart(2, '0')}</span>
            <span className="flex flex-1 gap-1" aria-hidden>
                {QS.map((_, i) => (
                    <span key={i} className={`h-2 flex-1 motion-safe:transition-colors motion-safe:duration-300 ${i < step ? KEY_BG[i % 4] : i === step ? 'bg-white' : 'bg-white/10'}`} />
                ))}
            </span>
        </div>
    );
}

/* ---------- One question ---------- */

function Question({ step, onAnswer, initial }: { step: number; onAnswer: (ids: string[]) => void; initial: string[] }) {
    const q = QS[step];
    const [picked, setPicked] = useState<string[]>(initial);
    useEffect(() => setPicked(initial), [step]); // eslint-disable-line react-hooks/exhaustive-deps

    const choose = useCallback((id: string) => {
        if (!q.multiSelect) {
            setPicked([id]);
            setTimeout(() => onAnswer([id]), 180); // let the press show before moving on
            return;
        }
        setPicked((cur) => {
            if (id === 'none') return cur.includes('none') ? [] : ['none'];
            const rest = cur.filter((x) => x !== 'none');
            return rest.includes(id) ? rest.filter((x) => x !== id) : [...rest, id];
        });
    }, [q, onAnswer]);

    // Keyboard: 1-9 or A-I picks an option, Enter continues a multi-select.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement)?.tagName === 'INPUT') return;
            const k = e.key.toLowerCase();
            const n = /^[1-9]$/.test(k) ? Number(k) - 1 : /^[a-i]$/.test(k) ? k.charCodeAt(0) - 97 : -1;
            if (n >= 0 && n < q.options.length) { e.preventDefault(); choose(q.options[n].id); }
            if (k === 'enter' && q.multiSelect) { e.preventDefault(); onAnswer(picked.length ? picked : ['none']); }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [q, choose, picked, onAnswer]);

    return (
        <div key={step} className="motion-safe:animate-[floatIn_400ms_ease-out_both]">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-[-0.04em] leading-[1.05]">{q.question.replace(/^Form Factor - /, '')}</h1>
            {q.subtitle && <p className="hidden sm:block mt-3 text-text-secondary max-w-[60ch]">{q.subtitle}</p>}
            <div className={`mt-5 sm:mt-8 grid gap-2 ${q.options.length > 4 ? 'sm:grid-cols-2' : 'sm:grid-cols-2'}`}>
                {q.options.map((o, i) => {
                    const on = picked.includes(o.id);
                    return (
                        <button
                            key={o.id}
                            type="button"
                            onClick={() => choose(o.id)}
                            aria-pressed={on}
                            className={`group text-left flex items-start gap-4 border px-4 py-3 sm:py-4 transition-colors ${on ? 'bg-white text-black border-white' : 'border-white/10 hover:bg-white/[0.04] hover:border-white/30'} ${focus}`}
                        >
                            <span className={`shrink-0 w-8 h-8 flex items-center justify-center font-pixel text-[10px] text-white ${on ? 'bg-black' : KEY_BG[i % 4]} motion-safe:transition-transform group-active:translate-y-0.5`}>
                                {on && q.multiSelect ? <Check size={14} /> : String.fromCharCode(65 + i)}
                            </span>
                            <span className="min-w-0">
                                <span className="block font-semibold leading-snug">{o.label}</span>
                                {o.description && <span className={`block mt-0.5 text-sm ${on ? 'text-zinc-600' : 'text-text-secondary'}`}>{o.description.charAt(0).toUpperCase() + o.description.slice(1)}</span>}
                            </span>
                        </button>
                    );
                })}
            </div>
            {q.multiSelect && (
                <button
                    type="button"
                    onClick={() => onAnswer(picked.length ? picked : ['none'])}
                    className={`mt-6 bg-white text-black font-mono text-sm px-6 py-3 hover:bg-violet-500 hover:text-white transition-colors ${focus}`}
                >
                    {picked.length && !picked.includes('none') ? `Continue with ${picked.length} must-have${picked.length > 1 ? 's' : ''}` : 'Continue'}
                </button>
            )}
            <p className="mt-6 hidden md:block font-mono text-xs text-zinc-600">Tip: press A to {String.fromCharCode(64 + q.options.length)} to answer{q.multiSelect ? ', Enter to continue' : ''}.</p>
        </div>
    );
}

/* ---------- Results ---------- */

const LABEL_COLOR = ['bg-violet-500', 'bg-cyan-500', 'bg-rose-500'];

function BuyButton({ r, placement, className }: { r: FinderResultConsole; placement: 'finder_winner' | 'finder_alternative'; className: string }) {
    const url = getBuyUrl({ asin: r.amazon_asin, name: r.name, manufacturer: r.manufacturer?.name });
    if (!url) return null;
    return (
        <AffiliateLink href={url} productName={r.name} linkType={r.amazon_asin ? 'product' : 'search'} placement={placement} className={className}>
            {r.amazon_asin ? 'Buy on Amazon' : 'Find on Amazon'}
        </AffiliateLink>
    );
}

function answerLabel(step: number, value: string | null): string | null {
    if (!value) return null;
    const ids = value.split(',');
    const labels = ids.map((id) => QS[step].options.find((o) => o.id === id)?.label).filter(Boolean) as string[];
    return labels.join(', ') || null;
}

function Results({ params, onRestart, editHref }: { params: URLSearchParams; onRestart: () => void; editHref: (step: number) => string }) {
    const [results, setResults] = useState<FinderResultConsole[] | null>(null);
    const key = params.toString();
    useEffect(() => {
        let live = true;
        setResults(null);
        const p: Record<string, string> = {};
        params.forEach((v, k) => { p[k] = v; });
        getFinderResults(p).then((r) => { if (live) setResults(r); }).catch(() => { if (live) setResults([]); });
        return () => { live = false; };
    }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

    const gift = params.get('tone_mode') === 'gift';

    if (results === null) {
        return (
            <div className="grid lg:grid-cols-[220px_1fr] gap-5 sm:gap-8 lg:gap-16 items-start">
                <Host says={LINES.LOADING} />
                <div className="space-y-2" aria-hidden>
                    {[0, 1, 2].map((i) => <div key={i} className="h-24 bg-white/[0.04] motion-safe:animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />)}
                </div>
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="grid lg:grid-cols-[220px_1fr] gap-5 sm:gap-8 lg:gap-16 items-start">
                <Host says={LINES.NONE} mood="worried" />
                <div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-[-0.04em]">No match yet</h1>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link href={editHref(6)} className={`bg-white text-black font-mono text-sm px-6 py-3 hover:bg-violet-500 hover:text-white ${focus}`}>Change must-haves</Link>
                        <button type="button" onClick={onRestart} className={`border border-white/20 font-mono text-sm px-6 py-3 hover:bg-white hover:text-black ${focus}`}>Start over</button>
                    </div>
                </div>
            </div>
        );
    }

    const winner = results.find((r) => r.is_winner) ?? results[0];
    const others = results.filter((r) => r.id !== winner.id);
    const note = LINES.relaxedNote(winner._relaxed_features);

    return (
        <div className="grid lg:grid-cols-[220px_1fr] gap-5 sm:gap-8 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-28">
                <Host says={gift ? LINES.FOUND_GIFT : LINES.FOUND} sub={note} mood={note ? 'worried' : 'happy'} />
            </div>

            <div className="min-w-0">
                <p className="font-pixel text-[10px] text-violet-400">{gift ? 'GIFT PICKS' : 'YOUR MATCHES'}</p>

                {/* Winner */}
                <article className="mt-4 bg-violet-600 text-white grid sm:grid-cols-[minmax(0,200px)_1fr] gap-6 p-6 md:p-8 motion-safe:animate-[floatIn_600ms_ease-out_both]" style={DOT_GRID}>
                    <div className="relative aspect-[4/3] sm:aspect-square">
                        {winner.image_url && (
                            <span className="absolute inset-0 motion-safe:animate-[spriteBob_1.6s_steps(2,jump-none)_infinite]">
                                <Image src={winner.image_url} alt={winner.name} fill sizes="200px" className="object-contain" priority />
                            </span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <span className="inline-block bg-white text-black font-pixel text-[9px] px-2 py-1.5">{(winner.match_label ?? 'Best match').toUpperCase()}</span>
                        <p className="mt-4 text-sm text-violet-100">{winner.manufacturer?.name}</p>
                        <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.04em] leading-[1.02]">{winner.name}</h2>
                        {winner.price ? <p className="mt-3 font-pixel text-2xl">${winner.price}</p> : null}
                        {winner.match_reason && <p className="mt-4 text-violet-50 leading-relaxed max-w-[56ch]">{winner.match_reason}</p>}
                        <div className="mt-6 flex flex-wrap gap-3">
                            <BuyButton r={winner} placement="finder_winner" className={`bg-white text-black font-mono text-sm px-5 py-3 hover:bg-black hover:text-white ${focus}`} />
                            <Link href={`/consoles/${winner.slug}`} className={`border border-white/40 font-mono text-sm px-5 py-3 hover:bg-white hover:text-black ${focus}`}>Full specs</Link>
                        </div>
                    </div>
                </article>

                {/* Alternatives */}
                {others.length > 0 && (
                    <div className="mt-2 grid sm:grid-cols-2 gap-2">
                        {others.map((r, i) => (
                            <article key={r.id} className="border border-white/10 p-5 flex flex-col motion-safe:animate-[floatIn_600ms_ease-out_both]" style={{ animationDelay: `${150 + i * 120}ms` }}>
                                <div className="flex items-start gap-4">
                                    <span className="relative w-20 h-20 shrink-0">{r.image_url && <Image src={r.image_url} alt="" fill sizes="80px" className="object-contain" />}</span>
                                    <div className="min-w-0">
                                        <span className={`inline-block ${LABEL_COLOR[i + 1]} text-black font-pixel text-[8px] px-2 py-1`}>{(r.match_label ?? 'Also great').toUpperCase()}</span>
                                        <h3 className="mt-2 text-xl font-bold leading-tight">{r.name}</h3>
                                        {r.price ? <p className="mt-1 font-mono text-cyan-400">${r.price}</p> : null}
                                    </div>
                                </div>
                                {r.match_reason && <p className="mt-4 text-sm text-zinc-300 leading-relaxed">{r.match_reason}</p>}
                                <div className="mt-auto pt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs">
                                    <Link href={`/consoles/${r.slug}`} className={`text-white hover:text-violet-400 ${focus}`}>Full specs</Link>
                                    <Link href={`/arena/${pairKey(winner.slug, r.slug)}`} className={`text-violet-400 hover:text-white ${focus}`}>Compare with {winner.name}</Link>
                                    <BuyButton r={r} placement="finder_alternative" className={`text-text-secondary hover:text-white ${focus}`} />
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Your answers */}
                <section className="mt-12" aria-labelledby="answers-heading">
                    <h2 id="answers-heading" className="font-pixel text-[10px] text-text-secondary">YOUR ANSWERS</h2>
                    <ul className="mt-4 flex flex-wrap gap-2">
                        {PARAM.map((p, i) => {
                            const label = answerLabel(i, params.get(p));
                            if (!label) return null;
                            return (
                                <li key={p}>
                                    <Link href={editHref(i)} className={`group inline-flex items-center gap-2 border border-white/10 px-3 py-2 text-sm hover:bg-white hover:text-black ${focus}`}>
                                        <span className={`w-2 h-2 ${KEY_BG[i % 4]}`} />{label}
                                        <span className="font-mono text-[11px] text-zinc-500 group-hover:text-black">change</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    <button type="button" onClick={onRestart} className={`mt-6 inline-flex items-center gap-2 font-mono text-sm text-text-secondary hover:text-white ${focus}`}>
                        <RotateCcw size={14} /> Start over
                    </button>
                </section>
            </div>
        </div>
    );
}

/* ---------- Flow ---------- */

function FinderV2Content({ base }: { base: string }) {
    const router = useRouter();
    const params = useSearchParams();
    const stepParam = params.get('step') || 'q1';
    const step = stepParam === 'results' ? QS.length : stepParam === 'conflict' ? -1 : Math.max(0, Math.min(QS.length - 1, (parseInt(stepParam.slice(1)) || 1) - 1));

    const go = useCallback((p: URLSearchParams) => {
        router.push(`${base}?${p.toString()}`, { scroll: false });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [router, base]);

    const answer = useCallback((ids: string[]) => {
        const p = new URLSearchParams(params.toString());
        const value = ids.join(',');
        p.set(PARAM[step], value);
        if (step === 0) {
            if (value === 'gift') p.set('tone_mode', 'gift'); else p.delete('tone_mode');
        }
        if (step === 3 && checkBudgetConflict(p.get('target_tier'), p.get('budget_band'))) {
            p.set('step', 'conflict');
        } else {
            p.set('step', step < QS.length - 1 ? `q${step + 2}` : 'results');
        }
        go(p);
    }, [params, step, go]);

    const editHref = (i: number) => {
        const p = new URLSearchParams(params.toString());
        p.set('step', `q${i + 1}`);
        return `${base}?${p.toString()}`;
    };

    // What Bit says: a reaction to the previous answer, then the nudge for this step.
    const lastAnswer = step > 0 && step < QS.length ? params.get(PARAM[step - 1])?.split(',')[0] : null;
    const reaction = lastAnswer ? LINES.REACTION[lastAnswer] : null;

    const conflict = useMemo(() => (stepParam === 'conflict' ? checkBudgetConflict(params.get('target_tier'), params.get('budget_band')) : null), [stepParam, params]);

    if (stepParam === 'conflict' && conflict) {
        const resolve = (action: 'lower' | 'raise' | 'keep') => {
            const p = new URLSearchParams(params.toString());
            if (action === 'lower') p.set('target_tier', conflict.lowerTierId);
            if (action === 'raise') p.set('budget_band', conflict.minRequiredBudgetId);
            p.set('step', 'q5');
            go(p);
        };
        return (
            <div className="grid lg:grid-cols-[220px_1fr] gap-5 sm:gap-8 lg:gap-16 items-start">
                <Host says={LINES.CLASH} mood="worried" />
                <div className="motion-safe:animate-[floatIn_400ms_ease-out_both]">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-[-0.04em] leading-[1.05]">Budget or power?</h1>
                    <p className="mt-3 text-text-secondary max-w-[60ch]">
                        Handhelds that run {conflict.tierName} well start around ${conflict.minBudget}. Under ${conflict.budgetVal}, the best experience is {conflict.lowerTier}.
                    </p>
                    <div className="mt-8 grid gap-2">
                        {[
                            { a: 'lower' as const, t: `Stay under $${conflict.budgetVal}`, d: `Show the best for ${conflict.lowerTier}. Recommended.` },
                            { a: 'raise' as const, t: `Stretch the budget`, d: `Show the cheapest handhelds that do ${conflict.tierName}.` },
                            { a: 'keep' as const, t: 'Keep both as they are', d: 'Show the closest match, even if it is over budget.' },
                        ].map((o, i) => (
                            <button key={o.a} type="button" onClick={() => resolve(o.a)} className={`text-left flex items-start gap-4 border border-white/10 px-4 py-4 hover:bg-white/[0.04] hover:border-white/30 ${focus}`}>
                                <span className={`shrink-0 w-8 h-8 flex items-center justify-center font-pixel text-[10px] text-white ${KEY_BG[i]}`}>{String.fromCharCode(65 + i)}</span>
                                <span><span className="block font-semibold">{o.t}</span><span className="block mt-0.5 text-sm text-text-secondary">{o.d}</span></span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (step === QS.length) {
        return <Results params={params} onRestart={() => go(new URLSearchParams())} editHref={editHref} />;
    }

    const initial = params.get(PARAM[step])?.split(',') ?? [];

    return (
        <div className="grid lg:grid-cols-[220px_1fr] gap-5 sm:gap-8 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-28">
                <Host says={reaction ?? LINES.PROMPT[step]} sub={reaction ? LINES.PROMPT[step] : null} />
            </div>
            <div className="min-w-0">
                <div className="flex items-center gap-4 mb-8">
                    {step > 0 && (
                        <button type="button" onClick={() => router.back()} className={`shrink-0 inline-flex items-center gap-1.5 font-mono text-xs text-text-secondary hover:text-white ${focus}`}>
                            <ArrowLeft size={14} /> Back
                        </button>
                    )}
                    <div className="flex-1"><Progress step={step} /></div>
                </div>
                <Question step={step} onAnswer={answer} initial={initial} />
            </div>
        </div>
    );
}

export default function FinderV2({ base = '/finder' }: { base?: string }) {
    return (
        <Suspense fallback={<div className="min-h-[60vh]" />}>
            <FinderV2Content base={base} />
        </Suspense>
    );
}
