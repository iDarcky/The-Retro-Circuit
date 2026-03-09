'use server';

import { createClient } from '../../lib/supabase/server';

export async function subscribeEmail(email: string, source: string): Promise<{ success: boolean; message: string }> {
    if (!email || !email.includes('@')) {
        return { success: false, message: 'Please enter a valid email address.' };
    }

    try {
        const supabase = await createClient();

        // Insert new subscriber
        const { error } = await supabase
            .from('subscribers')
            .insert({
                email: email.toLowerCase().trim(),
                source: source
            });

        if (error) {
            // Check if it's a unique constraint violation (duplicate email)
            if (error.code === '23505') {
                // If email already exists, just return success gracefully
                return { success: true, message: 'TRANSMISSION RECEIVED_' };
            }
            console.error('Newsletter subscription error:', error);
            return { success: false, message: 'Something went wrong. Please try again.' };
        }

        return { success: true, message: 'TRANSMISSION RECEIVED_' };
    } catch (err) {
        console.error('Newsletter subscription error:', err);
        return { success: false, message: 'Something went wrong. Please try again.' };
    }
}
