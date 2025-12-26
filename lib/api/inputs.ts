import { supabase } from "../supabase/singleton";
import { VariantInputProfile } from "../types/domain";

export const fetchVariantInputProfile = async (variantId: string): Promise<VariantInputProfile | null> => {
    try {
        const { data, error } = await supabase
            .from('variant_input_profile')
            .select('*')
            .eq('variant_id', variantId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // No rows found
            console.error('[API] fetchVariantInputProfile Error:', error.message);
            throw error;
        }

        return data as VariantInputProfile;
    } catch {
        return null;
    }
};

export const upsertVariantInputProfile = async (profile: VariantInputProfile): Promise<{ success: boolean, message?: string }> => {
    try {
        const { error } = await supabase
            .from('variant_input_profile')
            .upsert(profile, { onConflict: 'variant_id' });

        if (error) return { success: false, message: error.message };
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};
