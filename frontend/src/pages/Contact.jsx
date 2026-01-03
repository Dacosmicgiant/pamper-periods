// import React from "react";



// export default function Contact() {
//   return (
//     <div className="min-h-screen bg-background-light dark:bg-background-dark pt-24 font-display">

//       {/* ========= PAGE TITLE ========= */}
//       <div className="flex flex-col items-center text-center gap-3 px-4">
//         <p className="text-gray-900 dark:text-black text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.03em]">
//           How can we help?
//         </p>
//         <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm sm:text-base">
//           Fill out the form below and we'll respond within 24 hours.  
//           Or visit the FAQ section for quick answers.
//         </p>
//       </div>

//       <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 mt-12 px-4 sm:px-6">

//         {/* ========= LEFT FORM ========= */}
//         <div className="lg:col-span-2 bg-white dark:bg-background-dark p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-white/10">
//           <h2 className="text-gray-900 dark:text-black text-xl sm:text-2xl font-bold pb-6">
//             Send us a message
//           </h2>

//           <form className="flex flex-col gap-6">

//             {/* Name + Email */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//               <label className="flex flex-col">
//                 <p className="text-gray-900 dark:text-black pb-2 font-medium text-sm sm:text-base">Your Name</p>
//                 <input
//                   type="text"
//                   placeholder="Enter your full name"
//                   className="h-12 p-3 rounded-lg bg-transparent border border-gray-300 dark:border-white/20 text-gray-900 dark:text-black focus:ring-2 focus:ring-primary/50 outline-none"
//                 />
//               </label>

//               <label className="flex flex-col">
//                 <p className="text-gray-900 dark:text-black pb-2 font-medium text-sm sm:text-base">Email Address</p>
//                 <input
//                   type="email"
//                   placeholder="you@example.com"
//                   className="h-12 p-3 rounded-lg bg-transparent border border-gray-300 dark:border-white/20 text-gray-900 dark:text-black focus:ring-2 focus:ring-primary/50 outline-none"
//                 />
//               </label>
//             </div>

//             {/* Select */}
//             <label className="flex flex-col">
//               <p className="text-gray-900 dark:text-black pb-2 font-medium text-sm sm:text-base">Reason for Contact</p>
//               <select className="h-12 p-3 rounded-lg bg-transparent border border-gray-300 dark:border-white/20 text-gray-900 dark:text-black focus:ring-2 focus:ring-primary/50 outline-none">
//                 <option>Order Inquiry</option>
//                 <option>Technical Support</option>
//                 <option>Vendor Question</option>
//                 <option>Billing Issue</option>
//                 <option>General Feedback</option>
//               </select>
//             </label>

//             {/* Message */}
//             <label className="flex flex-col">
//               <p className="text-gray-900 dark:text-black pb-2 font-medium text-sm sm:text-base">Message</p>
//               <textarea
//                 placeholder="Tell us how we can help..."
//                 className="min-h-[140px] p-3 rounded-lg bg-transparent border border-gray-300 dark:border-white/20 text-gray-900 dark:text-black focus:ring-2 focus:ring-primary/50 outline-none"
//               ></textarea>
//             </label>

//             <button
//               type="submit"
//               className="h-12 px-6 rounded-lg bg-primary text-black font-bold hover:bg-primary/90"
//             >
//               Send Message
//             </button>
//           </form>
//         </div>

//         {/* ========= CONTACT DETAILS ========= */}
//         <div className="space-y-8">

//           {/* Contact Cards */}
//           <div className="bg-white dark:bg-background-dark p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-white/10">
//             <h3 className="text-gray-900 dark:text-black text-lg font-bold pb-4">
//               Other ways to reach us
//             </h3>

//             <div className="space-y-4">

//               {/* Email */}
//               <div className="flex items-start gap-3">
//                 <span className="material-symbols-outlined text-primary mt-1">mail</span>
//                 <div>
//                   <p className="text-gray-900 dark:text-black font-medium">Email</p>
//                   <a href="mailto:support@premiumstore.com" className="text-gray-500 dark:text-gray-400 text-sm hover:text-primary break-all">
//                     support@premiumstore.com
//                   </a>
//                 </div>
//               </div>

