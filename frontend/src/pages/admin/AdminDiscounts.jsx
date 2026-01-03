import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import API from "../../api/api";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDiscounts() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [discount, setDiscount] = useState({
    title: "",
    percentage: "",
    active: false,
    expiresAt: "",
  });

  /* ================================
           LOAD FLASH SALE
  =================================*/
  useEffect(() => {
    const loadSale = async () => {
      try {
        const { data } = await API.get("/flash-sale");
        if (data) {
          setDiscount({
            title: data.title || "",
            percentage: data.percentage || "",
            active: data.active || false,
            expiresAt: data.expiresAt ? data.expiresAt.slice(0, 16) : "",
          });
        }
      } catch (err) {
        console.error("Flash sale load failed:", err);
      }
      setLoading(false);
    };

    loadSale();
  }, []);

  /* ================================
           SAVE FLASH SALE
  =================================*/
  const saveSale = async () => {
    setSaving(true);
    try {
      await API.put("/flash-sale", discount);
      alert("Flash sale updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update sale");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
          <p className="text-lg font-bold text-gray-600 dark:text-gray-400 animate-pulse">
            Fetching campaign data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-gray-950 font-display">
      <AdminSidebar />

      <div className="flex-1 px-6 py-24 lg:px-12 max-w-6xl mx-auto">
        {/* Header Area */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 dark:bg-pink-900/30 text-pink-600">
              <span className="material-symbols-outlined">bolt</span>
            </span>
            <h2 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
              Flash <span className="text-pink-600">Sale</span>
            </h2>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl font-medium">
            Deploy global, store-wide discounts instantly. These settings override individual product pricing when active.
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Configuration Form */}
          <motion.div
            className="xl:col-span-2 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-none p-8 lg:p-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="space-y-8">
              {/* Campaign Title */}
              <div className="group">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1 mb-2 block">
                  Campaign Headline
                </label>
                <input
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-pink-500 focus:bg-white dark:focus:bg-gray-800 transition-all outline-none text-lg font-bold text-gray-900 dark:text-white placeholder:text-gray-300"
                  placeholder="e.g. SUMMER REVELRY 2025"
                  value={discount.title}
                  onChange={(e) => setDiscount({ ...discount, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Discount Percentage */}
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1 mb-2 block">
                    Discount Strength
                  </label>
                  <div className="relative group">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-pink-500 focus:bg-white dark:focus:bg-gray-800 transition-all outline-none text-2xl font-black text-pink-600"
                      value={discount.percentage}
                      onChange={(e) => setDiscount({ ...discount, percentage: e.target.value })}
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xl font-black text-gray-400 group-focus-within:text-pink-500 transition-colors">
                      %
                    </span>
                  </div>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1 mb-2 block">
                    Auto-Termination
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-pink-500 focus:bg-white dark:focus:bg-gray-800 transition-all outline-none font-bold text-gray-700 dark:text-gray-200"
                    value={discount.expiresAt}
                    onChange={(e) => setDiscount({ ...discount, expiresAt: e.target.value })}
                  />
                </div>
              </div>

              {/* Status Switcher */}
              <div className={`p-6 rounded-[2rem] border-2 transition-all duration-500 ${discount.active ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/20' : 'bg-gray-50 border-gray-100 dark:bg-gray-800/30 dark:border-gray-800'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${discount.active ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                      <span className="material-symbols-outlined">{discount.active ? 'visibility' : 'visibility_off'}</span>
                    </div>
                    <div>
                      <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight">Active Status</p>
                      <p className="text-sm text-gray-500 font-medium">Toggle visibility on the storefront</p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer scale-110">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={discount.active}
                      onChange={(e) => setDiscount({ ...discount, active: e.target.checked })}
                    />
                    <div className="w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:bg-emerald-500 transition-all duration-300"></div>
                    <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 peer-checked:translate-x-7"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={saveSale}
                disabled={saving}
                className="w-full lg:w-auto px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:shadow-pink-500/20 hover:bg-pink-600 dark:hover:bg-pink-500 dark:hover:text-white transition-all disabled:opacity-50 active:scale-95"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating System...
                  </span>
                ) : (
                  "Update Flash Campaign"
                )}
              </button>
            </div>
          </motion.div>

          {/* Right Side: Visual Preview */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Live Simulator</h3>
            <motion.div 
              className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-pink-500 to-rose-600 p-8 text-white shadow-2xl shadow-pink-500/40"
              animate={discount.active ? { scale: [1, 1.02, 1] } : {}}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              {/* Decorative background shapes */}
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-black/10 blur-3xl"></div>

              <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                <div>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                    {discount.active ? "● Live Storewide" : "○ Draft Mode"}
                  </span>
                  <h4 className="text-3xl font-black leading-tight mt-4 uppercase tracking-tighter">
                    {discount.title || "Untitled Sale"}
                  </h4>
                </div>

                <div className="flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-5xl font-black">
                      {discount.percentage || "0"}<span className="text-2xl">%</span>
                    </span>
                    <span className="text-xs font-bold opacity-80 uppercase tracking-widest">Off Entire Catalog</span>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Ends At</p>
                    <p className="font-mono text-sm font-bold bg-black/20 px-3 py-1 rounded-lg">
                      {discount.expiresAt ? discount.expiresAt.replace("T", " ") : "Not Set"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hint Card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-3xl p-6 border border-blue-100 dark:border-blue-800/30 flex gap-4">
              <span className="material-symbols-outlined text-blue-500">info</span>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400 leading-relaxed">
                When active, a countdown timer and promotion banner will appear on the homepage and product detail pages automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}