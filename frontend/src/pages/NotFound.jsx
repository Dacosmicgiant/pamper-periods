import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-200/40 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100/30 rounded-full blur-[120px] -z-10" />

      <div className="text-center max-w-lg">
        {/* Animated 404 Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-[120px] sm:text-[150px] font-serif leading-none text-slate-900 opacity-10 select-none">
            404
          </h1>
          
          <div className="relative -mt-16 sm:-mt-20">
            <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 mb-4">
              Lost in <span className="italic">Luxury?</span>
            </h2>
            <p className="text-slate-500 font-light leading-relaxed mb-10">
              It seems the page you are looking for has been moved or doesn't exist. 
              Let's get you back to finding the perfect gift.
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link 
            to="/" 
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-pink-600 transition-all hover:scale-105 active:scale-95"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white text-slate-900 font-bold text-sm uppercase tracking-widest hover:bg-white transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous Page
          </button>
        </motion.div>

        {/* Subtle Footer Suggestion */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
          className="mt-16 text-[10px] uppercase tracking-[0.4em] text-slate-400 font-black"
        >
          Premium Gifting Co.
        </motion.p>
      </div>
    </div>
  );
}