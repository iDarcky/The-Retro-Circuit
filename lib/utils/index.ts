import { ConsoleDetails, ConsoleVariant } from '../types/domain';

/**
 * Resolves the display image for a console or variant with fallback logic.
 * @param console The console details object
 * @param variant The specific variant (optional)
 * @returns A valid image URL or the default placeholder
 */
export function getConsoleImage(console: ConsoleDetails, variant?: ConsoleVariant | null): string {
    if (variant?.image_url) {
        return variant.image_url;
    }

    if (console.image_url) {
        return console.image_url;
    }

    // Fallback: Check if there's a default variant image available in the console object (if it wasn't fully hydrated)
    if (console.variants && console.variants.length > 0) {
        const defaultVar = console.variants.find(v => v.is_default);
        if (defaultVar?.image_url) return defaultVar.image_url;
        // Last resort: first variant
        if (console.variants[0]?.image_url) return console.variants[0].image_url;
    }

    return '/logo.png'; // Global default
}
