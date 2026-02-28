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
                <SwissButton variant="orange">Swiss Orange</SwissButton>
                <SwissButton variant="secondary">Swiss Secondary</SwissButton>
                <SwissButton variant="danger">Swiss Danger</SwissButton>
              </div>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-8">
          <h2 className="text-3xl font-pixel text-violet-500 uppercase border-l-4 border-violet-500 pl-4">Badges & Tags</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 p-8 border border-white/10 space-y-6">
              <h3 className="text-xl font-pixel text-white mb-4">Current TechBadge</h3>
              <p className="text-xs text-zinc-500 font-mono mb-4">Uses strict mono font and flat colored squares.</p>
              <div className="flex flex-wrap gap-4">
                <TechBadge label="ARM Cortex-A76" active={true} />
                <TechBadge label="OLED Display" active={true} color="bg-cyan-500" />
                <TechBadge label="LPDDR4x" active={true} color="bg-orange-500" />
                <TechBadge label="Wi-Fi 6" active={false} />
              </div>
            </div>

            <div className="bg-white/5 p-8 border border-violet-500/50 space-y-6 relative overflow-hidden group hover:border-violet-500 transition-colors">
              <div className="absolute top-0 right-0 bg-violet-500 text-black text-[10px] font-mono px-2 py-1 font-bold">PROPOSAL</div>
              <h3 className="text-xl font-pixel text-white mb-4">Vibrant Swiss Badge</h3>
              <p className="text-xs text-zinc-500 font-mono mb-4">Proposal: Inverted contrast. Solid thick borders, sans-serif typography, blocky structural feel.</p>
              <div className="flex flex-wrap gap-4">

                {/* Proposed Swiss Badges */}
                <div className="inline-flex items-center text-[10px] font-sans font-bold uppercase tracking-widest border border-white text-black bg-white">
                  <span className="bg-violet-500 w-3 h-full self-stretch border-r border-black"></span>
                  <span className="px-3 py-1">ARM Cortex-A76</span>
                </div>

                <div className="inline-flex items-center text-[10px] font-sans font-bold uppercase tracking-widest border border-cyan-500 text-cyan-500 bg-black">
                  <span className="bg-cyan-500 w-3 h-full self-stretch border-r border-cyan-500"></span>
                  <span className="px-3 py-1">OLED Display</span>
                </div>

                <div className="inline-flex items-center text-[10px] font-sans font-bold uppercase tracking-widest border border-orange-500 text-black bg-orange-500">
                  <span className="px-3 py-1">LPDDR4x</span>
                </div>

                <div className="inline-flex items-center text-[10px] font-sans font-bold uppercase tracking-widest border border-white/20 text-white/30 bg-transparent">
                  <span className="px-3 py-1">Wi-Fi 6</span>
                </div>

              </div>
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


        {/* Vibrant Swiss Proposals */}
        <section className="space-y-8 mt-24">
          <header className="border-b-4 border-orange-500 pb-8">
            <h2 className="text-4xl md:text-6xl font-pixel uppercase tracking-tighter mb-4 text-orange-500">
              Vibrant Swiss Proposals
            </h2>
            <p className="text-lg text-text-secondary font-mono">
              Prototyping next-gen components blending strict brutalist geometry with high-contrast brand colors.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Forms & Inputs */}
            <div className="bg-white/5 p-8 border border-white/10 space-y-8 relative overflow-hidden group hover:border-white/30 transition-colors">
              <div className="absolute top-0 right-0 bg-white text-black text-[10px] font-mono px-2 py-1 font-bold">PROPOSAL 01</div>
              <h3 className="text-xl font-pixel text-white mb-6">Text Input</h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 font-sans">Current Legacy Input</label>
                  <input type="text" placeholder="Type here..." className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm text-white" />
                </div>

                <div className="space-y-1 mt-6">
                  <label className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase block mb-2">Target Swiss Input</label>
                  <div className="relative group/input">
                    <input type="text" placeholder="Input specific criteria..." className="w-full bg-transparent border-2 border-white/20 p-3 text-sm font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 focus:bg-white/5 transition-colors rounded-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stepper */}
            <div className="bg-white/5 p-8 border border-white/10 space-y-8 relative overflow-hidden hover:border-white/30 transition-colors">
              <div className="absolute top-0 right-0 bg-white text-black text-[10px] font-mono px-2 py-1 font-bold">PROPOSAL 02</div>
              <h3 className="text-xl font-pixel text-white mb-6">Numeric Adjuster</h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 font-sans">Current Legacy Input</label>
                  <input type="number" defaultValue={5} className="bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm text-white w-24" />
                </div>

                <div className="space-y-1 mt-6">
                  <label className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase block mb-2">Target Swiss Stepper</label>
                  <div className="inline-flex">
                    <button className="w-10 h-10 bg-white/5 border border-white/20 text-white hover:bg-white hover:text-black transition-colors flex items-center justify-center font-sans font-bold text-lg">-</button>
                    <div className="h-10 px-6 bg-transparent border-y border-white/20 text-white font-mono text-lg flex items-center justify-center min-w-[60px]">05</div>
                    <button className="w-10 h-10 bg-white/5 border border-white/20 text-white hover:bg-white hover:text-black transition-colors flex items-center justify-center font-sans font-bold text-lg">+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="bg-white/5 p-8 border border-white/10 space-y-8 relative overflow-hidden hover:border-white/30 transition-colors">
              <div className="absolute top-0 right-0 bg-white text-black text-[10px] font-mono px-2 py-1 font-bold">PROPOSAL 03</div>
              <h3 className="text-xl font-pixel text-white mb-6">Checkboxes & Toggles</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  <input type="checkbox" className="w-4 h-4 rounded text-orange-500" defaultChecked />
                  <label className="text-sm text-zinc-400 font-sans">Legacy Default Checkbox</label>
                </div>

                <div className="space-y-4 mt-6">
                  <label className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase block mb-2">Target Swiss States</label>

                  {/* Swiss Checkbox */}
                  <div className="flex items-center gap-4 cursor-pointer group/cb">
                    <div className="w-5 h-5 border-2 border-white flex items-center justify-center bg-cyan-500 transition-colors">
                      {/* Checkmark icon using simple div lines */}
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 6L5 9L10 3" stroke="black" strokeWidth="2" strokeLinecap="square"/>
                      </svg>
                    </div>
                    <span className="font-sans font-bold uppercase tracking-wider text-xs text-white">Compare Models</span>
                  </div>

                  <div className="flex items-center gap-4 cursor-pointer group/cb">
                    <div className="w-5 h-5 border-2 border-white/30 flex items-center justify-center group-hover/cb:border-white transition-colors">
                    </div>
                    <span className="font-sans font-bold uppercase tracking-wider text-xs text-zinc-500 group-hover/cb:text-zinc-300">Show Specifications</span>
                  </div>

                  {/* Swiss Toggle */}
                  <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/10">
                    <div className="w-12 h-6 border-2 border-orange-500 flex items-center bg-orange-500/10 cursor-pointer relative">
                      <div className="absolute right-0 top-0 bottom-0 w-6 bg-orange-500"></div>
                    </div>
                    <span className="font-sans font-bold uppercase tracking-wider text-xs text-white">High Contrast Mode</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Breadcrumbs */}
            <div className="bg-white/5 p-8 border border-white/10 space-y-8 relative overflow-hidden hover:border-white/30 transition-colors">
              <div className="absolute top-0 right-0 bg-white text-black text-[10px] font-mono px-2 py-1 font-bold">PROPOSAL 04</div>
              <h3 className="text-xl font-pixel text-white mb-6">Navigation Paths</h3>

              <div className="space-y-4 mt-6">
                <div className="flex items-center text-xs font-mono tracking-wider">
                  <span className="text-zinc-500 hover:text-white cursor-pointer transition-colors bg-white/5 px-2 py-1 border border-white/10">Systems</span>
                  <div className="w-4 h-px bg-white/20 mx-2"></div>
                  <span className="text-zinc-500 hover:text-white cursor-pointer transition-colors bg-white/5 px-2 py-1 border border-white/10">Handhelds</span>
                  <div className="w-4 h-px bg-white/20 mx-2"></div>
                  <span className="text-black bg-white px-2 py-1 border border-white font-bold">Analogue Pocket</span>
                </div>
              </div>
            </div>

            {/* Toggles V2 */}
            <div className="bg-white/5 p-8 border border-white/10 space-y-8 relative overflow-hidden hover:border-white/30 transition-colors">
              <div className="absolute top-0 right-0 bg-white text-black text-[10px] font-mono px-2 py-1 font-bold">PROPOSAL 03_V2</div>
              <h3 className="text-xl font-pixel text-white mb-6">Checkboxes & Toggles (V2)</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  <input type="checkbox" className="w-4 h-4 rounded accent-orange-500 bg-black border-white/20" defaultChecked />
                  <label className="text-sm text-zinc-400 font-sans">Legacy Default Checkbox</label>
                </div>

                <div className="space-y-4 mt-6">
                  <label className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase block mb-2">Target Swiss States V2 (Minimal Block)</label>

                  {/* Swiss Checkbox V2 */}
                  <div className="flex items-center gap-4 cursor-pointer group/cb2">
                    <div className="w-5 h-5 border border-white/30 flex items-center justify-center bg-transparent group-hover/cb2:border-white transition-colors p-0.5">
                      <div className="w-full h-full bg-cyan-500"></div>
                    </div>
                    <span className="font-mono text-sm text-white">Compare Models</span>
                  </div>

                  <div className="flex items-center gap-4 cursor-pointer group/cb2">
                    <div className="w-5 h-5 border border-white/30 flex items-center justify-center group-hover/cb2:border-white transition-colors p-0.5">
                    </div>
                    <span className="font-mono text-sm text-zinc-500">Show Specifications</span>
                  </div>

                  {/* Swiss Toggle V2 */}
                  <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/10">
                    <div className="w-12 h-5 bg-white/10 flex items-center cursor-pointer relative overflow-hidden">
                      <div className="absolute right-0 top-0 bottom-0 w-6 bg-orange-500 border border-orange-400"></div>
                    </div>
                    <span className="font-sans text-xs text-white uppercase tracking-wider">High Contrast Mode</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Breadcrumbs V2 */}
            <div className="bg-white/5 p-8 border border-white/10 space-y-8 relative overflow-hidden hover:border-white/30 transition-colors">
              <div className="absolute top-0 right-0 bg-white text-black text-[10px] font-mono px-2 py-1 font-bold">PROPOSAL 04_V2</div>
              <h3 className="text-xl font-pixel text-white mb-6">Navigation Paths (V2)</h3>

              <div className="space-y-4 mt-6">
                <div className="flex items-center text-xs font-mono tracking-wider">
                  <span className="text-white/50 hover:text-white cursor-pointer transition-colors pb-1">SYSTEMS</span>
                  <span className="text-white/20 mx-3 font-mono">//</span>
                  <span className="text-white/50 hover:text-white cursor-pointer transition-colors pb-1">HANDHELDS</span>
                  <span className="text-white/20 mx-3 font-mono">//</span>
                  <span className="text-white pb-1 border-b border-white">ANALOGUE POCKET</span>
                </div>
              </div>
            </div>


            {/* Expandables */}
            <div className="bg-white/5 p-8 border border-white/10 space-y-8 relative overflow-hidden col-span-1 md:col-span-2 hover:border-white/30 transition-colors">
              <div className="absolute top-0 right-0 bg-white text-black text-[10px] font-mono px-2 py-1 font-bold">PROPOSAL 05</div>
              <h3 className="text-xl font-pixel text-white mb-6">Data Structures & Feedback</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Accordion */}
                <div className="space-y-0 border-t-4 border-violet-500">
                  <div className="flex items-center justify-between p-4 cursor-pointer bg-white/5 hover:bg-white/10 transition-colors border-b border-white/10">
                    <span className="font-sans text-sm text-white font-bold uppercase tracking-wider">Display Technology</span>
                    <span className="font-pixel text-sm text-violet-500">+</span>
                  </div>
                  <div className="flex items-start justify-between p-4 cursor-pointer bg-white/[0.02] border-b border-white/10">
                    <div className="space-y-4 w-full">
                      <div className="flex justify-between items-center">
                        <span className="font-sans text-sm text-white font-bold uppercase tracking-wider">Processing Power</span>
                        <span className="font-pixel text-sm text-white">-</span>
                      </div>
                      <div className="font-mono text-xs text-zinc-400 space-y-2 pb-2 pl-4 border-l-2 border-white/10">
                        <p>CPU: ARM Cortex-A76</p>
                        <p>GPU: Mali-G57 MC4</p>
                        <p>RAM: 8GB LPDDR4x</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress / Loading */}
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase block mb-2">Block Progress Indicator</label>
                    <div className="flex items-center gap-4">
                      <div className="font-mono text-xs text-white min-w-[30px]">60%</div>
                      <div className="flex-1 h-6 border border-white/20 bg-black p-0.5 flex">
                        <div className="h-full w-full bg-cyan-500 max-w-[60%]"></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <label className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase block mb-2">Alert / Toast Panel</label>
                    <div className="bg-orange-500 text-black p-4 border-l-8 border-black flex gap-4 items-start">
                       <span className="font-pixel text-lg">!</span>
                       <div>
                         <h4 className="font-sans font-bold text-sm uppercase">Configuration Saved</h4>
                         <p className="font-mono text-xs opacity-80 mt-1">Changes to the emulation matrix have been applied.</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid Layout Primitive */}
            <div className="bg-transparent p-0 border-none space-y-8 relative overflow-hidden col-span-1 md:col-span-2">
               <h3 className="text-xl font-pixel text-white mb-2">Mathematical Grid Foundation</h3>
               <p className="font-mono text-sm text-zinc-500 mb-4">Structural layouts should rely on visible gridlines and rigid geometric containment.</p>

               <div className="grid grid-cols-3 gap-0 border border-white/20 bg-black">
                 <div className="border-r border-b border-white/20 p-8 flex flex-col items-center justify-center min-h-[160px] bg-white/5">
                    <div className="w-16 h-16 bg-white flex items-center justify-center mb-4">
                      <span className="font-mono text-xl text-black font-bold">M</span>
                    </div>
                    <span className="font-sans text-xs text-white uppercase tracking-wider">Manufacturer Profile</span>
                 </div>
                 <div className="border-r border-b border-white/20 p-8 flex flex-col justify-center">
                   <div className="space-y-4 font-mono text-sm">
                     <div className="flex justify-between border-b border-white/10 pb-2">
                       <span className="text-zinc-500">Retail Price</span>
                       <span className="text-white">$199</span>
                     </div>
                     <div className="flex justify-between border-b border-white/10 pb-2">
                       <span className="text-zinc-500">Release Year</span>
                       <span className="text-white">2023</span>
                     </div>
                   </div>
                 </div>
                 <div className="border-b border-white/20 p-8 flex flex-col justify-center bg-violet-500/10 border-l-4 border-l-violet-500">
                   <div className="space-y-2">
                     <h4 className="font-sans font-bold text-sm text-white uppercase">System Notice</h4>
                     <p className="font-mono text-xs text-zinc-400 leading-relaxed">
                       Aesthetic info panel proposal. Rigid, colored border indicators, flat background fills.
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
