import { ComparisonResult, ComparisonPoint } from "./types";
import { supabase } from "./supabase/singleton";

// Helper to extract numbers from messy spec strings
const parseSpecValue = (val: string | undefined): number => {
    if (!val) return 0;
    const clean = val.toLowerCase().replace(/,/g, '');
    const num = parseFloat(clean.match(/[0-9.]+/)?.[0] || '0');
    
    // Normalize Memory/Storage to MB
    if (clean.includes('kb') || clean.includes('kilobyte')) return num / 1024;
    if (clean.includes('gb') || clean.includes('gigabyte')) return num * 1024;
    if (clean.includes('tb') || clean.includes('terabyte')) return num * 1024 * 1024;
    // Normalize Speed to MHz
    if (clean.includes('ghz')) return num * 1000;
    
    return num;
};

const parsePrice = (priceStr?: string): number => {
    if (!priceStr) return 0;
    const clean = priceStr.replace(/[^0-9.]/g, '');
    return parseFloat(clean) || 0;
};

const parseSales = (salesStr?: string): number => {
    if (!salesStr) return 0;
    const clean = salesStr.toLowerCase().replace(/[^0-9.]/g, '');
    const num = parseFloat(clean);
    // Heuristic: if number is huge (e.g. 60000000), assume raw count, else assume millions
    if (num > 1000) return num / 1000000;
    return num || 0;
};

const calculateScore = (valA: number, valB: number): { a: number, b: number } => {
    const max = Math.max(valA, valB);
    if (max === 0) return { a: 0, b: 0 };
    return {
        a: Math.round((valA / max) * 100),
        b: Math.round((valB / max) * 100)
    };
};

export const compareConsoles = async (slugA: string, slugB: string): Promise<ComparisonResult | null> => {
    try {
        const { data: cA } = await supabase
            .from('consoles')
            .select('*, manufacturer:manufacturers(*), specs:console_specs(*)')
            .eq('slug', slugA)
            .single();

        const { data: cB } = await supabase
            .from('consoles')
            .select('*, manufacturer:manufacturers(*), specs:console_specs(*)')
            .eq('slug', slugB)
            .single();
        
        if(!cA || !cB) return null;

        const specsA = cA.specs || {};
        const specsB = cB.specs || {};
        const manuA = cA.manufacturer || { name: 'Unknown' };
        const manuB = cB.manufacturer || { name: 'Unknown' };
        
        const priceA = parsePrice(specsA.launch_price);
        const priceB = parsePrice(specsB.launch_price);
        
        const salesA = parseSales(specsA.units_sold);
        const salesB = parseSales(specsB.units_sold);
        
        const cpuA = parseSpecValue(specsA.cpu);
        const cpuB = parseSpecValue(specsB.cpu);
        
        const ramA = parseSpecValue(specsA.ram);
        const ramB = parseSpecValue(specsB.ram);

        const points: ComparisonPoint[] = [];

        // 1. Generation (String comparison fallback if parsing fails)
        points.push({
            feature: 'Legacy',
            consoleAValue: `${cA.release_year} (${cA.generation})`,
            consoleBValue: `${cB.release_year} (${cB.generation})`,
            winner: cA.release_year < cB.release_year ? 'A' : (cB.release_year < cA.release_year ? 'B' : 'Tie'),
            aScore: 50,
            bScore: 50
        });

        // 2. Sales
        const salesScore = calculateScore(salesA, salesB);
        points.push({
            feature: 'Market (Millions Sold)',
            consoleAValue: specsA.units_sold || 'Unknown',
            consoleBValue: specsB.units_sold || 'Unknown',
            winner: salesA > salesB ? 'A' : (salesB > salesA ? 'B' : 'Tie'),
            aScore: salesScore.a,
            bScore: salesScore.b
        });

        // 3. Price
        points.push({
            feature: 'Launch Cost',
            consoleAValue: specsA.launch_price || 'Unknown',
            consoleBValue: specsB.launch_price || 'Unknown',
            winner: (priceA > 0 && priceB > 0) ? (priceA < priceB ? 'A' : (priceB < priceA ? 'B' : 'Tie')) : 'Tie',
            aScore: calculateScore(priceA, priceB).a,
            bScore: calculateScore(priceA, priceB).b
        });

        // 4. CPU
        const cpuScore = calculateScore(cpuA, cpuB);
        points.push({
            feature: 'Processing Power',
            consoleAValue: specsA.cpu || 'Unknown',
            consoleBValue: specsB.cpu || 'Unknown',
            winner: cpuA > cpuB ? 'A' : (cpuB > cpuA ? 'B' : 'Tie'),
            aScore: cpuScore.a,
            bScore: cpuScore.b
        });

        // 5. RAM
        const ramScore = calculateScore(ramA, ramB);
        points.push({
            feature: 'Memory (RAM)',
            consoleAValue: specsA.ram || 'Unknown',
            consoleBValue: specsB.ram || 'Unknown',
            winner: ramA > ramB ? 'A' : (ramB > ramA ? 'B' : 'Tie'),
            aScore: ramScore.a,
            bScore: ramScore.b
        });

        return {
            consoleA: cA.name,
            consoleB: cB.name,
            consoleAImage: cA.image_url,
            consoleBImage: cB.image_url,
            summary: `${manuA.name} faces off against ${manuB.name}.`,
            points: points
        }
    } catch {
        return null;
    }
}