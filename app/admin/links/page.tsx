import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';
import { fetchLinkReview } from '../../actions/commerce';
import LinkReviewClient from '../../../components/admin/LinkReviewClient';

/* Triage for everything the spreadsheet import attached to a console.
 *
 * 1,332 rows came in with the data and went straight onto the product pages: other
 * people's videos under our own "Reviews" heading, vendor links nobody checked. All of it
 * is hidden now — `approved` defaults to false — and this page is how any of it comes
 * back, one link at a time.
 *
 * Separate from /admin/buy-links, which is about the consoles that have no buy path at
 * all. This one is about the links we already hold and have not vouched for.
 */

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Link Review | Admin' };

export default async function LinkReviewPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') redirect('/');

    const rows = await fetchLinkReview();

    return <LinkReviewClient initial={rows} />;
}
