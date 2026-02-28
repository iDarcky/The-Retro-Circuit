const fs = require('fs');
let content = fs.readFileSync('components/arena/ConsoleSearch.tsx', 'utf8');

// Update textColor type
content = content.replace(
    /textColor\?: 'default' \| 'white';/,
    "textColor?: 'default' | 'white' | 'theme';"
);

// Update inputTextColor logic
content = content.replace(
    /const inputTextColor = textColor === 'white' \? 'text-white' : 'text-text-primary';/,
    `let inputTextColor = 'text-text-primary';
    if (textColor === 'white') inputTextColor = 'text-white';
    if (textColor === 'theme' && currentSelection) inputTextColor = theme.text;`
);

fs.writeFileSync('components/arena/ConsoleSearch.tsx', content, 'utf8');
