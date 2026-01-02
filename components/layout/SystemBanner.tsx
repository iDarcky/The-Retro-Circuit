import Link from 'next/link';

export default function SystemBanner() {
  return (
    <div className="bg-red-900 text-white font-mono text-[10px] md:text-xs font-bold tracking-[0.2em] h-8 flex items-center justify-center uppercase z-[100] relative shadow-lg">
      <span className="animate-pulse">PRE-ALPHA</span>
      <span className="mx-3 opacity-50">•</span>
      <span>Data and features are still evolving.</span>
      <span className="mx-3 opacity-50">•</span>
      <Link href="/about" className="underline hover:text-gray-300 transition-colors">
        Learn what this means
      </Link>
    </div>
  );
}
