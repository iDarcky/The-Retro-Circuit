
import { fetchRealWorldLatest } from '@/lib/api/real-world';
import { fetchLatestConsoles } from '@/lib/api/latest';
import Link from 'next/link';

export default async function TerminalConcept() {
  const [realWorldLatest, dbLatest] = await Promise.all([
    fetchRealWorldLatest(5),
    fetchLatestConsoles(5)
  ]);

  return (
    <div className="min-h-screen bg-black text-[#00ff00] font-mono p-4 selection:bg-[#00ff00] selection:text-black overflow-x-hidden">

      {/* CRT EFFECT */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)50%,rgba(0,0,0,0.25)50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

      <pre className="text-[10px] md:text-xs leading-none mb-8 text-[#00ff00] font-bold select-none opacity-50">
{`
 ____  _____ _____ ____  ____
|  _ \\| ____|_   _|  _ \\/ __ \\
| |_) |  _|   | | | |_) | |  | |
|  _ <| |___  | | |  _ <| |__| |
|_| \\_\\_____| |_| |_| \\_\\\\____/
   CIRCUIT TERMINAL V1.0
`}
      </pre>

      <main className="max-w-4xl mx-auto space-y-12 relative z-10">

         {/* FINDER (Prompt) */}
         <section>
            <div className="mb-2">root@retro-circuit:~$ ./finder.sh</div>
            <div className="border border-[#00ff00] p-4 bg-[#001100]">
               <p className="mb-4">INITIALIZING HARDWARE SEARCH PROTOCOL...</p>
               <p className="mb-4 text-white">Do you wish to scan for compatible devices?</p>
               <div className="flex gap-4">
                  <Link href="/finder" className="bg-[#00ff00] text-black px-2 hover:invert transition-all">
                     [Y] YES
                  </Link>
                  <span className="text-[#005500]">[N] NO</span>
               </div>
            </div>
         </section>

         {/* LATEST RELEASED (Table) */}
         <section>
             <div className="mb-2">root@retro-circuit:~$ cat /var/log/latest_releases.txt</div>
             <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="border-b border-[#00ff00] text-[#00ff00]">
                         <th className="py-2 pr-4">ID</th>
                         <th className="py-2 pr-4">UNIT_NAME</th>
                         <th className="py-2 pr-4">MANUFACTURER</th>
                         <th className="py-2">YEAR</th>
                      </tr>
                   </thead>
                   <tbody>
                      {realWorldLatest.map((c, i) => (
                         <tr key={c.id} className="hover:bg-[#002200] hover:text-white cursor-pointer group">
                            <td className="py-1 pr-4 text-[#005500] group-hover:text-white">0x0{i}</td>
                            <td className="py-1 pr-4">{c.name}</td>
                            <td className="py-1 pr-4">{c.manufacturer?.name}</td>
                            <td className="py-1">{c.release_year}</td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
         </section>

         {/* VS MODE (ASCII Visual) */}
         <section>
            <div className="mb-2">root@retro-circuit:~$ ./compare_utility.exe</div>
            <div className="border border-[#00ff00] border-dashed p-8 flex flex-col md:flex-row items-center justify-center gap-12 text-center">
               <div className="group cursor-pointer">
                  <div className="w-32 h-20 border border-[#00ff00] flex items-center justify-center mb-2 group-hover:bg-[#00ff00] group-hover:text-black">
                     SELECT_A
                  </div>
                  <div className="text-xs opacity-50">WAITING...</div>
               </div>

               <div className="text-xl font-bold">
                  {'<'} VS {'>'}
               </div>

               <div className="group cursor-pointer">
                  <div className="w-32 h-20 border border-[#00ff00] flex items-center justify-center mb-2 group-hover:bg-[#00ff00] group-hover:text-black">
                     SELECT_B
                  </div>
                  <div className="text-xs opacity-50">WAITING...</div>
               </div>
            </div>
         </section>

         {/* DB LOGS */}
         <section>
            <div className="mb-2">root@retro-circuit:~$ tail -f /var/db/consoles.log</div>
            <div className="bg-[#001100] p-4 font-mono text-xs md:text-sm h-48 overflow-y-auto border border-[#005500]">
               {dbLatest.map((c) => (
                  <div key={c.id} className="mb-1">
                     <span className="text-white">[{new Date().toLocaleTimeString()}]</span> <span className="text-[#00aa00]">INFO:</span> Imported record <span className="text-white">"{c.name}"</span> successfully.
                  </div>
               ))}
               <div className="animate-pulse">_</div>
            </div>
            <div className="mt-2 text-[#005500]">
               <Link href="/consoles" className="hover:text-[#00ff00] hover:underline">
                  [View all 500+ records]
               </Link>
            </div>
         </section>

      </main>
    </div>
  );
}
