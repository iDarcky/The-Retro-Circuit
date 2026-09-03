'use server';

import { createClient } from '@/lib/supabase/server';
import { siteConfig } from '../../config/site';
import { supabaseAnon } from '@/lib/supabase/anon';
import { revalidatePath } from 'next/cache';
import { NewsItem } from '@/lib/types/news';
import { submitToIndexNow } from '@/lib/indexnow';

export async function createNews(data: Omit<NewsItem, 'id' | 'author' | 'published_at' | 'slug'>) {
  const supabase = await createClient();

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
      submitToIndexNow([`${siteConfig.url}/news/${newNews.id}`]);
  }

  revalidatePath('/news');
  revalidatePath('/admin/news');
  return { success: true };
}

export async function deleteNews(id: string) {
  const supabase = await createClient();

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
  const supabase = await createClient();

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

// Public read for the /news page. Uses the anonymous client (no cookies) so the page can be
// statically rendered and served from the CDN, and only returns published items.
export async function fetchPublicNews(): Promise<NewsItem[]> {
  const { data, error } = await supabaseAnon
    .from('news')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching public news:', error);
    return [];
  }

  return data as NewsItem[];
}


export async function updateNews(id: string, data: Partial<NewsItem>) {
  const supabase = await createClient();

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
    submitToIndexNow([`${siteConfig.url}/news/${id}`]);
  }

  revalidatePath('/news');
  revalidatePath('/admin/news');
  return { success: true };
}
