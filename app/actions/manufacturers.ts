"use server";

import { createClient } from "../../lib/supabase/server";
import { supabaseAnon } from "../../lib/supabase/anon";
import { Manufacturer } from "../../lib/types";

export const fetchManufacturers = async (): Promise<Manufacturer[]> => {
    try {
        const supabase = supabaseAnon;
        const { data, error } = await supabase.from('manufacturer').select('*').order('name');
        if (error) throw error;
        return data as Manufacturer[];
    } catch (e) {
        console.error(e);
        return [];
    }
};

/**
 * Manufacturers that have at least one PUBLISHED console.
 *
 * Public surfaces must use this rather than fetchManufacturers(): the admin list
 * intentionally contains brands whose devices are still drafts (e.g. freshly
 * imported ones), and those would otherwise render as empty brand pages and pad
 * the fabricators grid with logo-less entries.
 *
 * Self-healing: a brand appears the moment one of its consoles is published.
 */
export const fetchPublicManufacturers = async (): Promise<Manufacturer[]> => {
    try {
        const supabase = supabaseAnon;

        const { data: published, error: pubError } = await supabase
            .from('consoles')
            .select('manufacturer_id')
            .eq('status', 'published')
            .not('manufacturer_id', 'is', null);

        if (pubError) throw pubError;

        const ids = Array.from(new Set((published || []).map((c: any) => c.manufacturer_id)));
        if (ids.length === 0) return [];

        const { data, error } = await supabase
            .from('manufacturer')
            .select('*')
            .in('id', ids)
            .order('name');

        if (error) throw error;
        return data as Manufacturer[];
    } catch (e) {
        console.error('[API] fetchPublicManufacturers:', e);
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
        const supabase = await createClient();
        // We use select() to get the inserted data back, useful for debugging even if not used
        const { error } = await supabase.from('manufacturer').insert([manu]).select();

        if (error) {
            console.error('CRITICAL SUPABASE ERROR:', error.code, error.message, error.details, error.hint);
            return { success: false, message: error.message };
        }
        return { success: true };
    } catch (e: any) {
        console.error('[API] Exception in addManufacturer:', e);
        return { success: false, message: e.message || "Unknown error occurred" };
    }
};

export const updateManufacturer = async (id: string, manu: Partial<Manufacturer>): Promise<{ success: boolean, message?: string }> => {
    try {
        const supabase = await createClient();
        const { error } = await supabase.from('manufacturer').update(manu).eq('id', id);
        if (error) {
            console.error('[API] Update Error:', error);
            return { success: false, message: error.message };
        }
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};

export const deleteManufacturer = async (id: string): Promise<{ success: boolean, message?: string }> => {
    try {
        const supabase = await createClient();

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

        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};
