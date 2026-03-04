const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components/console/swiss/SimilarConsoles.tsx');
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(
    /    \}, \[currentConsole\.id\]\);/g,
    '    // eslint-disable-next-line react-hooks/exhaustive-deps\n    }, [currentConsole.id]);'
);

fs.writeFileSync(filePath, code);
