'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Review } from '@/lib/types/news';
import { formRateLimit, getIp } from '@/lib/rate-limit';
import { submitToIndexNow } from '@/lib/indexnow';

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

  // Strip redundant columns before insert so we don't rely on them
  const { console_name, console_slug, ...cleanData } = data as any;

  const { data: newReview, error } = await supabase
    .from('reviews')
    .insert([{ ...cleanData }])
    .select('id, status')
    .single();

  if (error) {
    console.error('Error creating review:', error);
    throw new Error(error.message);
  }

  if (newReview && newReview.status === 'published') {
      submitToIndexNow([`https://theretrocircuit.com/news/reviews/${newReview.id}`]);
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

  const { data: rawData, error } = await supabase
    .from('reviews')
    .select('*, consoles!inner(name, slug)')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  // Flatten the result to match the expected Review interface
  const data = rawData.map((review: any) => {
    const { consoles, ...rest } = review;
    return {
      ...rest,
      console_name: consoles?.name || rest.console_name,
      console_slug: consoles?.slug || rest.console_slug,
    };
  });

  return data as Review[];
}


export async function updateReview(id: string, data: Partial<Review>) {
  const supabase = await createClient();

  // Check previous status
  const isPublishing = (data as any).status === 'published';
  let previousStatus = null;

  if (isPublishing) {
    const { data: prevReview } = await supabase.from('reviews').select('status').eq('id', id).single();
    previousStatus = prevReview?.status;
  }

  // Strip redundant columns before update
  const { console_name, console_slug, consoles, ...cleanData } = data as any;

  const { error } = await supabase
    .from('reviews')
    .update(cleanData)
    .eq('id', id);

  if (error) {
    console.error('Error updating review:', error);
    throw new Error(error.message);
  }

  if (isPublishing && previousStatus !== 'published') {
    submitToIndexNow([`https://theretrocircuit.com/news/reviews/${id}`]);
  }

  revalidatePath('/news');
  revalidatePath('/admin/reviews');
  return { success: true };
}
