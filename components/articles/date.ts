/** "1 Dec 2026". Dates are written as YYYY-MM-DD and shown in UTC so a build server's
 * time zone cannot shift them by a day. */
export function formatArticleDate(iso: string): string {
    const d = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}
