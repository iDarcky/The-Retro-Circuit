export const SpecField = ({ label, value, unit, highlight = false, small = false }: { label: string, value?: string | number | null, unit?: string, highlight?: boolean, small?: boolean }) => {
    if (value === undefined || value === null || value === '') return null;
    return (
        <div className="flex justify-between items-end border-b border-dotted border-white/10 pb-1 last:border-0 hover:bg-white/[0.02] transition-colors">
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-wide shrink-0 pr-2">{label}</span>
            {/* The separator line is implied by the border-b on the container, but we keep the structure flexible */}
            <span className={`font-mono text-right truncate pl-4 ${small ? 'text-xs' : 'text-sm'} ${highlight ? 'text-secondary font-bold' : 'text-gray-300'}`}>
                {value} {unit && <span className="text-[10px] text-gray-500 ml-0.5">{unit}</span>}
            </span>
        </div>
    );
};
