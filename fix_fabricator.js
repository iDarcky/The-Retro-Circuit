const fs = require('fs');

const filepath = 'components/fabricator/FabricatorDetailClient.tsx';
let code = fs.readFileSync(filepath, 'utf8');

code = code.replace(/const getMfgSlug = \(c: ConsoleDetails\) => \{\n\s*const mfg = c\.manufacturer \|\| profile;\n\s*return mfg\?\.slug \|\| \(mfg\?\.name \? mfg\.name\.toLowerCase\(\)\.replace\(\/\\s\+\/g, '-'\) : 'unknown'\);\n\s*\};\n/g, '');

fs.writeFileSync(filepath, code);
