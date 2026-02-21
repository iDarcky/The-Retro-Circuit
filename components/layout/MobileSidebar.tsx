'use client';

import { type FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconSearch, IconClose } from '../ui/Icons';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  openSearch: () => void;
}

interface SidebarItemProps {
  to: string;
  label: string;
  exact?: boolean;
  index: number;
}

// --- HELPER COMPONENT ---
const SidebarItem = ({ to, label, exact = false, index }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === to : pathname.startsWith(to);

  return (
    <Link
      href={to}
      className={`group flex items-center px-6 py-6 border-b border-white/10 transition-all duration-300 ${
        isActive
          ? 'bg-violet-600 text-white'
          : 'bg-transparent text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      <span className="font-sans font-black text-3xl tracking-tighter uppercase w-full">
        <span className="text-xs font-mono tracking-widest opacity-50 block mb-1">0{index} //</span>
        {label}
      </span>
    </Link>
  );
};

// --- MAIN COMPONENT ---
export const MobileSidebar: FC<MobileSidebarProps> = ({ isOpen, onClose, openSearch }) => {
  return (
    <>
      {/* MOBILE DRAWER BACKDROP (z-50) */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-[50] bg-black/90 backdrop-blur-sm animate-fadeIn"
          onClick={onClose}
        />
      )}

      {/* MOBILE SIDEBAR (Drawer: Right on Mobile, Full Height) */}
      <aside className={`
          flex flex-col h-screen transition-transform duration-300 ease-out

          /* Mobile: Fixed Right, Slide from Right, Signal Left Border, High Z-Index */
          fixed top-0 right-0 w-full sm:w-96 bg-bg-primary border-l-2 border-violet-500 z-[60]

          /* Desktop: Hidden */
          md:hidden

          /* Animation State Logic */
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* HEADER: Strict Grid, High Contrast */}
        <div className="p-6 border-b-2 border-white flex items-center justify-between bg-white text-black min-h-[80px]">
             <span className="font-sans font-black text-4xl tracking-tighter uppercase">MENU</span>
             <button
                onClick={onClose}
                className="text-black hover:opacity-70 transition-opacity"
                aria-label="Close Menu"
             >
                <IconClose className="w-8 h-8" />
             </button>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
           {/* SEARCH TRIGGER: Brutalist Block */}
           <div className="border-b border-white/10">
                <button
                    onClick={openSearch}
                    className="w-full bg-white/5 hover:bg-white/10 transition-colors text-white/60 font-sans font-bold text-lg px-6 py-6 flex justify-between items-center group uppercase tracking-widest"
                >
                    <span>SEARCH</span>
                    <IconSearch className="w-6 h-6 text-white/40 group-hover:text-violet-500 transition-colors" />
                </button>
           </div>

           {/* NAVIGATION ITEMS: Huge Typography Grid */}
           <SidebarItem to="/" label="CONTROL ROOM" exact index={1} />
           <SidebarItem to="/consoles" label="CONSOLES" index={2} />
           <SidebarItem to="/fabricators" label="FABRICATORS" index={3} />
           <SidebarItem to="/finder" label="FINDER" index={4} />
           <SidebarItem to="/arena" label="VS MODE" index={5} />
           <SidebarItem to="/news" label="NEWS" index={6} />
        </nav>
      </aside>
    </>
  );
};
