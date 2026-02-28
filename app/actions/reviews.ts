'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Review } from '@/lib/types/news';
import { formRateLimit, getIp } from '@/lib/rate-limit';

export async function createReview(data: Omit<Review, 'id' | 'author' | 'published_at'>) {
  // Apply Rate Limit for forms if env variables exist
  if (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) {
    const ip = await getIp();
    const { success } = await formRateLimit.limit(ip);

    if (!success) {
      throw new Error('Too many requests. Please try again later.');
    }
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('reviews')
    .insert([{ ...data }]);

  if (error) {
    console.error('Error creating review:', error);
    throw new Error(error.message);
  }

  revalidatePath('/news');
  revalidatePath('/admin/reviews');
  return { success: true };
}

export async function deleteReview(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting review:', error);
    throw new Error(error.message);
  }

  revalidatePath('/news');
  revalidatePath('/admin/reviews');
  return { success: true };
}

export async function fetchAllReviews(): Promise<Review[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data as Review[];
}
