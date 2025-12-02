import { ManufacturerProfile } from '../lib/types';

export const BRAND_THEMES: Record<string, { color: string, bg: string, hover: string }> = {
    'Nintendo': {
        color: 'text-red-500 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]',
        bg: 'bg-red-900/20',
        hover: 'hover:bg-red-900/40'
    },
    'Sega': {
        color: 'text-blue-500 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]',
        bg: 'bg-blue-900/20',
        hover: 'hover:bg-blue-900/40'
    },
    'Sony': {
        color: 'text-yellow-400 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)]',
        bg: 'bg-yellow-900/20',
        hover: 'hover:bg-yellow-900/40'
    },
    'Atari': {
        color: 'text-orange-500 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]',
        bg: 'bg-orange-900/20',
        hover: 'hover:bg-orange-900/40'
    },
    'Microsoft': {
        color: 'text-green-500 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]',
        bg: 'bg-green-900/20',
        hover: 'hover:bg-green-900/40'
    },
    'NEC': {
        color: 'text-purple-400 border-purple-400 shadow-[0_0_20px_rgba(192,132,252,0.3)]',
        bg: 'bg-purple-900/20',
        hover: 'hover:bg-purple-900/40'
    },
    'SNK': {
        color: 'text-teal-400 border-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.3)]',
        bg: 'bg-teal-900/20',
        hover: 'hover:bg-teal-900/40'
    },
};

export const getBrandTheme = (brand: string) => {
    return BRAND_THEMES[brand] || {
        color: 'text-retro-neon border-retro-neon shadow-[0_0_20px_rgba(0,255,157,0.3)]',
        bg: 'bg-retro-grid/20',
        hover: 'hover:bg-retro-grid/40'
    };
};

export const FALLBACK_MANUFACTURERS: Record<string, ManufacturerProfile> = {
    'Nintendo': { 
        name: 'Nintendo', 
        founded: '1889', 
        origin: 'Kyoto, Japan', 
        ceo: 'Shuntaro Furukawa', 
        key_franchises: ['Mario', 'Zelda', 'Metroid', 'Pokémon', 'Smash Bros'], 
        description: 'Active, dominant in handheld/hybrid market. Founded in 1889. Notable Consoles: NES, SNES, N64, GameCube, Wii, Wii U, Switch.' 
    },
    'Sony': { 
        name: 'Sony', 
        founded: '1946', 
        origin: 'Tokyo, Japan', 
        ceo: 'Kenichiro Yoshida', 
        key_franchises: ['Gran Turismo', 'God of War', 'Uncharted', 'The Last of Us'], 
        description: 'Active, leading home console manufacturer. Entered gaming in 1994. Notable Consoles: PlayStation, PS2, PS3, PS4, PS5.' 
    },
};