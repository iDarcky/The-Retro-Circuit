'use server';

import { createClient } from '@/lib/supabase/server';
import { siteConfig } from '../../config/site';
import { supabaseAnon } from '@/lib/supabase/anon';
import { revalidatePath } from 'next/cache';
import { Signal, SignalType } from '@/lib/types/news';
import { submitToIndexNow } from '@/lib/indexnow';

export async function createSignal(content: string, type: SignalType) {
  const supabase = await createClient();

const { data: newSignal, error } = await supabase
    .from('signals')
    .insert([{ content, type, is_active: true }])
    .select('id, is_active')
    .single();

  if (error) {
    console.error('Error creating signal:', error);
    throw new Error(error.message);
  }

  // Signals are essentially part of /news right now,
  // but if they have an individual route we can index them.
  // Let's index the news page they live on, or if there's a dedicated route:
  if (newSignal && newSignal.is_active) {
      // Assuming signals don't have their own detailed page, submit /news
      // If they do, submit `${siteConfig.url}/news/signals/${newSignal.id}`
      submitToIndexNow([`${siteConfig.url}/news`]);
  }

  revalidatePath('/news');
  revalidatePath('/admin/signals');
  return { success: true };
}

export async function toggleSignalStatus(id: string, isActive: boolean) {
  const supabase = await createClient();

const { error } = await supabase
    .from('signals')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) {
    console.error('Error toggling signal:', error);
    throw new Error(error.message);
  }

  if (isActive) {
      submitToIndexNow([`${siteConfig.url}/news`]);
  }

  revalidatePath('/news');
  revalidatePath('/admin/signals');
  return { success: true };
}

export async function fetchAllSignals(): Promise<Signal[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('signals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching signals:', error);
    return [];
  }

  return data as Signal[];
}

export async function fetchActiveSignals(): Promise<Signal[]> {
  // Public read: use the anonymous client so /news stays fully static (no cookies → no forced dynamic).
  const supabase = supabaseAnon;

  const { data, error } = await supabase
    .from('signals')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching active signals:', error);
    return [];
  }

  return data as Signal[];
}
