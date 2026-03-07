const fs = require('fs');
const filepath = 'components/arena/ArenaComparisonClient.tsx';
let code = fs.readFileSync(filepath, 'utf8');

code = code.replace(/\$\{mfgA\}-\$\{selectionA\.details\.slug\}/g, '${selectionA.details.slug}');
code = code.replace(/\$\{mfgB\}-\$\{selectionB\.details\.slug\}/g, '${selectionB.details.slug}');

fs.writeFileSync(filepath, code);
