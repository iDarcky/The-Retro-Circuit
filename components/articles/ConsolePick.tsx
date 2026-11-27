import Link from 'next/link';
import Image from 'next/image';
import type { ConsoleDetails } from '../../lib/types';
import type { ConsoleBlock } from '../../lib/articles';
import { pickBuyTarget } from '../../lib/affiliate';
import AffiliateLink from '../console/AffiliateLink';
import { NEWS_COLOR } from './theme';

/**
 * A console box inside an article. Everything except the label and the good/bad lines
 * comes from the database, so price, specs and the buy link stay current after the
 * article is written.
 */
export default function ConsolePick({ block, console: c, rival }: { block: ConsoleBlock; console: ConsoleDetails; rival?: ConsoleDetails }) {
    const spec: any = c.specs || {};
    const brand = c.manufacturer?.name;
    const discontinued = (c as any).release_status === 'discontinued';
    const buy = discontinued
        ? null
        : pickBuyTarget({ asin: spec.amazon_asin, name: c.name, manufacturer: brand, links: (c as any).links });
    const price = Number(spec.price_launch_usd) > 0 ? Math.round(Number(spec.price_launch_usd)) : null;

    const facts: [string, string | null][] = [
        ['Screen', spec.screen_size_inch ? `${Number(spec.screen_size_inch)}"${spec.display_type ? ` ${spec.display_type}` : ''}` : null],
        ['Chip', spec.soc_name || spec.soc || spec.cpu_model || null],
        ['Battery', spec.battery_capacity_mah ? `${spec.battery_capacity_mah} mAh` : null],
        ['Price', price ? `$${price}` : null],
    ];
    const shown = facts.filter(([, v]) => v);

    return (
        <div className="my-6 grid grid-cols-1 sm:grid-cols-[200px_minmax(0,1fr)] border border-white/10 bg-[#111114] not-prose">
            <Link
                href={`/consoles/${c.slug}`}
                className="relative block min-h-[200px] bg-[#17171b]"
                aria-label={`${brand ?? ''} ${c.name} specs`.trim()}
            >
                {c.image_url ? (
                    <Image
                        src={c.image_url}
                        alt={`${brand ?? ''} ${c.name}`.trim()}
                        fill
                        sizes="200px"
                        className="object-contain p-4"
                    />
                ) : (
                    <span className="absolute inset-0 flex items-center justify-center font-pixel text-gray-700">?</span>
                )}
            </Link>

            <div className="p-5 flex flex-col gap-3">
                {block.label && (
                    <span className="font-mono text-xs text-black px-2 py-1 w-fit" style={{ background: NEWS_COLOR }}>
                        {block.label}
                    </span>
                )}
                <div>
                    {brand && <div className="font-mono text-xs text-gray-500">{brand}</div>}
                    <h3 className="m-0 font-sans font-bold text-2xl leading-tight text-white">
                        <Link href={`/consoles/${c.slug}`} className="hover:underline underline-offset-4">
                            {c.name}
                        </Link>
                    </h3>
                </div>

                {shown.length > 0 && (
                    <dl className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 m-0">
                        {shown.map(([k, v]) => (
                            <div key={k} className="bg-[#17171b] px-3 py-2">
                                <dt className="font-mono text-xs text-gray-500">{k}</dt>
                                <dd className="m-0 font-mono text-sm font-semibold text-cyan-400">{v}</dd>
                            </div>
                        ))}
                    </dl>
                )}

                {(block.good.length > 0 || block.bad.length > 0) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[15px] text-gray-400">
                        {block.good.length > 0 && (
                            <div>
                                <b className="text-white font-semibold">Good</b>
                                <ul className="mt-1 pl-5 list-disc">
                                    {block.good.map((g) => <li key={g}>{g}</li>)}
                                </ul>
                            </div>
                        )}
                        {block.bad.length > 0 && (
                            <div>
                                <b className="text-white font-semibold">Not so good</b>
                                <ul className="mt-1 pl-5 list-disc">
                                    {block.bad.map((g) => <li key={g}>{g}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex flex-wrap gap-2.5 mt-1">
                    {buy && (
                        <AffiliateLink
                            href={buy.url}
                            productName={c.name}
                            linkType={buy.confidence === 'direct' ? 'product' : 'search'}
                            placement="article"
                            className="inline-flex items-center min-h-[44px] px-4 font-mono text-sm font-semibold text-black bg-[#ff7a1a] hover:bg-white transition-colors"
                        >
                            <span>
                                {buy.confidence === 'direct' ? `Buy on ${buy.vendor}` : `Search ${buy.vendor}`}
                                {price ? ` · from $${price}` : ''}
                            </span>
                        </AffiliateLink>
                    )}
                    {discontinued && (
                        <span className="inline-flex items-center min-h-[44px] px-4 border border-white/10 font-mono text-sm text-gray-500">
                            No longer sold new
                        </span>
                    )}
                    <Link
                        href={`/consoles/${c.slug}`}
                        className="inline-flex items-center min-h-[44px] px-4 border border-white/15 font-mono text-sm text-white hover:bg-white hover:text-black transition-colors"
                    >
                        Full specs
                    </Link>
                    {rival && (
                        <Link
                            href={`/arena/${c.slug}-vs-${rival.slug}`}
                            className="inline-flex items-center min-h-[44px] px-4 border border-white/15 font-mono text-sm text-white hover:bg-white hover:text-black transition-colors"
                        >
                            Compare with {rival.name}
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
