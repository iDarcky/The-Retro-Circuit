import { type FC } from 'react';

/* Affiliate disclosure, next to the link it is disclosing.
 *
 * The footer carries one, but the Associates Operating Agreement wants the statement
 * near the links themselves, and a reader who never scrolls to the footer has not been
 * told. BuySection used to carry this on the console page; that section is gone, so the
 * disclosure moved here rather than disappearing with it.
 *
 * The Amazon sentence is quoted exactly, because Amazon specifies the wording. The
 * second clause covers the other retailers, which Amazon's sentence does not.
 */

const AffiliateDisclosure: FC<{ className?: string; compact?: boolean }> = ({ className = '', compact = false }) => (
    <p className={`font-mono text-[9.5px] leading-relaxed text-gray-600 ${className}`}>
        As an Amazon Associate I earn from qualifying purchases.
        {!compact && (
            <>
                {' '}Some other retailer links may also earn a commission. It never affects
                what we list, how devices rank, or the specs on this page.
            </>
        )}
    </p>
);

export default AffiliateDisclosure;
