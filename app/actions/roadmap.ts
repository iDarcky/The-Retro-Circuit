"use server";

import { createClient } from "../../lib/supabase/server";
import { supabaseAnon } from "../../lib/supabase/anon";
import { RoadmapFeature, Release } from "../../lib/types/domain";
import { siteConfig } from "../../config/site";

export async function getSystemVersion() {
    const dbVersion = await fetchLatestVersion();
    return dbVersion || siteConfig.version;
}

export async function fetchRoadmapItems() {
  const supabase = supabaseAnon;
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
  const supabase = await createClient();
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
  const supabase = await createClient();
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
  const supabase = await createClient();
  const { error } = await supabase
    .from('roadmap_features')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting roadmap item:', error);
    throw error;
  }
}

// --- Releases ---

export async function fetchReleases() {
  try {
    const supabase = supabaseAnon;
    const { data, error } = await supabase
        .from('releases')
        .select('*, roadmap_features(*)')
        .eq('is_published', true)
        .order('release_date', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching releases:', error);
        return [];
    }

    // Cast to include joined features
    return data as (Release & { roadmap_features: RoadmapFeature[] })[];
  } catch (err) {
    console.error('Error fetching releases:', err);
    return [];
  }
}

export async function fetchAdminReleases() {
    try {
        const supabase = await createClient(); // Authenticated
        const { data, error } = await supabase
            .from('releases')
            .select('*, roadmap_features(*)')
            .order('release_date', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching admin releases:', error);
            return [];
        }

        return data as (Release & { roadmap_features: RoadmapFeature[] })[];
    } catch (err) {
        console.error('Error fetching admin releases:', err);
        return [];
    }
}

export async function fetchLatestVersion() {
    try {
        const supabase = supabaseAnon;
        const { data, error } = await supabase
            .from('releases')
            .select('version')
            .eq('is_published', true)
            .order('release_date', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            // If no rows or table doesn't exist yet, just return null (fallback to config)
            if (error.code !== 'PGRST116') {
                 console.error('Error fetching latest version:', error);
            }
            return null;
        }

        return data?.version || null;
    } catch (err) {
        console.error('Error fetching latest version:', err);
        return null;
    }
}

export async function createRelease(release: Omit<Release, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('releases')
        .insert([release])
        .select()
        .single();

    if (error) {
        console.error('Error creating release:', error);
        throw error;
    }
    return data as Release;
}

export async function updateRelease(id: string, updates: Partial<Release>) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('releases')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating release:', error);
        throw error;
    }
    return data as Release;
}

export async function deleteRelease(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('releases')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting release:', error);
        throw error;
    }
}
