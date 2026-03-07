const fs = require('fs');

const filesToFix = [
  'components/finder/FinderResults.tsx',
  'components/fabricator/FabricatorDetailClient.tsx',
  'components/arena/ArenaComparisonClient.tsx',
  'components/console/swiss/SimilarConsoles.tsx',
  'components/console/ConsoleVaultClient.tsx',
  'components/console/ConsoleIdentitySection.tsx'
];

filesToFix.forEach(filepath => {
  let code = fs.readFileSync(filepath, 'utf8');

  // Remove the definition of getMfgSlug
  code = code.replace(/const getMfgSlug = \(c: any\) => c\.manufacturer\?\.slug \|\| \(c\.manufacturer\?\.name \? c\.manufacturer\.name\.toLowerCase\(\)\.replace\(\/\\s\+\/g, '-'\) : 'unknown'\);\n?/g, '');
  code = code.replace(/const getMfgSlug = \(c: ConsoleDetails\) => c\.manufacturer\?\.slug \|\| \(c\.manufacturer\?\.name \? c\.manufacturer\.name\.toLowerCase\(\)\.replace\(\/\\s\+\/g, '-'\) : 'unknown'\);\n?/g, '');
  code = code.replace(/const getMfgSlug = \(\) => manufacturer\?\.slug \|\| \(manufacturer\?\.name \? manufacturer\.name\.toLowerCase\(\)\.replace\(\/\\s\+\/g, '-'\) : 'unknown'\);\n?/g, '');
  code = code.replace(/const getMfgSlug = \(c: ConsoleDetails\) => \{\n\s*return c\.manufacturer\?\.slug \|\| \(c\.manufacturer\?\.name \? c\.manufacturer\.name\.toLowerCase\(\)\.replace\(\/\\s\+\/g, '-'\) : 'unknown'\);\n\s*\};\n?/g, '');
  code = code.replace(/const getMfgSlug = \(details: ConsoleDetails\) => \{\n\s*if \(\!details\.manufacturer\) return 'unknown';\n\s*return details\.manufacturer\.slug \|\| details\.manufacturer\.name\.toLowerCase\(\)\.replace\(\/\\s\+\/g, '-'\);\n\s*\};\n?/g, '');

  // Replace calls in compareUrl
  code = code.replace(/\$\{getMfgSlug\(\)\}-\$\{consoleData\.slug\}/g, '${consoleData.slug}');

  fs.writeFileSync(filepath, code);
});
