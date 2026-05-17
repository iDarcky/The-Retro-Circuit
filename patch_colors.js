const fs = require('fs');

const targetFile = 'app/design/page.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

const colorsSection = `
        {/* Colors */}
        <section className="space-y-8">
          <h2 className="text-3xl font-pixel text-violet-500 uppercase border-l-4 border-violet-500 pl-4">Colors</h2>
          <div className="bg-white/5 p-8 border border-white/10 space-y-8">
            <p className="text-sm font-mono text-zinc-400">The Retro Circuit theme strictly enforces "Swiss Archive" minimal aesthetics. Pure black, stark white, and a single "International Orange" accent. No blur, no glow, no noise.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Primary / Accent */}
              <div className="space-y-4">
                <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest border-b border-white/10 pb-2">Primary / Accent</h3>
                <div className="flex items-center gap-4 border border-white/10 p-2 bg-black">
                   <div className="w-12 h-12 bg-primary"></div>
                   <div>
                     <p className="font-mono text-sm text-white font-bold">Primary</p>
                     <p className="font-mono text-[10px] text-zinc-500">var(--color-primary)</p>
                     <p className="font-sans text-xs text-zinc-400 mt-1">#ff4f00 (International Orange)</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 border border-white/10 p-2 bg-black">
                   <div className="w-12 h-12 bg-accent"></div>
                   <div>
                     <p className="font-mono text-sm text-white font-bold">Accent</p>
                     <p className="font-mono text-[10px] text-zinc-500">var(--color-accent)</p>
                     <p className="font-sans text-xs text-zinc-400 mt-1">Alias for Primary</p>
                   </div>
                </div>
              </div>

              {/* Secondary / Text */}
              <div className="space-y-4">
                <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest border-b border-white/10 pb-2">Secondary / Text</h3>
                <div className="flex items-center gap-4 border border-white/10 p-2 bg-black">
                   <div className="w-12 h-12 bg-secondary border border-white/20"></div>
                   <div>
                     <p className="font-mono text-sm text-white font-bold">Secondary / Text Primary</p>
                     <p className="font-mono text-[10px] text-zinc-500">var(--color-secondary)</p>
                     <p className="font-sans text-xs text-zinc-400 mt-1">#ffffff (Pure White)</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 border border-white/10 p-2 bg-black">
                   <div className="w-12 h-12 bg-zinc-400"></div>
                   <div>
                     <p className="font-mono text-sm text-white font-bold">Text Secondary</p>
                     <p className="font-mono text-[10px] text-zinc-500">var(--text-secondary)</p>
                     <p className="font-sans text-xs text-zinc-400 mt-1">#a1a1aa (Zinc 400)</p>
                   </div>
                </div>
              </div>

              {/* Backgrounds */}
              <div className="space-y-4">
                <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest border-b border-white/10 pb-2">Backgrounds</h3>
                <div className="flex items-center gap-4 border border-white/10 p-2 bg-white">
                   <div className="w-12 h-12 bg-bg-primary border border-white/20"></div>
                   <div>
                     <p className="font-mono text-sm text-black font-bold">Bg Primary</p>
                     <p className="font-mono text-[10px] text-zinc-500">var(--bg-primary)</p>
                     <p className="font-sans text-xs text-zinc-500 mt-1">#09090b (Zinc 950)</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 border border-white/10 p-2 bg-white">
                   <div className="w-12 h-12 bg-bg-secondary border border-black/20"></div>
                   <div>
                     <p className="font-mono text-sm text-black font-bold">Bg Secondary</p>
                     <p className="font-mono text-[10px] text-zinc-500">var(--bg-secondary)</p>
                     <p className="font-sans text-xs text-zinc-500 mt-1">#18181b (Zinc 900)</p>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </section>
`;

const insertIndex = content.indexOf('{/* Typography */}');
if (insertIndex !== -1) {
    const newContent = content.slice(0, insertIndex) + colorsSection + '\n        ' + content.slice(insertIndex);
    fs.writeFileSync(targetFile, newContent, 'utf8');
    console.log('Successfully added Colors section.');
} else {
    console.error('Could not find insert anchor.');
}
