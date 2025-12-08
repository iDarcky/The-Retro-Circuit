'use server'

import { revalidatePath } from 'next/cache'

export async function purgeCache(path?: string) {
  console.log(`[Cache] Purging: ${path || 'Global Layout (All)'}`);
  if (path) {
    revalidatePath(path)
  } else {
    revalidatePath('/', 'layout') // Nuke the entire site cache to ensure fresh data everywhere
  }
}