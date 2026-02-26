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

  const cleanItem = {
    ...item,
    target_date: item.target_date === '' ? null : item.target_date,
    release_id: item.release_id === '' ? null : item.release_id,
  };

  const { data, error } = await supabase
    .from('roadmap_features')
    .insert([cleanItem])
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

  const cleanUpdates = {
    ...updates,
    target_date: updates.target_date === '' ? null : updates.target_date,
    release_id: updates.release_id === '' ? null : updates.release_id,
  };

  const { data, error } = await supabase
    .from('roadmap_features')
    .update(cleanUpdates)
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

    const cleanRelease = {
        ...release,
        release_date: release.release_date === '' ? new Date().toISOString() : release.release_date
    };

    const { data, error } = await supabase
        .from('releases')
        .insert([cleanRelease])
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

    const cleanUpdates = {
        ...updates,
        release_date: updates.release_date === '' ? new Date().toISOString() : updates.release_date
    };

    const { data, error } = await supabase
        .from('releases')
        .update(cleanUpdates)
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

// --- Markdown Export ---

export async function generateRoadmapMarkdown() {
  const supabase = await createClient(); // Authenticated to fetch all data including drafts

  try {
    // 1. Fetch all releases with features
    const { data: releases, error: releasesError } = await supabase
      .from('releases')
      .select('*, roadmap_features(*)')
      .order('release_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (releasesError) throw releasesError;

    // 2. Fetch all roadmap items that are NOT assigned to a release (or drafts/planned)
    // We can fetch ALL roadmap items and filter in JS to be simpler, or query for null release_id
    const { data: unreleasedFeatures, error: featuresError } = await supabase
      .from('roadmap_features')
      .select('*')
      .is('release_id', null)
      .order('created_at', { ascending: false });

    if (featuresError) throw featuresError;

    // 3. Construct Markdown
    let md = `# Project Roadmap & Changelog\n\n`;
    md += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

    // Section 1: Releases (Published & Drafts)
    if (releases && releases.length > 0) {
        releases.forEach((release: any) => {
            const date = new Date(release.release_date).toLocaleDateString();
            const status = release.is_published ? '' : ' (Draft)';

            md += `## v${release.version}${status} - ${date}\n`;
            if (release.title) md += `### ${release.title}\n`;
            if (release.description) md += `> ${release.description}\n\n`;

            if (release.roadmap_features && release.roadmap_features.length > 0) {
                release.roadmap_features.forEach((feat: RoadmapFeature) => {
                    md += `- [x] **${feat.title}**\n`;
                    // Optional: Add description if detailed changelog desired
                    // if (feat.description) md += `  - ${feat.description}\n`;
                });
            } else {
                md += `- (No features linked)\n`;
            }
            md += `\n`;
        });
    }

    // Section 2: Unreleased / Planned
    if (unreleasedFeatures && unreleasedFeatures.length > 0) {
        md += `## 🚧 Unreleased / In Progress\n\n`;
        unreleasedFeatures.forEach((feat: RoadmapFeature) => {
            const checkbox = feat.status === 'completed' ? '[x]' : '[ ]';
            md += `- ${checkbox} **${feat.title}** (${feat.status})\n`;
            if (feat.description) md += `  - ${feat.description}\n`;
        });
        md += `\n`;
    }

    return md;

  } catch (error) {
    console.error('Error generating roadmap markdown:', error);
    throw new Error('Failed to generate roadmap markdown');
  }
}
