'use client';

import { useState, useTransition } from 'react';
import { ConsoleDetails, ConsoleVariant } from '../../lib/types';
import { setVariantAsin, addConsoleVendorLink, setLinkApproval, type LinkReviewRow } from '../../app/actions/commerce';
import { getAmazonSearchUrl } from '../../lib/affiliate';
import SwissButton from '../console/swiss/SwissButton';

/**
 * The buy path for one console, inside that console's editor.
 *
 * ASINs and vendor links were always attached to consoles in the database —
 * `console_variants.amazon_asin` and `console_links.console_id`. What was missing was
 * anywhere to see or set them while editing a console: the three commerce screens are
 * catalogue-wide queues built to sweep a 1,333-row import, so the only route to a buy
 * path was to leave the editor, pick a different screen, and find the console again in
 * a list of 462.
 *
 * The two live at different levels on purpose, and the layout says so: an Amazon listing
 * is per storage configuration, so the ASIN sits on the variant; a vendor product page
 * is usually one per device, so links sit on the console.
 */

type Props = {
    console: ConsoleDetails;
    initialLinks: LinkReviewRow[];
};

const KIND_TONE: Record<string, string> = {
    vendor: 'text-orange-500 border-orange-500/40',
    review: 'text-cyan-500 border-cyan-500/40',
    video: 'text-violet-500 border-violet-500/40',
};

