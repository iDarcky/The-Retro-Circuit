import { getSystemVersion } from '../../app/actions/roadmap';

import EmailActionCard from '../../components/about/EmailActionCard';

export const metadata = {
  title: 'Privacy Policy | The Retro Circuit',
  description: 'Privacy Policy detailing data handling and user privacy practices at The Retro Circuit.',
  robots: { index: false, follow: true }
};

export default async function PrivacyPage() {
  const version = await getSystemVersion();
  return (
    <div className="bg-bg-primary min-h-screen text-text-primary font-sans selection:bg-sky-500/30 selection:text-white pb-24 relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05] pointer-events-none"></div>

      {/* 1. HERO HEADER */}
      <header className="px-6 md:px-12 pt-12 md:pt-24 pb-8 md:pb-16 border-b border-white/5 relative z-10">
        <div className="max-w-4xl mx-auto w-full">

           {/* Metadata Pill - Sky Blue Variant */}
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-900/30 bg-sky-950/10 text-[9px] md:text-xs font-mono uppercase tracking-widest text-sky-400 mb-8 animate-fade-in backdrop-blur-sm shadow-[0_0_15px_-3px_rgba(56,189,248,0.1)]">
               <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-sky-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.5)]"></div>
               Secure Protocol // v{version}
           </div>

           {/* Title */}
           <h1 className="text-4xl md:text-6xl font-pixel text-white leading-none tracking-tighter mb-8">
              PRIVACY <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-400">PROTOCOL</span><span className="text-sky-500 animate-pulse">_</span>
           </h1>

        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 space-y-16 relative z-10">

          {/* Section 1: Overview */}
          <section className="space-y-6">
             <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-sky-500 border border-sky-500/30 px-2 py-0.5 bg-sky-500/5">[ 01 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-sky-400 uppercase">Overview</h2>
            </div>
            <div className="space-y-6 text-lg text-zinc-300 font-light leading-relaxed">
              <p>
                At The Retro Circuit, we believe in transparency and data minimalism. We only collect what is strictly necessary to operate the service, and we do not sell, share, or trade your information with anyone.
              </p>
              <p>
                This policy outlines what we collect, why we collect it, and your rights as a user. By using The Retro Circuit, you agree to the practices described here.
              </p>
              <div className="pl-6 border-l-2 border-sky-500/50">
                  <p className="text-zinc-400 font-light italic">
                    Last updated: March 2026
                  </p>
              </div>
            </div>
          </section>

          {/* Section 2: What We Collect */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-sky-500 border border-sky-500/30 px-2 py-0.5 bg-sky-500/5">[ 02 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-sky-400 uppercase">What We Collect</h2>
            </div>
            <div className="space-y-10 text-lg text-zinc-300 font-light leading-relaxed">

              {/* Analytics */}
              <div className="space-y-4">
                <h3 className="text-sky-400 font-bold uppercase text-xs tracking-widest font-mono">Analytics</h3>
                <p>
                  We use <strong className="text-white font-medium">Vercel Analytics</strong> to understand how users interact with the site. Vercel Analytics is cookieless and privacy-first by design. It does not track individuals, does not store personal data, and does not require a consent banner under GDPR. No personally identifiable information is collected through analytics.
                </p>
                <div className="bg-sky-500/5 border border-sky-500/20 p-4 md:p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                      <div className="w-16 h-16 border-2 border-sky-500 rounded-full border-dashed animate-spin-slow"></div>
                  </div>
                  <p className="text-sm text-sky-400 font-mono m-0">
                    &gt; STATUS: USER_CONTROLLED — no consent required
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="space-y-4">
                <h3 className="text-sky-400 font-bold uppercase text-xs tracking-widest font-mono">Contact Form</h3>
                <p>
                  If you choose to contact us via the contact form or by email, we receive your email address and the content of your message. This information is used solely to respond to your enquiry and is never stored in a database, shared with third parties, or used for marketing.
                </p>
              </div>

              {/* Rate Limiting */}
              <div className="space-y-4">
                <h3 className="text-sky-400 font-bold uppercase text-xs tracking-widest font-mono">Rate Limiting</h3>
                <p>
                  To protect the site from automated abuse and denial of service attacks, we use <strong className="text-white font-medium">Upstash Redis</strong> for rate limiting on specific API endpoints such as search and form submissions. This temporarily stores your IP address in an ephemeral, memory-based cache for a few seconds or minutes to verify that request rates are within safe limits.
                </p>
                <p>
                  This data is completely anonymous, automatically discarded after its expiration window, and is never used for tracking, profiling, or analytics.
                </p>
                <div className="bg-sky-500/5 border border-sky-500/20 p-4 md:p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                      <div className="w-16 h-16 border-2 border-sky-500 rounded-full border-dashed animate-spin-slow"></div>
                  </div>
                  <p className="text-sm text-sky-400 font-mono m-0">
                    &gt; STATUS: ANONYMOUS — auto-discarded
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* Section 3: What We Do Not Collect */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-sky-500 border border-sky-500/30 px-2 py-0.5 bg-sky-500/5">[ 03 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-sky-400 uppercase">What We Do Not Collect</h2>
            </div>
            <div className="space-y-6 text-lg text-zinc-300 font-light leading-relaxed">
              <p>We do not collect or store:</p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-400">
                <li>User accounts or passwords</li>
                <li>Payment information</li>
                <li>Browsing history or behavioural data</li>
                <li>Device fingerprints</li>
                <li>Location data beyond approximate region for analytics</li>
              </ul>
            </div>
          </section>

          {/* Section 4: Data Storage */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-sky-500 border border-sky-500/30 px-2 py-0.5 bg-sky-500/5">[ 04 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-sky-400 uppercase">Data Storage</h2>
            </div>
            <div className="space-y-6 text-lg text-zinc-300 font-light leading-relaxed">
              <p>
                We use <strong className="text-white font-medium">Supabase</strong> as our primary database provider. All data is encrypted at rest and in transit. The Retro Circuit database contains only hardware specification data — no personal user data is stored there.
              </p>
              <p>
                We do not sell, trade, or transfer your personally identifiable information to any outside parties under any circumstances.
              </p>
            </div>
          </section>

          {/* Section 5: Third Party Services */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-sky-500 border border-sky-500/30 px-2 py-0.5 bg-sky-500/5">[ 05 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-sky-400 uppercase">Third Party Services</h2>
            </div>
            <div className="space-y-6 text-lg text-zinc-300 font-light leading-relaxed">
              <p>The Retro Circuit uses the following third-party services to operate:</p>
              <ul className="list-none space-y-3 text-zinc-400">
                <li><strong className="text-white font-medium">Vercel</strong> — hosting and analytics (<a href="https://vercel.com/legal/privacy-policy" className="text-sky-400 hover:underline" target="_blank" rel="noopener noreferrer">vercel.com/legal/privacy-policy</a>)</li>
                <li><strong className="text-white font-medium">Supabase</strong> — database infrastructure (<a href="https://supabase.com/privacy" className="text-sky-400 hover:underline" target="_blank" rel="noopener noreferrer">supabase.com/privacy</a>)</li>
                <li><strong className="text-white font-medium">Upstash</strong> — rate limiting (<a href="https://upstash.com/trust/privacy.pdf" className="text-sky-400 hover:underline" target="_blank" rel="noopener noreferrer">upstash.com/trust/privacy.pdf</a>)</li>
                <li><strong className="text-white font-medium">Zoho Mail</strong> — email communications (<a href="https://www.zoho.com/privacy.html" className="text-sky-400 hover:underline" target="_blank" rel="noopener noreferrer">zoho.com/privacy.html</a>)</li>
                <li><strong className="text-white font-medium">Resend</strong> — transactional email (<a href="https://resend.com/legal/privacy-policy" className="text-sky-400 hover:underline" target="_blank" rel="noopener noreferrer">resend.com/legal/privacy-policy</a>)</li>
              </ul>
              <p>
                Each of these providers maintains their own privacy policies. The Retro Circuit is not responsible for the practices of these third-party services beyond our use of them.
              </p>
            </div>
          </section>

          {/* Section 6: Cookies */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-sky-500 border border-sky-500/30 px-2 py-0.5 bg-sky-500/5">[ 06 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-sky-400 uppercase">Cookies</h2>
            </div>
            <div className="space-y-6 text-lg text-zinc-300 font-light leading-relaxed">
              <p>
                The Retro Circuit does not use tracking cookies. The only cookies that may be set are strictly functional — such as remembering your cookie preferences — and do not collect personal data.
              </p>
              <p>
                Non-essential cookies and analytics scripts are not loaded without your explicit consent via the cookie banner.
              </p>
              <div className="bg-sky-500/5 border border-sky-500/20 p-4 md:p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <div className="w-16 h-16 border-2 border-sky-500 rounded-full border-dashed animate-spin-slow"></div>
                </div>
                <p className="text-sm text-sky-400 font-mono m-0">
                  &gt; STATUS: USER_CONTROLLED
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: Your Rights */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-sky-500 border border-sky-500/30 px-2 py-0.5 bg-sky-500/5">[ 07 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-sky-400 uppercase">Your Rights</h2>
            </div>
            <div className="space-y-8 text-lg text-zinc-300 font-light leading-relaxed">
              <p>
                Under GDPR and other applicable privacy regulations, you have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-400">
                <li>Access any personal data we hold about you</li>
                <li>Rectify inaccurate personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Withdraw consent for data processing at any time</li>
                <li>Lodge a complaint with your local data protection authority</li>
              </ul>
              <p>
                Given that The Retro Circuit does not store personal user data, most of these rights have limited practical application. However, we take them seriously and will respond to any request promptly.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                 {/* Managing Consent */}
                 <div className="border border-white/10 bg-white/[0.02] p-6 hover:border-sky-500/30 transition-colors">
                    <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-4 font-mono">Managing Consent</h3>
                    <p className="text-sm text-zinc-400 mb-4">
                      You can reset your cookie preferences at any time via the cookie settings link in the footer.
                    </p>
                    <div className="text-xs font-mono text-sky-400">
                        ACTION: SCROLL_TO_FOOTER
                    </div>
                 </div>

                 {/* Data Requests */}
                 <div className="border border-white/10 bg-white/[0.02] p-6">
                    <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-4 font-mono">Data Requests</h3>
                    <p className="text-sm text-zinc-400 mb-4">
                      To exercise any of your data rights, contact us at: <br/>
                      <span className="text-white truncate">contact@theretrocircuit.com</span>
                    </p>
                    <p className="text-sm text-zinc-400 mb-4">
                      Subject line: DATA REQUEST <br/>
                      We will respond within 30 days.
                    </p>
                 </div>
              </div>
            </div>
          </section>

          {/* Section 8: Changes To This Policy */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-sky-500 border border-sky-500/30 px-2 py-0.5 bg-sky-500/5">[ 08 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-sky-400 uppercase">Changes To This Policy</h2>
            </div>
            <div className="space-y-6 text-lg text-zinc-300 font-light leading-relaxed">
              <p>
                We may update this policy as the site evolves. Changes will be reflected in the updated date at the top of this page. Continued use of The Retro Circuit after changes are posted constitutes acceptance of the updated policy.
              </p>
            </div>
          </section>

          {/* Section 9: Contact */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-sky-500 border border-sky-500/30 px-2 py-0.5 bg-sky-500/5">[ 09 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-sky-400 uppercase">Contact</h2>
            </div>
            <div className="space-y-6 text-lg text-zinc-300 font-light leading-relaxed">
              <p>For any privacy-related questions or requests:</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <EmailActionCard
                    hoverBorderColor="hover:border-sky-500/30"
                    hoverIconBorderColor="group-hover:border-sky-500/50"
                    hoverTextColor="group-hover:text-sky-400"
                 />
              </div>
            </div>
          </section>

      </div>
    </div>
  );
}
