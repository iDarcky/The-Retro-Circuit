import { getFinderResults } from '@/app/finder/actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function QuizAnalyticsPage() {

    type Scenario = {
        name: string;
        expected: string[];
        inputs: Record<string, string>;
    };

    const scenarios: Scenario[] = [
        {
            name: "The Budget Beginner",
            expected: ["Miyoo Mini", "RG35XX", "Trimui"],
            inputs: { profile: "nostalgia", target_tier: "8bit", budget_band: "b_under_60", portability_pref: "pocket", setup_answer: "beginner" }
        },
        {
            name: "The PS2 Powerhouse",
            expected: ["Retroid Pocket 4 Pro", "Odin", "RG556"],
            inputs: { profile: "performance", target_tier: "6thgen", budget_band: "b_180_300", portability_pref: "versatile", setup_answer: "guide", form_factor_pref: "horizontal" }
        },
        {
            name: "The Metal Enthusiast",
            expected: ["Odin 2 Mini", "RG401M", "Retroid Pocket 4 Pro", "Steam Deck", "ROG Ally"],
            inputs: { profile: "performance", target_tier: "modern", budget_band: "b_300_plus", portability_pref: "versatile", setup_answer: "tinker", aesthetic_pref: "modern" }
        },
        {
            name: "The Commuter (PSP/DS Focus)",
            expected: ["Retroid Pocket 3+", "RG405M", "RG505"],
            inputs: { profile: "onthego", target_tier: "2000s", budget_band: "b_120_180", portability_pref: "jacket", setup_answer: "guide" }
        }
    ];

    let passed = 0;
    const results = [];

    // Run scenarios sequentially because they hit Supabase internally inside getFinderResults
    // getFinderResults handles caching reasonably well if allConsoles is optimized, but sequential is safer for logs.
    for (const scenario of scenarios) {
        try {
            const matches = await getFinderResults(scenario.inputs as Record<string, string>);

            // Only care about the top 3 recommendations
            const top3 = matches.slice(0, 3);

            // Success condition: IS ANY OF THE EXPECTED DEVICES IN OUR TOP 3?
            const isSuccess = top3.some(actual =>
                scenario.expected.some(expectedName => actual.name.toLowerCase().includes(expectedName.toLowerCase()))
            );

            if (isSuccess) passed++;

            results.push({
                scenario: scenario.name,
                isSuccess,
                expectations: scenario.expected,
                topPicks: top3.map(c => ({
                    name: c.name,
                    price: c.price,
                    score: Math.round(c._score),
                    tierFit: c._breakdown?.tierFit
                }))
            });

        } catch (e) {
            console.error(`Error running scenario: ${scenario.name}`, e);
            results.push({
                scenario: scenario.name,
                isSuccess: false,
                expectations: scenario.expected,
                topPicks: [],
                error: String(e)
            });
        }
    }

    const hitRate = Math.round((passed / scenarios.length) * 100);

    return (
        <div className="min-h-screen bg-bg-primary text-white p-8 md:p-16 font-mono">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-12 border-b border-zinc-800 pb-8">
                    <div>
                        <h1 className="text-3xl font-pixel mb-2">Quiz Analytics <span className="text-orange-500 text-sm align-top">[INTERNAL]</span></h1>
                        <p className="text-zinc-400">Live scoring engine validation against Supabase production data.</p>
                    </div>
                    <Link href="/finder-test">
                        <button className="px-4 py-2 border border-white/20 hover:bg-white hover:text-black transition-colors uppercase text-xs">
                            ← Back to Quiz
                        </button>
                    </Link>
                </div>

                {/* Scorecard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="border border-white/10 bg-white/[0.02] p-6 text-center">
                        <h3 className="text-zinc-500 text-xs mb-2 uppercase">Accuracy Hit Rate</h3>
                        <div className={`text-5xl font-bold ${hitRate === 100 ? 'text-emerald-400' : hitRate >= 75 ? 'text-yellow-400' : 'text-red-500'}`}>
                            {hitRate}%
                        </div>
                    </div>
                    <div className="border border-white/10 bg-white/[0.02] p-6 text-center">
                        <h3 className="text-zinc-500 text-xs mb-2 uppercase">Test Scenarios</h3>
                        <div className="text-5xl font-bold text-white">
                            {scenarios.length}
                        </div>
                    </div>
                    <div className="border border-white/10 bg-white/[0.02] p-6 text-center">
                        <h3 className="text-zinc-500 text-xs mb-2 uppercase">Status</h3>
                        <div className="text-xl font-bold text-emerald-400 mt-4 uppercase">
                            Engine Online
                        </div>
                    </div>
                </div>

                {/* Breakdowns */}
                <h2 className="text-xl font-pixel mb-6">Scenario Breakdowns</h2>
                <div className="space-y-8">
                    {results.map((res, i) => (
                        <div key={i} className={`border ${res.isSuccess ? 'border-emerald-500/30' : 'border-red-500/30'} bg-black/40 p-6`}>
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-lg font-bold text-white">{res.scenario}</h3>
                                {res.isSuccess
                                    ? <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 text-xs border border-emerald-500/50">PASS</span>
                                    : <span className="bg-red-500/10 text-red-500 px-3 py-1 text-xs border border-red-500/50">FAIL</span>
                                }
                            </div>

                            <div className="mb-4">
                                <span className="text-zinc-500 text-xs uppercase block mb-1">Expected one of:</span>
                                <div className="text-sm text-zinc-300">{res.expectations.join(', ')}</div>
                            </div>

                            <div className="bg-zinc-900 border border-zinc-800 p-4">
                                <span className="text-zinc-500 text-xs uppercase block mb-2">Engine Output (Top 3):</span>
                                {res.error ? (
                                    <div className="text-red-400 text-xs">{res.error}</div>
                                ) : (
                                    <ul className="space-y-2">
                                        {res.topPicks.map((pick, pIdx) => (
                                            <li key={pIdx} className="text-sm flex justify-between items-center border-b border-zinc-800/50 pb-2 last:border-0">
                                                <span className="text-white">
                                                    <span className="text-zinc-600 mr-2">{pIdx + 1}.</span>
                                                    {pick.name}
                                                </span>
                                                <div className="text-right">
                                                    <span className="bg-white/10 px-2 py-0.5 rounded text-xs ml-2">${pick.price}</span>
                                                    <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded text-xs ml-2">Score: {pick.score}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
