"use client";

import { useState, FormEvent } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { subscribeEmail } from "../../app/actions/newsletter";
import CircuitPattern from "./CircuitPattern";

type Status = "idle" | "loading" | "success" | "error";

/**
 * EmailCTA — Thin single-line strip with rose/red accent.
 */
export default function EmailCTA() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<Status>("idle");
    const [message, setMessage] = useState("");

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");
        const result = await subscribeEmail(email);

        if (result.success) {
            setStatus("success");
            setMessage(result.message);
            setEmail("");
        } else {
            setStatus("error");
            setMessage(result.message);
        }
    }

    return (
        <section className="px-6 md:px-12 py-6 md:py-8 border-b border-border-subtle relative overflow-hidden">
            {/* Circuit board background */}
            <CircuitPattern accentColor="rose" className="absolute inset-0 w-full h-full opacity-40" />

            <div className="max-w-[1800px] mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">

                    {/* Left — Tag + inline text */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                        <span className="text-xs font-mono uppercase tracking-widest text-rose-400">Signals</span>
                        <span className="hidden md:inline text-text-muted mx-1">/</span>
                        <span className="hidden md:inline text-sm text-text-secondary font-light">
                            Stay in the loop. Monthly updates on new devices &amp; releases.
                        </span>
                    </div>

                    {/* Right — Form or success */}
                    <div className="shrink-0">
                        {status === "success" ? (
                            <div className="inline-flex items-center gap-2 text-rose-400 font-mono text-xs uppercase tracking-widest">
                                <Check className="w-4 h-4" />
                                {message}
                            </div>
                        ) : (
                            <div className="relative">
                                <form onSubmit={handleSubmit} className="flex gap-2">
                                    <input
                                        id="newsletter-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (status === "error") setStatus("idle");
                                        }}
                                        placeholder="your@email.com"
                                        required
                                        className="w-48 md:w-56 bg-bg-secondary border border-border-normal text-text-primary font-mono text-xs px-3 py-2 placeholder:text-text-secondary/40 focus:outline-none focus:border-rose-500 transition-colors tracking-wide"
                                    />
                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="inline-flex items-center gap-2 bg-rose-600 text-white font-mono text-xs px-4 py-2 hover:brightness-110 transition-[filter,opacity] uppercase tracking-widest border border-rose-500 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                                    >
                                        {status === "loading" ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                            <>
                                                Subscribe <ArrowRight className="w-3 h-3" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                {status === "error" && (
                                    <p className="absolute left-0 top-full mt-1.5 text-red-400 font-mono text-[10px] uppercase tracking-wider whitespace-nowrap">{message}</p>
                                )}

                                <p className="absolute left-0 top-full mt-1.5 text-zinc-600 text-[9px] font-mono tracking-wider uppercase whitespace-nowrap">
                                    No Spam. Unsubscribe Anytime.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
