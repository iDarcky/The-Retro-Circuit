'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { NewsItem } from '@/lib/types/news';

export async function createNews(data: Omit<NewsItem, 'id' | 'author' | 'published_at' | 'slug'>) {
  const supabase = await createClient();

  // Simple slug generation
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const { error } = await supabase
    .from('news')
    .insert([{ ...data, slug, author: 'Editorial' }]);

  if (error) {
    console.error('Error creating news:', error);
    throw new Error(error.message);
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
