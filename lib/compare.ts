
import { ComparisonResult, ComparisonPoint } from "./types";
import { supabase } from "./supabase/singleton";

// Helper to extract numbers from messy spec strings
const parseSpecValue = (val: string | undefined): number => {
    if (!val) return 0;
    const clean = val.toLowerCase().replace(/,/g, '');
    const num = parseFloat(clean.match(/[0-9.]+/)?.[0] || '0');
    
    // Normalize Memory/Storage to MB (Logic preserved, though fields might not exist in new schema)
    if (clean.includes('kb') || clean.includes('kilobyte')) return num / 1024;
    if (clean.includes('gb') || clean.includes('gigabyte')) return num * 1024;
    if (clean.includes('tb') || clean.includes('terabyte')) return num * 1024 * 1024;
    // Normalize Speed to MHz
    if (clean.includes('ghz')) return num * 1000;
    
    return num;
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
            .select('*, manufacturer:manufacturer(*), specs:console_specs(*)')
            .eq('slug', slugA)
            .single();

        const { data: cB } = await supabase
            .from('consoles')
            .select('*, manufacturer:manufacturer(*), specs:console_specs(*)')
            .eq('slug', slugB)
            .single();
        
        if(!cA || !cB) return null;

        const specsA = cA.specs || {};
        const specsB = cB.specs || {};
        const manuA = cA.manufacturer || { name: 'Unknown' };
        const manuB = cB.manufacturer || { name: 'Unknown' };
        
        // Use Console-level Units Sold (as per new schema)
        const salesA = parseSales(cA.units_sold);
        const salesB = parseSales(cB.units_sold);
        
        // Use new Spec fields
        const cpuA = parseSpecValue(specsA.cpu_model); // Approximation based on text
        const cpuB = parseSpecValue(specsB.cpu_model);

        const points: ComparisonPoint[] = [];

        // 1. Generation
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
            consoleAValue: cA.units_sold || 'Unknown',
            consoleBValue: cB.units_sold || 'Unknown',
            winner: salesA > salesB ? 'A' : (salesB > salesA ? 'B' : 'Tie'),
            aScore: salesScore.a,
            bScore: salesScore.b
        });

        // 3. CPU Cores (Numeric comparison)
        const coresA = specsA.cpu_cores || 0;
        const coresB = specsB.cpu_cores || 0;
        const coreScore = calculateScore(coresA, coresB);
        points.push({
            feature: 'CPU Cores',
            consoleAValue: specsA.cpu_cores ? `${specsA.cpu_cores}` : 'Unknown',
            consoleBValue: specsB.cpu_cores ? `${specsB.cpu_cores}` : 'Unknown',
            winner: coresA > coresB ? 'A' : (coresB > coresA ? 'B' : 'Tie'),
            aScore: coreScore.a,
            bScore: coreScore.b
        });

        // 4. Processing Power (Text)
        points.push({
            feature: 'CPU Model',
            consoleAValue: specsA.cpu_model || 'Unknown',
            consoleBValue: specsB.cpu_model || 'Unknown',
            winner: 'Tie', // Hard to compare text programmatically
        });

        // 5. Output
        points.push({
            feature: 'Max Resolution',
            consoleAValue: specsA.max_resolution_output || 'Unknown',
            consoleBValue: specsB.max_resolution_output || 'Unknown',
            winner: 'Tie',
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
