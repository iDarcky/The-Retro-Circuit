/**
 * Every screen the admin can reach, grouped by the job it serves rather than by the
 * table it writes to — that is how the work arrives ("this console needs a buy path",
 * not "I need the console_links table").
 *
 * One definition, two consumers: the persistent bar in `AdminNav` and the directory at
 * the bottom of the hub. They were separate copies for about ten minutes, which is
 * exactly long enough for a new screen to be added to one and not the other.
 */
export type AdminNavItem = { href: string; label: string; hint: string };
export type AdminNavGroup = { group: string; items: AdminNavItem[] };

export const ADMIN_NAV: AdminNavGroup[] = [
    {
        group: 'Catalogue',
        items: [
            { href: '/admin/consoles', label: 'Consoles', hint: 'Index & editor' },
            { href: '/admin/fabricators', label: 'Brands', hint: 'Brands & profiles' },
        ],
    },
    {
        group: 'Revenue',
        items: [
            { href: '/admin/asins', label: 'ASINs', hint: 'Catalogue-wide sweep' },
            { href: '/admin/buy-links', label: 'Buy links', hint: 'Published, no path' },
            { href: '/admin/links', label: 'Link review', hint: 'Imported, ungreenlit' },
        ],
    },
    {
        group: 'Editorial',
        items: [
            { href: '/admin/reviews', label: 'Reviews', hint: 'Written verdicts' },
            { href: '/admin/news', label: 'News', hint: 'Posts' },
            { href: '/admin/signals', label: 'Signals', hint: 'Short updates' },
        ],
    },
    {
        group: 'Product',
        items: [
            { href: '/admin/roadmap', label: 'Roadmap', hint: 'Features & releases' },
            { href: '/admin/broadcast', label: 'Broadcast', hint: 'Subscriber email' },
            { href: '/design', label: 'Design', hint: 'Tokens & components' },
        ],
    },
];
