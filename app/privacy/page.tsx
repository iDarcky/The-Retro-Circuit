import fs from 'fs';
import path from 'path';
import LegalMarkdownRenderer from '../../components/legal/LegalMarkdownRenderer';
import { getSystemVersion } from '../../app/actions/roadmap';

export const metadata = {
  title: 'Privacy Policy | The Retro Circuit',
  description: 'Privacy Policy detailing data handling and user privacy practices at The Retro Circuit.',
  robots: { index: false, follow: true }
};

export default async function PrivacyPage() {
  const version = await getSystemVersion();

  // Read Markdown content
  const filePath = path.join(process.cwd(), 'content', 'legal', 'privacy.md');
  let markdownContent = '';
  try {
    markdownContent = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    markdownContent = '# Privacy Policy\n\nError loading privacy policy content.';
    console.error('Error reading privacy policy file:', err);
  }

  return (
    <div className="bg-bg-primary min-h-screen text-text-primary font-sans selection:bg-sky-500/30 selection:text-white pb-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05] pointer-events-none"></div>

      {/* HEADER SECTION */}
      <header className="px-6 md:px-12 pt-12 md:pt-24 pb-8 md:pb-16 relative z-10">
        <div className="max-w-4xl mx-auto w-full">
           {/* Metadata Pill - Sky Blue Variant */}
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-900/30 bg-sky-950/10 text-[9px] md:text-xs font-mono uppercase tracking-widest text-sky-400 mb-8 animate-fade-in backdrop-blur-sm shadow-[0_0_15px_-3px_rgba(56,189,248,0.1)]">
               <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-sky-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.5)]"></div>
               Secure Protocol // v{version}
           </div>
        </div>
      </header>

      {/* CONTENT SECTION */}
      <main className="px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto w-full">
          <LegalMarkdownRenderer content={markdownContent} themeColor="sky" />
        </div>
      </main>
    </div>
  );
}
