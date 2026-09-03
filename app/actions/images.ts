"use server";

/** The per-console image gallery behind the admin uploader. */

import { createClient } from "../../lib/supabase/server";
import { unwrapRelation } from "../../lib/normalize";
import { supabaseAnon } from "../../lib/supabase/anon";
import { revalidateConsoleContent } from "../../lib/revalidate-console";

export interface ConsoleImage {
    id: string;
    url: string;
    alt_text: string | null;
    kind: string | null;
    sort_order: number;
}

/**
 * Gallery shots for a console, ordered.
 *
 * Returns [] if the console_images table has not been migrated yet, so the detail page
 * renders exactly as before instead of erroring on an unmigrated database.
 */
export const fetchConsoleImages = async (consoleId: string): Promise<ConsoleImage[]> => {
    if (!consoleId) return [];
    try {
        const { data, error } = await supabaseAnon
            .from('console_images')
            .select('id, url, alt_text, kind, sort_order')
            .eq('console_id', consoleId)
            .order('sort_order', { ascending: true });

        if (error) {
            // 42P01 = undefined_table: migration not applied yet. Anything else is worth surfacing.
            if (error.code !== '42P01') console.error('[API] fetchConsoleImages:', error.message);
            return [];
        }
        return (data || []) as ConsoleImage[];
    } catch (e: any) {
        console.error('[API] fetchConsoleImages exception:', e?.message);
        return [];
    }
};

/** Admin: gallery images for a console, regardless of publish status. */
export const fetchConsoleImagesAdmin = async (consoleId: string): Promise<ConsoleImage[]> => {
    if (!consoleId) return [];
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('console_images')
            .select('id, url, alt_text, kind, sort_order')
            .eq('console_id', consoleId)
            .order('sort_order', { ascending: true });
        if (error) {
            if (error.code !== '42P01') console.error('[API] fetchConsoleImagesAdmin:', error.message);
            return [];
        }
        return (data || []) as ConsoleImage[];
    } catch {
        return [];
    }
};

export const addConsoleImage = async (
    consoleId: string,
    url: string,
    altText: string,
    kind: string
): Promise<{ success: boolean; message?: string }> => {
    try {
        const supabase = await createClient();
        const { data: last } = await supabase
            .from('console_images')
            .select('sort_order')
            .eq('console_id', consoleId)
            .order('sort_order', { ascending: false })
            .limit(1)
            .maybeSingle();

        const { error } = await supabase.from('console_images').insert([{
            console_id: consoleId,
            url,
            alt_text: altText || null,
            kind: kind || 'other',
            sort_order: (last?.sort_order ?? -1) + 1,
        }]);
        if (error) return { success: false, message: error.message };

        const { data: c } = await supabase
            .from('consoles')
            .select('slug, status, manufacturer:manufacturer_id(slug)')
            .eq('id', consoleId)
            .maybeSingle();
        // A gallery image can become the card image and the OG card, so refresh the
        // listing surfaces too, not just the detail page.
        if (c?.status === 'published' && c.slug) {
            revalidateConsoleContent(c.slug, unwrapRelation<any>(c.manufacturer)?.slug);
        }
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};

export const deleteConsoleImage = async (
    imageId: string
): Promise<{ success: boolean; message?: string }> => {
    try {
        const supabase = await createClient();
        const { data: img } = await supabase
            .from('console_images')
            .select('console_id')
            .eq('id', imageId)
            .maybeSingle();

        const { error } = await supabase.from('console_images').delete().eq('id', imageId);
        if (error) return { success: false, message: error.message };

        if (img?.console_id) {
            const { data: c } = await supabase
                .from('consoles')
                .select('slug, status, manufacturer:manufacturer_id(slug)')
                .eq('id', img.console_id)
                .maybeSingle();
            if (c?.status === 'published' && c.slug) {
                revalidateConsoleContent(c.slug, unwrapRelation<any>(c.manufacturer)?.slug);
            }
        }
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};
