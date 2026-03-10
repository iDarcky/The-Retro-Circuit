import fs from 'fs';
import path from 'path';
import { siteConfig } from '../../config/site';
import LegalMarkdownRenderer from '../../components/legal/LegalMarkdownRenderer';

export const metadata = {
  title: 'Terms of Service | The Retro Circuit',
  description: 'Terms of Service and usage conditions for The Retro Circuit database.',
  robots: { index: false, follow: true }
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
    <div className="bg-bg-primary min-h-screen text-text-primary font-sans selection:bg-rose-500/30 selection:text-white pb-24 relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05] pointer-events-none"></div>

      {/* HEADER SECTION */}
      <header className="px-6 md:px-12 pt-12 md:pt-24 pb-8 md:pb-16 relative z-10">
        <div className="max-w-4xl mx-auto w-full">

           {/* Metadata Pill - Rose Variant */}
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-900/30 bg-rose-950/10 text-[9px] md:text-xs font-mono uppercase tracking-widest text-rose-400 mb-8 animate-fade-in backdrop-blur-sm shadow-[0_0_15px_-3px_rgba(244,63,94,0.1)]">
               <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
               System Online // Status: BINDING // Est: {siteConfig.est}
           </div>
        </div>
      </header>

      {/* CONTENT SECTION */}
      <main className="px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto w-full">
          <LegalMarkdownRenderer content={markdownContent} themeColor="rose" />
        </div>
      </main>

    </div>
  );
}
