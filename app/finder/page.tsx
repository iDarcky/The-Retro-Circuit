import { Metadata } from 'next';
import { FinderFlow } from '@/components/finder/FinderFlow';

export const metadata: Metadata = {
    title: 'Handheld Finder | The Retro Circuit',
    description: 'Test page for iterating on the new Finder algorithm.',
};

export default function FinderTestPage() {
    return (
        <main className="min-h-screen bg-bg-primary text-text-primary pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-pixel text-white mb-4 text-center">FINDER_</h1>
                <div className="mb-8 p-4 bg-orange-500/10 border border-orange-500/30 text-center font-mono text-sm text-orange-400">
                    The finder is still a work in progress - have fun
                </div>
                <FinderFlow />
            </div>
        </main>
    );
}
