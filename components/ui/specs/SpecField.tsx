export const SpecField = ({ label, value, unit, highlight = false, small = false }: { label: string, value?: string | number | null, unit?: string, highlight?: boolean, small?: boolean }) => {
    if (value === undefined || value === null || value === '') return null;
    return (
        <div className="flex justify-between items-end border-b border-white/5 pb-1 last:border-0">
            <span className="font-tech text-[10px] text-gray-500 uppercase tracking-wide">{label}</span>
            <span className={`font-mono text-right ${small ? 'text-xs' : 'text-sm'} ${highlight ? 'text-secondary font-bold drop-shadow-[0_0_5px_rgba(0,255,157,0.4)]' : 'text-gray-300'}`}>
                {value} {unit && <span className="text-[10px] text-gray-500 ml-0.5">{unit}</span>}
            </span>
        </div>
    );
};