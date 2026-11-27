import { supabaseAnon } from '../supabase/anon';
import { normalizeConsoleList } from '../normalize';
import type { ConsoleDetails } from '../types';

/**
 * Load the published consoles an article mentions, keyed by slug.
 *
 * Anonymous client only, so article pages stay static. Drafts are filtered out by RLS
 * and by the status check, so a guide that names an unpublished console simply skips
 * that box instead of linking to a page that 404s.
 */
export async function fetchArticleConsoles(slugs: string[]): Promise<Map<string, ConsoleDetails>> {
    const unique = Array.from(new Set(slugs.filter(Boolean)));
    const map = new Map<string, ConsoleDetails>();
    if (unique.length === 0) return map;

    try {
        const { data, error } = await supabaseAnon
            .from('consoles')
            .select(`
                *,
                manufacturer:manufacturer(*),
                variants:console_variants(*),
                links:console_links(*)
            `)
            .in('slug', unique)
            .eq('status', 'published');

        if (error) {
            console.error('[articles] console fetch failed:', error.message);
            return map;
        }
        for (const c of normalizeConsoleList(data)) map.set(c.slug, c);
    } catch (e) {
        console.error('[articles] console fetch exception:', e);
    }
    return map;
}
