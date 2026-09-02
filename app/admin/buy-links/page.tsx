import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';
import { fetchBuyLinkWorklist } from '../../actions/commerce';
import BuyLinkWorklistClient from '../../../components/admin/BuyLinkWorklistClient';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Buy Links | Admin' };

export default async function BuyLinksAdminPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') redirect('/');

    const rows = await fetchBuyLinkWorklist();

    return (
        <main className="max-w-[1400px] mx-auto w-full px-6 md:px-12 py-12 flex flex-col gap-8">
            <header>
                <h1 className="font-pixel text-sm text-orange-500 uppercase tracking-widest">Buy Links</h1>
                <p className="font-sans text-sm text-gray-400 mt-4 max-w-[70ch]">
                    The spreadsheet import attached 1,332 vendor links, but every one landed on a
                    draft console — no published page gained a buy path from it. The default tab is
                    the group that costs money today: live pages with no ASIN and no vendor link,
                    where the buy button falls back to an Amazon search for a device Amazon often
                    does not even stock.
                </p>
                <p className="font-sans text-sm text-gray-400 mt-3 max-w-[70ch]">
                    Paste the plain product URL. Affiliate tracking is rejected on purpose — the
                    site applies its own tag through <code>lib/affiliate.ts</code>, and a pasted
                    tag would pay whoever owns it instead.
                </p>
            </header>
            <BuyLinkWorklistClient rows={rows} />
        </main>
    );
}
