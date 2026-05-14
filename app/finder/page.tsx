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
                <h1 className="text-4xl font-pixel text-white mb-8 text-center">FINDER_</h1>
                <FinderFlow />
            </div>
        </main>
    );
}
