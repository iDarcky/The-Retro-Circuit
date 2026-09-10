/* The shape the v2 landing sections read.
 *
 * Deliberately flat and pre-formatted on the server: the carousel is a client
 * component, so every field it renders is a string it can print without pulling
 * the whole ConsoleDetails graph (and its variants) across the RSC boundary.
 */
export interface LandingDevice {
    slug: string;
    name: string;
    brand: string;
    brandSlug: string;
    imageUrl: string | null;
    /** Label / value pairs, already formatted. Four at most — the stage fits four rows. */
    specs: { label: string; value: string }[];
    /** "Aug 2026", or null when the variant carries no release date. */
    released: string | null;
    /** Only rendered when it is something other than "released". */
    status: string | null;
}
