import React from "react";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-black font-sans selection:bg-pink-100 selection:text-pink-600">
      
      {/* NAVBAR - Fixed at the top with a heavy blur */}
      <div className="fixed top-0 w-full z-50">
        <AdminNavbar />
      </div>

      <div className="flex pt-28 pb-10 px-4 sm:px-6 lg:px-8 gap-8 max-w-[1600px] mx-auto">
        
        {/* SIDEBAR - Hidden on mobile, visible on desktop */}
        <aside className="hidden lg:block w-72 sticky top-28 h-[calc(100vh-140px)]">
           <div className="h-full bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <AdminSidebar />
           </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname} // Triggers animation on route change
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* The "Canvas" for your dashboard items */}
              <div className="relative">
                {children}
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Footer inside the layout */}
          <footer className="mt-20 pb-10 px-4 text-center">
            <div className="h-[1px] w-20 bg-gray-200 mx-auto mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
              Powered by Pamper Periods Admin Engine
            </p>
          </footer>
        </main>
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 right-0 -z-10 w-1/2 h-1/2 bg-pink-50/50 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-1/2 h-1/2 bg-purple-50/50 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}