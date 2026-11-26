import { Pixelify_Sans, Silkscreen, Bungee, Jersey_10 } from 'next/font/google';

// BETA ONLY: candidate faces for the homepage title, so the owner can flip between them.
// Once one is picked, keep that one font and delete the rest along with TitleFontPicker.
const pixelify = Pixelify_Sans({ weight: ['700'], subsets: ['latin'], display: 'swap', variable: '--font-title-pixelify' });
const silkscreen = Silkscreen({ weight: ['700'], subsets: ['latin'], display: 'swap', variable: '--font-title-silkscreen' });
const bungee = Bungee({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-title-bungee' });
const jersey = Jersey_10({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-title-jersey' });

export const TITLE_FONT_VARS = [pixelify.variable, silkscreen.variable, bungee.variable, jersey.variable].join(' ');
