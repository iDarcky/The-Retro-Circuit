
export function formatReleaseDate(date: string | null | undefined, precision: string | null | undefined): string | null {
    if (!date) return null;

    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return null;

        // Ensure we are working with UTC date parts to avoid timezone shifts
        // For 'YYYY-MM-DD' strings, standard Date() parsing in JS assumes UTC if strictly ISO,
        // but often browser locale issues arise.
        // We manually extract parts for stability.
        const [year, month, day] = date.split('-').map(Number);

        // Month names
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        if (precision === 'year') {
            return year.toString();
        }

        if (precision === 'month') {
            return `${monthNames[month - 1]} ${year}`;
        }

        if (precision === 'day') {
            return `${monthNames[month - 1]} ${day}, ${year}`;
        }

        // Fallback if precision is missing but we have a date (assume year)
        return year.toString();

    } catch (e) {
        console.error("Date formatting error", e);
        return null;
    }
}

export function timeAgo(dateString: string | undefined): string {
    if (!dateString) return '---';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";

    return Math.floor(seconds) + "s ago";
}
