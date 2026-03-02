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
    }
];

const FinderTestFlowContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const stepParam = searchParams.get('step') || 'q1';

    let stepIndex = 0;
    if (stepParam === 'results') {
        stepIndex = QUESTIONS.length;
    } else if (stepParam?.startsWith('q')) {
        const qNum = parseInt(stepParam.substring(1));
        if (!isNaN(qNum) && qNum >= 1 && qNum <= QUESTIONS.length) {
            stepIndex = qNum - 1;
        }
    }

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

        // Navigation
        if (stepIndex < QUESTIONS.length - 1) {
            params.set('step', `q${stepIndex + 2}`);
        } else {
            params.set('step', 'results');
        }

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

            {stepIndex >= QUESTIONS.length && (
                <div className="mt-8 border-t border-zinc-800 pt-8">
                    <div className="text-center p-8 bg-zinc-900 border border-zinc-800 mb-8">
                        <h2 className="text-2xl font-pixel text-white mb-4">END OF CURRENT TEST PHASE</h2>
                        <p className="text-zinc-400 mb-6 font-mono text-sm">
                            You have completed the currently implemented test questions (Q1 and Q2).<br />
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
