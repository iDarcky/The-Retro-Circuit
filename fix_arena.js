const fs = require('fs');
const filepath = 'components/arena/ArenaComparisonClient.tsx';
let code = fs.readFileSync(filepath, 'utf8');
code = code.replace(/const getMfgSlug = \(details: ConsoleDetails\) => \{\n\s*return details\.manufacturer\?\.slug \|\| details\.manufacturer\?\.name\.toLowerCase\(\)\.replace\(\/\\s\+\/g, '-'\) \|\| 'unknown';\n\s*\};\n/g, '');
fs.writeFileSync(filepath, code);
