const fs = require('fs');
const filepath = 'components/arena/ArenaComparisonClient.tsx';
let code = fs.readFileSync(filepath, 'utf8');
code = code.replace(/\$\{getMfgSlug\(([a-zA-Z0-9_\.]+)\)\}-\$\{\1\.slug\}/g, '${$1.slug}');
fs.writeFileSync(filepath, code);
