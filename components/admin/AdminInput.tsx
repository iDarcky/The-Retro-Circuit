import { type FC, type ChangeEvent } from 'react';
import { SwissDropdown } from '../ui/SwissDropdown';

interface RenderInputProps {
    field: { 
        label: string, 
        key: string, 
        type?: string,
        required?: boolean, 
        step?: string, 
        note?: string,
        options?: string[],
        visualStyle?: 'computed' | 'standard',
        placeholder?: string,
    };
    value: any;
    onChange: (key: string, val: any) => void;
    error?: string;
}

export const AdminInput: FC<RenderInputProps> = ({ field, value, onChange, error }) => {
    const type = field.type || 'text';

    // Default val handling
    const val = value !== undefined && value !== null ? value : (type === 'checkbox' ? false : '');
    
    // Updated CSS Variables and Style
    const borderColor = error ? 'border-accent' : 'border-border-normal focus:border-white';
    const labelColor = error ? 'text-accent' : 'text-gray-500';

    // Visual styles for computed fields (read-only appearance)
    const isComputed = field.visualStyle === 'computed';
    const computedBg = isComputed ? 'bg-bg-secondary text-gray-500 cursor-not-allowed opacity-75' : 'bg-bg-primary text-white';
    
    // No `uppercase` here: it is text-transform only, so the box would show caps while
    // storing whatever was typed — there was no way to tell which case was saved.
    const baseInputClasses = `w-full bg-bg-primary border p-3 font-mono text-sm outline-none transition-all duration-200 placeholder:text-gray-700`;

    if (type === 'color') {
        return (
            <div>
                <label htmlFor={field.key} className={`text-[10px] mb-1 block uppercase tracking-wider ${labelColor}`}>{field.label}</label>
                <div className="flex gap-2 h-[46px]">
                    <div className="relative w-12 h-full border border-border-normal group hover:border-white transition-colors">
                        <input
                            type="color"
                            className="absolute inset-0 w-full h-full p-0 border-0 outline-none cursor-pointer opacity-0"
                            value={val || '#000000'}
                            onChange={(e) => onChange(field.key, e.target.value)}
                            tabIndex={-1}
                            aria-hidden="true"
                        />
                        <div
                            className="w-full h-full"
                            style={{ backgroundColor: val || '#000000' }}
                        ></div>
                    </div>
                    <input
                        id={field.key}
                        type="text"
                        className={`flex-1 ${baseInputClasses} ${borderColor}`}
                        value={val}
                        placeholder="#RRGGBB"
                        onChange={(e) => onChange(field.key, e.target.value)}
                        maxLength={7}
                    />
                </div>
                {field.note && <div className="text-[9px] text-gray-500 mt-1 font-mono tracking-tight">// {field.note}</div>}
                {error && <div className="text-[10px] text-accent mt-1 font-mono uppercase font-bold">! {error}</div>}
            </div>
        );
    }

    if (type === 'textarea') {
        return (
            <div className="col-span-1 md:col-span-2">
                <label htmlFor={field.key} className={`text-[10px] mb-1 block uppercase tracking-wider ${labelColor}`}>{field.label}</label>
                <textarea 
                    id={field.key}
                    className={`w-full bg-bg-primary border p-3 h-24 outline-none font-mono text-sm ${borderColor} transition-colors placeholder:text-gray-700`}
                    value={val}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(field.key, e.target.value)}
                    required={false}
                    placeholder={field.placeholder || "NO DATA"}
                />
                {field.note && <div className="text-[9px] text-gray-500 mt-1 font-mono tracking-tight">// {field.note}</div>}
                {error && <div className="text-[10px] text-accent mt-1 font-mono uppercase font-bold">! {error}</div>}
            </div>
        );
    }

    if (type === 'checkbox') {
        const isChecked = String(val) === 'true';
        
        return (
            <div>
                <div 
                    role="checkbox"
                    aria-checked={isChecked}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            onChange(field.key, !isChecked);
                        }
                    }}
                    className={`flex items-center justify-between bg-bg-primary border p-3 cursor-pointer group transition-all h-[46px] mt-[21px] ${borderColor} hover:border-white`}
                    onClick={() => onChange(field.key, !isChecked)}
                >
                    <span className={`text-[10px] uppercase font-bold tracking-wider group-hover:text-white transition-colors ${labelColor}`}>
                        {field.label}
                    </span>
                    <div className={`w-4 h-4 border flex items-center justify-center transition-all ${isChecked ? 'bg-secondary border-secondary' : 'border-gray-600 bg-transparent group-hover:border-white'}`}>
                        {isChecked && <div className="w-2 h-2 bg-black"></div>}
                    </div>
                </div>
                {field.note && <div className="text-[9px] text-gray-500 mt-1 font-mono tracking-tight">// {field.note}</div>}
                {error && <div className="text-[10px] text-accent mt-1 font-mono uppercase font-bold">! {error}</div>}
            </div>
        );
    }

    if (type === 'select') {
        const dropdownOptions = [
            { label: '-- SELECT --', value: '' },
            ...(field.options?.map(opt => ({ label: opt, value: opt })) || [])
        ];

        return (
            <div>
                <label htmlFor={field.key} className={`text-[10px] mb-1 block uppercase tracking-wider ${labelColor}`}>{field.label}</label>
                <div className="relative">
                    <SwissDropdown
                        value={val}
                        onChange={(newVal) => onChange(field.key, newVal)}
                        options={dropdownOptions}
                        labelPrefix="" inverted={false}
                        className="w-full"
                        buttonClassName={`${baseInputClasses} ${borderColor} h-[46px] flex justify-between items-center`}
                    />
                </div>
                {field.note && <div className="text-[9px] text-gray-500 mt-1 font-mono tracking-tight">// {field.note}</div>}
                {error && <div className="text-[10px] text-accent mt-1 font-mono uppercase font-bold">! {error}</div>}
            </div>
        );
    }

    return (
        <div>
            <label htmlFor={field.key} className={`text-[10px] mb-1 block uppercase tracking-wider ${labelColor}`}>{field.label}</label>
            <input 
                id={field.key}
                type={type}
                className={`${baseInputClasses} ${borderColor} ${computedBg}`}
                value={val}
                onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(field.key, e.target.value)}
                required={field.required}
                step={field.step}
                readOnly={isComputed}
                placeholder={field.placeholder || "NO DATA"}
            />
            {field.note && <div className="text-[9px] text-gray-500 mt-1 font-mono tracking-tight">// {field.note}</div>}
            {error && <div className="text-[10px] text-accent mt-1 font-mono uppercase font-bold">! {error}</div>}
        </div>
    );
};
