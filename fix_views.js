const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components/console/ConsoleDetailView.tsx');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Revert State Type
code = code.replace(
    /const \[techViewMode, setTechViewMode\] = useState\<'grid' \| 'table' \| 'matrix' \| 'terminal' \| 'ribbon'\>\('grid'\);/,
    "const [techViewMode, setTechViewMode] = useState<'grid' | 'table' | 'ribbon'>('grid');"
);

// 2. Remove buttons
const newButtons = `<div className="flex flex-wrap font-mono text-[10px] md:text-xs gap-2 md:gap-4 text-gray-500">
                             <button
                                onClick={() => setTechViewMode('grid')}
                                className={\`transition-colors hover:text-white pb-1 \${techViewMode === 'grid' ? 'text-white border-b border-orange-500' : ''}\`}
                             >[ GRID ]</button>
                             <button
                                onClick={() => setTechViewMode('table')}
                                className={\`transition-colors hover:text-white pb-1 \${techViewMode === 'table' ? 'text-white border-b border-orange-500' : ''}\`}
                             >[ TABLE ]</button>
                             <button
                                onClick={() => setTechViewMode('ribbon')}
                                className={\`transition-colors hover:text-white pb-1 \${techViewMode === 'ribbon' ? 'text-white border-b border-orange-500' : ''}\`}
                             >[ RIBBON ]</button>
                         </div>`;

code = code.replace(
    /<div className="flex flex-wrap font-mono text-\[10px\] md:text-xs gap-2 md:gap-4 text-gray-500">[\s\S]*?<\/div>/,
    newButtons
);

// 3. Clean up rendering logic
code = code.replace(
    /\{techViewMode === 'matrix' \? \([\s\S]*?\) : \([\s\S]*?<TechnicalReference mergedSpecs=\{mergedSpecs\} viewMode=\{techViewMode as 'grid' \| 'table' \| 'terminal' \| 'ribbon'\} \/>\n                     \)\}/,
    "<TechnicalReference mergedSpecs={mergedSpecs} viewMode={techViewMode as 'grid' | 'table' | 'ribbon'} />"
);

fs.writeFileSync(filePath, code);
