import { RoadmapFeature, Release } from "./types/domain";

// Helper function to format the markdown
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
