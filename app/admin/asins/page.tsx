import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';
import { fetchAsinWorklist } from '../../actions/consoles';
import AsinWorklistClient from '../../../components/admin/AsinWorklistClient';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'ASIN Worklist | Admin' };

export default async function AsinAdminPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') redirect('/');

    const rows = await fetchAsinWorklist();

    return (
        <main className="max-w-[1400px] mx-auto w-full px-6 md:px-12 py-12 flex flex-col gap-8">
            <header>
                <h1 className="font-pixel text-sm text-orange-500 uppercase tracking-widest">ASIN Worklist</h1>
                <p className="font-sans text-sm text-gray-400 mt-4 max-w-[60ch]">
                    Without an ASIN the buy button falls back to an Amazon search, which converts
                    far worse and rarely produces a qualifying sale. Device names link straight to
                    an Amazon search — copy the ASIN from the product URL (<code>/dp/B0XXXXXXXX</code>).
                </p>
            </header>
            <AsinWorklistClient rows={rows} />
        </main>
    );
}
