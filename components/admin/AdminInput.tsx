
import { type FC } from 'react';

interface RenderInputProps {
    field: { label: string, key: string, type: string, required?: boolean, step?: string };
    value: any;
    onChange: (key: string, val: any) => void;
}

export const AdminInput: FC<RenderInputProps> = ({ field, value, onChange }) => {
    const val = value || (field.type === 'checkbox' ? false : '');
    
    if (field.type === 'textarea') {
        return (
            <div className="col-span-1 md:col-span-2">
                <label className="text-[10px] text-gray-500 mb-1 block uppercase">{field.label}</label>
                <textarea 
                    className="w-full bg-black border border-gray-700 p-3 h-24 focus:border-retro-neon outline-none font-mono text-sm"
                    value={val}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    required={field.required}
                />
            </div>
        );
    }

    if (field.type === 'checkbox') {
            return (
            <div className="flex items-center gap-3 border border-gray-800 p-3 bg-black">
                <input 
                    type="checkbox"
                    className="accent-retro-neon w-4 h-4"
                    checked={!!val}
                    onChange={(e) => onChange(field.key, e.target.checked)}
                />
                <label className="text-xs text-gray-300 uppercase cursor-pointer" onClick={() => onChange(field.key, !val)}>{field.label}</label>
            </div>
        );
    }

    return (
        <div>
            <label className="text-[10px] text-gray-500 mb-1 block uppercase">{field.label}</label>
            <input 
                type={field.type}
                step={field.step}
                className="w-full bg-black border border-gray-700 p-3 focus:border-retro-neon outline-none text-white font-mono"
                value={val}
                onChange={(e) => onChange(field.key, e.target.value)}
                required={field.required}
            />
        </div>
    );
};
