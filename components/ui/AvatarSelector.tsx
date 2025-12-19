'use client';

import { type FC } from 'react';
import { RETRO_AVATARS } from '../../data/avatars';

interface AvatarSelectorProps {
    selectedId: string;
    onSelect: (id: string) => void;
}

const AvatarSelector: FC<AvatarSelectorProps> = ({ selectedId, onSelect }) => {
    return (
        <div className="grid grid-cols-5 gap-2 p-2 bg-bg-primary border border-border-normal">
            {RETRO_AVATARS.map((avatar) => (
                <button
                    key={avatar.id}
                    onClick={() => onSelect(avatar.id)}
                    className={`aspect-square flex items-center justify-center border-2 transition-all p-1 ${
                        selectedId === avatar.id 
                        ? 'border-secondary bg-secondary/20 shadow-[0_0_10px_rgba(0,255,157,0.5)]'
                        : 'border-border-normal hover:border-primary hover:bg-primary/10'
                    }`}
                    title={avatar.name}
                >
                    <avatar.svg className={`w-8 h-8 ${selectedId === avatar.id ? 'text-secondary' : 'text-gray-400'}`} />
                </button>
            ))}
        </div>
    );
};

export default AvatarSelector;