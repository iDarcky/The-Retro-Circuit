
import { type FC, type ChangeEvent } from 'react';

interface RenderInputProps {
    field: { 
        label: string, 
        key: string, 
        type?: string, // Make type optional
        required?: boolean, 
        step?: string, 
        note?: string,
        options?: string[],
        visualStyle?: 'computed' | 'standard',
        placeholder?: string, // Add placeholder
    };
    value: any;
    onChange: (key: string, val: any) => void;
    error?: string;
}

export const AdminInput: FC<RenderInputProps> = ({ field, value, onChange, error }) => {
    const type = field.type || 'text'; // Default to text if not specified

    // Default val handling
    const val = value !== undefined && value !== null ? value : (type === 'checkbox' ? false : '');
    
    const borderColor = error ? 'border-retro-pink' : 'border-gray-700 focus:border-retro-neon';
    const labelColor = error ? 'text-retro-pink' : 'text-gray-500';

    // Visual styles for computed fields (read-only appearance)
    const isComputed = field.visualStyle === 'computed';
    const computedBg = isComputed ? 'bg-gray-900 text-gray-400 cursor-not-allowed' : 'bg-black text-white';
    
    if (type === 'textarea') {
        return (
            <div className="col-span-1 md:col-span-2">
                <label className={`text-[10px] mb-1 block uppercase ${labelColor}`}>{field.label}</label>
                <textarea 
                    className={`w-full bg-black border p-3 h-24 outline-none font-mono text-sm ${borderColor} transition-colors`}
                    value={val}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(field.key, e.target.value)}
                    required={false}
                    placeholder={field.placeholder}
                />
                {field.note && <div className="text-[9px] text-gray-500 mt-1 font-mono tracking-tight">{field.note}</div>}
                {error && <div className="text-[10px] text-retro-pink mt-1 font-mono uppercase">! {error}</div>}
            </div>
        );
    }

    if (type === 'checkbox') {
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

    if (type === 'select') {
        return (
            <div>
                <label className={`text-[10px] mb-1 block uppercase ${labelColor}`}>{field.label}</label>
                <select
                    className={`w-full bg-black border p-3 outline-none font-mono text-sm ${borderColor} transition-colors text-white`}
                    value={val}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(field.key, e.target.value)}
                >
                    <option value="">-- Select --</option>
                    {field.options?.map(opt => (
                        <option key={opt} value={opt} className="bg-black">{opt}</option>
                    ))}
                </select>
                {field.note && <div className="text-[9px] text-gray-500 mt-1 font-mono tracking-tight">{field.note}</div>}
                {error && <div className="text-[10px] text-retro-pink mt-1 font-mono uppercase">! {error}</div>}
            </div>
        );
    }

    return (
        <div>
            <label className={`text-[10px] mb-1 block uppercase ${labelColor}`}>{field.label}</label>
            <input 
                type={type}
                className={`w-full border p-3 outline-none font-mono text-sm ${borderColor} ${computedBg} transition-colors`}
                value={val}
                onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(field.key, e.target.value)}
                required={field.required}
                step={field.step}
                readOnly={isComputed}
                placeholder={field.placeholder}
            />
            {field.note && <div className="text-[9px] text-gray-500 mt-1 font-mono tracking-tight">{field.note}</div>}
            {error && <div className="text-[10px] text-retro-pink mt-1 font-mono uppercase">! {error}</div>}
        </div>
    );
};
