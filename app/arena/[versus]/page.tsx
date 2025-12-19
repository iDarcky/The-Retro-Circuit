import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';

export default async function ArenaVersusPage({ params }: { params: Promise<{ versus: string }> }) {
  const { versus } = await params;
  const supabase = await createClient();

  // Parse "slug1-vs-slug2"
  // Note: If slugs contain "-vs-", this might break, but standard slugs usually don't.
  const parts = versus.split('-vs-');

  if (parts.length !== 2) {
      redirect('/arena');
  }

  const [raw1, raw2] = parts;

  // Helper to resolve "console-variant" into { p: console, v: variant }
  const resolveSlug = async (raw: string) => {
     if (!raw || raw === 'select') return { p: undefined, v: undefined };

     // 1. Try exact match (Console)
     // .maybeSingle() returns null if not found, instead of error
     const { data: consoleMatch } = await supabase.from('consoles').select('id, slug').eq('slug', raw).maybeSingle();
     if (consoleMatch) return { p: raw, v: undefined };

     // 2. Try splitting from right to left to find a Console + Variant combo
     // E.g. steam-deck-oled -> steam-deck (p) + oled (v)
     let lastIndex = raw.lastIndexOf('-');
     while (lastIndex > 0) {
         const potentialConsole = raw.substring(0, lastIndex);
         const potentialVariant = raw.substring(lastIndex + 1);

         const { data: cMatch } = await supabase.from('consoles').select('id, slug').eq('slug', potentialConsole).maybeSingle();
         if (cMatch) {
             // Console found, check if variant exists
             const { data: vMatch } = await supabase.from('console_variants').select('slug').eq('console_id', cMatch.id).eq('slug', potentialVariant).maybeSingle();
             if (vMatch) {
                 return { p: potentialConsole, v: potentialVariant };
             }
             // If variant matches nothing, continue splitting (e.g. console could have hyphens)
         }

         lastIndex = raw.lastIndexOf('-', lastIndex - 1);
     }

     // Fallback: Just return raw as p (let Arena handle 404 or partial match if logic differs)
     return { p: raw, v: undefined };
  };

  // Resolve both sides in parallel
  const [r1, r2] = await Promise.all([resolveSlug(raw1), resolveSlug(raw2)]);

  // Construct query params
  const paramsOut = new URLSearchParams();
  if (r1.p) paramsOut.set('p1', r1.p);
  if (r1.v) paramsOut.set('v1', r1.v);
  if (r2.p) paramsOut.set('p2', r2.p);
  if (r2.v) paramsOut.set('v2', r2.v);

  redirect(`/arena?${paramsOut.toString()}`);
}
