import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import LegalMarkdownRenderer from '../../components/legal/LegalMarkdownRenderer';

export const metadata = {
  title: 'Terms of Service | The Retro Circuit',
  description: 'Terms of Service and usage conditions for The Retro Circuit database.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  // Read Markdown content
  const filePath = path.join(process.cwd(), 'content', 'legal', 'terms.md');
  let markdownContent = '';
  try {
    markdownContent = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    markdownContent = '# Terms of Service\n\nError loading terms of service content.';
    console.error('Error reading terms file:', err);
  }

  return (
    <main className="bg-bg-primary min-h-screen text-text-primary font-sans pb-24">
      <div className="px-5 md:px-12 pt-12 md:pt-20">
        <div className="max-w-[760px] mx-auto">
          <nav aria-label="Legal pages" className="flex items-center gap-2 mb-10">
            <span className="font-pixel text-[10px] text-rose-400 mr-3">LEGAL</span>
            <Link href="/privacy" className="px-3 py-1.5 text-sm border border-white/10 text-zinc-300 hover:border-white/40">Privacy</Link>
            <Link href="/terms" aria-current="page" className="px-3 py-1.5 text-sm border bg-white text-black border-white">Terms</Link>
          </nav>
          <LegalMarkdownRenderer content={markdownContent} themeColor="rose" />
        </div>
      </div>
    </main>
  );
}
