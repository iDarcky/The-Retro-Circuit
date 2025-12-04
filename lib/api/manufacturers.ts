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

export const addManufacturer = async (manu: Omit<Manufacturer, 'id'>): Promise<{ success: boolean, message?: string }> => {
    try {
        const { error } = await supabase.from('manufacturer').insert([manu]);
        if (error) return { success: false, message: error.message };
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message || "Unknown error occurred" };
    }
}