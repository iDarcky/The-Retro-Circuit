const fs = require('fs');

const filepaths = [
  'components/landing/FeaturedConsoles.tsx',
  'components/ui/GlobalSearch.tsx',
  'components/arena/ArenaComparisonClient.tsx',
  'components/console/ConsoleIdentitySection.tsx'
];

filepaths.forEach(filepath => {
  let code = fs.readFileSync(filepath, 'utf8');

  // FeaturedConsoles.tsx
  code = code.replace(/const mfgSlug = console\.manufacturer\?\.slug \|\| \(console\.manufacturer\?\.name \? console\.manufacturer\.name\.toLowerCase\(\)\.replace\(\/\\s\+\/g, '-'\) : 'unknown'\);\n/g, '');

  // GlobalSearch.tsx
  code = code.replace(/const mfgSlug = result\.manufacturer\?\.slug \|\| \(result\.manufacturer\?\.name \? result\.manufacturer\.name\.toLowerCase\(\)\.replace\(\/\\s\+\/g, '-'\) : 'unknown'\);\n/g, '');

  // ArenaComparisonClient.tsx
  code = code.replace(/const mfgA = getMfgSlug\(selectionA\.details\);\n/g, '');
  code = code.replace(/const mfgB = getMfgSlug\(selectionB\.details\);\n/g, '');
  code = code.replace(/const getMfgSlug = \(details: ConsoleDetails\) => \{\n\s*if \(\!details\.manufacturer\) return 'unknown';\n\s*return details\.manufacturer\.slug \|\| details\.manufacturer\.name\.toLowerCase\(\)\.replace\(\/\\s\+\/g, '-'\);\n\s*\};\n/g, '');

  // ConsoleIdentitySection.tsx
  code = code.replace(/const getMfgSlug = \(\) => manufacturer\?\.slug \|\| \(manufacturer\?\.name \? manufacturer\.name\.toLowerCase\(\)\.replace\(\/\\s\+\/g, '-'\) : 'unknown'\);\n/g, '');

  fs.writeFileSync(filepath, code);
});
