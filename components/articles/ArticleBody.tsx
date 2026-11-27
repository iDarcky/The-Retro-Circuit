import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import type { Article } from '../../lib/articles';
import { slugifyHeading } from '../../lib/articles';
import type { ConsoleDetails } from '../../lib/types';
import ConsolePick from './ConsolePick';

const textOf = (children: any): string =>
    Array.isArray(children) ? children.map(textOf).join('') : typeof children === 'string' ? children : children?.props ? textOf(children.props.children) : '';

const md: Components = {
    h2: ({ children }) => (
        <h2 id={slugifyHeading(textOf(children))} className="font-sans font-bold text-[26px] leading-tight text-white mt-12 mb-4 scroll-mt-24">
            {children}
        </h2>
    ),
    h3: ({ children }) => <h3 className="font-sans font-semibold text-xl text-white mt-8 mb-3">{children}</h3>,
    p: ({ children }) => <p className="text-[17px] leading-[1.7] text-gray-300 mb-5">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-6 mb-5 text-[17px] text-gray-300 space-y-1.5">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-5 text-[17px] text-gray-300 space-y-1.5">{children}</ol>,
    strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
    blockquote: ({ children }) => <blockquote className="border-l-2 border-[#ff7a1a] pl-4 my-6 text-gray-300">{children}</blockquote>,
    a: ({ href = '', children }) =>
        href.startsWith('/') ? (
            <Link href={href} className="text-[#ff7a1a] underline underline-offset-4 decoration-[#ff7a1a]/40 hover:decoration-[#ff7a1a]">
                {children}
            </Link>
        ) : (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#ff7a1a] underline underline-offset-4 decoration-[#ff7a1a]/40 hover:decoration-[#ff7a1a]">
                {children}
            </a>
        ),
    table: ({ children }) => (
        <div className="overflow-x-auto border border-white/10 my-6">
            <table className="w-full border-collapse text-[15px]">{children}</table>
        </div>
    ),
    th: ({ children }) => <th className="text-left font-mono text-xs font-medium text-gray-500 px-3.5 py-3 border-b border-white/10">{children}</th>,
    td: ({ children }) => <td className="px-3.5 py-3 border-b border-white/10 text-gray-300">{children}</td>,
    img: ({ src, alt }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={typeof src === 'string' ? src : ''} alt={alt || ''} className="w-full border border-white/10 my-6" loading="lazy" />
    ),
    hr: () => <hr className="border-0 border-t border-white/10 my-10" />,
};

/** The quick-picks table, built from the labelled console boxes in the article. */
export function QuickPicks({ article, consoles }: { article: Article; consoles: Map<string, ConsoleDetails> }) {
    const rows = article.blocks.flatMap((b) => (b.type === 'console' && b.label && consoles.get(b.slug) ? [{ b, c: consoles.get(b.slug)! }] : []));
    if (rows.length < 2) return null;
    return (
        <div className="border border-white/10 my-6">
            <table className="w-full border-collapse text-[15px]">
                <thead>
                    <tr>
                        <th className="text-left font-mono text-xs font-medium text-gray-500 px-3.5 py-3 border-b border-white/10">Pick</th>
                        <th className="text-left font-mono text-xs font-medium text-gray-500 px-3.5 py-3 border-b border-white/10">Console</th>
                        <th className="text-right font-mono text-xs font-medium text-gray-500 px-3.5 py-3 border-b border-white/10">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(({ b, c }) => {
                        const price = Number((c.specs as any)?.price_launch_usd);
                        return (
                            <tr key={b.slug} className="border-b border-white/10 last:border-0">
                                <td className="px-3.5 py-3 text-gray-300">{b.label}</td>
                                <td className="px-3.5 py-3">
                                    <a href={`#pick-${b.slug}`} className="text-[#ff7a1a] underline underline-offset-4 decoration-[#ff7a1a]/40">
                                        {c.name}
                                    </a>
                                </td>
                                <td className="px-3.5 py-3 text-right whitespace-nowrap font-mono text-gray-300">{price > 0 ? `$${Math.round(price)}` : '—'}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export function hasQuickPicks(article: Article, consoles: Map<string, ConsoleDetails>): boolean {
    return article.blocks.filter((b) => b.type === 'console' && b.label && consoles.has(b.slug)).length >= 2;
}

/**
 * Split the blocks so the quick-picks table lands after the intro: before the first
 * `##` heading, or before the first console box if the intro runs straight into one.
 */
function withQuickPicksSlot(blocks: Article['blocks']): (Article['blocks'][number] | { type: 'quickpicks' })[] {
    const out: (Article['blocks'][number] | { type: 'quickpicks' })[] = [];
    let placed = false;
    for (const b of blocks) {
        if (!placed && b.type === 'markdown') {
            const m = b.text.match(/^##\s/m);
            if (m && m.index !== undefined) {
                const before = b.text.slice(0, m.index).trim();
                if (before) out.push({ type: 'markdown', text: before });
                out.push({ type: 'quickpicks' });
                out.push({ type: 'markdown', text: b.text.slice(m.index) });
                placed = true;
                continue;
            }
        }
        if (!placed && b.type === 'console') {
            out.push({ type: 'quickpicks' });
            placed = true;
        }
        out.push(b);
    }
    return out;
}

export default function ArticleBody({ article, consoles }: { article: Article; consoles: Map<string, ConsoleDetails> }) {
    const picks = article.blocks.flatMap((b) => (b.type === 'console' && consoles.get(b.slug) ? [consoles.get(b.slug)!] : []));
    const showQuick = hasQuickPicks(article, consoles);
    return (
        <>
            {withQuickPicksSlot(article.blocks).map((block, i) => {
                if (block.type === 'quickpicks') {
                    if (!showQuick) return null;
                    return (
                        <div key={i}>
                            <h2 id="quick-picks" className="font-sans font-bold text-[26px] leading-tight text-white mt-12 mb-4 scroll-mt-24">
                                Quick picks
                            </h2>
                            <QuickPicks article={article} consoles={consoles} />
                        </div>
                    );
                }
                if (block.type === 'markdown') {
                    return (
                        <ReactMarkdown key={i} remarkPlugins={[remarkGfm]} components={md}>
                            {block.text}
                        </ReactMarkdown>
                    );
                }
                if (block.type === 'console') {
                    const c = consoles.get(block.slug);
                    if (!c) return null;
                    const idx = picks.indexOf(c);
                    const rival = picks[idx + 1] ?? (idx > 0 ? picks[idx - 1] : undefined);
                    return (
                        <div key={i} id={`pick-${block.slug}`} className="scroll-mt-24">
                            <ConsolePick block={block} console={c} rival={rival} />
                        </div>
                    );
                }
                return (
                    <div key={i} className="my-6">
                        {block.items.map((it) => (
                            <details key={it.q} className="border-t border-white/10 last:border-b py-3.5 group">
                                <summary className="cursor-pointer font-semibold text-[17px] text-white min-h-[28px] marker:text-[#ff7a1a]">{it.q}</summary>
                                <p className="mt-2.5 mb-0 text-gray-400">{it.a}</p>
                            </details>
                        ))}
                    </div>
                );
            })}
        </>
    );
}
