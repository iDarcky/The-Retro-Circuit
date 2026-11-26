import type { Metadata } from 'next';
import FinderV2 from '../../components/finder-v2/FinderV2';

// Beta mockup of the redesigned Finder. Served on /finder in the beta branch through a rewrite.
export const metadata: Metadata = {
    title: { absolute: 'Find the Best Retro Handheld for You | The Retro Circuit' },
    robots: { index: false, follow: false },
};

export default function FinderPreviewPage() {
    return (
        <main className="flex-1 bg-bg-primary text-text-primary font-sans">
            <div className="max-w-[1200px] mx-auto px-5 md:px-12 pt-8 md:pt-16 pb-12">
                <FinderV2 base="/finder" />
            </div>
        </main>
    );
}
