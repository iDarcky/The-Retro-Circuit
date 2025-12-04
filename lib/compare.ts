
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
        // Fetch consoles with variants
        const { data: cA } = await supabase
            .from('consoles')
            .select('*, manufacturer:manufacturer(*), specs:console_specs(*), variants:console_variants(*)')
            .eq('slug', slugA)
            .single();

        const { data: cB } = await supabase
            .from('consoles')
            .select('*, manufacturer:manufacturer(*), specs:console_specs(*), variants:console_variants(*)')
            .eq('slug', slugB)
            .single();
        
        if(!cA || !cB) return null;

        const specsA = (Array.isArray(cA.specs) ? cA.specs[0] : cA.specs) || {};
        const specsB = (Array.isArray(cB.specs) ? cB.specs[0] : cB.specs) || {};
        const manuA = cA.manufacturer || { name: 'Unknown' };
        const manuB = cB.manufacturer || { name: 'Unknown' };
        
        const points: ComparisonPoint[] = [];

        // 1. Generation
        points.push({
            feature: 'Generation',
            consoleAValue: `${cA.release_year} (${cA.generation})`,
            consoleBValue: `${cB.release_year} (${cB.generation})`,
            winner: cA.release_year < cB.release_year ? 'A' : (cB.release_year < cA.release_year ? 'B' : 'Tie'),
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

        // 3. CPU Cores (Base Arch)
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

        // 4. RAM (Variant Level)
        const ramA = getBestVariantSpec(cA, 'ram_gb');
        const ramB = getBestVariantSpec(cB, 'ram_gb');
        const ramScore = calculateScore(ramA, ramB);
        
        points.push({
            feature: 'System RAM',
            consoleAValue: ramA ? `${ramA} GB` : 'Unknown',
            consoleBValue: ramB ? `${ramB} GB` : 'Unknown',
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

        // 6. Output (Base Arch)
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