import { SignalManager } from '@/components/admin/SignalManager';
import { fetchAllSignals } from '@/app/actions/signals';

export default async function SignalsPage() {
  const signals = await fetchAllSignals();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8 px-6 pt-6">
        <h1 className="text-2xl font-pixel text-white">SIGNAL CONTROLS</h1>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-500">
           <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
           UPLINK_ACTIVE
        </div>
      </div>

      <SignalManager signals={signals} />
    </div>
  );
}
