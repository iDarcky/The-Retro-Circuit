const fs = require('fs');
let content = fs.readFileSync('components/arena/ArenaComparisonClient.tsx', 'utf8');

// The file might contain constructArenaUrl. If so, let's remove it and replace updateUrl.
content = content.replace(/const constructArenaUrl = [\s\S]*?return `\/arena\?\$\{params\.toString\(\)\}`;[\s]*};/m, '');

content = content.replace(/const updateUrl = [\s\S]*?const handleSelect/m,
`const updateUrl = (p1?: string | null, v1?: string | null, p2?: string | null, v2?: string | null) => {
        const finalP1 = p1 !== undefined ? p1 : selectionA.slug;
        const finalV1 = v1 !== undefined ? v1 : selectionA.selectedVariant?.slug;
        const finalP2 = p2 !== undefined ? p2 : selectionB.slug;
        const finalV2 = v2 !== undefined ? v2 : selectionB.selectedVariant?.slug;

        const buildPart = (p: string | null | undefined, v: string | null | undefined) => p ? (v && v !== "base" ? \`\${p}-\${v}\` : p) : "select";
        const url = \`/arena/\${buildPart(finalP1, finalV1)}-vs-\${buildPart(finalP2, finalV2)}\`;

        router.replace(url, { scroll: false });
    };

    const handleSelect`);

// There is also a hardcoded router.replace('/arena', { scroll: false }) that we should change to select-vs-select
content = content.replace(/router\.replace\('\/arena', \{ scroll: false \}\);/g, "router.replace('/arena/select-vs-select', { scroll: false });");

fs.writeFileSync('components/arena/ArenaComparisonClient.tsx', content, 'utf8');
