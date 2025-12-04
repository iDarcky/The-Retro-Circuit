import { supabase } from "../supabase/singleton";
import { UserCollectionItem } from "../types";

export const addToCollection = async (item: UserCollectionItem): Promise<boolean> => {
    try {
        const { error } = await supabase.from('user_collections').upsert([item], { onConflict: 'user_id, item_id, item_type' });
        return !error;
    } catch {
        return false;
    }
};

export const removeFromCollection = async (itemId: string): Promise<boolean> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;
        const { error } = await supabase.from('user_collections').delete().match({ user_id: user.id, item_id: itemId });
        return !error;
    } catch {
        return false;
    }
};

export const fetchUserCollection = async (): Promise<UserCollectionItem[]> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];
        const { data, error } = await supabase.from('user_collections').select('*').eq('user_id', user.id);
        if (error) throw error;
        return data as UserCollectionItem[];
    } catch {
        return [];
    }
};