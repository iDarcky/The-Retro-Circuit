"use client";
import Button from '@/components/ui/Button';
import SwissButton from '@/components/console/swiss/SwissButton';
import { TechBadge } from '@/components/ui/specs/TechBadge';
import { SwissDropdown } from '@/components/ui/SwissDropdown';


export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <header className="border-b-4 border-violet-500 pb-8">
          <h1 className="text-5xl md:text-8xl font-pixel uppercase tracking-tighter mb-4 text-white">
            Design System
          </h1>
          <p className="text-xl text-text-secondary font-mono">
            Living audit of components enforcing the Swiss Design methodology.
          </p>
        </header>

        {/* Typography */}
        <section className="space-y-8">
          <h2 className="text-3xl font-pixel text-violet-500 uppercase border-l-4 border-violet-500 pl-4">Typography</h2>
          <div className="grid gap-8 bg-white/5 p-8 border border-white/10">
            <div>
              <p className="text-sm text-text-secondary font-mono mb-2">.font-pixel (Headers)</p>
              <h1 className="text-5xl font-pixel uppercase text-white">Pixel Header 1</h1>
              <h2 className="text-3xl font-pixel uppercase text-white mt-4">Pixel Header 2</h2>
              <h3 className="text-xl font-pixel uppercase text-white mt-4">Pixel Header 3</h3>
            </div>
            <div className="pt-8 border-t border-white/10">
              <p className="text-sm text-text-secondary font-mono mb-2">.font-sans (Body / UI)</p>
              <p className="text-lg font-sans text-text-primary">
                The quick brown fox jumps over the lazy dog. System Console employs a dense, high-contrast typography scale inspired by Swiss design principles.
              </p>
            </div>
            <div className="pt-8 border-t border-white/10">
              <p className="text-sm text-text-secondary font-mono mb-2">.font-mono (Data / Metadata)</p>
              <p className="text-sm font-mono text-text-secondary">
                {"{ id: '123e4567-e89b-12d3-a456-426614174000', status: 'ACTIVE', tier: 'MAX_EMULATION' }"}
              </p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-8">
          <h2 className="text-3xl font-pixel text-violet-500 uppercase border-l-4 border-violet-500 pl-4">Buttons</h2>
          <div className="grid grid-cols-1 gap-8">

            <div className="bg-white/5 p-8 border border-white/10 space-y-6">
              <h3 className="text-xl font-pixel text-white mb-4">Standard Button</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>

            <div className="bg-white/5 p-8 border border-white/10 space-y-6">
              <h3 className="text-xl font-pixel text-white mb-4">SwissButton (Console View)</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <SwissButton variant="primary">Swiss Primary</SwissButton>
              </div>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-8">
          <h2 className="text-3xl font-pixel text-violet-500 uppercase border-l-4 border-violet-500 pl-4">Badges & Tags</h2>
          <div className="bg-white/5 p-8 border border-white/10 space-y-6">
            <h3 className="text-xl font-pixel text-white mb-4">TechBadge</h3>
            <div className="flex flex-wrap gap-4">
              <TechBadge label="ARM Cortex-A76" />
              <TechBadge label="OLED Display" />
              <TechBadge label="LPDDR4x" />
              <TechBadge label="Wi-Fi 6" />
            </div>
          </div>
        </section>

        {/* Interactive Components */}
        <section className="space-y-8">
          <h2 className="text-3xl font-pixel text-violet-500 uppercase border-l-4 border-violet-500 pl-4">Interactive</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 p-8 border border-white/10 space-y-6">
              <h3 className="text-xl font-pixel text-white mb-4">SwissDropdown</h3>
              <div className="w-64">
                <SwissDropdown
                  options={[
                    { label: 'Cyan Player', value: 'cyan' },
                    { label: 'Orange Player', value: 'orange' },
                    { label: 'Violet System', value: 'violet' }
                  ]}
                  value="cyan"
                  onChange={() => {}}
                />
              </div>
            </div>

          </div>
        </section>

        {/* Cyber-Swiss Proposals */}
        <section className="space-y-8 mt-24">
          <header className="border-b-4 border-emerald-500 pb-8">
            <h2 className="text-4xl md:text-6xl font-pixel uppercase tracking-tighter mb-4 text-emerald-500">
              Cyber-Swiss Proposals
            </h2>
            <p className="text-lg text-emerald-400 font-mono">
              [SYS.LOG] Prototyping next-gen components blending brutalist geometry with terminal/cyberpunk aesthetics.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Forms & Inputs */}
            <div className="bg-white/5 p-8 border border-emerald-500/30 space-y-8 relative overflow-hidden group hover:border-emerald-500 transition-colors">
              <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[10px] font-mono px-2 py-1 font-bold">PROPOSAL 01</div>
              <h3 className="text-xl font-pixel text-white mb-6">Text Input [Standard vs Cyber]</h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 font-sans">Current Legacy Input</label>
                  <input type="text" placeholder="Type here..." className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm text-white" />
                </div>

                <div className="space-y-1 mt-6">
                  <label className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase block mb-2">Target Cyber-Swiss Input</label>
                  <div className="relative group/input">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 font-mono">&gt;</span>
                    <input type="text" placeholder="ENTER_COMMAND..." className="w-full bg-black border-2 border-white/10 p-3 pl-8 text-sm font-mono text-emerald-500 placeholder:text-emerald-900 focus:outline-none focus:border-emerald-500 transition-colors rounded-none" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-4 bg-emerald-500 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stepper */}
            <div className="bg-white/5 p-8 border border-cyan-500/30 space-y-8 relative overflow-hidden hover:border-cyan-500 transition-colors">
              <div className="absolute top-0 right-0 bg-cyan-500 text-black text-[10px] font-mono px-2 py-1 font-bold">PROPOSAL 02</div>
              <h3 className="text-xl font-pixel text-white mb-6">Numeric Adjuster</h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 font-sans">Current Legacy Input</label>
                  <input type="number" defaultValue={5} className="bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm text-white w-24" />
                </div>

                <div className="space-y-1 mt-6">
                  <label className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase block mb-2">Target Cyber-Swiss Stepper</label>
                  <div className="inline-flex border-2 border-white/20">
                    <button className="px-4 py-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors font-mono text-xl border-r border-white/20">-</button>
                    <div className="px-6 py-2 bg-black text-cyan-400 font-mono text-xl text-center min-w-[80px]">05</div>
                    <button className="px-4 py-2 text-white/50 hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors font-mono text-xl border-l border-white/20">+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="bg-white/5 p-8 border border-orange-500/30 space-y-8 relative overflow-hidden hover:border-orange-500 transition-colors">
              <div className="absolute top-0 right-0 bg-orange-500 text-black text-[10px] font-mono px-2 py-1 font-bold">PROPOSAL 03</div>
              <h3 className="text-xl font-pixel text-white mb-6">Checkboxes / Toggles</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded text-orange-500" defaultChecked />
                  <label className="text-sm text-zinc-400 font-sans">Legacy Default Checkbox</label>
                </div>

                <div className="space-y-4 mt-6">
                  <label className="text-[10px] text-orange-400 font-mono tracking-widest uppercase block mb-2">Target Cyber-Swiss States</label>

                  {/* Cyber Checkbox */}
                  <div className="flex items-center gap-3 cursor-pointer group/cb">
                    <div className="w-5 h-5 border-2 border-orange-500 flex items-center justify-center bg-orange-500/10">
                      <div className="w-2.5 h-2.5 bg-orange-500"></div>
                    </div>
                    <span className="font-mono text-sm text-white group-hover/cb:text-orange-400 transition-colors">SYSTEM_ACTIVE</span>
                  </div>

                  <div className="flex items-center gap-3 cursor-pointer group/cb">
                    <div className="w-5 h-5 border-2 border-white/20 flex items-center justify-center group-hover/cb:border-white/40">
                    </div>
                    <span className="font-mono text-sm text-zinc-500 group-hover/cb:text-white transition-colors">GUEST_ACCESS</span>
                  </div>

                  {/* Cyber Toggle */}
                  <div className="flex items-center gap-3 mt-4">
                    <div className="w-12 h-6 border-2 border-orange-500 bg-orange-500/10 relative cursor-pointer">
                      <div className="absolute top-0.5 left-6 w-4 h-4 bg-orange-500"></div>
                    </div>
                    <span className="font-mono text-xs text-orange-400">SYS_OVERRIDE : ON</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terminal Breadcrumbs */}
            <div className="bg-white/5 p-8 border border-violet-500/30 space-y-8 relative overflow-hidden hover:border-violet-500 transition-colors">
              <div className="absolute top-0 right-0 bg-violet-500 text-black text-[10px] font-mono px-2 py-1 font-bold">PROPOSAL 04</div>
              <h3 className="text-xl font-pixel text-white mb-6">Navigation / Breadcrumbs</h3>

              <div className="space-y-4 mt-6">
                <div className="flex items-center text-[10px] md:text-xs font-mono text-zinc-500 tracking-wider">
                  <span className="hover:text-violet-400 cursor-pointer transition-colors">ROOT_DIR</span>
                  <span className="mx-2 text-white/20">/</span>
                  <span className="hover:text-violet-400 cursor-pointer transition-colors">SYS_VAULT</span>
                  <span className="mx-2 text-white/20">/</span>
                  <span className="text-white bg-violet-500/20 px-1 border-b border-violet-500">NINTENDO_DS</span>
                </div>
              </div>
            </div>

            {/* Expandables */}
            <div className="bg-white/5 p-8 border border-white/20 space-y-8 relative overflow-hidden col-span-1 md:col-span-2 hover:border-white transition-colors">
              <div className="absolute top-0 right-0 bg-white text-black text-[10px] font-mono px-2 py-1 font-bold">PROPOSAL 05</div>
              <h3 className="text-xl font-pixel text-white mb-6">Data Structures & Expandables</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Accordion */}
                <div className="space-y-0 border-y border-white/20">
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/10">
                    <span className="font-mono text-sm text-emerald-400">SYS.CONFIG.1</span>
                    <span className="font-mono text-lg text-white">+</span>
                  </div>
                  <div className="flex items-start justify-between p-4 cursor-pointer bg-white/5 border-l-4 border-emerald-500 border-b border-white/10">
                    <div className="space-y-4 w-full">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-sm text-white font-bold">SYS.CONFIG.2_ACTIVE</span>
                        <span className="font-mono text-lg text-white">-</span>
                      </div>
                      <div className="font-mono text-xs text-zinc-400 space-y-2 pb-2">
                        <p>MEMORY_ALLOCATION: 1024MB</p>
                        <p>RENDER_TARGET: VULKAN_API</p>
                        <p>OVERCLOCK_STATE: DISABLED</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cyber Skeleton / Loading */}
                <div className="space-y-4">
                  <label className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase block mb-2">Terminal Loading Indicator</label>
                  <div className="font-mono text-xs space-y-1">
                    <div className="text-emerald-500">COMPILING DATASET...</div>
                    <div className="text-zinc-500">[||||||||||||........] 60%</div>
                  </div>
                  <div className="w-full h-8 border border-white/20 mt-4 relative bg-black overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-[60%] bg-white/10 border-r-2 border-white flex items-center overflow-hidden">
                       <div className="w-full h-full" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid Layout Primitive */}
            <div className="bg-transparent p-0 border-none space-y-8 relative overflow-hidden col-span-1 md:col-span-2">
               <h3 className="text-xl font-pixel text-white mb-2">Mathematical Grid Foundation</h3>
               <p className="font-mono text-sm text-zinc-500 mb-4">Structural layouts should rely on visible gridlines and rigid geometric containment rather than floating cards.</p>

               <div className="grid grid-cols-3 gap-0 border-2 border-white/20 bg-black">
                 <div className="border-r border-b border-white/20 p-6 flex flex-col items-center justify-center min-h-[160px] hover:bg-white/5 transition-colors">
                    <div className="w-16 h-16 border-2 border-emerald-500 bg-emerald-500/10 rotate-45 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      <span className="-rotate-45 font-mono text-xs text-emerald-500">AVTR</span>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-500 uppercase">Octagonal Profile</span>
                 </div>
                 <div className="border-r border-b border-white/20 p-6 flex flex-col justify-center">
                   <div className="space-y-2 font-mono text-xs">
                     <div className="flex justify-between border-b border-dashed border-white/20 pb-1">
                       <span className="text-zinc-500">PWR_DRAW</span>
                       <span className="text-orange-400">15W</span>
                     </div>
                     <div className="flex justify-between border-b border-dashed border-white/20 pb-1">
                       <span className="text-zinc-500">THERMALS</span>
                       <span className="text-cyan-400">65C</span>
                     </div>
                   </div>
                 </div>
                 <div className="border-b border-white/20 p-6 flex flex-col justify-center bg-white/5">
                   <div className="border-l-2 border-violet-500 pl-4 space-y-2">
                     <h4 className="font-pixel text-sm text-white">SYS.WARNING</h4>
                     <p className="font-mono text-[10px] text-zinc-400 leading-relaxed">
                       Aesthetic tooltip or popover proposal. Rigid, border-heavy, zero shadow drop.
                     </p>
                   </div>
                 </div>
               </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