//               {/* Phone */}
//               <div className="flex items-start gap-3">
//                 <span className="material-symbols-outlined text-primary mt-1">call</span>
//                 <div>
//                   <p className="text-gray-900 dark:text-black font-medium">Phone</p>
//                   <p className="text-gray-500 dark:text-gray-400 text-sm">+1 (555) 123-4567</p>
//                   <p className="text-gray-400 dark:text-gray-500 text-xs">Mon–Fri, 9am–5pm EST</p>
//                 </div>
//               </div>

//             </div>
//           </div>

//           {/* Social */}
//           <div className="bg-white dark:bg-background-dark p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-white/10">
//             <h3 className="text-gray-900 dark:text-black text-lg font-bold pb-4">
//               Follow Us
//             </h3>

//             <div className="flex gap-4">
//               <div className="size-10 rounded-full bg-gray-100 dark:bg-white/10" />
//               <div className="size-10 rounded-full bg-gray-100 dark:bg-white/10" />
//               <div className="size-10 rounded-full bg-gray-100 dark:bg-white/10" />
//             </div>
//           </div>

//         </div>
//       </div>

//       {/* ========= FAQ ========= */}
//       <div className="mt-20 px-4 sm:px-6 lg:px-8">
//         <h2 className="text-gray-900 dark:text-black text-2xl sm:text-3xl font-bold text-center">
//           Frequently Asked Questions
//         </h2>

//         <div className="max-w-3xl mx-auto mt-8 space-y-4">

//           <details className="group bg-white dark:bg-background-dark p-6 rounded-xl border border-gray-200 dark:border-white/10">
//             <summary className="flex justify-between items-center font-semibold text-gray-900 dark:text-black cursor-pointer">
//               How do I track my order?
//               <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
//             </summary>
//             <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm sm:text-base">
//               You will receive a tracking number once your order ships. You can also check your order history.
//             </p>
//           </details>

//           <details className="group bg-white dark:bg-background-dark p-6 rounded-xl border border-gray-200 dark:border:white/10">
//             <summary className="flex justify-between items-center font-semibold text-gray-900 dark:text:white cursor-pointer">
//               What is your return policy?
//               <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
//             </summary>
//             <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm sm:text-base">
//               We offer 30-day returns on most items. Items must be unused and in original packaging.
//             </p>
//           </details>

//           <details className="group bg-white dark:bg-background-dark p-6 rounded-xl border border-gray-200 dark:border:white/10">
//             <summary className="flex justify-between items-center font-semibold text-gray-900 dark:text:white cursor-pointer">
//               How do I contact a vendor?
//               <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
//             </summary>
//             <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm sm:text-base">
//               Go to the vendor's store from any product page and click “Contact Vendor”.
//             </p>
//           </details>

//         </div>
//       </div>

