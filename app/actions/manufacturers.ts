"use server";

import { createClient } from "../../lib/supabase/server";
import { requireAdmin } from "../../lib/auth/require-admin";
import { supabaseAnon } from "../../lib/supabase/anon";
import { Manufacturer } from "../../lib/types";
import { revalidateTag, unstable_cache } from "next/cache";

// Cached: read on /fabricators, /consoles, and /admin/fabricators. Invalidated on
// manufacturer mutations via revalidateTag('manufacturers').
const getCachedManufacturers = unstable_cache(
    async (): Promise<Manufacturer[]> => {
        const { data, error } = await supabaseAnon.from('manufacturer').select('*').order('name');
        if (error) throw error;
        return data as Manufacturer[];
    },
    ['manufacturers-list'],
    { tags: ['manufacturers'], revalidate: 3600 }
);

export const fetchManufacturers = async (): Promise<Manufacturer[]> => {
    try {
        return await getCachedManufacturers();
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getManufacturerBySlug = async (slug: string): Promise<Manufacturer | null> => {
    try {
        const supabase = supabaseAnon;
        const { data, error } = await supabase.from('manufacturer').select('*').eq('slug', slug).single();
        if (error) throw error;
        return data as Manufacturer;
    } catch {
        return null;
    }
};

export const getManufacturerById = async (id: string): Promise<Manufacturer | null> => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.from('manufacturer').select('*').eq('id', id).single();
        if (error) throw error;
        return data as Manufacturer;
    } catch {
        return null;
    }
};

export const addManufacturer = async (manu: Omit<Manufacturer, 'id'>): Promise<{ success: boolean, message?: string }> => {
    try {
        const supabase = await requireAdmin();
        // We use select() to get the inserted data back, useful for debugging even if not used
        const { error } = await supabase.from('manufacturer').insert([manu]).select();

        if (error) {
            console.error('CRITICAL SUPABASE ERROR:', error.code, error.message, error.details, error.hint);
            return { success: false, message: error.message };
        }
        revalidateTag('manufacturers', { expire: 0 });
        return { success: true };
    } catch (e: any) {
        console.error('[API] Exception in addManufacturer:', e);
        return { success: false, message: e.message || "Unknown error occurred" };
    }
};

export const updateManufacturer = async (id: string, manu: Partial<Manufacturer>): Promise<{ success: boolean, message?: string }> => {
    try {
        const supabase = await requireAdmin();
        const { error } = await supabase.from('manufacturer').update(manu).eq('id', id);
        if (error) {
            console.error('[API] Update Error:', error);
            return { success: false, message: error.message };
        }
        revalidateTag('manufacturers', { expire: 0 });
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};

export const deleteManufacturer = async (id: string): Promise<{ success: boolean, message?: string }> => {
    try {
        const supabase = await requireAdmin();

        // 1. Check for associated consoles
        const { count, error: countError } = await supabase
            .from('consoles')
            .select('*', { count: 'exact', head: true })
            .eq('manufacturer_id', id);

        if (countError) return { success: false, message: countError.message };

        if (count && count > 0) {
            return { success: false, message: `Cannot delete: This fabricator has ${count} associated consoles.` };
        }

        // 2. Delete
        const { error: deleteError } = await supabase.from('manufacturer').delete().eq('id', id);
        if (deleteError) return { success: false, message: deleteError.message };

        revalidateTag('manufacturers', { expire: 0 });
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};
