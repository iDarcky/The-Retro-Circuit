import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { submitToIndexNow } from '../lib/indexnow';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BASE = 'https://theretrocircuit.com';
const STATIC_URLS = [
    `${BASE}/`,
    `${BASE}/consoles`,
    `${BASE}/finder`,
    `${BASE}/fabricators`,
    `${BASE}/arena`,
    `${BASE}/news`,
    `${BASE}/about`,
];

async function main() {
    const urls: string[] = [...STATIC_URLS];

    const { data: consoles, error: consoleErr } = await supabase
        .from('consoles')
        .select('slug')
        .eq('status', 'published');
    if (consoleErr) {
        console.error('Failed to fetch consoles:', consoleErr.message);
        process.exit(1);
    }
    consoles?.forEach((c: any) => urls.push(`${BASE}/consoles/${c.slug}`));

    const { data: manufacturers, error: mfgErr } = await supabase
        .from('manufacturers')
        .select('slug');
    if (mfgErr) {
        console.error('Failed to fetch manufacturers:', mfgErr.message);
        process.exit(1);
    }
    manufacturers?.forEach((m: any) => urls.push(`${BASE}/fabricators/${m.slug}`));

    const { data: news } = await supabase
        .from('news')
        .select('id')
        .eq('status', 'published');
    news?.forEach((n: any) => urls.push(`${BASE}/news/${n.id}`));

    const { data: reviews } = await supabase
        .from('reviews')
        .select('id')
        .eq('status', 'published');
    reviews?.forEach((r: any) => urls.push(`${BASE}/news/reviews/${r.id}`));

    console.log(`[IndexNow] Submitting ${urls.length} URLs`);

    // IndexNow accepts up to 10,000 per request — chunk to stay safe.
    const BATCH = 1000;
    for (let i = 0; i < urls.length; i += BATCH) {
        const slice = urls.slice(i, i + BATCH);
        console.log(`[IndexNow] Batch ${i / BATCH + 1}: ${slice.length} URLs`);
        await submitToIndexNow(slice);
    }

    console.log('[IndexNow] Done.');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
