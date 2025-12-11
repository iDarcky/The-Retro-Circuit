export const TechBadge = ({ label, active, color = "bg-retro-neon" }: { label: string, active?: boolean | string | null, color?: string }) => {
    // If active is undefined/null/empty, don't show the badge at all
    if (active === undefined || active === null || active === '') return null;

    // Strict boolean check because DB might return "false" string which is truthy in JS
    const isActive = active === true || active === 'true';

    return (
        <div className={`
            inline-flex items-center gap-2 px-2 py-1 border text-[9px] font-mono uppercase tracking-wider
            ${isActive ? 'border-retro-grid bg-white/5 text-gray-200' : 'border-transparent text-gray-600 opacity-50'}
        `}>
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? `${color} animate-pulse shadow-[0_0_5px_currentColor]` : 'bg-gray-700'}`}></span>
            {label}
        </div>
    );
};