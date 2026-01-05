import React from 'react';
import { 
  Scale, 
  ShoppingBag, 
  Truck, 
  RefreshCw, 
  Ban, 
  Gavel,
  ExternalLink,
  Info
} from "lucide-react";

export default function TermsOfService() {
  const lastUpdated = "December 24, 2025";

  const summaryItems = [
    { icon: ShoppingBag, title: "Orders", desc: "You agree that all info provided is accurate." },
    { icon: Truck, title: "Shipping", desc: "Risk of loss passes to you upon delivery." },
    { icon: RefreshCw, title: "Returns", desc: "30-day window for unused gift items." },
    { icon: Ban, title: "Conduct", desc: "No fraudulent activity or site scraping." },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 font-sans">
      
      {/* ========= HERO SECTION ========= */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="p-3 bg-slate-900 rounded-2xl text-white mb-2">
            <Scale className="w-6 h-6" />
          </div>
          <h1 className="text-slate-900 text-4xl md:text-6xl font-serif tracking-tight">
            Terms of <span className="italic font-light">Service</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-[0.3em]">
            Effective Date: {lastUpdated}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        
        {/* ========= TL;DR SUMMARY GRID ========= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {summaryItems.map((item, i) => (
            <div key={i} className="bg-white/40 backdrop-blur-md border border-white p-6 rounded-[2rem] shadow-sm">
              <item.icon className="w-5 h-5 text-pink-500 mb-3" />
              <h3 className="text-slate-900 font-bold text-sm mb-1">{item.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ========= MAIN LEGAL CONTENT ========= */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-8 md:p-16">
          
          <div className="prose prose-slate max-w-none space-y-12 text-slate-600">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <Gavel className="w-5 h-5 text-slate-400" />
                1. Acceptance of Terms
              </h2>
              <p className="text-sm leading-relaxed">
                By accessing and using the <strong>Pamper Period</strong> boutique platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree, please discontinue use of our site immediately.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Account Responsibility</h2>
              <p className="text-sm leading-relaxed">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
              </p>
              <div className="mt-4 p-5 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-4 items-start">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  <strong>Pro Tip:</strong> You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Products and Pricing</h2>
              <p className="text-sm leading-relaxed">
                We reserve the right to modify or discontinue any product (or gift bundle) at any time without notice. We shall not be liable to you or to any third-party for any modification, price change, suspension, or discontinuance of the Service.
              </p>
              <ul className="mt-4 space-y-2 text-sm italic">
                <li>• All prices are in INR (₹) unless stated otherwise.</li>
                <li>• Discounts and flash sales are subject to specific timeframes.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-4">4. Intellectual Property</h2>
              <p className="text-sm leading-relaxed">
                The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Pamper Period and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Pamper Period.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Governing Law</h2>
              <p className="text-sm leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of <strong>India</strong>, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </section>

          </div>

          {/* ========= FOOTER OF DOCUMENT ========= */}
          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-slate-400">
              Questions about our Terms?
            </div>
            <div className="flex gap-4">
              <a 
                href="mailto:legal@pamperperiods.com" 
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all"
              >
                Email Legal Team
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}