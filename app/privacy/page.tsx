import { siteConfig } from '../../config/site';

export const metadata = {
  title: 'Privacy Protocol | The Retro Circuit',
  description: 'Privacy policy and data handling protocols.',
};

export default function PrivacyPage() {
  return (
    <div className="w-full min-h-screen bg-bg-primary text-text-primary font-sans pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <header className="mb-20 border-b border-white/10 pb-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white uppercase">
              Privacy<br/>Protocol
            </h1>
            <div className="flex items-center gap-4 text-xs font-mono text-gray-500 uppercase tracking-widest mt-2">
              <span>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              <span>//</span>
              <span>v{siteConfig.version}</span>
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <div className="space-y-16">

          {/* Section 1: Overview */}
          <section className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
            <h2 className="text-sm font-mono text-gray-500 uppercase tracking-widest pt-1">
              01 // Overview
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                At The Retro Circuit, we believe in transparency and data minimalism. We only collect data that is strictly necessary for the operation of our service or to improve the user experience, and only with your explicit consent.
              </p>
              <p>
                This policy outlines our practices regarding data collection, storage, and your rights as a user. By using our services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </div>
          </section>

          {/* Section 2: Cookies & Analytics */}
          <section className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
            <h2 className="text-sm font-mono text-gray-500 uppercase tracking-widest pt-1">
              02 // Cookies & Analytics
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                We use <strong className="text-white">Vercel Analytics</strong> to understand how users interact with our website. This helps us identify performance bottlenecks and improve content relevance.
              </p>
              <div className="bg-white/5 border border-white/10 p-6 rounded-sm">
                <h3 className="text-white font-bold mb-2 uppercase text-sm tracking-wide">Strict Consent Policy</h3>
                <p className="text-sm text-gray-400 mb-4">
                  By default, all non-essential cookies and analytics scripts are <strong className="text-white">blocked</strong>. We do not track your activity until you explicitly click &quot;Accept&quot; on our cookie banner.
                </p>
                <p className="text-sm text-gray-400">
                  You have the right to withdraw your consent at any time.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Data Storage */}
          <section className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
            <h2 className="text-sm font-mono text-gray-500 uppercase tracking-widest pt-1">
              03 // Data Storage
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                We utilize <strong className="text-white">Supabase</strong> as our primary database provider. All data is encrypted at rest and in transit. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties.
              </p>
            </div>
          </section>

          {/* Section 4: Your Rights */}
          <section className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
            <h2 className="text-sm font-mono text-gray-500 uppercase tracking-widest pt-1">
              04 // Your Rights
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                Under GDPR and other privacy regulations, you have the right to access, rectify, or erase your personal data. You also have the right to withdraw consent for data processing.
              </p>

              <div className="space-y-4">
                <h3 className="text-white font-bold uppercase text-sm tracking-wide">Managing Consent</h3>
                <p>
                  You can reset your cookie preferences at any time by clicking the <strong className="text-white">Cookie Settings</strong> link located in the footer of every page. This will re-open the consent banner, allowing you to opt-out of analytics.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-white font-bold uppercase text-sm tracking-wide">Contact Us</h3>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at:
                  <br />
                  <a href="mailto:contact@theretrocircuit.com" className="text-white hover:text-violet-400 transition-colors border-b border-white/20 pb-0.5 hover:border-violet-400">
                    contact@theretrocircuit.com
                  </a>
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
