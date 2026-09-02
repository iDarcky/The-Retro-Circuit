import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';
import { fetchAsinWorklist, fetchBuyLinkWorklist, fetchLinkReview } from '../../actions/commerce';
import RevenueClient from '../../../components/admin/RevenueClient';

/* Everything standing between a published console and a reader who can buy it.
 *
 * This replaced /admin/asins, /admin/buy-links and /admin/links, which were three nav
 * items for one job. Per-console work moved the other way: an individual console's ASIN
 * and vendor links are edited in that console's editor, where you already are when you
 * know the answer. What is left here is the catalogue-wide sweep. */

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Revenue | Admin' };

export default async function RevenueAdminPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') redirect('/');

    // All three in parallel: the tab counts are part of the point, so every queue has to
    // be measured whichever one is open.
    const [asinRows, buyLinkRows, linkReview] = await Promise.all([
        fetchAsinWorklist(),
        fetchBuyLinkWorklist(),
        fetchLinkReview(),
    ]);

    return (
        <main className="max-w-[1400px] mx-auto w-full px-6 md:px-12 py-12 flex flex-col gap-8">
            <header>
                <h1 className="font-pixel text-sm text-orange-500 uppercase tracking-widest">Revenue</h1>
                <p className="font-sans text-sm text-gray-400 mt-4 max-w-[70ch]">
                    Paste plain product URLs. Affiliate tracking is rejected on purpose — the site
                    applies its own tag through <code>lib/affiliate.ts</code>, and a pasted tag would
                    pay whoever owns it instead.
                </p>
            </header>
            {/* useSearchParams needs a Suspense boundary on a statically-analysed route. */}
            <Suspense fallback={<div className="font-mono text-xs text-gray-600">LOADING QUEUES…</div>}>
                <RevenueClient asinRows={asinRows} buyLinkRows={buyLinkRows} linkReview={linkReview} />
            </Suspense>
        </main>
    );
}
