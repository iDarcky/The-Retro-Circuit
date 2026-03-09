import { createAdminClient } from '../../lib/supabase/admin';

// Make sure it doesn't get cached so the unsubscription actually hits the DB immediately
export const revalidate = 0;

interface UnsubscribePageProps {
    searchParams: Promise<{ email?: string }>;
}

export default async function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
    // Await searchParams in Next 15+
    const params = await searchParams;
    const email = params.email;

    let success = false;
    let errorMsg = '';

    if (!email) {
        errorMsg = 'No email provided.';
    } else {
        try {
            const supabase = createAdminClient();

            // Attempt to update the user
            const { error, data } = await supabase
                .from('subscribers')
                .update({ unsubscribed_at: new Date().toISOString() })
                .eq('email', email.toLowerCase().trim())
                .select();

            if (error) {
                console.error('Error unsubscribing:', error);
                errorMsg = 'Could not process unsubscription. Please try again or contact us.';
            } else if (!data || data.length === 0) {
                errorMsg = 'Could not find a matching subscription.';
            } else {
                success = true;
            }
        } catch (err) {
            console.error('Unexpected error unsubscribing:', err);
            errorMsg = 'An unexpected error occurred.';
        }
    }

    return (
        <div className="bg-bg-primary min-h-[60vh] text-text-primary font-sans flex flex-col justify-center items-center px-6">
            <div className="max-w-xl w-full text-center space-y-6">

                {success ? (
                    <>
                        <h1 className="text-2xl md:text-4xl font-mono font-bold tracking-tighter uppercase text-rose-500 animate-fade-in">
                            SIGNAL TERMINATED<span className="animate-pulse">_</span>
                        </h1>
                        <p className="text-text-secondary font-mono text-sm tracking-wider">
                            YouYou've been unsubscribed.apos;ve been unsubscribed. You wonYou won't hear from us again.apos;t hear from us again.
                        </p>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl md:text-4xl font-mono font-bold tracking-tighter uppercase text-red-500">
                            ERROR<span className="animate-pulse">_</span>
                        </h1>
                        <p className="text-text-secondary font-mono text-sm tracking-wider">
                            {errorMsg}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
