import { type FC, type ReactNode } from 'react';

/* One section shell for the whole console page.
 *
 * The page had two header treatments at once: three sections used
 * `font-pixel text-sm text-orange-500`, while Playability and Compare carried their own
 * inline mono labels. Together with a violet fold that made the page read as unfinished,
 * which is the honest reason it did not look like the mockup.
 *
 * Violet, not orange, because the site already decided: DesktopHeader is
 * `border-b-2 border-violet-500` with violet nav underlines, and DESIGN.md reserves
 * orange for warnings, attention and beta, which is the PRE-ALPHA badge and nothing else
 * on this page. The three orange headers were the legacy, not the direction.
 *
 * Spacing, rule weight and scroll offset live here too, so sections cannot drift apart
 * again by being styled one at a time.
 */

interface SectionProps {
    id: string;
    title: string;
    /** Small mono line above the title. Use it to say what the section measures. */
    eyebrow?: string;
    /** Controls that belong to this section, right-aligned on the title row. */
    actions?: ReactNode;
    /** First section on the page skips the top rule. */
    first?: boolean;
    children: ReactNode;
}

const Section: FC<SectionProps> = ({ id, title, eyebrow, actions, first = false, children }) => (
    <section
        id={id}
        className={`scroll-mt-32 ${first ? '' : 'border-t border-white/10 pt-10 mt-10'}`}
    >
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 mb-6">
            <div>
                {eyebrow && (
                    <div className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-gray-500 mb-2">
                        {eyebrow}
                    </div>
                )}
                <h2 className="font-pixel text-[13px] md:text-sm text-violet-400 uppercase tracking-widest">
                    {title}
                </h2>
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
        {children}
    </section>
);

export default Section;
