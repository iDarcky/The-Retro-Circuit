const fs = require('fs');

const file = 'app/actions/subscribers.ts';
let code = fs.readFileSync(file, 'utf8');

const targetStr = `            if (error.code === '23505') {
                // If email already exists, just return success gracefully
                return { success: true, message: 'TRANSMISSION RECEIVED_' };
            }`;

const replacementStr = `            if (error.code === '23505') {
                // Fetch the existing user
                const { data: existingUser, error: fetchError } = await supabase
                    .from('subscribers')
                    .select('unsubscribed_at')
                    .eq('email', normalizedEmail)
                    .single();

                if (!fetchError && existingUser && existingUser.unsubscribed_at !== null) {
                    // User previously unsubscribed, so re-subscribe them
                    const { error: updateError } = await supabase
                        .from('subscribers')
                        .update({
                            unsubscribed_at: null,
                            subscribed_at: new Date().toISOString()
                        })
                        .eq('email', normalizedEmail);

                    if (!updateError) {
                        // Send welcome email again on successful re-subscription
                        await sendWelcomeEmail(normalizedEmail);
                    } else {
                        console.error('Failed to update unsubscribed user:', updateError);
                        // Even if update fails, we return success to the user as requested
                    }
                }

                // Return success gracefully in all unique constraint scenarios
                return { success: true, message: 'TRANSMISSION RECEIVED_' };
            }`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, replacementStr);
    fs.writeFileSync(file, code);
    console.log('Successfully patched error handling in subscribers.ts');
} else {
    console.error('Could not find error handling logic to patch');
}
