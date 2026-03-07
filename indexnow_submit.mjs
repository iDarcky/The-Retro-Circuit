// IndexNow batch URL submission script
const KEY = 'e0fa4fa524524cc9977e34474132ea62';
const HOST = 'theretrocircuit.com';

const urls = [
    "https://theretrocircuit.com",
    "https://theretrocircuit.com/consoles",
    "https://theretrocircuit.com/finder",
    "https://theretrocircuit.com/fabricators",
    "https://theretrocircuit.com/arena",
    "https://theretrocircuit.com/news",
    "https://theretrocircuit.com/about",
    "https://theretrocircuit.com/consoles/kinhank-k59",
    "https://theretrocircuit.com/consoles/trimui-smart-pro",
    "https://theretrocircuit.com/consoles/ayn-loki",
    "https://theretrocircuit.com/consoles/analogue-pocket",
    "https://theretrocircuit.com/consoles/ayn-loki-max",
    "https://theretrocircuit.com/consoles/ayn-loki-zero",
    "https://theretrocircuit.com/consoles/ayn-loki-mini-pro",
    "https://theretrocircuit.com/consoles/ayaneo-pocket-micro",
    "https://theretrocircuit.com/consoles/miyoo-a30",
    "https://theretrocircuit.com/consoles/trimui-smart-pro-s",
    "https://theretrocircuit.com/consoles/retroid-pocket-4",
    "https://theretrocircuit.com/consoles/ayaneo-pocket-vert",
    "https://theretrocircuit.com/consoles/ayaneo-pocket-s-mini",
    "https://theretrocircuit.com/consoles/data-frog-sf2000",
    "https://theretrocircuit.com/consoles/retroid-pocket-mini",
    "https://theretrocircuit.com/consoles/anbernic-rg-34xxsp",
    "https://theretrocircuit.com/consoles/miyoo-mini-plus",
    "https://theretrocircuit.com/consoles/ayn-odin-2-portal",
    "https://theretrocircuit.com/consoles/asus-rog-ally",
    "https://theretrocircuit.com/consoles/nintendo-switch",
    "https://theretrocircuit.com/consoles/retroid-pocket-2s",
    "https://theretrocircuit.com/consoles/anbernic-rg-35xxsp",
    "https://theretrocircuit.com/consoles/retroid-pocket-1",
    "https://theretrocircuit.com/consoles/retroid-pocket-3",
    "https://theretrocircuit.com/consoles/retroid-pocket-g2",
    "https://theretrocircuit.com/consoles/retroid-pocket-classic",
    "https://theretrocircuit.com/consoles/ayn-thor",
    "https://theretrocircuit.com/consoles/anbernic-rg-28xx",
    "https://theretrocircuit.com/consoles/retroid-pocket-2",
    "https://theretrocircuit.com/consoles/anbernic-rg-476h",
    "https://theretrocircuit.com/consoles/retroid-pocket-5",
    "https://theretrocircuit.com/consoles/anbernic-rg-351m",
    "https://theretrocircuit.com/consoles/anbernic-rg-cube",
    "https://theretrocircuit.com/consoles/anbernic-rg-477v",
    "https://theretrocircuit.com/consoles/anbernic-rg-40xxv",
    "https://theretrocircuit.com/consoles/retroid-pocket-2-plus",
    "https://theretrocircuit.com/consoles/anbernic-rg-vita",
    "https://theretrocircuit.com/consoles/retroid-pocket-flip-2",
    "https://theretrocircuit.com/consoles/miyoo-mini-flip",
    "https://theretrocircuit.com/consoles/anbernic-rg-35xx-plus",
    "https://theretrocircuit.com/consoles/retroid-pocket-mini-v2",
    "https://theretrocircuit.com/consoles/anbernic-rg-35xxh",
    "https://theretrocircuit.com/consoles/ayn-odin-lite",
    "https://theretrocircuit.com/consoles/powkiddy-rgb30",
    "https://theretrocircuit.com/consoles/retroid-pocket-6",
    "https://theretrocircuit.com/consoles/ayn-odin-2-mini",
    "https://theretrocircuit.com/consoles/ayn-odin-2",
    "https://theretrocircuit.com/consoles/retroid-pocket-flip",
    "https://theretrocircuit.com/consoles/retroid-pocket-3-plus",
    "https://theretrocircuit.com/consoles/anbernic-rg-350p",
    "https://theretrocircuit.com/consoles/mangmi-air-x",
    "https://theretrocircuit.com/consoles/mangmi-pocket-max",
    "https://theretrocircuit.com/consoles/anbernic-rg-ds",
    "https://theretrocircuit.com/consoles/ayn-odin",
    "https://theretrocircuit.com/consoles/ayn-odin-3",
    "https://theretrocircuit.com/consoles/valve-steam-deck",
    "https://theretrocircuit.com/consoles/valve-steam-deck-oled",
    "https://theretrocircuit.com/consoles/ayaneo-pocket-s2",
    "https://theretrocircuit.com/consoles/ayaneo-pocket-air-mini",
    "https://theretrocircuit.com/consoles/ayaneo-pocket-ds",
    "https://theretrocircuit.com/consoles/ayaneo-pocket-s2-pro",
    "https://theretrocircuit.com/consoles/ayaneo-pocket-dmg",
    "https://theretrocircuit.com/consoles/ayaneo-pocket-micro-classic",
    "https://theretrocircuit.com/consoles/ayaneo-pocket-ace",
    "https://theretrocircuit.com/consoles/ayaneo-pocket-evo",
    "https://theretrocircuit.com/consoles/ayaneo-pocket-air",
    "https://theretrocircuit.com/consoles/ayaneo-pocket-s-1080p",
    "https://theretrocircuit.com/consoles/konkr-pocket-fit",
    "https://theretrocircuit.com/consoles/trimui-smart-brick",
    "https://theretrocircuit.com/consoles/miyoo-flip",
    "https://theretrocircuit.com/consoles/ayaneo-pocket-s-1440p",
    "https://theretrocircuit.com/consoles/anbernic-rg-351p",
    "https://theretrocircuit.com/consoles/anbernic-rg-351v",
    "https://theretrocircuit.com/consoles/anbernic-rg-351mp",
    "https://theretrocircuit.com/consoles/anbernic-rg-405m",
    "https://theretrocircuit.com/consoles/anbernic-rg-405v",
    "https://theretrocircuit.com/consoles/miyoo-mini",
    "https://theretrocircuit.com/consoles/anbernic-rg-350",
    "https://theretrocircuit.com/consoles/anbernic-rg-350m",
    // Fabricator pages
    "https://theretrocircuit.com/fabricators/retroid",
    "https://theretrocircuit.com/fabricators/anbernic",
    "https://theretrocircuit.com/fabricators/ayn",
    "https://theretrocircuit.com/fabricators/ayaneo",
    "https://theretrocircuit.com/fabricators/miyoo",
    "https://theretrocircuit.com/fabricators/trimui",
    "https://theretrocircuit.com/fabricators/valve",
    "https://theretrocircuit.com/fabricators/analogue",
    "https://theretrocircuit.com/fabricators/powkiddy",
    "https://theretrocircuit.com/fabricators/data-frog",
    "https://theretrocircuit.com/fabricators/kinhank",
    "https://theretrocircuit.com/fabricators/mangmi",
    "https://theretrocircuit.com/fabricators/konkr",
    "https://theretrocircuit.com/fabricators/asus",
    "https://theretrocircuit.com/fabricators/nintendo",
];

const payload = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
};

async function submit() {
    console.log(`Submitting ${urls.length} URLs to IndexNow...`);

    const response = await fetch('https://api.indexnow.org/IndexNow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
    });

    console.log(`Status: ${response.status} ${response.statusText}`);
    const body = await response.text();
    if (body) console.log(`Response: ${body}`);

    if (response.status === 200 || response.status === 202) {
        console.log('All URLs submitted successfully!');
    } else {
        console.log('Submission failed.');
    }
}

submit();
