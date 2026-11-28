import Link from 'next/link';
import type { Article } from '../../lib/articles';
import { CATEGORY_LABELS } from '../../lib/articles';
import ArticleArt from './ArticleArt';
import { formatArticleDate } from './date';

const tagClass = 'font-mono text-xs border px-2 py-0.5 w-fit text-[#ff7a1a] border-[#ff7a1a]';

export function ArticleCard({ article, image }: { article: Article; image?: string | null }) {
    return (
        <Link
            href={`/news/${article.slug}`}
            className="group flex flex-col border border-white/10 bg-[#111114] hover:border-[#ff7a1a] hover:-translate-y-0.5 transition"
        >
            <ArticleArt color={article.color} image={article.image || image} alt="" className="h-[160px]" />
            <div className="p-5 flex flex-col gap-2 flex-1">
                <span className={tagClass}>{article.draft ? 'Draft' : CATEGORY_LABELS[article.category]}</span>
                <h3 className="m-0 font-sans font-semibold text-[19px] leading-snug text-white text-balance">{article.title}</h3>
                <p className="m-0 text-gray-400 text-[15px] leading-relaxed">{article.description}</p>
                <span className="mt-auto pt-2 font-mono text-xs text-gray-500">{article.readMinutes} min read</span>
            </div>
        </Link>
    );
}

export function FeaturedArticle({ article, image }: { article: Article; image?: string | null }) {
    return (
        <Link
            href={`/news/${article.slug}`}
            className="group grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] border border-white/10 bg-[#111114] hover:border-[#ff7a1a] hover:-translate-y-0.5 transition"
        >
            <ArticleArt color={article.color} image={article.image || image} alt="" className="min-h-[240px] md:min-h-[320px]" sizes="700px" priority />
            <div className="p-6 md:p-9 flex flex-col justify-center gap-3">
                <span className={tagClass}>{article.draft ? 'Draft' : CATEGORY_LABELS[article.category]}</span>
                <h3 className="m-0 font-sans font-bold text-[26px] md:text-[32px] leading-tight text-white text-balance">{article.title}</h3>
                <p className="m-0 text-gray-400">{article.description}</p>
                <span className="font-mono text-xs text-gray-500">
                    {article.readMinutes} min read · {article.updated ? 'Last edited' : 'Published'} {formatArticleDate(article.updated || article.date)}
                </span>
            </div>
        </Link>
    );
}

export function ArticleRow({ article }: { article: Article }) {
    return (
        <Link
            href={`/news/${article.slug}`}
            className="group grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)_auto] gap-2 sm:gap-4 py-4 border-b border-white/10 items-baseline"
        >
            <span className="font-mono text-xs text-gray-500">{formatArticleDate(article.date)}</span>
            <span className="font-sans font-semibold text-[17px] text-white group-hover:text-[#ff7a1a] transition-colors">{article.title}</span>
            <span className={tagClass}>{article.draft ? 'Draft' : CATEGORY_LABELS[article.category]}</span>
        </Link>
    );
}

/** Blog-style row: picture on the left, text on the right. Stacks on a phone. */
export function ArticleListItem({ article, image }: { article: Article; image?: string | null }) {
    return (
        <Link
            href={`/news/${article.slug}`}
            className="group grid grid-cols-1 sm:grid-cols-[200px_minmax(0,1fr)] border border-white/10 bg-[#111114] hover:border-[#ff7a1a] hover:-translate-y-0.5 transition"
        >
            <ArticleArt color={article.color} image={article.image || image} alt="" className="min-h-[150px] sm:min-h-[140px]" sizes="200px" />
            <div className="px-5 py-4 flex flex-col gap-1.5">
                <span className={tagClass}>{article.draft ? 'Draft' : CATEGORY_LABELS[article.category]}</span>
                <h3 className="m-0 font-sans font-semibold text-[19px] leading-snug text-white text-balance">{article.title}</h3>
                <p className="m-0 text-gray-400 text-[15px] leading-relaxed">{article.description}</p>
                <span className="font-mono text-xs text-gray-500">
                    {article.readMinutes} min read · {formatArticleDate(article.updated || article.date)}
                </span>
            </div>
        </Link>
    );
}
