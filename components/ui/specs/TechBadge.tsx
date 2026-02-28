export const TechBadge = ({ label, active, color = "bg-violet-500" }: { label: string, active?: boolean | string | null, color?: string }) => {
    // If active is undefined/null/empty, don't show the badge at all
    if (active === undefined || active === null || active === '') return null;

    // Strict boolean check because DB might return "false" string which is truthy in JS
    const isActive = active === true || active === 'true';

    return (
        <div className={`
            inline-flex items-center gap-2 px-3 py-1 border text-[10px] font-mono uppercase tracking-tight
            ${isActive ? 'border-border-normal bg-bg-tertiary text-text-primary' : 'border-border-subtle text-text-muted bg-transparent'}
        `}>
            <span className={`w-2 h-2 rounded-none ${isActive ? color : 'bg-bg-tertiary'}`}></span>
            {label}
        </div>
    );
};