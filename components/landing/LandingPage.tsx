import Link from 'next/link';
import { Gamepad2, Factory, Zap, Calendar, ArrowRight } from 'lucide-react';
import { fetchLatestConsoles, fetchRealWorldLatest } from '../../lib/api/latest';
import { fetchConsoleList } from '../../lib/api/consoles';
import { fetchManufacturers } from '../../lib/api/manufacturers';
import AnalysisTools from './AnalysisTools';
import LatestTransmissions from './LatestTransmissions';

export default async function LandingPage() {
  // Fetch data
  const latestConsoles = await fetchLatestConsoles(3);
  const upcomingConsoles = await fetchRealWorldLatest(3);
  const allConsoles = await fetchConsoleList();
  const manufacturers = await fetchManufacturers();

  // Helper for colors
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary': return 'text-primary bg-primary/10 group-hover:text-primary border-primary/20';
      case 'secondary': return 'text-secondary bg-secondary/10 group-hover:text-secondary border-secondary/20';
      case 'accent': return 'text-accent bg-accent/10 group-hover:text-accent border-accent/20';
      case 'warning': return 'text-warning bg-warning/10 group-hover:text-warning border-warning/20';
      default: return 'text-white bg-white/10 group-hover:text-white border-white/20';
    }
  };

  // Metric Card Component
  const MetricCard = ({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: any, color: string }) => {
    const colorClass = getColorClasses(color);

    return (
      <div className={`bg-bg-card border border-border-subtle p-6 rounded-xl flex items-center justify-between group hover:border-border-normal transition-all duration-300 relative overflow-hidden`}>
        {/* Subtle Glow Effect on Hover */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-${color}/5 pointer-events-none`} />

        <div className="relative z-10">
          <p className="text-text-muted text-[10px] md:text-xs font-mono uppercase tracking-widest mb-1">{label}</p>
          <p className={`text-2xl md:text-3xl font-pixel text-white transition-colors`}>
            {value}
          </p>
        </div>

        <div className={`p-3 rounded-lg ${colorClass} transition-colors relative z-10`}>
          <Icon size={24} />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-bg-primary min-h-screen w-full p-4 md:p-8 font-mono selection:bg-accent selection:text-white pb-24">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-8">

        {/* HEADER / WELCOME */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center pb-6 border-b border-border-subtle">
           <div>
              <h1 className="text-3xl md:text-4xl font-pixel text-white mb-2">
                CIRCUIT_<span className="text-secondary">DASHBOARD</span>
              </h1>
              <p className="text-text-muted text-sm md:text-base font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                SYSTEM STATUS: ONLINE
              </p>
           </div>
           <div className="mt-4 md:mt-0 flex gap-4">
              <Link href="/about" className="text-text-muted hover:text-primary text-xs font-mono uppercase tracking-widest transition-colors flex items-center gap-2 group">
                [ MISSION BRIEF ]
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
        </div>

        {/* ROW 1: METRICS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <MetricCard
            label="Total Systems"
            value={allConsoles.length}
            icon={Gamepad2}
            color="primary"
          />
          <MetricCard
            label="Manufacturers"
            value={manufacturers.length}
            icon={Factory}
            color="secondary"
          />
          <MetricCard
            label="New Entries"
            value={latestConsoles.length}
            icon={Zap}
            color="accent"
          />
          <MetricCard
            label="Upcoming"
            value={upcomingConsoles.length}
            icon={Calendar}
            color="warning"
          />
        </div>

        {/* ROW 2: MAIN DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* MAIN CONTENT AREA (2/3) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
              <AnalysisTools consoles={allConsoles} />
          </div>

          {/* SIDE LIST AREA (1/3) */}
          <div className="lg:col-span-1 flex flex-col gap-6 h-full">
              <LatestTransmissions vault={latestConsoles} market={upcomingConsoles} />
          </div>

        </div>

      </div>
    </div>
  );
}
