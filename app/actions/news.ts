'use server';

import { requireAdmin } from '@/lib/auth/require-admin';
import { supabaseAnon } from '@/lib/supabase/anon';
import { revalidatePath } from 'next/cache';
import { NewsItem } from '@/lib/types/news';
import { submitToIndexNow } from '@/lib/indexnow';

export async function createNews(data: Omit<NewsItem, 'id' | 'author' | 'published_at' | 'slug'>) {
  const supabase = await requireAdmin();

  // Simple slug generation
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const { data: newNews, error } = await supabase
    .from('news')
    .insert([{ ...data, slug, author: 'Editorial' }])
    .select('id, status')
    .single();

  if (error) {
    console.error('Error creating news:', error);
    throw new Error(error.message);
  }

  if (newNews && newNews.status === 'published') {
      submitToIndexNow([`https://theretrocircuit.com/news/${newNews.id}`]);
  }

  revalidatePath('/news');
  revalidatePath('/admin/news');
  return { success: true };
}

export async function deleteNews(id: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting news:', error);
    throw new Error(error.message);
  }

  revalidatePath('/news');
  revalidatePath('/admin/news');
  return { success: true };
}

export async function fetchAllNews(): Promise<NewsItem[]> {
  // Public read via the stateless anon client (no cookies) so /news stays static/ISR.
  const supabase = supabaseAnon;

  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching news:', error);
    return [];
  }

  return data as NewsItem[];
}


export async function updateNews(id: string, data: Partial<NewsItem>) {
  const supabase = await requireAdmin();

  // Check previous status
  const isPublishing = (data as any).status === 'published';
  let previousStatus = null;

  if (isPublishing) {
    const { data: prevNews } = await supabase.from('news').select('status').eq('id', id).single();
    previousStatus = prevNews?.status;
  }

  const { error } = await supabase
    .from('news')
    .update(data)
    .eq('id', id);

  if (error) {
    console.error('Error updating news:', error);
    throw new Error(error.message);
  }

  if (isPublishing && previousStatus !== 'published') {
    submitToIndexNow([`https://theretrocircuit.com/news/${id}`]);
  }

  revalidatePath('/news');
  revalidatePath('/admin/news');
  return { success: true };
}
