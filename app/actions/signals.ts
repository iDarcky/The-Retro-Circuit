'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Signal, SignalType } from '@/lib/types/news';

export async function createSignal(content: string, type: SignalType) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('signals')
    .insert([{ content, type, is_active: true }]);

  if (error) {
    console.error('Error creating signal:', error);
    throw new Error(error.message);
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
  const supabase = await createClient();

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
