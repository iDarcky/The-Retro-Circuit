
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { fetchConsoleBySlug } from '@/lib/api';
import ConsoleDetailView from '@/components/console/ConsoleDetailView';
import Button from '@/components/ui/Button';
import Link from 'next/link';

// Strict Dynamic - No Caching for Admin Preview
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>
};

export default async function AdminConsolePreviewPage(props: Props) {
  const params = await props.params;
  const slug = decodeURIComponent(params.slug);
  const supabase = await createClient();

  // 1. Strict Admin Auth Guard
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
      redirect('/login');
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') {
      redirect('/');
  }

  // 2. Fetch Data (Including Hidden Drafts)
  // We pass 'true' to includeHidden
  const { data: consoleData, error } = await fetchConsoleBySlug(slug, true);

  if (!consoleData) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
            <h2 className="font-pixel text-accent text-2xl mb-4">PREVIEW ERROR</h2>
            <p className="font-mono text-gray-400 mb-8">DRAFT NOT FOUND OR DATABASE ERROR.</p>
            {error && <div className="text-red-500 font-mono text-xs mb-4">{error.message}</div>}
            <Link href="/admin/consoles">
                <Button variant="secondary">BACK TO ADMIN</Button>
            </Link>
        </div>
      );
  }

  return (
      <div className="relative">
          {/* Admin Preview Banner */}
          <div className="bg-yellow-500/90 text-black text-center font-mono font-bold text-xs py-2 sticky top-0 z-50">
              ⚠ ADMIN PREVIEW MODE - SHOWING DRAFT CONTENT ⚠
          </div>

          <ConsoleDetailView consoleData={consoleData} />
      </div>
  );
}
