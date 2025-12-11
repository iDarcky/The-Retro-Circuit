import { ConsoleDetails, ConsoleVariant } from '../types';

interface ImageGetterParams {
    console: ConsoleDetails;
    variant?: ConsoleVariant | null;
}

// A placeholder image URL if no other image is found
const PLACEHOLDER_IMAGE = '/img/placeholder.png';

/**
 * Centralized helper to determine the correct image for a console or its variant.
 * Fallback Logic:
 * 1. Selected Variant's Image URL
 * 2. Base Console's Image URL
 * 3. Default Variant's Image URL (if available)
 * 4. A final placeholder image.
 */
export const getConsoleImage = ({ console, variant }: ImageGetterParams): string => {
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

    // 4. Return a placeholder if no other image is found
    return PLACEHOLDER_IMAGE;
};