export default function ConsoleCommerceSection({ console: consoleData, initialLinks }: Props) {
    const variants = (consoleData.variants ?? []) as ConsoleVariant[];
    const [links, setLinks] = useState<LinkReviewRow[]>(initialLinks);
    const [pending, startTransition] = useTransition();
    const [note, setNote] = useState<{ tone: 'ok' | 'bad'; text: string } | null>(null);

    const approvedVendor = links.some(l => l.approved && l.kind === 'vendor');
    const anyAsin = variants.some(v => Boolean((v as any).amazon_asin));
    const hasBuyPath = approvedVendor || anyAsin;
    /* A discontinued device has nothing to sell. Missing a buy path is the correct state
     * for it, not an outstanding task, so it is not flagged as one here or counted as one
     * in the catalogue-wide queues. */
    const discontinued = (consoleData as any).release_status === 'discontinued';

    return (
        <section className="mt-8">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-2">
                <h3 className="font-pixel text-lg text-white">BUY PATH</h3>
                <span
                    className={`font-mono text-[9px] uppercase tracking-widest border px-2 py-1 ${
                        hasBuyPath
                            ? 'text-emerald-500 border-emerald-500/40'
                            : discontinued
                              ? 'text-gray-500 border-gray-700'
                              : 'text-orange-500 border-orange-500/40'
                    }`}
                >
                    {hasBuyPath ? 'Has a buy path' : discontinued ? 'Discontinued — none needed' : 'No buy path'}
                </span>
            </div>
            <p className="font-mono text-[10px] text-gray-500 mb-6 max-w-[70ch] leading-relaxed">
                {'//'} {discontinued
                    ? 'This device is discontinued, so it needs no buy path — the page shows the successor instead. Anything set here still renders.'
                    : 'With neither an ASIN nor an approved vendor link, the buy button falls back to an Amazon search for a device Amazon often does not stock.'}
                {' '}Paste plain product URLs — the site applies its own affiliate tag, and a pasted one
                would pay whoever owns it.
            </p>

            {note && (
                <div
                    className={`mb-4 px-3 py-2 font-mono text-[10px] uppercase tracking-widest border ${
                        note.tone === 'ok'
                            ? 'text-emerald-500 border-emerald-500/40'
                            : 'text-rose-500 border-rose-500/40'
                    }`}
                >
                    {note.text}
                </div>
            )}

            {/* ── ASIN, per variant ─────────────────────────────────────── */}
            <div className="mb-8">
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-3">
                    Amazon ASIN — one per configuration
                </h4>
                {variants.length === 0 ? (
                    <div className="p-6 border border-dashed border-gray-800 text-gray-600 font-mono text-xs">
                        NO VARIANTS YET. ADD ONE IN THE VARIANTS TAB FIRST — AN ASIN BELONGS TO A CONFIGURATION.
                    </div>
                ) : (
                    <div className="border border-border-normal divide-y divide-border-normal">
                        {variants.map(v => (
                            <AsinRowEditor
                                key={v.id}
                                variant={v}
                                consoleName={consoleData.name}
                                brand={(consoleData.manufacturer as any)?.name}
                                disabled={pending}
                                onSaved={(msg, ok) => setNote({ tone: ok ? 'ok' : 'bad', text: msg })}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Vendor links, per console ──────────────────────────────── */}
            <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-3">
                    Links — only approved ones render on the public page
                </h4>

                <AddVendorLink
                    consoleId={consoleData.id}
                    disabled={pending}
                    onAdded={(msg, ok) => setNote({ tone: ok ? 'ok' : 'bad', text: msg })}
                />

                {links.length === 0 ? (
                    <div className="mt-4 p-6 border border-dashed border-gray-800 text-gray-600 font-mono text-xs">
                        NO LINKS ON THIS CONSOLE.
                    </div>
                ) : (
                    <div className="mt-4 border border-border-normal divide-y divide-border-normal">
                        {links.map(l => (
                            <div
                                key={l.id}
                                className="flex flex-wrap items-center gap-3 p-3 hover:bg-white/[0.03] transition-colors"
                            >
                                <span
                                    className={`font-mono text-[9px] uppercase tracking-widest border px-1.5 py-0.5 shrink-0 ${
                                        KIND_TONE[l.kind] ?? 'text-gray-500 border-gray-700'
                                    }`}
                                >
                                    {l.kind}
                                </span>
                                <a
                                    href={l.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-xs text-gray-300 hover:text-white hover:underline truncate flex-1 min-w-[12rem]"
                                    title={l.url}
                                >
                                    {l.label || l.domain}
                                </a>
                                <span className="font-mono text-[9px] uppercase tracking-widest text-gray-600 shrink-0">
                                    {l.domain}
                                </span>
                                <button
                                    type="button"
                                    disabled={pending}
                                    onClick={() =>
                                        startTransition(async () => {
                                            const next = !l.approved;
                                            const res = await setLinkApproval(l.id, next);
                                            if (res.success) {
                                                setLinks(prev =>
                                                    prev.map(x => (x.id === l.id ? { ...x, approved: next } : x)),
                                                );
                                                setNote({
                                                    tone: 'ok',
                                                    text: next ? 'Link approved — it renders now' : 'Link hidden',
                                                });
                                            } else {
                                                setNote({ tone: 'bad', text: res.message ?? 'Could not change approval' });
                                            }
                                        })
                                    }
                                    className={`shrink-0 font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border transition-colors disabled:opacity-40 ${
                                        l.approved
                                            ? 'text-emerald-500 border-emerald-500/40 hover:bg-emerald-500 hover:text-black hover:border-emerald-500'
                                            : 'text-gray-500 border-gray-700 hover:border-white hover:text-white'
                                    }`}
                                >
                                    {l.approved ? 'Approved' : 'Hidden'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

/** One variant's ASIN, saved on its own so a slip on one row cannot lose the others. */
function AsinRowEditor({
    variant,
    consoleName,
    brand,
    disabled,
    onSaved,
}: {
    variant: ConsoleVariant;
    consoleName: string;
    brand?: string;
    disabled: boolean;
    onSaved: (message: string, ok: boolean) => void;
}) {
    const [value, setValue] = useState(((variant as any).amazon_asin as string) ?? '');
    const [saved, setSaved] = useState(((variant as any).amazon_asin as string) ?? '');
    const [pending, startTransition] = useTransition();

    const dirty = value.trim() !== (saved ?? '');
    const searchUrl = getAmazonSearchUrl([brand, consoleName, variant.variant_name].filter(Boolean).join(' '));

    return (
        <div className="flex flex-wrap items-center gap-3 p-3">
            <div className="min-w-[10rem] flex-1">
                <div className="font-mono text-xs text-white">
                    {variant.variant_name}
                    {variant.is_default && (
                        <span className="ml-2 text-[9px] bg-secondary text-black px-1.5 py-0.5 font-mono">DEFAULT</span>
                    )}
                </div>
                <a
                    href={searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[9px] uppercase tracking-widest text-gray-600 hover:text-white hover:underline"
                >
                    Find on Amazon →
                </a>
            </div>

            <input
                value={value}
                onChange={e => setValue(e.target.value.toUpperCase())}
                placeholder="B0XXXXXXXX"
                spellCheck={false}
                maxLength={10}
                className="w-[11rem] bg-black border border-white/20 px-3 py-2 font-mono text-xs text-white placeholder:text-gray-700 focus:border-orange-500 focus:outline-none"
            />

            <SwissButton
                variant="secondary"
                className="text-xs shrink-0"
                disabled={disabled || pending || !dirty}
                isLoading={pending}
                onClick={() =>
                    startTransition(async () => {
                        const next = value.trim() || null;
                        const res = await setVariantAsin(variant.id, next);
                        if (res.success) {
                            setSaved(next ?? '');
                            onSaved(`ASIN saved for ${variant.variant_name}`, true);
                        } else {
                            onSaved(res.message ?? 'Could not save the ASIN', false);
                        }
                    })
                }
            >
                {dirty ? 'Save' : 'Saved'}
            </SwissButton>
        </div>
    );
}

/** Add a vendor link. Typed in by hand, so the action approves it on the way in. */
function AddVendorLink({
    consoleId,
    disabled,
    onAdded,
}: {
    consoleId: string;
    disabled: boolean;
    onAdded: (message: string, ok: boolean) => void;
}) {
    const [url, setUrl] = useState('');
    const [label, setLabel] = useState('');
    const [pending, startTransition] = useTransition();

    return (
        <div className="flex flex-wrap gap-3">
            <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://vendor.example/product/…"
                spellCheck={false}
                className="flex-1 min-w-[16rem] bg-black border border-white/20 px-3 py-2 font-mono text-xs text-white placeholder:text-gray-700 focus:border-orange-500 focus:outline-none"
            />
            <input
                value={label}
                onChange={e => setLabel(e.target.value)}
                placeholder="Label (optional)"
                className="w-[12rem] bg-black border border-white/20 px-3 py-2 font-mono text-xs text-white placeholder:text-gray-700 focus:border-orange-500 focus:outline-none"
            />
            <SwissButton
                variant="orange"
                className="text-xs shrink-0"
                disabled={disabled || pending || !url.trim()}
                isLoading={pending}
                onClick={() =>
                    startTransition(async () => {
                        const res = await addConsoleVendorLink(consoleId, url.trim(), label.trim());
                        if (res.success) {
                            setUrl('');
                            setLabel('');
                            onAdded('Vendor link added and approved — reload to see it listed', true);
                        } else {
                            onAdded(res.message ?? 'Could not add the link', false);
                        }
                    })
                }
            >
                Add link
            </SwissButton>
        </div>
    );
}
