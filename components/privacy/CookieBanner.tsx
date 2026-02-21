"use client";

import React from "react";
import Link from "next/link";
import { useConsent } from "./ConsentContext";

export const CookieBanner: React.FC = () => {
  const { isOpen, accept, decline } = useConsent();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-bg-primary border-t border-white/10 p-4 md:p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1 max-w-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-emerald-500 animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              System Notification
            </h3>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            We use cookies to enhance your experience and analyze traffic.
            By continuing, you agree to our use of cookies.
            <span className="block mt-1 text-xs text-zinc-500">
              Read our <Link href="/privacy" className="text-white hover:underline underline-offset-4 decoration-zinc-600">Privacy Policy</Link> for details.
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={decline}
            className="flex-1 md:flex-none px-6 py-3 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white border border-white/10 hover:border-white transition-colors bg-black/20"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="flex-1 md:flex-none px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors border border-white"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};
