
import { fetchRealWorldLatest } from '@/lib/api/real-world';
import { fetchLatestConsoles } from '@/lib/api/latest';
import Link from 'next/link';
import { Scale, FileText, AlertTriangle } from 'lucide-react';

export default async function LegalConcept() {
  const [realWorldLatest, dbLatest] = await Promise.all([
    fetchRealWorldLatest(3),
    fetchLatestConsoles(5)
  ]);

  return (
    <div className="min-h-screen bg-white text-black font-serif text-sm leading-relaxed p-8 md:p-16 selection:bg-gray-200">

      {/* HEADER */}
      <header className="mb-12 border-b-2 border-black pb-4">
         <div className="flex justify-between items-end mb-2">
            <h1 className="text-3xl font-bold uppercase tracking-widest">Master Service Agreement</h1>
            <span className="font-mono text-xs">DOC_ID: RC-2024-V1</span>
         </div>
         <p className="uppercase text-xs font-bold">The Retro Circuit LLC &bull; Hardware Evaluation Division</p>
      </header>

      <main className="max-w-4xl mx-auto space-y-12">

         {/* SECTION 1: FINDER */}
         <section>
            <h2 className="font-bold uppercase mb-4 text-lg">1. Identification of Hardware Requirements</h2>
            <p className="mb-4 text-justify">
               WHEREAS, the User desires to procure a handheld gaming device ("The Console"); and <br/>
               WHEREAS, The Retro Circuit ("The Provider") maintains a database of such devices; <br/>
               NOW, THEREFORE, the parties agree to utilize the automated discovery tool ("The Finder") to ascertain compatibility.
            </p>
            <div className="bg-gray-100 border border-black p-6 flex items-center gap-6">
               <FileText size={32} />
               <div className="flex-grow">
                  <h3 className="font-bold uppercase mb-1">Exhibit A: The Finder</h3>
                  <p className="text-xs mb-0">Interactive questionnaire to determine eligibility.</p>
               </div>
               <Link href="/finder" className="bg-black text-white px-6 py-2 font-bold uppercase text-xs hover:bg-gray-800">
                  Execute Search
               </Link>
            </div>
         </section>

         {/* SECTION 2: LATEST RELEASED */}
         <section>
            <h2 className="font-bold uppercase mb-4 text-lg">2. Schedule of Recent Amendments</h2>
            <p className="mb-4 text-xs italic text-gray-600">The following hardware has been released to the public domain within the current fiscal year.</p>

            <table className="w-full border-collapse border border-black text-xs">
               <thead className="bg-gray-200">
                  <tr>
                     <th className="border border-black p-2 text-left">Item Name</th>
                     <th className="border border-black p-2 text-left">Manufacturer (Party B)</th>
                     <th className="border border-black p-2 text-center">Effective Date</th>
                  </tr>
               </thead>
               <tbody>
                  {realWorldLatest.map((c) => (
                     <tr key={c.id}>
                        <td className="border border-black p-2 font-bold">{c.name}</td>
                        <td className="border border-black p-2">{c.manufacturer?.name}</td>
                        <td className="border border-black p-2 text-center">{c.release_year}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </section>

         {/* SECTION 3: VS MODE */}
         <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-black p-6">
               <h2 className="font-bold uppercase mb-4 text-lg flex items-center gap-2">
                  <Scale size={18} /> 3. Comparative Clauses
               </h2>
               <p className="text-xs mb-6 text-justify">
                  In the event of a dispute regarding hardware superiority, the parties shall refer to the Comparison Tool to adjudicate technical specifications.
               </p>
               <div className="flex justify-between font-mono text-xs border-t border-black pt-4">
                  <span>[ ] Party A Selection</span>
                  <span>[ ] Party B Selection</span>
               </div>
            </div>

            {/* SECTION 4: DATABASE */}
            <div className="border border-black p-6 bg-gray-50">
               <h2 className="font-bold uppercase mb-4 text-lg flex items-center gap-2">
                  <AlertTriangle size={18} /> 4. Liability & Logs
               </h2>
               <ul className="list-decimal list-inside text-xs space-y-2">
                  {dbLatest.map((c) => (
                     <li key={c.id}>
                        Entry record <strong>{c.id.substring(0,8)}</strong> ({c.name}) processed.
                     </li>
                  ))}
               </ul>
               <Link href="/consoles" className="block text-right mt-6 text-xs underline font-bold">
                  View Full Terms (Database)
               </Link>
            </div>
         </section>

         <div className="mt-16 pt-8 border-t border-black flex justify-between items-center text-xs">
            <div>
               <p>By browsing this site, you agree to these terms.</p>
            </div>
            <div className="flex gap-12">
               <div className="border-b border-black w-32"></div>
               <div className="border-b border-black w-32"></div>
            </div>
         </div>

      </main>
    </div>
  );
}
