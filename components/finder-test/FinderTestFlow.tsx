'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QuizQuestion } from '@/components/finder/QuizQuestion';
import { FinderResults } from '@/components/finder/FinderResults';

const QUESTIONS = [
    {
        id: 'q1',
        question: "What best describes you?",
        subtitle: "This helps us understand what you’ll care about most when we pick your top matches.",
        options: [
            { id: 'nostalgia', label: 'Nostalgia hunter', description: 'Reliving childhood classics' },
            { id: 'completionist', label: 'Completionist', description: "Gotta catch 'em all" },
            { id: 'performance', label: 'Performance chaser', description: 'Wants the most powerful option' },
            { id: 'onthego', label: 'On-the-go', description: 'Commuter, traveler' },
            { id: 'gift', label: 'Finding the perfect gift', description: 'For someone special' },
        ]
    },
    {
        id: 'q2',
        question: "Form Factor - How do you want to hold it?",
        subtitle: "This is mostly about comfort and nostalgia — we’ll prioritize your preferred shape when we can.",
        options: [
            { id: 'horizontal', label: 'Classic horizontal (like Game Boy Advance)' },
            { id: 'vertical', label: 'Vertical pocket device (like original Game Boy)' },
            { id: 'clamshell', label: 'Clamshell flip-style (like DS/GBA SP)' },
            { id: 'surprise', label: 'Surprise me!' },
        ]
    },
    {
        id: 'q3',
        question: "What do you mainly want to play?",
        subtitle: "We’ll make sure your top matches can handle these systems perfectly.",
        options: [
            { id: '8bit', label: '8-16 bit era', description: 'NES, SNES, Game Boy, Genesis' },
            { id: '32bit', label: 'PlayStation 1 & Nintendo 64', description: 'The early 3D era' },
            { id: '2000s', label: '2000s Handhelds', description: 'GBA, PSP, Nintendo DS' },
            { id: '6thgen', label: '6th generation consoles', description: 'PS2, GameCube, Dreamcast' },
            { id: 'modern', label: 'Modern Era', description: 'Switch, PS3, Vita, 3DS' },
        ]
    },
    {
        id: 'q4',
        question: "What's your budget?",
        subtitle: "We’ll aim to stay inside your range. If your performance target needs more power, we’ll show the closest option and explain why.",
        options: [
            { id: 'b_under_60', label: 'Budget-friendly', description: 'Under $60' },
            { id: 'b_60_120', label: 'Sweet spot', description: '$60–$120' },
            { id: 'b_120_180', label: 'Mid-range', description: '$120–$180' },
            { id: 'b_180_300', label: 'High-end', description: '$180–$300' },
            { id: 'b_300_plus', label: 'No budget limit', description: '$300+' },
        ]
    }
];

// --- CONFLICT LOGIC ---
const checkBudgetConflict = (tier: string | null, budget: string | null) => {
    if (!tier || !budget) return null;

    if (tier === 'modern' && (budget === 'b_under_60' || budget === 'b_60_120')) {
        return {
            tierName: 'Switch/PS3',
            minBudget: 150,
            budgetVal: budget === 'b_under_60' ? 60 : 120,
            lowerTier: '2000s Handhelds (PSP/DS) or PS1/N64',
            lowerTierId: '2000s',
            minRequiredBudgetId: 'b_120_180'
        };
    }

    if (tier === '6thgen' && budget === 'b_under_60') {
        return {
            tierName: 'PS2/GameCube',
            minBudget: 100,
            budgetVal: 60,
            lowerTier: 'PS1/N64 and below',
            lowerTierId: '32bit',
            minRequiredBudgetId: 'b_60_120'
        };
    }

    return null;
};

const FinderTestFlowContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isClient, setIsClient] = useState(false);
    const [conflictState, setConflictState] = useState<any>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const stepParam = searchParams.get('step') || 'q1';

    let stepIndex = 0;
    if (stepParam === 'results') {
        stepIndex = QUESTIONS.length;
    } else if (stepParam === 'conflict') {
        stepIndex = QUESTIONS.length + 1; // Special Step
    } else if (stepParam?.startsWith('q')) {
        const qNum = parseInt(stepParam.substring(1));
        if (!isNaN(qNum) && qNum >= 1 && qNum <= QUESTIONS.length) {
            stepIndex = qNum - 1;
        }
    }

    useEffect(() => {
        if (stepParam === 'results') {
            const tier = searchParams.get('target_tier');
            const budget = searchParams.get('budget_band');
            const conflict = checkBudgetConflict(tier, budget);
            if (conflict) {
                setConflictState(conflict);
                const newParams = new URLSearchParams(searchParams.toString());
                newParams.set('step', 'conflict');
                router.replace(`/finder-test?${newParams.toString()}`);
            }
        }
    }, [stepParam, searchParams, router]);

    const handleAnswer = (answer: string | string[]) => {
        const params = new URLSearchParams(searchParams.toString());
        const optionId = Array.isArray(answer) ? answer.join(',') : answer;

        // Q1 Logic
        if (stepIndex === 0) {
            params.set('profile', optionId);

            if (optionId === 'gift') {
                params.set('tone_mode', 'gift');
            } else {
                params.delete('tone_mode');
            }
        }

        // Q2 Logic
        if (stepIndex === 1) {
            params.set('form_factor_pref', optionId);
        }

        // Q3 Logic
        if (stepIndex === 2) {
            params.set('target_tier', optionId);
        }

        // Q4 Logic
        if (stepIndex === 3) {
            params.set('budget_band', optionId);
        }

        // Navigation
        if (stepIndex < QUESTIONS.length - 1) {
            params.set('step', `q${stepIndex + 2}`);
        } else {
            params.set('step', 'results');
        }

        router.push(`/finder-test?${params.toString()}`);
    };

    const resolveConflict = (action: 'lower_tier' | 'increase_budget' | 'ignore') => {
        const params = new URLSearchParams(searchParams.toString());

        if (action === 'lower_tier' && conflictState) {
            params.set('target_tier', conflictState.lowerTierId);
        } else if (action === 'increase_budget' && conflictState) {
            params.set('budget_band', conflictState.minRequiredBudgetId);
        }

        params.set('step', 'results');
        setConflictState(null);
        router.push(`/finder-test?${params.toString()}`);
    };

    const handleRestart = () => {
        router.push('/finder-test');
    };

    if (!isClient) return null;

    return (
        <div className="relative pb-12">
            <div className="mb-8 p-4 bg-zinc-900 border border-zinc-800 rounded-lg overflow-auto">
                <h3 className="font-mono text-zinc-400 text-sm mb-2">DEBUG STATE:</h3>
                <pre className="font-mono text-xs text-emerald-400">
                    {JSON.stringify(Object.fromEntries(searchParams.entries()), null, 2)}
                </pre>
            </div>

            {stepIndex >= 0 && stepIndex < QUESTIONS.length && (
                <QuizQuestion
                    question={QUESTIONS[stepIndex].question}
                    subtitle={QUESTIONS[stepIndex].subtitle}
                    options={QUESTIONS[stepIndex].options as any}
                    onAnswer={handleAnswer}
                    stepNumber={stepIndex + 1}
                    totalSteps={QUESTIONS.length}
                    isOptional={(QUESTIONS[stepIndex] as any).isOptional}
                    isBonus={(QUESTIONS[stepIndex] as any).isBonus}
                    multiSelect={(QUESTIONS[stepIndex] as any).multiSelect}
                />
            )}

            {stepParam === 'conflict' && conflictState && (
                <div className="max-w-2xl mx-auto p-8 bg-zinc-900 border border-orange-500/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
                    <h2 className="text-2xl font-pixel text-orange-400 mb-4">Your picks clash a bit — here’s the trade-off</h2>
                    <p className="text-zinc-300 font-mono text-sm mb-8 leading-relaxed">
                        Devices that can run <strong className="text-white">{conflictState.tierName}</strong> reliably start above <strong className="text-white">${conflictState.minBudget}</strong>.
                        Under <strong className="text-white">${conflictState.budgetVal}</strong>, the best experience is typically <strong className="text-white">{conflictState.lowerTier}</strong>.
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => resolveConflict('lower_tier')}
                            className="bg-white text-black hover:bg-zinc-200 font-pixel text-xs py-4 px-6 text-left"
                        >
                            <span className="text-zinc-500 mr-2">[RECOMMENDED]</span>
                            Show best under ${conflictState.budgetVal} for {conflictState.lowerTier}
                        </button>
                        <button
                            onClick={() => resolveConflict('increase_budget')}
                            className="border border-white/20 text-white hover:bg-white/10 font-pixel text-xs py-4 px-6 text-left transition-colors"
                        >
                            Show the cheapest devices that can do {conflictState.tierName}
                        </button>
                        <button
                            onClick={() => resolveConflict('ignore')}
                            className="text-zinc-500 hover:text-white font-mono text-xs py-4 px-6 text-center underline decoration-zinc-800 underline-offset-4 transition-colors"
                        >
                            Show closest match (Show best overall even if over budget)
                        </button>
                    </div>
                </div>
            )}

            {stepIndex === QUESTIONS.length && stepParam === 'results' && (
                <div className="mt-8 border-t border-zinc-800 pt-8">
                    <div className="text-center p-8 bg-zinc-900 border border-zinc-800 mb-8">
                        <h2 className="text-2xl font-pixel text-white mb-4">END OF CURRENT TEST PHASE</h2>
                        <p className="text-zinc-400 mb-6 font-mono text-sm">
                            You have completed the currently implemented test questions (Q1 - Q4).<br />
                            Below are the live results based <strong>only</strong> on these parameters.
                        </p>
                    </div>

                    <FinderResults onRestart={handleRestart} />
                </div>
            )}
        </div>
    );
};

export const FinderTestFlow = () => {
    return (
        <Suspense fallback={<div className="min-h-screen bg-bg-primary" />}>
            <FinderTestFlowContent />
        </Suspense>
    );
};
