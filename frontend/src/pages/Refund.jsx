import React from 'react';
import { 
  RotateCcw, 
  PackageCheck, 
  CreditCard, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  Ban
} from "lucide-react";

export default function RefundPolicy() {
  const steps = [
    { icon: RotateCcw, label: "Request", desc: "Initiate via portal" },
    { icon: PackageCheck, label: "Inspection", desc: "Quality check" },
    { icon: CheckCircle2, label: "Approval", desc: "Confirmation email" },
    { icon: CreditCard, label: "Refund", desc: "3-5 business days" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 font-sans">
      
      {/* ========= HEADER ========= */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 text-pink-600 text-xs font-bold uppercase tracking-widest mb-6">
          <RotateCcw className="w-3 h-3" />
          Returns & Exchanges
        </div>
        <h1 className="text-slate-900 text-5xl md:text-7xl font-serif tracking-tight mb-4">
          Refund <span className="italic font-light">Policy</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg font-light">
          We want you to love your gift. If something isn't right, we're here to make it better with our 30-day return window.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        
        {/* ========= REFUND TIMELINE ========= */}
        <div className="relative mb-20 px-4">
          <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100 -z-10 hidden md:block" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-4 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                  <step.icon className="w-6 h-6" />
                </div>
                <h4 className="text-slate-900 font-bold text-sm mb-1">{step.label}</h4>
                <p className="text-slate-500 text-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* ========= MAIN CONTENT ========= */}
          <div className="lg:col-span-2 space-y-12">
            
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Eligibility for Returns</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                To be eligible for a return, your item must be in the same condition that you received it: unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 bg-white border border-slate-100 rounded-3xl">
                  <Clock className="w-5 h-5 text-pink-500 mb-2" />
                  <h5 className="font-bold text-sm mb-1">30-Day Window</h5>
                  <p className="text-xs text-slate-500">You have 30 days from the delivery date to request a return.</p>
                </div>
                <div className="p-5 bg-white border border-slate-100 rounded-3xl">
                  <Ban className="w-5 h-5 text-pink-500 mb-2" />
                  <h5 className="font-bold text-sm mb-1">Non-Returnable</h5>
                  <p className="text-xs text-slate-500">Customized gift boxes and perishable items cannot be returned.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Damages and Issues</h2>
              <p className="text-slate-600 leading-relaxed">
                Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.
              </p>
            </section>

            <section className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-pink-400 shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Exchanges</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.
                  </p>
                </div>
              </div>
            </section>

          </div>

          {/* ========= SIDEBAR / INFO ========= */}
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-sm">
              <HelpCircle className="w-6 h-6 text-slate-900 mb-4" />
              <h3 className="font-bold text-lg mb-2">Need help?</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Our support team is available Mon-Fri to help with your return queries.
              </p>
              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all mb-3">
                Start Return Request
              </button>
              <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest font-black">
                Response within 24 hours
              </p>
            </div>

            <div className="p-8 rounded-[2.5rem] border border-dashed border-slate-200">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Important Note</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Refunds will be issued to the original payment method. Depending on your bank, it may take an additional 5-10 business days for the credit to post to your account.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}