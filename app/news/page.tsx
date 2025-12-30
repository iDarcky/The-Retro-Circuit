import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 300; // 5 minutes

export default function NewsPage() {
  return (
    <div className="w-full">

      <div className="min-h-screen bg-bg-primary font-mono text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full border border-white/10 p-8 md:p-12 relative overflow-hidden">
        {/* Decorative corner markers */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-secondary"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-secondary"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-secondary"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-secondary"></div>

        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-pixel text-secondary tracking-tight">
            COMING SOON
          </h1>

          <div className="h-px w-full bg-white/10 my-8"></div>

          <p className="text-gray-400 font-tech text-lg tracking-wider">
            TRANSMISSION INTERRUPTED...<br/>
            ESTABLISHING UPLINK...
          </p>

          <div className="pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-secondary transition-colors font-tech tracking-widest uppercase"
            >
              <ArrowLeft size={16} />
              Return to Base
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
