import { supabase } from "./supabase/singleton";
import { UserProfile } from "./types";

export const retroAuth = {
    signIn: async (email: string, password: string) => {
        return await supabase.auth.signInWithPassword({ email, password });
    },
    signUp: async (email: string, password: string, username: string) => {
        const redirectTo = window.location.origin;
        return await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                emailRedirectTo: redirectTo,
                data: { username, full_name: username, avatar_id: 'pilot' }
            }
        });
    },
    resetPassword: async (email: string) => {
        const redirectTo = window.location.origin;
        return await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    },
    updateUserPassword: async (newPassword: string) => {
        return await supabase.auth.updateUser({ password: newPassword });
    },
    signOut: async () => {
        return await supabase.auth.signOut();
    },
    getUser: async () => {
        const { data } = await supabase.auth.getUser();
        return data.user;
    },
    updateAvatar: async (avatarId: string) => {
        // We update both the auth metadata (fast access) and the profile table (persistence)
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
             await supabase.from('profiles').update({ avatar_id: avatarId }).eq('id', user.id);
        }
        
        return await supabase.auth.updateUser({
            data: { avatar_id: avatarId }
        });
    },
    isAdmin: async (): Promise<boolean> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;
        
        // Updated to check 'profiles' table for role='admin'
        const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
            
        return (data as UserProfile)?.role === 'admin';
    }
};