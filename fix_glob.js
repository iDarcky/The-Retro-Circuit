const fs = require('fs');
const filepath = 'components/ui/GlobalSearch.tsx';
let code = fs.readFileSync(filepath, 'utf8');

code = code.replace(/const mfgSlug = result\.subtitle \? result\.subtitle\.toLowerCase\(\)\.replace\(\/\\s\+\/g, '-'\) : 'unknown';\n/g, '');

fs.writeFileSync(filepath, code);
