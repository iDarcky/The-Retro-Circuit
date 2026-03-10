'use server';

import { createClient } from '../../lib/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function subscribeEmail(email: string, source: string): Promise<{ success: boolean; message: string }> {
    if (!email || !email.includes('@')) {
        return { success: false, message: 'Please enter a valid email address.' };
    }

    try {
        const supabase = await createClient();
        const normalizedEmail = email.toLowerCase().trim();

        // Insert new subscriber
        const { error } = await supabase
            .from('subscribers')
            .insert({
                email: normalizedEmail,
                source: source
            });

        if (error) {
            // Check if it's a unique constraint violation (duplicate email)
            if (error.code === '23505') {
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
            }
            console.error('Newsletter subscription error:', error);
            return { success: false, message: 'Something went wrong. Please try again.' };
        }

        // Successfully inserted, now send the welcome email
        await sendWelcomeEmail(normalizedEmail);

        return { success: true, message: 'TRANSMISSION RECEIVED_' };
    } catch (err) {
        console.error('Newsletter subscription error:', err);
        return { success: false, message: 'Something went wrong. Please try again.' };
    }
}

async function sendWelcomeEmail(normalizedEmail: string) {
    try {
            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="background-color: #09090b; color: #ffffff; font-family: ui-monospace, 'SFMono-Regular', 'JetBrains Mono', Consolas, 'Liberation Mono', Menlo, monospace; padding: 40px 20px; margin: 0; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 600px; margin: 0 auto; border: 1px solid #8b5cf6; padding: 40px; background-color: #09090b;">
    <div style="text-align: center; color: #8b5cf6; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; font-variant: small-caps; margin-bottom: 24px;">
      THE RETRO CIRCUIT
    </div>

    <hr style="border: none; border-top: 1px solid #3f3f46; margin-bottom: 32px;" />

    <div style="font-size: 16px; line-height: 1.8; color: #ffffff; text-align: left; margin-bottom: 32px;">
      <p style="margin-top: 0;">SIGNAL LOCKED IN_</p>

      <p>You're in the circuit.</p>

      <p>We'll send a monthly update when new consoles drop,<br/>
      specs update, or something worth reading lands on<br/>
      The Retro Circuit.</p>

      <br/>

      <p>Changed your mind? <a href="https://theretrocircuit.com/unsubscribe?email=${encodeURIComponent(normalizedEmail)}" style="color: #ffffff; text-decoration: underline;">Unsubscribe here</a></p>

      <br/>

      <p style="margin-bottom: 0;">Your Captain, Daniel.</p>
    </div>

    <hr style="border: none; border-top: 1px solid #3f3f46; margin-bottom: 24px;" />

    <div style="font-size: 12px; color: #a1a1aa; line-height: 1.6;">
      <p style="margin: 0;">This is a no-reply address.</p>
      <p style="margin: 0;">Questions? <a href="mailto:contact@theretrocircuit.com" style="color: #a1a1aa; text-decoration: underline;">contact@theretrocircuit.com</a></p>
      <br/>
      <p style="margin: 0;">&copy; The Retro Circuit // Secure Transmission</p>
    </div>
  </div>
</body>
</html>
`.trim();

            await resend.emails.send({
                from: 'The Retro Circuit <hello@theretrocircuit.com>',
                replyTo: 'contact@theretrocircuit.com',
                to: normalizedEmail,
                subject: 'SIGNAL LOCKED IN_',
                html: htmlContent
            });
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // We don't fail the subscription if the email fails, just log it.
        }
}
