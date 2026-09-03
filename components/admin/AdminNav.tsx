'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ADMIN_NAV } from '../../lib/config/admin-nav';

/**
 * The persistent admin bar.
 *
 * Until this existed, `app/admin/layout.tsx` was a passthrough and every admin screen
 * was an island: ten of the thirteen pages had no link out at all, so moving between
 * two of them meant the browser back button or retyping a URL. That is what made the
 * admin feel like a maze — not the number of screens, but that none of them said where
 * you were or what else there was.
 *
 * Grouped by the job rather than by the table it writes to, because that is how the
 * work actually arrives: "this console needs a buy path", not "I need the console_links
 * table".
 */


export default function AdminNav() {
    const pathname = usePathname() ?? '';

    /* `/admin/consoles/anbernic-rg-28xx` should light up Consoles, so a section matches
     * on its prefix — but `/admin` itself is a prefix of everything, so it is exact. */
    const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

    return (
        <header className="sticky top-0 z-50 bg-bg-primary border-b border-white/10">
            <div className="max-w-[1600px] mx-auto flex items-stretch gap-0 overflow-x-auto">
                <Link
                    href="/admin"
                    className={`shrink-0 flex items-center px-4 md:px-6 border-r border-white/10 font-pixel text-[9px] uppercase tracking-widest transition-colors ${
                        pathname === '/admin' ? 'text-violet-500' : 'text-gray-500 hover:text-white'
                    }`}
                >
                    Admin
                </Link>

                {ADMIN_NAV.map(({ group, items }) => (
                    <div key={group} className="shrink-0 flex items-stretch border-r border-white/10">
                        <span className="flex items-center pl-4 pr-3 font-mono text-[9px] uppercase tracking-[0.2em] text-gray-700 select-none">
                            {group}
                        </span>
                        {items.map(item => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={active ? 'page' : undefined}
                                    className={`flex items-center px-3 py-3 font-mono text-[10px] uppercase tracking-widest whitespace-nowrap border-t-2 transition-colors ${
                                        active
                                            ? 'border-t-violet-500 text-white'
                                            : 'border-t-transparent text-gray-500 hover:text-white hover:bg-white/[0.04]'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                ))}

                <Link
                    href="/"
                    className="shrink-0 ml-auto flex items-center px-4 md:px-6 border-l border-white/10 font-mono text-[10px] uppercase tracking-widest text-gray-600 hover:text-white transition-colors"
                >
                    View site →
                </Link>
            </div>
        </header>
    );
}
