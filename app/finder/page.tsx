import { Metadata } from 'next';
import { FinderFlow } from '@/components/finder/FinderFlow';

export const metadata: Metadata = {
    title: { absolute: 'Find the Best Retro Handheld for You | The Retro Circuit Quiz' },
    description: "Not sure which retro handheld to buy? Answer a few quick questions about your budget and emulation needs, and we'll match you with the perfect device.",
};

export default function FinderTestPage() {
    return (
        <main className="min-h-screen bg-bg-primary text-text-primary pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-pixel text-white mb-4 text-center flex items-center justify-center gap-3">
                    FINDER_
                    <span className="font-mono text-[10px] px-2 py-0.5 border border-orange-500/30 text-orange-400 uppercase tracking-widest align-middle">Beta</span>
                </h1>
                <p className="mb-8 text-center font-mono text-xs text-gray-500">
                    Answer a few questions and we&apos;ll match you to a handheld. Fresh feature — tell us if a match feels off.
                </p>
                <FinderFlow />
            </div>
        </main>
    );
}
