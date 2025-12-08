
import { type FC, type ChangeEvent } from 'react';

interface RenderInputProps {
    field: { label: string, key: string, type: string, required?: boolean, step?: string };
    value: any;
    onChange: (key: string, val: any) => void;
    error?: string;
}

export const AdminInput: FC<RenderInputProps> = ({ field, value, onChange, error }) => {
    // Default val handling
    const val = value !== undefined && value !== null ? value : (field.type === 'checkbox' ? false : '');
    
    const borderColor = error ? 'border-retro-pink' : 'border-gray-700 focus:border-retro-neon';
    const labelColor = error ? 'text-retro-pink' : 'text-gray-500';
    
    if (field.type === 'textarea') {
        return (
            <div className="col-span-1 md:col-span-2">
                <label className={`text-[10px] mb-1 block uppercase ${labelColor}`}>{field.label}</label>
                <textarea 
                    className={`w-full bg-black border p-3 h-24 outline-none font-mono text-sm ${borderColor} transition-colors`}
                    value={val}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(field.key, e.target.value)}
                    required={false}
                />
                {error && <div className="text-[10px] text-retro-pink mt-1 font-mono uppercase">! {error}</div>}
            </div>
        );
    }

    if (field.type === 'checkbox') {
        // Strictly check for true or "true" string to handle potential DB type mismatch
        const isChecked = String(val) === 'true';
        
        return (
            <div>
                <label className={`flex items-center gap-3 cursor-pointer group`}>
                    <input 
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-700 bg-black text-retro-neon focus:ring-retro-neon"
                        checked={isChecked}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(field.key, e.target.checked)}
                    />
                    <span className={`text-[10px] uppercase font-bold tracking-wider group-hover:text-white ${labelColor}`}>
                        {field.label}
                    </span>
                </label>
                {error && <div className="text-[10px] text-retro-pink mt-1 font-mono uppercase">! {error}</div>}
            </div>
        );
    }

    return (
        <div>
            <label className={`text-[10px] mb-1 block uppercase ${labelColor}`}>{field.label}</label>
            <input 
                type={field.type}
                className={`w-full bg-black border p-3 outline-none font-mono text-sm ${borderColor} transition-colors`}
                value={val}
                onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(field.key, e.target.value)}
                required={field.required}
                step={field.step}
            />
            {error && <div className="text-[10px] text-retro-pink mt-1 font-mono uppercase">! {error}</div>}
        </div>
    );
};
