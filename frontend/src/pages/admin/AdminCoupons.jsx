// import React, { useEffect, useState } from "react";
// import API from "../../api/api";
// import AdminSidebar from "../../components/AdminSidebar";

// export default function AdminCoupons() {
//   const [coupons, setCoupons] = useState([]);
//   const [form, setForm] = useState({
//     code: "",
//     discountType: "percentage",
//     discountValue: "",
//     minAmount: "",
//     usageLimit: "",
//     expiresAt: "",
//   });

//   const load = React.useCallback(async () => {
//     const { data } = await API.get("/coupons");
//     setCoupons(data);
//   }, []);

//   const create = async () => {
//     await API.post("/coupons", form);
//     load();
//   };

//   const remove = async (id) => {
//     await API.delete(`/coupons/${id}`);
//     load();
//   };

//   useEffect(() => {
//     load();
//   }, [load]);

//   return (
//     <div className="max-w-7xl mx-auto flex gap-6 px-6">
//       <AdminSidebar />

//       <div className="flex-1">
//         <h2 className="text-2xl font-semibold">Coupon Management</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

//           <input className="p-2 border rounded" placeholder="Coupon Code"
//             onChange={(e) => setForm({ ...form, code: e.target.value })} />

//           <select className="p-2 border rounded"
//             onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
//             <option value="percentage">Percentage</option>
//             <option value="flat">Flat Amount</option>
//           </select>

//           <input className="p-2 border rounded" placeholder="Discount Value"
//             type="number"
//             onChange={(e) => setForm({ ...form, discountValue: e.target.value })} />

//           <input className="p-2 border rounded" placeholder="Min Amount"
//             type="number"
//             onChange={(e) => setForm({ ...form, minAmount: e.target.value })} />

//           <input className="p-2 border rounded" placeholder="Usage Limit"
//             type="number"
//             onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />

//           <input className="p-2 border rounded" type="date"
//             onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />

//         </div>

//         <button
//           className="mt-4 px-4 py-2 bg-brandPink text-white rounded"
//           onClick={create}
//         >
//           Create Coupon
//         </button>

//         <h3 className="text-xl mt-8 font-semibold">Available Coupons</h3>

