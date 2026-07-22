'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Shared route-level error boundary UI. Each public route's error.tsx renders this so a thrown
 * error is isolated to that segment (the rest of the shell stays interactive) instead of
 * bubbling to the global boundary. Keeps the hard-edged Swiss styling (no shadows).
 */
export default function RouteError({
  error,
  reset,
  label = 'THIS VIEW',
}: {
  error: Error & { digest?: string };
  reset: () => void;
  label?: string;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="font-pixel text-5xl md:text-6xl text-rose-500 mb-6 select-none">ERROR</div>
      <h2 className="font-mono text-sm uppercase tracking-widest text-white mb-3">
        {`Could not load ${label.toLowerCase()}`}
      </h2>
      <p className="font-mono text-xs text-gray-400 max-w-md mb-8">
        The signal dropped while fetching this data. You can retry, or head back to base.
      </p>
      {error.digest && (
        <p className="font-mono text-[10px] text-gray-500 mb-8">Reference: {error.digest}</p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="border border-white/40 px-6 py-2 font-mono text-xs uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors"
        >
          Retry
        </button>
        <Link
          href="/"
          className="border border-white/10 px-6 py-2 font-mono text-xs uppercase tracking-widest text-gray-300 hover:bg-white/[0.04] hover:text-white transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
