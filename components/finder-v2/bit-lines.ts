/* What Bit says as you go through the Finder. Short, friendly, never salesy. */

/** Bit's reaction to the answer you just gave, keyed by option id. */
export const REACTION: Record<string, string> = {
    nostalgia: 'A nostalgia hunter. Good taste.',
    completionist: 'Every system? Respect.',
    performance: 'Power it is.',
    onthego: 'Pocket life. Got it.',
    gift: 'A gift! That is nice of you.',
    horizontal: 'The classic grip.',
    vertical: 'Game Boy style. Timeless.',
    clamshell: 'Flip it open. Love it.',
    '8bit': 'The classics. Easy to do well.',
    '32bit': 'PS1 and N64, the dawn of 3D.',
    '2000s': 'PSP and DS. Great libraries.',
    '6thgen': 'PS2 and GameCube need real muscle.',
    modern: 'Modern systems. A big ask!',
    b_under_60: 'Thrifty. I can work with that.',
    b_60_120: 'The sweet spot. Lots of choice here.',
    b_120_180: 'Nice, that opens doors.',
    b_180_300: 'Now we are talking.',
    b_300_plus: 'No limits. Fun.',
    pocket: 'Jeans pocket size. Noted.',
    jacket: 'A bit of bulk is fine. Noted.',
    home: 'Couch mode. Big screens welcome.',
    versatile: 'A bit of everything.',
    beginner: 'Out of the box it is.',
    guide: 'A guide is fine. Good.',
    tinker: 'A tinkerer! My favourite kind.',
    power: 'All the knobs. You got it.',
    surprise: 'I will keep it open.',
};

/** Bit's nudge for each step, shown under the reaction. */
export const PROMPT: Record<number, string> = {
    0: 'Hi, I am Bit. Eight quick questions and I will find your handheld.',
    1: 'How do you like to hold it?',
    2: 'What are you itching to play?',
    3: 'How much do you want to spend?',
    4: 'Where will it live?',
    5: 'How hands-on are you?',
    6: 'Anything you cannot live without? Pick only real deal-breakers.',
    7: 'Last one, and just for fun.',
};

export const LOADING = 'Checking every handheld in the catalogue...';
export const FOUND = 'Found it! Here is your match.';
export const FOUND_GIFT = 'These make great gifts: easy to set up and hard to get wrong.';
export const NONE = 'Hmm, nothing fits all of that. Try dropping a must-have.';
export const CLASH = 'Heads up, those two pull against each other.';

export function relaxedNote(relaxed: string[] | undefined): string | null {
    if (!relaxed?.length) return null;
    if (relaxed.includes('features')) return 'Nothing has every must-have you picked, so I matched on the rest.';
    if (relaxed.includes('form_factor')) return 'Nothing in that shape had your must-haves, so I looked at other shapes too.';
    return null;
}
