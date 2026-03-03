const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components/console/swiss/TechnicalReference.tsx');
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(
    /    \}\n                        <span className=\{\`\$\{colorClass\.split\(' '\)\[0\]\}\`\}>\{title\}<\/span>\n                    <\/td>\n                <\/tr>\n                \{children\}\n            <\/>\n        \);\n    \}/g,
    '    }'
);

fs.writeFileSync(filePath, code);
