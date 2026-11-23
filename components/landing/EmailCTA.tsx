"use client";

import { useState, FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { subscribeEmail } from "../../app/actions/subscribers";

type Status = "idle" | "loading" | "success" | "error";

/**
 * EmailCTA: the homepage newsletter signup.
 */
export default function EmailCTA() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<Status>("idle");
    const [message, setMessage] = useState("");

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");
        const result = await subscribeEmail(email, "homepage");

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
        <section className="px-5 md:px-12 py-14 md:py-20 border-b border-border-subtle" aria-labelledby="signals-heading">
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
                <div className="lg:col-span-7">
                    <h2 id="signals-heading" className="font-pixel text-lg md:text-2xl leading-snug text-white mb-4">
                        New handhelds, once a month
                    </h2>
                    <p className="text-text-secondary leading-relaxed max-w-[52ch]">
                        One email with the devices we added, the ones announced, and what changed. No spam, and you can
                        unsubscribe any time.
                    </p>
                </div>

                <div className="lg:col-span-5">
                    {status === "success" ? (
                        <p role="status" className="font-mono text-sm text-violet-300">{message}</p>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                            <input
                                id="newsletter-email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (status === "error") setStatus("idle");
                                }}
                                placeholder="you@example.com"
                                required
                                aria-invalid={status === "error" || undefined}
                                aria-describedby={status === "error" ? "newsletter-error" : undefined}
                                className="flex-1 min-w-0 bg-bg-secondary border border-border-normal text-text-primary font-mono text-sm px-4 py-3.5 placeholder:text-text-muted focus:outline-none focus:border-violet-500 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="inline-flex justify-center items-center gap-2 bg-violet-600 border border-violet-500 text-white font-mono text-sm px-6 py-3.5 hover:bg-white hover:text-black hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                            >
                                {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" aria-label="Subscribing" /> : "Subscribe"}
                            </button>
                        </form>
                    )}
                    {status === "error" && (
                        <p id="newsletter-error" className="mt-2 font-mono text-xs text-rose-400">{message}</p>
                    )}
                </div>
            </div>
        </section>
    );
}
