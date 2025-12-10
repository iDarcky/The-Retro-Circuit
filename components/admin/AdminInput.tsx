
import { type FC, type ChangeEvent } from 'react';

interface RenderInputProps {
    field: { label: string, key: string, type: string, required?: boolean, step?: string, note?: string };
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
                {field.note && <div className="text-[9px] text-gray-500 mt-1 font-mono tracking-tight">{field.note}</div>}
                {error && <div className="text-[10px] text-retro-pink mt-1 font-mono uppercase">! {error}</div>}
            </div>
        );
    }

    if (field.type === 'checkbox') {
        // Strictly check for true or "true" string to handle potential DB type mismatch
        const isChecked = String(val) === 'true';
        
        return (
            <div>
                <div 
                    className={`flex items-center justify-between bg-black border p-3 cursor-pointer group transition-all h-[46px] mt-[19px] ${borderColor}`}
                    onClick={() => onChange(field.key, !isChecked)}
                >
                    <span className={`text-[10px] uppercase font-bold tracking-wider group-hover:text-white ${labelColor}`}>
                        {field.label}
                    </span>
                    <div className={`w-5 h-5 border flex items-center justify-center transition-all ${isChecked ? 'bg-retro-neon border-retro-neon' : 'border-gray-600 bg-transparent'}`}>
                        {isChecked && <svg className="w-3 h-3 text-black font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                </div>
                {field.note && <div className="text-[9px] text-gray-500 mt-1 font-mono tracking-tight">{field.note}</div>}
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
            {field.note && <div className="text-[9px] text-gray-500 mt-1 font-mono tracking-tight">{field.note}</div>}
            {error && <div className="text-[10px] text-retro-pink mt-1 font-mono uppercase">! {error}</div>}
        </div>
    );
};
