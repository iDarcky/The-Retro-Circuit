
import { type FC } from 'react';

interface RenderInputProps {
    field: { label: string, key: string, type: string, required?: boolean, step?: string };
    value: any;
    onChange: (key: string, val: any) => void;
    error?: string;
}

export const AdminInput: FC<RenderInputProps> = ({ field, value, onChange, error }) => {
    const val = value || (field.type === 'checkbox' ? false : '');
    const borderColor = error ? 'border-retro-pink' : 'border-gray-700 focus:border-retro-neon';
    const labelColor = error ? 'text-retro-pink' : 'text-gray-500';
    
    if (field.type === 'textarea') {
        return (
            <div className="col-span-1 md:col-span-2">
                <label className={`text-[10px] mb-1 block uppercase ${labelColor}`}>{field.label}</label>
                <textarea 
                    className={`w-full bg-black border p-3 h-24 outline-none font-mono text-sm ${borderColor} transition-colors`}
                    value={val}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    required={field.required}
                />
                {error && <div className="text-[10px] text-retro-pink mt-1 font-mono uppercase">! {error}</div>}
            </div>
        );
    }

    if (field.type === 'checkbox') {
            return (
            <div className="flex flex-col">
                <div className={`flex items-center gap-3 border p-3 bg-black ${borderColor} transition-colors`}>
                    <input 
                        type="checkbox"
                        className="accent-retro-neon w-4 h-4"
                        checked={!!val}
                        onChange={(e) => onChange(field.key, e.target.checked)}
                    />
                    <label className="text-xs text-gray-300 uppercase cursor-pointer" onClick={() => onChange(field.key, !val)}>{field.label}</label>
                </div>
                {error && <div className="text-[10px] text-retro-pink mt-1 font-mono uppercase">! {error}</div>}
            </div>
        );
    }

    return (
        <div>
            <label className={`text-[10px] mb-1 block uppercase ${labelColor}`}>{field.label}</label>
            <input 
                type={field.type}
                step={field.step}
                className={`w-full bg-black border p-3 outline-none text-white font-mono ${borderColor} transition-colors`}
                value={val}
                onChange={(e) => onChange(field.key, e.target.value)}
                required={field.required}
            />
            {error && <div className="text-[10px] text-retro-pink mt-1 font-mono uppercase">! {error}</div>}
        </div>
    );
};