//       <div className="h-20"></div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { Mail, Phone, Instagram, Facebook, Twitter, ChevronDown, Send } from "lucide-react";

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', reason: 'Order Inquiry', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const primaryColor = 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200';

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      alert("Message received! We'll get back to you shortly.");
      setIsSubmitting(false);
      setFormState({ name: '', email: '', reason: 'Order Inquiry', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-24 font-sans pb-20">

      {/* ========= PAGE TITLE ========= */}
      <div className="flex flex-col items-center text-center gap-4 px-4">
        <div className="h-1.5 w-12 bg-slate-900 rounded-full mb-2" />
        <h1 className="text-slate-900 text-4xl sm:text-5xl lg:text-6xl font-serif font-light tracking-tight">
          How can we <span className="italic font-normal">help?</span>
        </h1>
        <p className="text-slate-600 max-w-xl text-base font-light leading-relaxed">
          Whether you have a question about an order or just want to say hello, 
          our team is here to assist you.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16 px-6">

        {/* ========= LEFT FORM - Glassmorphism style ========= */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-2xl p-8 sm:p-10 rounded-[3rem] border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
          <h2 className="text-slate-900 text-2xl font-bold mb-8 tracking-tight flex items-center gap-3">
            Send a message
            <div className="h-px flex-1 bg-slate-100" />
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Your Name</span>
                <input
                  required
                  type="text"
                  placeholder="Full name"
                  value={formState.name}
                  onChange={(e) => setFormState({...formState, name: e.target.value})}
                  className="h-14 px-5 rounded-2xl bg-white border border-slate-100 shadow-sm text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all placeholder-slate-300"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</span>
                <input
                  required
                  type="email"
                  placeholder="you@example.com"
                  value={formState.email}
                  onChange={(e) => setFormState({...formState, email: e.target.value})}
                  className="h-14 px-5 rounded-2xl bg-white border border-slate-100 shadow-sm text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all placeholder-slate-300"
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 relative">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Reason for contact</span>
              <select 
                value={formState.reason}
                onChange={(e) => setFormState({...formState, reason: e.target.value})}
                className="h-14 px-5 rounded-2xl bg-white border border-slate-100 shadow-sm text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all appearance-none cursor-pointer"
              >
                <option>Order Inquiry</option>
                <option>Technical Support</option>
                <option>Vendor Question</option>
                <option>General Feedback</option>
              </select>
              <ChevronDown className="absolute right-5 bottom-4 w-4 h-4 text-slate-400 pointer-events-none" />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Message</span>
              <textarea
                required
                placeholder="Tell us how we can help..."
                value={formState.message}
                onChange={(e) => setFormState({...formState, message: e.target.value})}
                className="min-h-[160px] p-5 rounded-3xl bg-white border border-slate-100 shadow-sm text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all placeholder-slate-300 resize-none"
              ></textarea>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`h-14 px-8 mt-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 ${primaryColor}`}
            >
              {isSubmitting ? "Sending..." : (
                <>
                  Send Message
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* ========= CONTACT DETAILS ========= */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            
            <h3 className="text-xl font-bold mb-6 italic relative z-10">Direct Contact</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-2xl text-white">
                    <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Email Us</p>
                  <a href="mailto:support@pamperperiods.com" className="text-sm hover:text-pink-300 transition-colors">support@pamperperiods.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-2xl text-white">
                    <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Call Us</p>
                  <p className="text-sm">+91 98765 43210</p>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Mon–Fri, 10am–6pm</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/60">
            <h3 className="text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Join our community</h3>
            <div className="flex gap-3">
              {[
                { icon: Instagram, link: "#" },
                { icon: Facebook, link: "#" },
                { icon: Twitter, link: "#" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.link}
                  className="w-12 h-12 rounded-2xl bg-white shadow-sm hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center border border-slate-100"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========= FAQ ========= */}
      <div className="mt-28 max-w-4xl mx-auto px-6">
        <div className="flex flex-col items-center mb-12">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Concierge</div>
            <h2 className="text-slate-900 text-3xl font-serif text-center italic">
                Frequently asked <span className="not-italic">questions</span>
            </h2>
        </div>

        <div className="space-y-4">
          {[
            { q: "How do I track my order?", a: "Once your order is processed, you'll receive a shipping confirmation email with a unique tracking link." },
            { q: "What is your return policy?", a: "We accept returns for unused items in original packaging within 30 days of delivery. Custom gift bundles are final sale." },
            { q: "Do you ship internationally?", a: "Currently, we offer shipping across pan-India. International shipping is coming soon!" }
          ].map((item, idx) => (
            <details key={idx} className="group bg-white/50 backdrop-blur-sm rounded-3xl border border-white/80 overflow-hidden shadow-sm transition-all hover:bg-white/80">
              <summary className="flex justify-between items-center p-6 font-bold text-slate-900 cursor-pointer list-none select-none">
                <span className="text-sm tracking-tight">{item.q}</span>
                <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180 text-slate-400" />
              </summary>
              <div className="px-6 pb-6 text-slate-500 text-sm leading-relaxed border-t border-slate-50/50 pt-4">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}