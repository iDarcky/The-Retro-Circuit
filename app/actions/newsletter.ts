'use server';

import { createClient } from '../../lib/supabase/server';

export async function subscribeEmail(email: string): Promise<{ success: boolean; message: string }> {
    if (!email || !email.includes('@')) {
        return { success: false, message: 'Please enter a valid email address.' };
    }

    try {
        const supabase = await createClient();

        // Check if email already exists
        const { data: existing } = await supabase
            .from('newsletter_subscribers')
            .select('id')
            .eq('email', email.toLowerCase().trim())
            .single();

        if (existing) {
            return { success: true, message: 'You\'re already subscribed!' };
        }

        // Insert new subscriber
        const { error } = await supabase
            .from('newsletter_subscribers')
            .insert({ email: email.toLowerCase().trim() });

        if (error) {
            console.error('Newsletter subscription error:', error);
            return { success: false, message: 'Something went wrong. Please try again.' };
        }

        return { success: true, message: 'You\'re in! Welcome to the signal.' };
    } catch (err) {
        console.error('Newsletter subscription error:', err);
        return { success: false, message: 'Something went wrong. Please try again.' };
    }
}
