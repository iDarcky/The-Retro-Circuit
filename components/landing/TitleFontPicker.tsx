'use client';

import { useEffect, useState } from 'react';

// BETA ONLY: a small switcher under the hero for comparing title fonts. Remove once chosen.
const OPTIONS = [
    { id: 'a', label: 'A  Current pixel' },
    { id: 'b', label: 'B  Pixelify' },
    { id: 'c', label: 'C  Silkscreen' },
    { id: 'd', label: 'D  Bungee' },
    { id: 'e', label: 'E  Jersey' },
];

export default function TitleFontPicker() {
    const [font, setFont] = useState('b');
    useEffect(() => {
        const saved = localStorage.getItem('beta-title-font');
        if (saved) setFont(saved);
    }, []);
    useEffect(() => {
        document.documentElement.dataset.titleFont = font;
        localStorage.setItem('beta-title-font', font);
    }, [font]);

    return (
        <div className="mt-8 flex flex-wrap items-center gap-2 font-mono text-xs" role="group" aria-label="Title font (beta preview)">
            <span className="text-orange-400 mr-1">Beta: title font</span>
            {OPTIONS.map((o) => (
                <button
                    key={o.id}
                    type="button"
                    onClick={() => setFont(o.id)}
                    aria-pressed={font === o.id}
                    className={`px-2.5 py-1.5 border ${font === o.id ? 'bg-white text-black border-white' : 'border-white/20 text-text-secondary hover:border-white hover:text-white'}`}
                >
                    {o.label}
                </button>
            ))}
        </div>
    );
}
