'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="fixed inset-0 bg-[#0000AA] text-white font-mono p-8 flex flex-col items-center justify-center text-center z-[100] overflow-y-auto">
      <h1 className="text-4xl mb-4 bg-gray-300 text-[#0000AA] px-4 font-bold">FATAL ERROR</h1>
      <p className="text-xl mb-8">A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36.</p>
      
      <div className="text-left border-2 border-white p-4 mb-8 max-w-2xl bg-[#000088] w-full">
         <p className="mb-2 text-yellow-300">Technical Information:</p>
         <pre className="whitespace-pre-wrap break-words font-mono text-sm">{error.message || 'Unknown Error'}</pre>
         {error.digest && <p className="mt-2 text-xs text-gray-400">Digest: {error.digest}</p>}
      </div>
      
      <p className="animate-pulse mb-8 text-[#00FF00]">* Press RESTART to terminate the current application.</p>
      <p className="text-sm opacity-75 mb-8">Press any key to continue _</p>
      
      <button 
        onClick={() => reset()}
        className="border-2 border-white px-6 py-2 hover:bg-white hover:text-[#0000AA] font-bold uppercase transition-colors"
      >
        Restart System
      </button>
    </div>
  );
}