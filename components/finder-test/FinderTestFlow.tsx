'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QuizQuestion } from '@/components/finder/QuizQuestion';

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
    if (stepParam?.startsWith('q')) {
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

        // For the test page we just stop after Q1 for now to show the user
        // In future iterations we will navigate to the next step
        router.push(`/finder-test?${params.toString()}`);
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
                <div className="text-center p-8 bg-zinc-900 border border-zinc-800">
                    <h2 className="text-2xl font-pixel text-white mb-4">END OF TEST</h2>
                    <p className="text-zinc-400 mb-6 font-mono text-sm">You have reached the end of the currently implemented test flow.</p>
                    <button
                        onClick={() => router.push('/finder-test')}
                        className="px-6 py-3 bg-white text-black font-pixel text-xs hover:bg-zinc-200"
                    >
                        RESTART TEST
                    </button>
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
