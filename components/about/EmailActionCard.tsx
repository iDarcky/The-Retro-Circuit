"use client";

import { Mail, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export interface EmailActionCardProps {
    hoverBorderColor?: string;
    hoverIconBorderColor?: string;
    hoverTextColor?: string;
}

export default function EmailActionCard({
    hoverBorderColor = "hover:border-orange-500/30",
    hoverIconBorderColor = "group-hover:border-orange-500/50",
    hoverTextColor = "group-hover:text-orange-400"
}: EmailActionCardProps) {
    const [copied, setCopied] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        // Only override on desktop/tablet views (md: >= 768px)
        if (typeof window !== "undefined" && window.innerWidth >= 768) {
            e.preventDefault();
            navigator.clipboard.writeText("contact@theretrocircuit.com").then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    return (
        <Link
            href="mailto:contact@theretrocircuit.com"
            onClick={handleClick}
            className={`group block border border-white/10 bg-white/[0.02] p-4 hover:bg-white/5 transition-all relative overflow-hidden ${hoverBorderColor}`}
        >
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors ${hoverIconBorderColor}`}>
                        {copied ? <Check size={18} className="text-emerald-400" /> : <Mail size={18} />}
                    </div>
                    <div>
                        <div className={`text-white font-medium text-sm transition-colors ${hoverTextColor}`}>
                            {copied ? "Email Copied!" : "Open Comms"}
                        </div>
                        <div className="text-zinc-500 text-xs font-mono">
                            contact@theretrocircuit.com
                        </div>
                    </div>
                </div>
                {copied ? (
                    <span className="text-xs text-emerald-400 font-mono tracking-widest uppercase">Copied</span>
                ) : (
                    <ArrowRight size={16} className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                )}
            </div>
        </Link>
    );
}
