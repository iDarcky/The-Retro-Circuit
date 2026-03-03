import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { calculateConsoleScore } from '../lib/finder/scoring';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuiz() {
    console.log("Fetching consoles from Supabase...");

    const { data: consoles, error } = await supabase
        .from('consoles')
        .select(`
            id,
            name,
            slug,
            device_category,
            form_factor,
            chassis_features,
            setup_ease_score,
            community_score,
            image_url,
            manufacturer:manufacturer_id ( name, slug ),
            specs:console_specs ( * ),
            variants:console_variants (
                id,
                name,
                emulation_profiles ( * )
            )
        `)
        .eq('status', 'published');

    if (error || !consoles || consoles.length === 0) {
        console.error("Error or no data fetching:", error);
        return;
    }

    console.log(`Loaded ${consoles.length} publishable consoles. Running scenarios...\n`);

    const scenarios = [
        {
            name: "The Budget Beginner",
            expected: ["Miyoo Mini", "RG35XX", "Trimui"],
            inputs: { profile: "nostalgia", targetTier: "8bit", budgetBand: "b_under_60", portabilityPref: "pocket", setupAnswer: "beginner" }
        },
        {
            name: "The PS2 Powerhouse",
            expected: ["Retroid Pocket 4 Pro", "Odin", "RG556"],
            inputs: { profile: "performance", targetTier: "6thgen", budgetBand: "b_180_300", portabilityPref: "versatile", setupAnswer: "guide", formFactorPref: "horizontal" }
        },
        {
            name: "The Metal Enthusiast",
            expected: ["Odin 2 Mini", "RG401M", "Retroid Pocket 4 Pro", "Steam Deck"],
            inputs: { profile: "performance", targetTier: "modern", budgetBand: "b_300_plus", portabilityPref: "versatile", setupAnswer: "tinker", aestheticPref: "modern" }
        }
    ];

    let passed = 0;

    for (const s of scenarios) {
        console.log(`\n--- Scenario: ${s.name} ---`);
        console.log(s.inputs);

        // Map existing records to the shape the component uses
        const results = consoles.map(c => {
            const formatted = { ...c, specs: Array.isArray(c.specs) ? c.specs[0] : c.specs };
            const scoreData = calculateConsoleScore(formatted as any, s.inputs as any);
            return {
                name: c.name,
                total: scoreData.total,
                price: formatted.specs?.price_launch_usd || 'N/A'
            };
        });

        results.sort((a, b) => b.total - a.total);
        const top3 = results.slice(0, 3);

        const isSuccess = top3.some(r => s.expected.some(e => r.name.includes(e)));
        if (isSuccess) passed++;

        top3.forEach((r, i) => console.log(`  ${i + 1}. ${r.name} (Score: ${r.total.toFixed(2)}, $${r.price})`));
        console.log(isSuccess ? "✅ PASS" : `❌ FAIL (Expected: ${s.expected.join(', ')})`);
    }

    console.log(`\n=== SUCCESS RATE: ${((passed / scenarios.length) * 100).toFixed(1)}% (${passed}/${scenarios.length}) ===`);
}

testQuiz();
