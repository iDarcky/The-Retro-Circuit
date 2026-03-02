import { Metadata } from 'next';
import { FinderTestFlow } from '@/components/finder-test/FinderTestFlow';

export const metadata: Metadata = {
    title: 'Finder Test - The Retro Circuit',
    description: 'Test page for iterating on the new Finder algorithm.',
};

export default function FinderTestPage() {
    return (
        <main className="min-h-screen bg-bg-primary text-text-primary pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-pixel text-white mb-8 text-center">FINDER V2 (TEST)_</h1>
                <FinderTestFlow />
            </div>
        </main>
    );
}
