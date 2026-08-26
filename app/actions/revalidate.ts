'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../../lib/supabase/server'

export async function purgeCache(path?: string) {
  const supabase = await createClient()

  // 1. Check Authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized: User not signed in')
  }

  // 2. Check Authorization (Admin Role)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    throw new Error('Forbidden: Insufficient privileges')
  }

  // 3. Perform Action
  console.log(`[Cache] Purging: ${path || 'Primary public routes'}`);
  if (path) {
    revalidatePath(path)
  } else {
    // Targeted refresh of the primary public listing surfaces instead of nuking the entire
    // site cache on every admin save. Entity detail pages (/consoles/[slug],
    // /fabricators/[slug]) are revalidated by their own create/update actions, and the
    // footer version is handled by the 'system-version' tag.
    revalidatePath('/')
    revalidatePath('/consoles')
    revalidatePath('/fabricators')
    revalidatePath('/arena')
  }
}