//         <ul className="mt-4 space-y-3">
//           {coupons.map((c) => (
//             <li key={c._id} className="p-3 bg-white shadow-sm rounded flex justify-between">
//               <span>{c.code} — {c.discountValue}{c.discountType === "percentage" ? "%" : "₹"}</span>
//               <button
//                 onClick={() => remove(c._id)}
//                 className="px-3 py-1 bg-red-200 rounded"
//               >
//                 Delete
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import API from "../../api/api";
import AdminSidebar from "../../components/AdminSidebar";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  const [coupon, setCoupon] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minAmount: "",
    usageLimit: "",
    expiresAt: ""
  });

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/coupons");
      setCoupons(res.data);
    } catch (error) {
      console.error("Error loading coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCoupon(prev => ({ ...prev, code }));
  };

  const createCoupon = async () => {
    try {
      await API.post("/admin/coupons", coupon);
      setShowCreate(false);
      setCoupon({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minAmount: "",
        usageLimit: "",
        expiresAt: ""
      });
      loadCoupons();
    } catch (error) {
      console.error("Error creating coupon:", error);
    }
  };

  const deleteCoupon = async (couponId) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await API.delete(`/admin/coupons/${couponId}`);
        loadCoupons();
      } catch (error) {
        console.error("Error deleting coupon:", error);
      }
    }
  };

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  const getStatus = (coupon) => {
    if (isExpired(coupon.expiresAt)) return "expired";
    if (coupon.usedCount >= coupon.usageLimit) return "limit_reached";
    return "active";
  };

  const STATUS_COLORS = {
    active: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400",
    expired: "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400",
    limit_reached: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400"
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50/50 dark:bg-gray-950 font-display">
      <AdminSidebar />

      <div className="flex-1 px-4 lg:px-10 py-24 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
              Coupon <span className="text-primary">Vault</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
              Manage your promotional strategy and discount campaigns
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="group relative px-6 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold shadow-xl shadow-gray-200 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 overflow-hidden"
          >
            <span className="material-symbols-outlined text-xl">add_circle</span>
            New Coupon
          </button>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-500 animate-pulse font-medium">Synchronizing coupons...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {coupons.map((coupon, index) => {
              const status = getStatus(coupon);
              const progress = Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100);
              
              return (
                <motion.div
                  key={coupon._id}
                  className="group relative bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Decorative background element */}
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>

                  <div className="flex items-start justify-between relative">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                         <span className="material-symbols-outlined text-primary text-sm">confirmation_number</span>
                         <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">Promo Code</span>
                      </div>
                      <h3 className="font-black text-2xl text-gray-900 dark:text-white tracking-tight group-hover:text-primary transition-colors">
                        {coupon.code}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold mt-3 uppercase tracking-wider ${STATUS_COLORS[status]}`}>
                        {status.replace('_', ' ')}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteCoupon(coupon._id)}
                      className="p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all duration-200"
                    >
                      <span className="material-symbols-outlined text-xl italic">delete_sweep</span>
                    </button>
                  </div>

                  {/* Pricing Details */}
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100/50 dark:border-gray-700/30">
                      <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-tighter">Value</p>
                      <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 uppercase">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100/50 dark:border-gray-700/30">
                      <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-tighter">Min Spend</p>
                      <p className="text-xl font-black text-gray-900 dark:text-white">₹{coupon.minAmount || '0'}</p>
                    </div>
                  </div>

                  {/* Usage & Expiry */}
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <span className="material-symbols-outlined text-lg">event</span>
                        <span className="font-medium">Expires {new Date(coupon.expiresAt).toLocaleDateString()}</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">{coupon.usedCount}/{coupon.usageLimit}</span>
                    </div>

                    <div className="relative">
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className={`h-full rounded-full ${
                            status === 'active' ? 'bg-primary' : 
                            status === 'limit_reached' ? 'bg-amber-500' : 'bg-gray-400'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {coupons.length === 0 && (
              <div className="col-span-full py-20 bg-white dark:bg-gray-900 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800 text-center">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                   <span className="material-symbols-outlined text-4xl text-gray-300">confirmation_number</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Coupons Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Ready to boost your sales? Create your first coupon code.</p>
              </div>
            )}
          </div>
        )}

        {/* Modal Upgrade */}
        <AnimatePresence>
          {showCreate && (
            <motion.div
              className="fixed inset-0 bg-gray-950/40 backdrop-blur-md flex justify-center items-center z-[100] p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-800"
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
              >
                <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Configure Coupon</h3>
                    <p className="text-sm text-gray-500 font-medium">Define your discount parameters</p>
                  </div>
                  <button onClick={() => setShowCreate(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-colors">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-6">
                  {/* Coupon Code Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Unique Code</label>
                    <div className="flex gap-3">
                      <input
                        className="flex-1 h-14 px-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary text-lg font-bold transition-all"
                        placeholder="SUMMER2024"
                        value={coupon.code}
                        onChange={(e) => setCoupon({ ...coupon, code: e.target.value.toUpperCase() })}
                      />
                      <button
                        onClick={generateCode}
                        className="h-14 px-6 bg-primary/10 text-primary rounded-2xl font-bold hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined">auto_fix_high</span>
                        Magic
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Type</label>
                      <select
                        className="w-full h-14 px-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary font-bold transition-all appearance-none"
                        value={coupon.discountType}
                        onChange={(e) => setCoupon({ ...coupon, discountType: e.target.value })}
                      >
                        <option value="percentage">Percentage %</option>
                        <option value="flat">Flat ₹</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Value</label>
                      <input
                        className="w-full h-14 px-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary font-bold"
                        type="number"
                        placeholder="0"
                        value={coupon.discountValue}
                        onChange={(e) => setCoupon({ ...coupon, discountValue: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Min Spend</label>
                      <input
                        className="w-full h-14 px-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary font-bold"
                        type="number"
                        value={coupon.minAmount}
                        onChange={(e) => setCoupon({ ...coupon, minAmount: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Total Limit</label>
                      <input
                        className="w-full h-14 px-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary font-bold"
                        type="number"
                        value={coupon.usageLimit}
                        onChange={(e) => setCoupon({ ...coupon, usageLimit: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Valid Until</label>
                    <input
                      className="w-full h-14 px-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary font-bold"
                      type="datetime-local"
                      value={coupon.expiresAt}
                      onChange={(e) => setCoupon({ ...coupon, expiresAt: e.target.value })}
                    />
                  </div>
                </div>

                <div className="p-8 bg-gray-50 dark:bg-gray-800/50 flex gap-4">
                  <button
                    onClick={createCoupon}
                    className="flex-1 h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:translate-y-0"
                    disabled={!coupon.code || !coupon.discountValue || !coupon.usageLimit || !coupon.expiresAt}
                  >
                    Deploy Coupon
                  </button>
                  <button
                    onClick={() => setShowCreate(false)}
                    className="px-8 h-14 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}