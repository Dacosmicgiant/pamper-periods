import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, Database, Bell, UserCheck, ChevronRight } from "lucide-react";

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", title: "Introduction", icon: ShieldCheck },
    { id: "data-collection", title: "Data Collection", icon: Database },
    { id: "data-usage", title: "How We Use Data", icon: Eye },
    { id: "protection", title: "Data Protection", icon: Lock },
    { id: "your-rights", title: "Your Rights", icon: UserCheck },
    { id: "updates", title: "Policy Updates", icon: Bell },
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen pt-24 pb-20 font-sans">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-col gap-4">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Legal Documentation</div>
          <h1 className="text-slate-900 text-5xl lg:text-7xl font-serif italic tracking-tight">
            Privacy <span className="not-italic font-light text-slate-400">Policy</span>
          </h1>
          <p className="text-slate-500 max-w-2xl text-lg font-light">
            Last Updated: December 24, 2025. Your privacy is paramount. This document outlines how we protect and manage your personal information.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* STICKY NAVIGATION (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-32 h-fit">
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all text-sm font-medium ${
                  activeSection === section.id 
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-200 scale-105" 
                  : "bg-white/50 text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-100"
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* CONTENT AREA */}
        <main className="lg:col-span-9 bg-white/60 backdrop-blur-2xl rounded-[3rem] border border-white p-8 md:p-12 shadow-sm">
          
          <section id="introduction" className="mb-16 scroll-mt-32">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs">01</span>
              Introduction
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                Welcome to <strong>Pamper Periods</strong>. We are committed to protecting your personal data and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at privacy@pamperperiods.com.
              </p>
              <p>
                When you visit our website and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy notice, we describe our privacy policy.
              </p>
            </div>
          </section>

          <section id="data-collection" className="mb-16 scroll-mt-32">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs">02</span>
              Data Collection
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-3xl border border-slate-50 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2">Personal Information</h4>
                <p className="text-sm text-slate-500">Name, email address, shipping address, and phone number provided during checkout.</p>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-50 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2">Payment Data</h4>
                <p className="text-sm text-slate-500">Processed through secure encrypted gateways. We never store your full card details on our servers.</p>
              </div>
            </div>
          </section>

          <section id="data-usage" className="mb-16 scroll-mt-32">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs">03</span>
              How We Use Data
            </h2>
            <ul className="space-y-4">
              {[
                "To process and deliver your boutique gift orders.",
                "To provide personalized gift recommendations based on history.",
                "To send optional updates regarding new arrivals and sales.",
                "To improve our platform security and performance."
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-4 text-slate-600">
                  <ChevronRight className="w-4 h-4 text-pink-500" />
                  <span className="text-sm">{text}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="protection" className="mb-16 scroll-mt-32">
            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white overflow-hidden relative group">
              <Lock className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 rotate-12 transition-transform group-hover:scale-110" />
              <h2 className="text-2xl font-bold mb-4 relative z-10 italic">Data Protection</h2>
              <p className="text-slate-400 text-sm leading-relaxed relative z-10 max-w-xl">
                We implement a variety of security measures to maintain the safety of your personal information. We use 256-bit SSL encryption for all data transfers and conduct regular security audits of our internal infrastructure.
              </p>
            </div>
          </section>

          <section id="your-rights" className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs">05</span>
              Your Rights
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              You have the right to access, rectify, or erase your personal data at any time. If you wish to exercise these rights, please follow the steps below:
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-900 hover:bg-slate-50 transition-all">Request Data Export</button>
              <button className="px-6 py-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold uppercase tracking-widest text-rose-600 hover:bg-rose-100 transition-all">Delete Account</button>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}