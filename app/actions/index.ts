/**
 * Barrel for the server actions.
 *
 * consoles.ts was split into four modules along the seams the admin screens already
 * use; re-exporting here kept every existing import path working, so the split was a
 * pure move.
 */
export * from './search';
export * from './manufacturers';
export * from './consoles';
export * from './variants';
export * from './images';
export * from './commerce';
export * from './roadmap';
