import fs from 'node:fs';
import path from 'node:path';

/**
 * Articles: buying guides, news and hands-on notes.
 *
 * Each article is one Markdown file in `content/articles/`. The file starts with a short
 * header (title, description, date...) between `---` lines, then the body in Markdown.
 * Two extra blocks are understood inside the body:
 *
 *   :::console retroid-pocket-5
 *   label: Best overall
 *   good: Big bright screen; Runs PS2 well
 *   bad: Gets warm
 *   :::
 *
 *   :::faq
 *   Q: Do these come with games?
 *   A: Most ship with an empty card.
 *   :::
 *
 * The console block pulls photo, specs, price and the buy link from the database, so a
 * guide never goes stale. The faq block renders as questions and feeds FAQPage schema.
 * See content/articles/README.md for the full writing guide.
 */

export type ArticleCategory = 'guide' | 'news' | 'hands-on' | 'site';

export const CATEGORY_LABELS: Record<ArticleCategory, string> = {
    guide: 'Buying guide',
    news: 'News',
    'hands-on': 'Hands-on',
    site: 'Site update',
};

export interface ConsoleBlock {
    type: 'console';
    slug: string;
    label?: string;
    good: string[];
    bad: string[];
}

export interface FaqItem {
    q: string;
    a: string;
}

export type ArticleBlock =
    | { type: 'markdown'; text: string }
    | ConsoleBlock
    | { type: 'faq'; items: FaqItem[] };

export interface Article {
    slug: string;
    title: string;
    /** Short title for the pixel-font page header. Falls back to `title`. A `|` splits it:
     * the part after the bar is drawn in the page colour. */
    headline: string;
    description: string;
    category: ArticleCategory;
    /** Groups guides into a series, e.g. "holiday-2026". */
    series?: string;
    date: string;
    updated?: string;
    author: string;
    /** Background colour of the card art. */
    color: string;
    /** Optional cover image URL. Without one, the first featured console's photo is used. */
    image?: string;
    /** Console slug whose photo is used on cards when there is no `image`. */
    cover?: string;
    draft: boolean;
    featured: boolean;
    blocks: ArticleBlock[];
    /** Console slugs in the order they appear. */
    consoles: string[];
    faq: FaqItem[];
    headings: { id: string; text: string }[];
    readMinutes: number;
}

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

/**
 * Drafts show on preview deployments and locally, never on the live site. That lets a
 * guide be read on its preview link before it is switched on.
 */
export const SHOW_DRAFTS = process.env.VERCEL_ENV !== 'production';

export function slugifyHeading(text: string): string {
    return text
        .toLowerCase()
        .replace(/[*_`[\]()]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

function parseHeader(raw: string): { meta: Record<string, string>; body: string } {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    if (!match) return { meta: {}, body: raw };
    const meta: Record<string, string> = {};
    for (const line of match[1].split(/\r?\n/)) {
        const m = line.match(/^([A-Za-z_]+)\s*:\s*(.*)$/);
        if (!m) continue;
        let value = m[2].trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        meta[m[1].toLowerCase()] = value;
    }
    return { meta, body: raw.slice(match[0].length) };
}

const splitList = (v?: string) =>
    (v || '')
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean);

function parseBlocks(body: string): ArticleBlock[] {
    const blocks: ArticleBlock[] = [];
    const lines = body.split(/\r?\n/);
    let buffer: string[] = [];
    const flush = () => {
        const text = buffer.join('\n').trim();
        if (text) blocks.push({ type: 'markdown', text });
        buffer = [];
    };

    for (let i = 0; i < lines.length; i++) {
        const open = lines[i].match(/^:::\s*(console|faq)\s*(\S+)?\s*$/i);
        if (!open) {
            buffer.push(lines[i]);
            continue;
        }
        flush();
        const inner: string[] = [];
        i++;
        while (i < lines.length && !/^:::\s*$/.test(lines[i])) inner.push(lines[i++]);

        if (open[1].toLowerCase() === 'console') {
            const fields: Record<string, string> = {};
            for (const l of inner) {
                const m = l.match(/^\s*([a-z]+)\s*:\s*(.*)$/i);
                if (m) fields[m[1].toLowerCase()] = m[2].trim();
            }
            if (open[2]) {
                blocks.push({
                    type: 'console',
                    slug: open[2].trim(),
                    label: fields.label || undefined,
                    good: splitList(fields.good),
                    bad: splitList(fields.bad),
                });
            }
        } else {
            const items: FaqItem[] = [];
            let current: FaqItem | null = null;
            for (const l of inner) {
                const q = l.match(/^\s*Q:\s*(.*)$/);
                const a = l.match(/^\s*A:\s*(.*)$/);
                if (q) {
                    current = { q: q[1].trim(), a: '' };
                    items.push(current);
                } else if (a && current) {
                    current.a = a[1].trim();
                } else if (current && l.trim()) {
                    current.a = `${current.a} ${l.trim()}`.trim();
                }
            }
            blocks.push({ type: 'faq', items: items.filter((it) => it.q && it.a) });
        }
    }
    flush();
    return blocks;
}

function toArticle(slug: string, raw: string): Article {
    const { meta, body } = parseHeader(raw);
    const blocks = parseBlocks(body);

    const headings: { id: string; text: string }[] = [];
    let words = 0;
    for (const b of blocks) {
        if (b.type === 'markdown') {
            words += b.text.split(/\s+/).length;
            for (const m of b.text.matchAll(/^##\s+(.+)$/gm)) {
                const text = m[1].trim();
                headings.push({ id: slugifyHeading(text), text });
            }
        } else if (b.type === 'console') {
            words += 60;
        } else {
            words += b.items.reduce((n, it) => n + it.q.split(' ').length + it.a.split(' ').length, 0);
        }
    }

    const consoles = blocks.filter((b): b is ConsoleBlock => b.type === 'console').map((b) => b.slug);
    const faq = blocks.flatMap((b) => (b.type === 'faq' ? b.items : []));
    const category = (['guide', 'news', 'hands-on', 'site'].includes(meta.category) ? meta.category : 'news') as ArticleCategory;

    return {
        slug: meta.slug || slug,
        title: meta.title || slug,
        headline: meta.headline || meta.title || slug,
        description: meta.description || '',
        category,
        series: meta.series || undefined,
        date: meta.date || '1970-01-01',
        updated: meta.updated || undefined,
        author: meta.author || 'The Retro Circuit',
        color: meta.color || '#ff7a1a',
        image: meta.image || undefined,
        cover: meta.cover || consoles[0],
        draft: meta.draft === 'true',
        featured: meta.featured === 'true',
        blocks,
        consoles,
        faq,
        headings,
        readMinutes: Math.max(1, Math.round(words / 220)),
    };
}

let cache: Article[] | null = null;

function loadAll(): Article[] {
    if (cache) return cache;
    let files: string[] = [];
    try {
        files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.md') && !f.startsWith('_') && f !== 'README.md');
    } catch {
        files = [];
    }
    cache = files
        .map((f) => toArticle(f.replace(/\.md$/, ''), fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf8')))
        .sort((a, b) => (b.updated || b.date).localeCompare(a.updated || a.date));
    return cache;
}

/** Articles that should be visible on this deployment, newest first. */
export function getArticles(): Article[] {
    return loadAll().filter((a) => SHOW_DRAFTS || !a.draft);
}

export function getArticle(slug: string): Article | undefined {
    return getArticles().find((a) => a.slug === slug);
}

export const SERIES_LABELS: Record<string, string> = {
    'holiday-2026': 'Holiday gift guides 2026',
};
