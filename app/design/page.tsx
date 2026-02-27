"use client";
import Button from '@/components/ui/Button';
import SwissButton from '@/components/console/swiss/SwissButton';
import { TechBadge } from '@/components/ui/specs/TechBadge';
import { SwissDropdown } from '@/components/ui/SwissDropdown';
import RetroStatusBar from '@/components/ui/RetroStatusBar';


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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

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

            <div className="bg-white/5 p-8 border border-white/10 space-y-6">
              <h3 className="text-xl font-pixel text-white mb-4">RetroStatusBar</h3>
              <div className="w-full relative h-16 bg-black">
                <RetroStatusBar rcPath="RC-01" docId="DOC-SYS" archiveVersion="1.0.0" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
