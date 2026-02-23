'use client';

interface SystemAnalysisProps {
    description: string;
}

export default function SystemAnalysis({ description }: SystemAnalysisProps) {
    if (!description) return null;

    return (
        <div className="font-mono text-sm text-gray-400 leading-relaxed whitespace-pre-line">
            {description}
        </div>
    );
}
