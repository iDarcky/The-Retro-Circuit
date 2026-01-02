export default function SystemBanner() {
  return (
    <div className="bg-red-600 text-white font-mono text-[10px] md:text-xs font-bold tracking-[0.2em] h-8 flex items-center justify-center uppercase z-[100] relative shadow-lg">
      <span className="animate-pulse">Pre-Alpha Version</span>
      <span className="mx-3 opacity-50">•</span>
      <span>Content Subject To Change</span>
    </div>
  );
}
