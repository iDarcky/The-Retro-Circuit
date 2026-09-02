import { ConsoleDetails, ConsoleVariant } from '../types';

interface ImageGetterParams {
    console: ConsoleDetails;
    variant?: ConsoleVariant | null;
}

/**
 * Centralized helper to determine the correct image for a console or its variant.
 * Fallback Logic:
 * 1. Selected Variant's Image URL
 * 2. Base Console's Image URL
 * 3. Default Variant's Image URL (if available)
 * 4. `null` — there is no image.
 *
 * Returns null rather than a placeholder path: the only caller
 * (`ConsoleDetailView`) already renders a "NO SIGNAL" state for a missing image, and
 * the placeholder this used to return (`/img/placeholder.png`) is not in `public/`,
 * so that branch was unreachable and imageless consoles rendered a broken <img>
 * instead. 378 of 379 drafts have no image, so that is nearly every draft preview.
 */
export const getConsoleImage = ({ console, variant }: ImageGetterParams): string | null => {
    // 1. Use the selected variant's image if it exists
    if (variant && variant.image_url) {
        return variant.image_url;
    }

    // 2. Fallback to the main console's image
    if (console.image_url) {
        return console.image_url;
    }
    
    // 3. If variants exist, try to find the default variant and use its image
    if (console.variants && console.variants.length > 0) {
        const defaultVariant = console.variants.find(v => v.is_default);
        if (defaultVariant && defaultVariant.image_url) {
            return defaultVariant.image_url;
        }
    }

    // 4. Nothing to show — the caller renders its own empty state.
    return null;
};