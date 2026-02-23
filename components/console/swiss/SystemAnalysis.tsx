'use client';

interface SystemAnalysisProps {
    description: string;
}

export default function SystemAnalysis({ description }: SystemAnalysisProps) {
    if (!description) return null;

    return (
        <section className="mb-8">
            <h2 className="font-pixel text-[10px] text-orange-500 uppercase mb-4 tracking-widest border-b border-orange-500/20 pb-2">
                SYSTEM ANALYSIS
            </h2>
            <div className="font-mono text-gray-300 leading-relaxed text-sm whitespace-pre-line max-w-4xl">
                {description}
            </div>
        </section>
    );
}
