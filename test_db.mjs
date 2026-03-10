import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const email = 'test_jules_resubscribe@example.com';

  // 3. Resubscribe
  const { data, error } = await supabase.from('subscribers').update({
    unsubscribed_at: null,
    subscribed_at: new Date().toISOString()
  }).eq('email', email).select();

  console.log('Update result:', { data, error });
}

run();
