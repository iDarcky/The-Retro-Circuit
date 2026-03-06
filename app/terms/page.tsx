import { siteConfig } from '../../config/site';

import EmailActionCard from '../../components/about/EmailActionCard';

export const metadata = {
  title: 'Terms of Service | The Retro Circuit',
  description: 'Terms of Service and usage conditions for The Retro Circuit database.',
  robots: { index: false, follow: true }
};

export default function TermsPage() {
  return (
    <div className="bg-bg-primary min-h-screen text-text-primary font-sans selection:bg-rose-500/30 selection:text-white pb-24 relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05] pointer-events-none"></div>

      {/* 1. HERO HEADER */}
      <header className="px-6 md:px-12 pt-12 md:pt-24 pb-8 md:pb-16 border-b border-white/5 relative z-10">
        <div className="max-w-4xl mx-auto w-full">

           {/* Metadata Pill - Rose Variant */}
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-900/30 bg-rose-950/10 text-[9px] md:text-xs font-mono uppercase tracking-widest text-rose-400 mb-8 animate-fade-in backdrop-blur-sm shadow-[0_0_15px_-3px_rgba(244,63,94,0.1)]">
               <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
               System Online // Status: BINDING // Est: {siteConfig.est}
           </div>

           {/* Title */}
           <h1 className="text-4xl md:text-6xl font-pixel text-white leading-none tracking-tighter mb-8">
              TERMS OF <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-400">SERVICE</span><span className="text-rose-500 animate-pulse">_</span>
           </h1>

        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 space-y-16 relative z-10">

          {/* [ 01 ] ACCEPTANCE */}
          <section className="space-y-6">
             <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-rose-500 border border-rose-500/30 px-2 py-0.5 bg-rose-500/5">[ 01 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-rose-400 uppercase">Acceptance</h2>
            </div>
            <div className="space-y-6 text-lg text-zinc-300 font-light leading-relaxed">
              <p>
                By accessing or using The Retro Circuit, you agree to be bound by these Terms of Service and all applicable laws and regulations.
              </p>
              <div className="pl-6 border-l-2 border-rose-500/50">
                  <p className="text-zinc-400 font-light italic">
                    If you do not agree with any of these terms, you are prohibited from using or accessing this site. Access to this database is a privilege, not a right.
                  </p>
              </div>
              <p>
                These terms apply to all visitors, users, and anyone else who accesses The Retro Circuit.
              </p>
              <p className="text-sm font-mono text-zinc-500">
                Last updated: March 2026
              </p>
            </div>
          </section>

          {/* [ 02 ] AFFILIATE DISCLOSURE */}
          <section className="space-y-6">
             <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-rose-500 border border-rose-500/30 px-2 py-0.5 bg-rose-500/5">[ 02 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-rose-400 uppercase">Affiliate Disclosure</h2>
            </div>
            <div className="space-y-6 text-lg text-zinc-300 font-light leading-relaxed">
              <p>
                The Retro Circuit participates in the Amazon Associates Programme, an affiliate advertising programme designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. When you click an Amazon link and make a purchase, we may earn a small commission at no additional cost to you.
              </p>
            </div>
          </section>

          {/* [ 03 ] ACCURACY DISCLAIMER */}
          <section className="space-y-6">
             <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-rose-500 border border-rose-500/30 px-2 py-0.5 bg-rose-500/5">[ 03 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-rose-400 uppercase">Accuracy Disclaimer</h2>
            </div>
            <div className="space-y-6 text-lg text-zinc-300 font-light leading-relaxed">
              <p>
                The Retro Circuit provides hardware specification data for informational purposes only.
              </p>

              <div className="space-y-2">
                <h3 className="text-white font-bold tracking-tight uppercase text-sm">No Guarantee of Accuracy</h3>
                <p className="text-zinc-400 text-base">
                  While we make every effort to ensure specifications are correct and up to date, we make no guarantees about the accuracy, completeness, or timeliness of any information listed on this site. Hardware specifications can change without notice, and manufacturers may release updates, revisions, or variants that have not yet been catalogued.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-white font-bold tracking-tight uppercase text-sm">Purchase Decisions</h3>
                <p className="text-zinc-400 text-base">
                  Always verify critical specifications directly with the manufacturer or retailer before making a purchase decision. The Retro Circuit accepts no responsibility for decisions made based on information found on this site.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-white font-bold tracking-tight uppercase text-sm">Pre-Alpha Status</h3>
                <p className="text-zinc-400 text-base">
                  The Retro Circuit is currently in Pre-Alpha. Data may be incomplete, features may change, and information may be updated or corrected at any time without prior notice.
                </p>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-zinc-500 border border-zinc-800 px-3 py-1 bg-zinc-900/50">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                STATUS: DATA_INFORMATIONAL_ONLY
              </div>
            </div>
          </section>

          {/* [ 04 ] PROHIBITED CONDUCT */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-rose-500 border border-rose-500/30 px-2 py-0.5 bg-rose-500/5">[ 04 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-rose-400 uppercase">Prohibited Conduct</h2>
            </div>
            <div className="space-y-8">
              <p className="text-lg text-zinc-300 font-light leading-relaxed">
                To maintain the integrity of our data ecosystem, the following actions are strictly forbidden.
              </p>

              {/* Automated Access - Critical Alert Box */}
              <div className="bg-rose-500/5 border border-rose-500/30 p-6 md:p-8 relative overflow-hidden group">
                 {/* Decorative background element */}
                <div className="absolute -top-6 -right-6 opacity-10 rotate-12">
                     <svg className="w-32 h-32 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 bg-rose-500 animate-pulse"></div>
                    <h3 className="text-rose-400 font-bold uppercase text-xs tracking-widest font-mono">Automated Access</h3>
                </div>

                <div className="h-px w-full bg-rose-500/20 mb-4"></div>

                <p className="text-sm text-rose-200 mb-4 font-mono leading-relaxed relative z-10">
                   Automated scraping, data harvesting, bulk export, or any form of automated access to The Retro Circuit&apos;s database structure is <strong className="text-rose-500 bg-rose-950/30 px-1 border border-rose-500/30">STRICTLY PROHIBITED</strong> without prior written permission.
                </p>
                <p className="text-xs text-rose-500/70 font-mono">
                  &gt; VIOLATION_RESPONSE: IP_BAN_IMMEDIATE
                </p>
              </div>

              {/* Unauthorised Redistribution */}
              <div className="space-y-2">
                <h3 className="text-white font-bold tracking-tight uppercase text-sm">Unauthorised Redistribution</h3>
                <p className="text-zinc-400 text-base leading-relaxed font-light">
                  Reproducing, redistributing, or republishing The Retro Circuit&apos;s data aggregations, database structure, or compiled specifications in any form — commercial or otherwise — without explicit written permission is prohibited.
                </p>
              </div>

              {/* Interference */}
              <div className="space-y-2">
                <h3 className="text-white font-bold tracking-tight uppercase text-sm">Interference</h3>
                <p className="text-zinc-400 text-base leading-relaxed font-light">
                  Attempting to interfere with, disrupt, or compromise the integrity or security of the site, its infrastructure, or its data is strictly prohibited.
                </p>
              </div>

            </div>
          </section>

          {/* [ 05 ] OWNERSHIP */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-rose-500 border border-rose-500/30 px-2 py-0.5 bg-rose-500/5">[ 05 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-rose-400 uppercase">Ownership</h2>
            </div>

            <div className="space-y-8">
               {/* Content Rights Box */}
               <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden hover:bg-white/[0.04] transition-colors">
                  {/* IP Icon */}
                  <div className="w-20 h-20 bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0">
                      <span className="font-pixel text-xl text-zinc-700">IP</span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-4 relative z-10">
                      <div>
                          <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg text-white font-bold tracking-tight uppercase">Content Rights</h3>
                              <span className="font-mono text-xs text-rose-500 border border-rose-500/30 bg-rose-500/5 px-2 py-0.5">PROTECTED</span>
                          </div>
                          <div className="h-px w-full bg-white/10 mb-4"></div>
                          <p className="font-light text-zinc-400 leading-relaxed text-sm">
                              The materials contained on this site — including the architecture, code, design system, curation methodology, and specific data aggregations — are protected by applicable copyright and trademark law. The Retro Circuit&apos;s unique compilation and presentation of hardware data is proprietary.
                          </p>
                      </div>

                      <div className="font-mono text-xs text-zinc-500 flex items-center gap-2">
                           <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                           STATUS: ALL_RIGHTS_RESERVED
                      </div>
                  </div>
              </div>

              {/* Hardware Data */}
              <div className="space-y-2">
                <h3 className="text-white font-bold tracking-tight uppercase text-sm">Hardware Data</h3>
                <p className="text-zinc-400 text-base leading-relaxed font-light">
                  Individual hardware specifications are factual information and are not claimed as proprietary. The specific compilation, structure, variant model, and curation of this data is the intellectual property of The Retro Circuit.
                </p>
              </div>

              {/* User Content */}
              <div className="space-y-2">
                <h3 className="text-white font-bold tracking-tight uppercase text-sm">User Content</h3>
                <p className="text-zinc-400 text-base leading-relaxed font-light">
                  By submitting any content or information to The Retro Circuit — including via the contact form — you grant us a non-exclusive right to use that information to improve the service.
                </p>
              </div>

            </div>
          </section>

          {/* [ 06 ] LIMITATION OF LIABILITY */}
          <section className="space-y-6">
             <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-rose-500 border border-rose-500/30 px-2 py-0.5 bg-rose-500/5">[ 06 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-rose-400 uppercase">Limitation of Liability</h2>
            </div>
            <div className="space-y-6 text-lg text-zinc-300 font-light leading-relaxed">
              <p>
                To the fullest extent permitted by applicable law, The Retro Circuit and its operator shall not be liable for:
              </p>

              <ul className="list-disc list-inside space-y-2 text-zinc-400 text-base ml-4">
                <li>Any inaccuracies in hardware specifications</li>
                <li>Any decisions made based on information found on this site</li>
                <li>Any direct, indirect, incidental, or consequential damages arising from your use of the site</li>
                <li>Any temporary unavailability of the service, particularly during this Pre-Alpha phase</li>
              </ul>

              <p className="text-base text-zinc-400 pt-4">
                The Retro Circuit is operated by a single individual as a personal project. It is not a commercial entity and does not provide warranties of any kind, express or implied.
              </p>
            </div>
          </section>

          {/* [ 07 ] EXTERNAL LINKS */}
          <section className="space-y-6">
             <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-rose-500 border border-rose-500/30 px-2 py-0.5 bg-rose-500/5">[ 07 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-rose-400 uppercase">External Links</h2>
            </div>
            <div className="space-y-6 text-lg text-zinc-300 font-light leading-relaxed">
              <p>
                The Retro Circuit may link to third-party websites including manufacturer pages, retailer listings, and community resources.
              </p>
              <p className="text-zinc-400 text-base">
                We are not responsible for the content, accuracy, or practices of any external sites. Links do not constitute endorsement.
              </p>
            </div>
          </section>

          {/* [ 08 ] CHANGES TO THESE TERMS */}
          <section className="space-y-6">
             <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-rose-500 border border-rose-500/30 px-2 py-0.5 bg-rose-500/5">[ 08 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-rose-400 uppercase">Changes to Terms</h2>
            </div>
            <div className="space-y-6 text-lg text-zinc-300 font-light leading-relaxed">
              <p>
                We reserve the right to update these Terms of Service at any time. Changes will be reflected in the updated date at the top of this page.
              </p>
              <p className="text-zinc-400 text-base">
                Continued use of The Retro Circuit after changes are posted constitutes acceptance of the updated terms.
              </p>
            </div>
          </section>

          {/* [ 09 ] GOVERNING LAW */}
          <section className="space-y-6">
             <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-rose-500 border border-rose-500/30 px-2 py-0.5 bg-rose-500/5">[ 09 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-rose-400 uppercase">Governing Law</h2>
            </div>
            <div className="space-y-6 text-lg text-zinc-300 font-light leading-relaxed">
              <p>
                These Terms of Service are governed by the laws of Romania and applicable European Union regulations, without regard to conflict of law principles.
              </p>
            </div>
          </section>

          {/* [ 10 ] CONTACT */}
          <section className="space-y-6">
             <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-rose-500 border border-rose-500/30 px-2 py-0.5 bg-rose-500/5">[ 10 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-rose-400 uppercase">Contact</h2>
            </div>
            <div className="space-y-6 text-lg text-zinc-300 font-light leading-relaxed">
              <p>
                For any questions regarding these terms:
              </p>
              <div className="pt-2">
                 <EmailActionCard
                    hoverBorderColor="hover:border-rose-500/30"
                    hoverIconBorderColor="group-hover:border-rose-500/50"
                    hoverTextColor="group-hover:text-rose-400"
                 />
              </div>
            </div>
          </section>

      </div>
    </div>
  );
}
