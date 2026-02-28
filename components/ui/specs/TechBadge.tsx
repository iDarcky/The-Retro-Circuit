

export const TechBadge = ({ label, active, color = "bg-violet-500" }: { label: string, active?: boolean, color?: string }) => {
    // If explicitly provided active state, use it, otherwise default to active for visual presence
    const isActive = active !== undefined ? active : true;

    return (
        <div className={`
            inline-flex items-center gap-2 px-3 py-1 border-2 text-[10px] font-bold uppercase tracking-widest font-sans
            ${isActive ? 'border-border-strong bg-bg-secondary text-text-primary' : 'border-border-subtle text-text-muted bg-transparent'}
        `}>
            <span className={`w-3 h-3 rounded-none border border-border-strong ${isActive ? color : 'bg-transparent'}`}></span>
            {label}
        </div>
    );
};
