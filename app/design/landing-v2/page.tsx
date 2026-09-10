import type { Metadata } from 'next';
import LandingV2 from '@/components/landing/v2/LandingV2';

/* Preview route for the landing-page redesign.
 *
 * Lives under /design so it inherits that layout's robots noindex, and so the live
 * homepage is untouched until the redesign is signed off. Adopting it is a one-line
 * swap of the import in app/page.tsx.
 */
export const revalidate = false;

export const metadata: Metadata = {
    title: { absolute: 'Landing v2 preview' },
};

export default function LandingV2Preview() {
    return (
        <div className="w-full">
            <div className="border-b border-orange-500/40 bg-orange-500/10 px-6 py-2 font-mono text-[11px] uppercase tracking-widest text-orange-400 md:px-12">
                Preview — landing redesign. Not the live homepage.
            </div>
            <LandingV2 />
        </div>
    );
}
