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

// Helper function to format the markdown - exported for testing if needed, but primarily used here
export function formatRoadmapMarkdown(
  releases: (Release & { roadmap_features: RoadmapFeature[] })[],
  unreleasedFeatures: RoadmapFeature[]
): string {
  let md = `# Project Roadmap & Changelog\n\n`;
  md += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

  // --- Section 1: Changelog (Releases) ---
  md += `## Changelog\n\n`;
  if (releases && releases.length > 0) {
      releases.forEach((release: any) => {
          const date = new Date(release.release_date).toLocaleDateString();
          const status = release.is_published ? '' : ' (Draft)';

          md += `### v${release.version}${status} - ${date}\n`;
          if (release.title) md += `**${release.title}**\n`;
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
  } else {
    md += `No releases found.\n\n`;
  }

  // --- Section 2: Roadmap ---
  md += `## Roadmap\n\n`;

  // Define Groups
  const readyForRelease: RoadmapFeature[] = [];
  const inProgress: RoadmapFeature[] = [];
  const planned: RoadmapFeature[] = [];

  // Sort raw list first by target_date (asc) then created_at (desc) as a fallback
  // This helps if we just want a default sort before grouping
  const sortedUnreleased = [...unreleasedFeatures].sort((a, b) => {
      const dateA = a.target_date ? new Date(a.target_date).getTime() : Infinity;
      const dateB = b.target_date ? new Date(b.target_date).getTime() : Infinity;
      if (dateA !== dateB) return dateA - dateB;
      // Fallback to creation date (newest first)
      return (new Date(b.created_at || 0).getTime()) - (new Date(a.created_at || 0).getTime());
  });

  // Categorize
  sortedUnreleased.forEach(feat => {
      if (feat.status === 'completed') {
          readyForRelease.push(feat);
      } else if (feat.status === 'in-progress') {
          inProgress.push(feat);
      } else if (feat.status === 'planned') {
          planned.push(feat);
      }
  });

  // Helper to process a group of features by priority
  const processGroup = (features: RoadmapFeature[]) => {
      if (features.length === 0) return;

      const critical: RoadmapFeature[] = [];
      const mustHave: RoadmapFeature[] = [];
      const niceToHave: RoadmapFeature[] = [];

      features.forEach(feat => {
          if (feat.priority === 'critical') critical.push(feat);
          else if (feat.priority === 'must-have') mustHave.push(feat);
          else niceToHave.push(feat); // Includes 'nice-to-have' and any fallback
      });

      // Render Sub-sections
      const renderPrioritySection = (title: string, items: RoadmapFeature[]) => {
          if (items.length === 0) return;
          md += `#### ${title}\n`;
          items.forEach(item => {
              const targetDate = item.target_date
                  ? ` (Target: ${new Date(item.target_date).toLocaleDateString()})`
                  : '';
              md += `- [ ] **${item.title}**${targetDate}\n`;
              if (item.description) md += `  - ${item.description}\n`;
          });
          md += `\n`;
      };

      renderPrioritySection('Critical', critical);
      renderPrioritySection('Must Have', mustHave);
      renderPrioritySection('Nice to Have', niceToHave);
  };

  // 1. Ready for Release (if any exist that aren't in a release object)
  if (readyForRelease.length > 0) {
      md += `### Ready for Release\n\n`;
      processGroup(readyForRelease);
  }

  // 2. In Progress
  if (inProgress.length > 0) {
      md += `### In Progress\n\n`;
      processGroup(inProgress);
  }

  // 3. Planned
  if (planned.length > 0) {
      md += `### Planned\n\n`;
      processGroup(planned);
  }

  if (readyForRelease.length === 0 && inProgress.length === 0 && planned.length === 0) {
      md += `No active roadmap items found.\n\n`;
  }

  return md;
}

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
    const { data: unreleasedFeatures, error: featuresError } = await supabase
      .from('roadmap_features')
      .select('*')
      .is('release_id', null)
      .order('created_at', { ascending: false });

    if (featuresError) throw featuresError;

    return formatRoadmapMarkdown(
        (releases as (Release & { roadmap_features: RoadmapFeature[] })[]) || [],
        (unreleasedFeatures as RoadmapFeature[]) || []
    );

  } catch (error) {
    console.error('Error generating roadmap markdown:', error);
    throw new Error('Failed to generate roadmap markdown');
  }
}
