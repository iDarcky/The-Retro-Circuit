
import { ComparisonResult, ComparisonPoint } from "./types";
import { supabase } from "./supabase/singleton";

const getBestVariantSpec = (console: any, field: string): number => {
    // If variants exist, grab the highest value for this field (e.g., PS4 Pro RAM vs PS4 RAM)
    // Actually, for fairness, usually we compare base models, but let's grab the default variant if available
    const variants = console.variants || [];
    const defaultVariant = variants.find((v: any) => v.is_default) || variants[0];
    
    if (defaultVariant && defaultVariant[field] !== undefined && defaultVariant[field] !== null) {
        return Number(defaultVariant[field]);
    }
    return 0;
};

const calculateScore = (valA: number, valB: number): { a: number, b: number } => {
    const max = Math.max(valA, valB);
    if (max === 0) return { a: 0, b: 0 };
    return {
        a: Math.round((valA / max) * 100),
        b: Math.round((valB / max) * 100)
    };
};

const parseSales = (salesStr?: string): number => {
    if (!salesStr) return 0;
    const clean = salesStr.toLowerCase().replace(/[^0-9.]/g, '');
    const num = parseFloat(clean);
    if (num > 1000) return num / 1000000;
    return num || 0;
};

export const compareConsoles = async (slugA: string, slugB: string): Promise<ComparisonResult | null> => {
    try {
        // Fetch consoles with variants, removal of console_specs dependency
        const { data: cA } = await supabase
            .from('consoles')
            .select('*, manufacturer:manufacturer(*), variants:console_variants(*)')
            .eq('slug', slugA)
            .single();

        const { data: cB } = await supabase
            .from('consoles')
            .select('*, manufacturer:manufacturer(*), variants:console_variants(*)')
            .eq('slug', slugB)
            .single();
        
        if(!cA || !cB) return null;

        const manuA = cA.manufacturer || { name: 'Unknown' };
        const manuB = cB.manufacturer || { name: 'Unknown' };
        
        // Extract specs from default variant or first variant
        const variantsA = cA.variants || [];
        const specsA = variantsA.find((v: any) => v.is_default) || variantsA[0] || {};
        
        const variantsB = cB.variants || [];
        const specsB = variantsB.find((v: any) => v.is_default) || variantsB[0] || {};
        
        const points: ComparisonPoint[] = [];

        // 1. Generation (Prioritize variant release year if available)
        const yearA = specsA.release_year || cA.release_year;
        const yearB = specsB.release_year || cB.release_year;

        points.push({
            feature: 'Generation',
            consoleAValue: `${yearA} (${cA.generation || 'N/A'})`,
            consoleBValue: `${yearB} (${cB.generation || 'N/A'})`,
            winner: yearA < yearB ? 'A' : (yearB < yearA ? 'B' : 'Tie'),
            aScore: 50,
            bScore: 50
        });

        // 2. Sales
        const salesA = parseSales(cA.units_sold);
        const salesB = parseSales(cB.units_sold);
        const salesScore = calculateScore(salesA, salesB);
        points.push({
            feature: 'Market (Millions Sold)',
            consoleAValue: cA.units_sold || 'Unknown',
            consoleBValue: cB.units_sold || 'Unknown',
            winner: salesA > salesB ? 'A' : (salesB > salesA ? 'B' : 'Tie'),
            aScore: salesScore.a,
            bScore: salesScore.b
        });

        // 3. CPU Cores (Variant Level)
        const coresA = specsA.cpu_cores || 0;
        const coresB = specsB.cpu_cores || 0;
        const coreScore = calculateScore(coresA, coresB);
        points.push({
            feature: 'CPU Cores',
            consoleAValue: coresA ? `${coresA}` : 'Unknown',
            consoleBValue: coresB ? `${coresB}` : 'Unknown',
            winner: coresA > coresB ? 'A' : (coresB > coresA ? 'B' : 'Tie'),
            aScore: coreScore.a,
            bScore: coreScore.b
        });

        // 4. RAM (Variant Level) - USING MB
        const ramA = getBestVariantSpec(cA, 'ram_mb');
        const ramB = getBestVariantSpec(cB, 'ram_mb');
        const ramScore = calculateScore(ramA, ramB);
        
        points.push({
            feature: 'System RAM',
            consoleAValue: ramA >= 1024 ? `${(ramA/1024).toFixed(1)} GB` : `${ramA} MB`,
            consoleBValue: ramB >= 1024 ? `${(ramB/1024).toFixed(1)} GB` : `${ramB} MB`,
            winner: ramA > ramB ? 'A' : (ramB > ramA ? 'B' : 'Tie'),
            aScore: ramScore.a,
            bScore: ramScore.b
        });

        // 5. CPU Clock (Variant Level)
        const clockA = getBestVariantSpec(cA, 'cpu_clock_mhz');
        const clockB = getBestVariantSpec(cB, 'cpu_clock_mhz');
        const clockScore = calculateScore(clockA, clockB);

        points.push({
            feature: 'CPU Speed',
            consoleAValue: clockA ? `${clockA} MHz` : 'Unknown',
            consoleBValue: clockB ? `${clockB} MHz` : 'Unknown',
            winner: clockA > clockB ? 'A' : (clockB > clockA ? 'B' : 'Tie'),
            aScore: clockScore.a,
            bScore: clockScore.b
        });

        // 6. Output (Variant Level - screen resolution as proxy for output capability in handheld context)
        const resA = specsA.screen_resolution_x ? `${specsA.screen_resolution_x}x${specsA.screen_resolution_y}` : 'Unknown';
        const resB = specsB.screen_resolution_x ? `${specsB.screen_resolution_x}x${specsB.screen_resolution_y}` : 'Unknown';
        
        points.push({
            feature: 'Resolution',
            consoleAValue: resA,
            consoleBValue: resB,
            winner: 'Tie',
        });

        // Use variant image if available, else console image
        const imgA = specsA.image_url || cA.image_url;
        const imgB = specsB.image_url || cB.image_url;

        return {
            consoleA: cA.name,
            consoleB: cB.name,
            consoleAImage: imgA,
            consoleBImage: imgB,
            summary: `${manuA.name} faces off against ${manuB.name}.`,
            points: points
        }
    } catch {
        return null;
    }
}
