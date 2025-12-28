
import { createClient } from '../../../lib/supabase/server';
import ArenaComparisonClient from '../../../components/arena/ArenaComparisonClient';

export async function generateMetadata({ params }: { params: Promise<{ versus: string }> }) {
    const { versus } = await params;
    const parts = versus.split('-vs-');

    // Basic title if not fully parseable yet
    if (parts.length !== 2) return { title: 'Head-to-Head Arena | The Retro Circuit' };

    // Simply format the slugs for the title (capitalized)
    const formatName = (s: string) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const name1 = formatName(parts[0]);
    const name2 = formatName(parts[1]);

    return {
        title: `${name1} vs ${name2} | The Retro Circuit Arena`,
        description: `Detailed spec comparison: ${name1} versus ${name2}. Compare CPU, Screen, Battery, and more.`,
        openGraph: {
            title: `${name1} vs ${name2} - Fight!`,
            description: 'Who wins? Check the specs.',
        }
    };
}

export default async function ArenaVersusPage({ params }: { params: Promise<{ versus: string }> }) {
  const { versus } = await params;
  const supabase = await createClient();

  const parts = versus.split('-vs-');

  // If invalid format, let the client handle it or just render empty (redirecting is also fine but user asked for SSR content)
  // We can redirect to the main arena if it's completely broken
  // but to satisfy "instant load", we should try to resolve here.

  // Reuse the resolution logic or similar?
  // NOTE: The previous redirection logic was robust for handling "console-variant".
  // To replicate that for SSR rendering, we need to do the same lookups.

  const resolveSlug = async (raw: string) => {
     if (!raw || raw === 'select') return { p: null, v: null, details: null, variant: null };

     // 1. Try exact match (Console)
     const { data: consoleMatch } = await supabase.from('consoles').select('*, manufacturer:manufacturer(*)').eq('slug', raw).maybeSingle();
     if (consoleMatch) {
         // Get default variant
         const { data: variants } = await supabase.from('console_variants').select('*').eq('console_id', consoleMatch.id);
         const defaultVar = variants?.find((v: any) => v.is_default) || variants?.[0];
         consoleMatch.variants = variants; // Attach variants for the selector
         return { p: raw, v: null, details: consoleMatch, variant: defaultVar };
     }

     // 2. Try splitting
     let lastIndex = raw.lastIndexOf('-');
     while (lastIndex > 0) {
         const potentialConsole = raw.substring(0, lastIndex);
         const potentialVariant = raw.substring(lastIndex + 1);

         const { data: cMatch } = await supabase.from('consoles').select('*, manufacturer:manufacturer(*)').eq('slug', potentialConsole).maybeSingle();
         if (cMatch) {
             const { data: vMatch } = await supabase.from('console_variants').select('*').eq('console_id', cMatch.id).eq('slug', potentialVariant).maybeSingle();
             if (vMatch) {
                 // Fetch all variants for the selector
                 const { data: allVars } = await supabase.from('console_variants').select('*').eq('console_id', cMatch.id);
                 cMatch.variants = allVars;
                 return { p: potentialConsole, v: potentialVariant, details: cMatch, variant: vMatch };
             }
         }
         lastIndex = raw.lastIndexOf('-', lastIndex - 1);
     }
     return { p: raw, v: null, details: null, variant: null };
  };

  const [r1, r2] = await Promise.all([
      parts[0] ? resolveSlug(parts[0]) : Promise.resolve(null),
      parts[1] ? resolveSlug(parts[1]) : Promise.resolve(null)
  ]);

  // If we resolved valid data, pass it to the Client Component
  // If not, we pass what we have (nulls) and let the client handle empty states (or fetch fallback).

  const initialSelectionA = r1?.details ? {
      slug: r1.p,
      details: r1.details,
      selectedVariant: r1.variant,
      loading: false
  } : undefined;

  const initialSelectionB = r2?.details ? {
      slug: r2.p,
      details: r2.details,
      selectedVariant: r2.variant,
      loading: false
  } : undefined;

  return (
      <ArenaComparisonClient
          initialSelectionA={initialSelectionA}
          initialSelectionB={initialSelectionB}
      />
  );
}
