const fs = require('fs');

const filesToFix = [
  'components/finder/FinderResults.tsx',
  'components/fabricator/FabricatorDetailClient.tsx',
  'components/landing/FeaturedConsoles.tsx',
  'components/ui/GlobalSearch.tsx',
  'components/arena/ArenaComparisonClient.tsx',
  'components/console/swiss/SimilarConsoles.tsx',
  'components/console/ConsoleVaultClient.tsx'
];

filesToFix.forEach(filepath => {
  let code = fs.readFileSync(filepath, 'utf8');

  // Replace ${getMfgSlug(var)}-${var.slug} with ${var.slug}
  code = code.replace(/\$\{getMfgSlug\(([a-zA-Z0-9_]+)\)\}-\$\{\1\.slug\}/g, '${$1.slug}');

  // Replace ${mfgSlug}-${var.slug} with ${var.slug}
  code = code.replace(/\$\{mfgSlug\}-\$\{([a-zA-Z0-9_]+)\.slug\}/g, '${$1.slug}');
  code = code.replace(/\$\{mfgSlug\}-\$\{result\.slug\}/g, '${result.slug}');

  fs.writeFileSync(filepath, code);
});
