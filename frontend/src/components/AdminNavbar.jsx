import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    // If you have a setUser in context, call it here: setUser(null);
    navigate("/login");
  };

  return (
    <nav className="
      w-full bg-white/70 dark:bg-gray-900/80 
      backdrop-blur-2xl border-b border-gray-100 dark:border-gray-800
      fixed top-0 left-0 z-50
      flex items-center justify-between px-8 h-20
    ">
      {/* LEFT: Branding */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-100">
          <span className="material-symbols-outlined text-2xl">
            analytics
          </span>
        </div>
        <div>
          <h1 className="text-sm font-black uppercase tracking-[0.3em] text-gray-900 dark:text-white leading-none">
            Pamper Periods
          </h1>
          <p className="text-[10px] font-bold text-pink-600 uppercase tracking-widest mt-1">
            Central Command
          </p>
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-8">
        {/* Desktop Links */}
        <Link 
          to="/" 
          className="hidden md:flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-pink-600 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">open_in_new</span>
          View Site
        </Link>

        {/* Vertical Divider */}
        <div className="hidden md:block w-[1px] h-6 bg-gray-100 dark:bg-gray-800" />

        <div className="flex items-center gap-4">
          {/* Admin Avatar/Profile Info */}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">System Admin</span>
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Superuser</span>
          </div>
          
          <div className="relative group">
            <button 
              onClick={handleLogout}
              className="group flex items-center gap-3 pl-2 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all border border-transparent hover:border-pink-100"
            >
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm group-hover:bg-pink-600 group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-lg">logout</span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 group-hover:text-pink-700">
                Exit
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}