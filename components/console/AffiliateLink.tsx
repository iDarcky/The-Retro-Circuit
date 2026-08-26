'use client';

import { track } from '@vercel/analytics';
import type { ReactNode } from 'react';

interface AffiliateLinkProps {
    href: string;
    productName: string;
    /** 'product' = direct ASIN link, 'search' = Amazon search fallback. */
    linkType: 'product' | 'search';
    /** Where the click happened, so we can compare converting surfaces. */
    placement: 'console_detail' | 'finder_winner' | 'finder_alternative' | 'best_of';
    className?: string;
    children: ReactNode;
}

/**
 * Affiliate outbound link with click tracking.
 *
 * Without this we have no idea which surfaces actually convert — previously there
 * were zero custom analytics events anywhere in the app. Events go to Vercel
 * Analytics (cookieless, consent-gated by AnalyticsWrapper).
 */
export default function AffiliateLink({
    href,
    productName,
    linkType,
    placement,
    className,
    children,
}: AffiliateLinkProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={className}
            onClick={() => {
                try {
                    track('affiliate_click', { product: productName, type: linkType, placement });
                } catch {
                    // Never let analytics break the outbound click.
                }
            }}
        >
            {children}
        </a>
    );
}
