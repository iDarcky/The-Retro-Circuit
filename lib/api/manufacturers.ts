
import { supabase } from "../supabase/singleton";
import { Manufacturer } from "../types";

export const fetchManufacturers = async (): Promise<Manufacturer[]> => {
    try {
        const { data, error } = await supabase.from('manufacturer').select('*').order('name');
        if (error) throw error;
        return data as Manufacturer[];
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getManufacturerBySlug = async (slug: string): Promise<Manufacturer | null> => {
    try {
        const { data, error } = await supabase.from('manufacturer').select('*').eq('slug', slug).single();
        if (error) throw error;
        return data as Manufacturer;
    } catch {
        return null;
    }
};

export const getManufacturerById = async (id: string): Promise<Manufacturer | null> => {
    try {
        const { data, error } = await supabase.from('manufacturer').select('*').eq('id', id).single();
        if (error) throw error;
        return data as Manufacturer;
    } catch {
        return null;
    }
};

export const addManufacturer = async (manu: Omit<Manufacturer, 'id'>): Promise<{ success: boolean, message?: string }> => {
    try {
        console.log('[API] Inserting Manufacturer:', manu);
        
        // We use select() to get the inserted data back, useful for debugging even if not used
        const { data, error } = await supabase.from('manufacturer').insert([manu]).select();
        
        console.log('Supabase raw response:', { data, error });

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
