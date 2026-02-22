"use server";

import { createClient } from "../../lib/supabase/client";
import { RoadmapFeature } from "../../lib/types/domain";

export async function fetchRoadmapItems() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('roadmap_features')
    .select('*')
    .order('target_date', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching roadmap items:', error);
    return [];
  }

  return data as RoadmapFeature[];
}

export async function createRoadmapItem(item: Omit<RoadmapFeature, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('roadmap_features')
    .insert([item])
    .select()
    .single();

  if (error) {
    console.error('Error creating roadmap item:', error);
    throw error;
  }

  return data as RoadmapFeature;
}

export async function updateRoadmapItem(id: string, updates: Partial<RoadmapFeature>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('roadmap_features')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating roadmap item:', error);
    throw error;
  }

  return data as RoadmapFeature;
}

export async function deleteRoadmapItem(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('roadmap_features')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting roadmap item:', error);
    throw error;
  }
}
