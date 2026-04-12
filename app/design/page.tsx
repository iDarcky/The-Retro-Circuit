"use client";
import { useState } from 'react';
import Button from '@/components/ui/Button';
import SwissButton from '@/components/console/swiss/SwissButton';
import { TechBadge } from '@/components/ui/specs/TechBadge';
import { SwissDropdown } from '@/components/ui/SwissDropdown';
import { SpecCard } from '@/components/ui/specs/SpecCard';
import { SpecField } from '@/components/ui/specs/SpecField';
import RetroLoader from '@/components/ui/RetroLoader';
import RetroStatusBar from '@/components/ui/RetroStatusBar';
import Modal from '@/components/ui/Modal';
import SwissModal from '@/components/console/swiss/SwissModal';
import {
  IconNews, IconDatabase, IconVS, IconGames, IconTimeline,
  IconLogin, IconHome, IconLock, IconSettings, IconChip,
  IconSearch, IconMenu, IconClose
} from '@/components/ui/Icons';


export default function DesignSystemPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSwissModalOpen, setIsSwissModalOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState('newest');

  const dropdownOptions = [
    { value: 'newest', label: 'NEWEST FIRST' },
    { value: 'oldest', label: 'OLDEST FIRST' },
    { value: 'price_high', label: 'PRICE: HIGH TO LOW' },
    { value: 'price_low', label: 'PRICE: LOW TO HIGH' }
  ];

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
              <h3 className="text-xl font-pixel text-white">Legacy Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <Button>Primary</Button>
                <Button variant="secondary">Outline</Button>
                <Button variant="secondary">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>

            <div className="bg-white/5 p-8 border border-white/10 space-y-6 relative overflow-hidden">
              <h3 className="text-xl font-pixel text-white">Swiss Buttons (V2)</h3>
              <div className="flex flex-wrap gap-4">
                <SwissButton variant="primary">Primary</SwissButton>
                <SwissButton variant="secondary">Outline</SwissButton>
                <SwissButton variant="secondary">Ghost</SwissButton>
                <SwissButton variant="danger">Danger</SwissButton>
              </div>
            </div>
          </div>
        </section>

        {/* Icons */}
        <section className="space-y-8">
          <h2 className="text-3xl font-pixel text-violet-500 uppercase border-l-4 border-violet-500 pl-4">Icons</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 bg-white/5 p-8 border border-white/10">
            {[
              { icon: <IconNews className="w-8 h-8" />, label: 'News' },
              { icon: <IconDatabase className="w-8 h-8" />, label: 'Database' },
              { icon: <IconVS className="w-8 h-8" />, label: 'VS' },
              { icon: <IconGames className="w-8 h-8" />, label: 'Games' },
              { icon: <IconTimeline className="w-8 h-8" />, label: 'Timeline' },
              { icon: <IconLogin className="w-8 h-8" />, label: 'Login' },
              { icon: <IconHome className="w-8 h-8" />, label: 'Home' },
              { icon: <IconLock className="w-8 h-8" />, label: 'Lock' },
              { icon: <IconSettings className="w-8 h-8" />, label: 'Settings' },
              { icon: <IconChip className="w-8 h-8" />, label: 'Chip' },
              { icon: <IconSearch className="w-8 h-8" />, label: 'Search' },
              { icon: <IconMenu className="w-8 h-8" />, label: 'Menu' },
              { icon: <IconClose className="w-8 h-8" />, label: 'Close' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-4 border border-white/10 bg-black hover:border-white/30 transition-colors">
                <div className="text-white mb-2">{item.icon}</div>
                <span className="font-mono text-[10px] text-zinc-500 uppercase">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-8">
          <h2 className="text-3xl font-pixel text-violet-500 uppercase border-l-4 border-violet-500 pl-4">Badges & Labels</h2>
          <div className="bg-white/5 p-8 border border-white/10">
             <div className="flex flex-wrap gap-4">
                <TechBadge label="Active Default" active={true} />
                <TechBadge label="Active Cyan" active={true} color="bg-cyan-500" />
                <TechBadge label="Active Orange" active={true} color="bg-orange-500" />
                <TechBadge label="Inactive" active={false} />
             </div>
          </div>
        </section>

        {/* Data Display / Specs */}
        <section className="space-y-8">
          <h2 className="text-3xl font-pixel text-violet-500 uppercase border-l-4 border-violet-500 pl-4">Data Display (Specs)</h2>
          <div className="bg-white/5 p-8 border border-white/10 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <h3 className="font-mono text-sm text-zinc-500 mb-4 uppercase">Collapsible Spec Card</h3>
                   <SpecCard title="Hardware Architecture" collapsible={true} defaultOpen={true}>
                      <SpecField label="CPU" value="ARM Cortex-A76" />
                      <SpecField label="GPU" value="Mali-G57 MC4" />
                      <SpecField label="RAM" value="8" unit="GB LPDDR4x" highlight={true} />
                   </SpecCard>
                </div>
                <div>
                   <h3 className="font-mono text-sm text-zinc-500 mb-4 uppercase">Static Spec Card</h3>
                   <SpecCard title="Display Specs" collapsible={false}>
                      <SpecField label="Type" value="OLED" />
                      <SpecField label="Resolution" value="1920x1080" />
                      <SpecField label="Size" value="5.5" unit="inches" />
                   </SpecCard>
                </div>
             </div>
          </div>
        </section>

        {/* Modals */}
        <section className="space-y-8">
          <h2 className="text-3xl font-pixel text-violet-500 uppercase border-l-4 border-violet-500 pl-4">Modals</h2>
          <div className="bg-white/5 p-8 border border-white/10 flex gap-4">
             <Button onClick={() => setIsModalOpen(true)}>Open Legacy Modal</Button>
             <SwissButton variant="primary" onClick={() => setIsSwissModalOpen(true)}>Open Swiss Modal</SwissButton>

             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Legacy Modal Title">
                <div className="text-white space-y-4">
                   <p className="font-sans">This is the legacy modal content. It uses glowing borders and cyber aesthetics.</p>
                   <Button onClick={() => setIsModalOpen(false)}>Close Modal</Button>
                </div>
             </Modal>

             <SwissModal isOpen={isSwissModalOpen} onClose={() => setIsSwissModalOpen(false)} title="Swiss Modal Title">
                <div className="text-white p-6 space-y-4 font-mono text-sm">
                   <p>This is the Swiss modal content. It uses a flatter, rigid structure, with dark backgrounds and high contrast text.</p>
                   <div className="p-4 bg-white/5 border border-white/10">
                      Inside modal block
                   </div>
                   <SwissButton onClick={() => setIsSwissModalOpen(false)}>Acknowledge</SwissButton>
                </div>
             </SwissModal>
          </div>
        </section>

        {/* Dropdowns */}
        <section className="space-y-8">
          <h2 className="text-3xl font-pixel text-violet-500 uppercase border-l-4 border-violet-500 pl-4">Dropdowns & Inputs</h2>
          <div className="bg-white/5 p-8 border border-white/10 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                 <h3 className="font-mono text-sm text-zinc-500 mb-4 uppercase">Standard Swiss Dropdown</h3>
                 <SwissDropdown
                    value={dropdownValue}
                    onChange={setDropdownValue}
                    options={dropdownOptions}
                 />
               </div>
               <div>
                 <h3 className="font-mono text-sm text-zinc-500 mb-4 uppercase">Compact Swiss Dropdown</h3>
                 <div className="max-w-[200px]">
                   <SwissDropdown
                      value={dropdownValue}
                      onChange={setDropdownValue}
                      options={dropdownOptions}
                      compact={true}
                      labelPrefix="FILTER"
                   />
                 </div>
               </div>
             </div>
          </div>
        </section>

        {/* Loaders & Status */}
        <section className="space-y-8">
          <h2 className="text-3xl font-pixel text-violet-500 uppercase border-l-4 border-violet-500 pl-4">Loaders & Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-black border border-white/10 flex items-center justify-center p-4">
                <RetroLoader />
             </div>
             <div className="bg-black border border-white/10 p-4 space-y-8 flex flex-col justify-center">
                <div>
                   <h3 className="font-mono text-sm text-zinc-500 mb-4 uppercase ml-4 mt-4">Retro Status Bar</h3>
                   <RetroStatusBar
                      rcPath="//RC_CORE/SYS_AUDIT"
                      docId="AUDIT-992-X"
                      status="ONLINE"
                      archiveVersion="v1.0.4"
                   />
                </div>
             </div>
          </div>
        </section>

      </div>
    </div>
  );
}
