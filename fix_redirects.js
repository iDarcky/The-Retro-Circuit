const fs = require('fs');

const redirectsStr = fs.readFileSync('next.config.mjs', 'utf8');

const allData = [
    {"slug":"kinhank-k59","old_slug":"k59"},
    {"slug":"trimui-smart-pro","old_slug":"smart-pro"},
    {"slug":"ayn-loki","old_slug":"loki"},
    {"slug":"analogue-pocket","old_slug":"pocket"},
    {"slug":"ayn-loki-max","old_slug":"loki-max"},
    {"slug":"ayn-loki-zero","old_slug":"loki-zero"},
    {"slug":"ayn-loki-mini-pro","old_slug":"loki-mini-pro"},
    {"slug":"ayaneo-pocket-micro","old_slug":"pocket-micro"},
    {"slug":"miyoo-a30","old_slug":"a30"},
    {"slug":"trimui-smart-pro-s","old_slug":"smart-pro-s"},
    {"slug":"retroid-pocket-4","old_slug":"pocket-4"},
    {"slug":"ayaneo-pocket-vert","old_slug":"pocket-vert"},
    {"slug":"ayaneo-pocket-s-mini","old_slug":"pocket-s-mini"},
    {"slug":"data-frog-sf2000","old_slug":"sf2000"},
    {"slug":"retroid-pocket-mini","old_slug":"pocket-mini"},
    {"slug":"anbernic-rg-34xxsp","old_slug":"rg-34xxsp"},
    {"slug":"miyoo-mini-plus","old_slug":"mini-plus"},
    {"slug":"ayn-odin-2-portal","old_slug":"odin-2-portal"},
    {"slug":"asus-rog-ally","old_slug":"rog-ally"},
    {"slug":"nintendo-switch","old_slug":"switch"},
    {"slug":"retroid-pocket-2s","old_slug":"pocket-2s"},
    {"slug":"anbernic-rg-35xxsp","old_slug":"rg-35xxsp"},
    {"slug":"retroid-pocket-1","old_slug":"pocket-1"},
    {"slug":"retroid-pocket-3","old_slug":"pocket-3"},
    {"slug":"retroid-pocket-g2","old_slug":"pocket-g2"},
    {"slug":"retroid-pocket-classic","old_slug":"pocket-classic"},
    {"slug":"ayn-thor","old_slug":"thor"},
    {"slug":"anbernic-rg-28xx","old_slug":"rg-28xx"},
    {"slug":"retroid-pocket-2","old_slug":"pocket-2"},
    {"slug":"anbernic-rg-476h","old_slug":"rg-476h"},
    {"slug":"retroid-pocket-5","old_slug":"pocket-5"},
    {"slug":"anbernic-rg-351m","old_slug":"rg-351m"},
    {"slug":"anbernic-rg-cube","old_slug":"rg-cube"},
    {"slug":"anbernic-rg-477v","old_slug":"rg-477v"},
    {"slug":"anbernic-rg-40xxv","old_slug":"rg-40xxv"},
    {"slug":"retroid-pocket-2-plus","old_slug":"pocket-2-plus"},
    {"slug":"anbernic-rg-vita","old_slug":"rg-vita"},
    {"slug":"retroid-pocket-flip-2","old_slug":"pocket-flip-2"},
    {"slug":"miyoo-mini-flip","old_slug":"mini-flip"},
    {"slug":"anbernic-rg-35xx-plus","old_slug":"rg-35xx-plus"},
    {"slug":"retroid-pocket-mini-v2","old_slug":"pocket-mini-v2"},
    {"slug":"anbernic-rg-35xxh","old_slug":"rg-35xxh"},
    {"slug":"ayn-odin-lite","old_slug":"odin-lite"},
    {"slug":"powkiddy-rgb30","old_slug":"rgb30"},
    {"slug":"retroid-pocket-6","old_slug":"pocket-6"},
    {"slug":"ayn-odin-2-mini","old_slug":"odin-2-mini"},
    {"slug":"ayn-odin-2","old_slug":"odin-2"},
    {"slug":"retroid-pocket-flip","old_slug":"pocket-flip"},
    {"slug":"retroid-pocket-3-plus","old_slug":"pocket-3-plus"},
    {"slug":"anbernic-rg-350p","old_slug":"rg-350p"},
    {"slug":"mangmi-air-x","old_slug":"air-x"},
    {"slug":"mangmi-pocket-max","old_slug":"pocket-max"},
    {"slug":"anbernic-rg-ds","old_slug":"rg-ds"},
    {"slug":"ayn-odin","old_slug":"odin"},
    {"slug":"ayn-odin-3","old_slug":"odin-3"},
    {"slug":"valve-steam-deck","old_slug":"steam-deck"},
    {"slug":"valve-steam-deck-oled","old_slug":"steam-deck-oled"},
    {"slug":"ayaneo-pocket-s2","old_slug":"pocket-s2"},
    {"slug":"ayaneo-pocket-air-mini","old_slug":"pocket-air-mini"},
    {"slug":"ayaneo-pocket-ds","old_slug":"pocket-ds"},
    {"slug":"ayaneo-pocket-s2-pro","old_slug":"pocket-s2-pro"},
    {"slug":"ayaneo-pocket-dmg","old_slug":"pocket-dmg"},
    {"slug":"ayaneo-pocket-micro-classic","old_slug":"pocket-micro-classic"},
    {"slug":"ayaneo-pocket-ace","old_slug":"pocket-ace"},
    {"slug":"ayaneo-pocket-evo","old_slug":"pocket-evo"},
    {"slug":"ayaneo-pocket-air","old_slug":"pocket-air"},
    {"slug":"ayaneo-pocket-s-1080p","old_slug":"pocket-s-1080p"},
    {"slug":"konkr-pocket-fit","old_slug":"pocket-fit"},
    {"slug":"trimui-smart-brick","old_slug":"smart-brick"},
    {"slug":"miyoo-flip","old_slug":"flip"},
    {"slug":"ayaneo-pocket-s-1440p","old_slug":"pocket-s-1440p"},
    {"slug":"anbernic-rg-351p","old_slug":"rg-351p"},
    {"slug":"anbernic-rg-351v","old_slug":"rg-351v"},
    {"slug":"anbernic-rg-351mp","old_slug":"rg-351mp"},
    {"slug":"anbernic-rg-405m","old_slug":"rg-405m"},
    {"slug":"anbernic-rg-405v","old_slug":"rg-405v"},
    {"slug":"miyoo-mini","old_slug":"mini"},
    {"slug":"anbernic-rg-350","old_slug":"rg-350"},
    {"slug":"anbernic-rg-350m","old_slug":"rg-350m"}
];

let addedRedirects = [];

let newRedirectsStr = "return [\n      {\n        source: '/consoles/brand/:slug',\n        destination: '/fabricators/:slug',\n        permanent: true,\n      },\n";

allData.forEach(item => {
    const existingStr = `{ source: '/consoles/${item.old_slug}', destination: '/consoles/${item.slug}', permanent: true }`;
    newRedirectsStr += `      ${existingStr},\n`;

    // Check if it was in the original file (very basic check)
    if (!redirectsStr.includes(`source: '/consoles/${item.old_slug}'`)) {
        addedRedirects.push(`/consoles/${item.old_slug} -> /consoles/${item.slug}`);
    }
});

newRedirectsStr += "    ]";

// We replace the array block returned by redirects()
let finalCode = redirectsStr.replace(/return \[\s*\{[\s\S]*?\]/, newRedirectsStr);
fs.writeFileSync('next.config.mjs', finalCode);

fs.writeFileSync('added_redirects.json', JSON.stringify(addedRedirects, null, 2));
