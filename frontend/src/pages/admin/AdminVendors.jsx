// import React, { useEffect, useState } from "react";
// import API from "../../api/api";
// import AdminSidebar from "../../components/AdminSidebar";

// export default function AdminVendors() {
//   const [vendors, setVendors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(null);

//   const load = React.useCallback(async () => {
//     try {
//       setLoading(true);
//       const { data } = await API.get("/admin/vendors");
//       setVendors(data);
//     } catch (err) {
//       console.log("Failed to load vendors", err);
//     }
//     setLoading(false);
//   }, []);

//   const toggleApproval = async (id, approved) => {
//     try {
//       setActionLoading(id);
//       await API.put(`/admin/vendors/${id}/approve`, { approved });
//       await load();
//     } catch (err) {
//       console.log("Toggle failed", err);
//     }
//     setActionLoading(null);
//   };

//   useEffect(() => {
//     load();
//   }, [load]);

//   return (
//     <div className="max-w-7xl mx-auto px-6 flex gap-6">
//       <AdminSidebar />

//       <div className="flex-1">
//         <h2 className="text-3xl font-bold mb-6">Vendor Approval</h2>

//         {loading ? (
//           <div className="text-center text-lg py-20">Loading vendors…</div>
//         ) : (
//           <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="bg-pink-200 text-left">
//                   <th className="p-3 font-semibold">Shop</th>
//                   <th className="p-3 font-semibold">Owner</th>
//                   <th className="p-3 font-semibold">Approved</th>
//                   <th className="p-3 font-semibold text-center">Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {vendors.map((v) => (
//                   <tr
//                     key={v._id}
//                     className="border-b hover:bg-gray-50 transition"
//                   >
//                     <td className="p-3 font-medium">{v.shopName}</td>

//                     <td className="p-3">{v.user?.name || "N/A"}</td>

//                     <td className="p-3">
//                       {v.isApproved ? (
//                         <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
//                           Approved
//                         </span>
//                       ) : (
//                         <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
//                           Pending
//                         </span>
//                       )}
//                     </td>

//                     <td className="p-3 text-center">
//                       <button
//                         onClick={() => toggleApproval(v._id, !v.isApproved)}
//                         disabled={actionLoading === v._id}
//                         className={`px-4 py-2 rounded-lg text-sm font-semibold shadow transition
//                           ${
//                             v.isApproved
//                               ? "bg-red-500 text-white hover:bg-red-600"
//                               : "bg-green-500 text-white hover:bg-green-600"
//                           }
//                           ${actionLoading === v._id && "opacity-50 cursor-not-allowed"}
//                         `}
//                       >
//                         {actionLoading === v._id
//                           ? "Processing..."
//                           : v.isApproved
//                           ? "Unapprove"
//                           : "Approve"}
//                       </button>
//                     </td>
//                   </tr>
//                 ))}

//                 {vendors.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan="4"
//                       className="p-6 text-center text-gray-500 italic"
//                     >
//                       No vendors found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import AdminSidebar from "../../components/AdminSidebar";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = React.useCallback(async () => {
    try {
      const { data } = await API.get("/admin/vendors");
      setVendors(data);
    } catch (err) {
      console.log("Failed to load vendors", err);
    }
    setLoading(false);
  }, []);

  const toggleApproval = async (id, approved) => {
    try {
      setActionLoading(id);
      await API.put(`/admin/vendors/${id}/approve`, { approved });
      await load();
    } catch (err) {
      console.log("Toggle failed", err);
    }
    setActionLoading(null);
  };

  useEffect(() => {
    load();
  }, [load]);

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "approved" && vendor.isApproved) ||
      (statusFilter === "pending" && !vendor.isApproved);

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: vendors.length,
    approved: vendors.filter(v => v.isApproved).length,
    pending: vendors.filter(v => !v.isApproved).length
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-gray-950 font-display">
      <AdminSidebar />

      <div className="flex-1 px-6 py-24 lg:px-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined">verified_user</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
              Vendor <span className="text-primary">Ecosystem</span>
            </h2>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
            Monitor shop performance and manage marketplace credentials.
          </p>
        </header>

        {/* Analytics Snapshot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Marketplace Reach', val: stats.total, color: 'blue', icon: 'hub', sub: 'Total registered partners' },
            { label: 'Active Sellers', val: stats.approved, color: 'emerald', icon: 'verified', sub: 'Verified and selling' },
            { label: 'Verification Queue', val: stats.pending, color: 'amber', icon: 'pending_actions', sub: 'Waiting for approval' }
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-500/10 flex items-center justify-center`}>
                  <span className={`material-symbols-outlined text-${stat.color}-600 dark:text-${stat.color}-400`}>{stat.icon}</span>
                </div>
                <span className={`text-${stat.color}-500 text-xs font-black uppercase tracking-widest`}>{stat.color === 'emerald' ? '+Live' : 'Global'}</span>
              </div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-none">{stat.val}</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input
              placeholder="Search by shop, name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-gray-700 dark:text-gray-200"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-600 dark:text-gray-400 outline-none"
          >
            <option value="all">All Partners</option>
            <option value="approved">Verified Only</option>
            <option value="pending">Awaiting Review</option>
          </select>
        </div>

        {/* Data Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-black animate-pulse uppercase tracking-widest text-xs">Accessing Database...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                    <th className="py-6 px-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Partner Profile</th>
                    <th className="py-6 px-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Merchant Contact</th>
                    <th className="py-6 px-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Verification Status</th>
                    <th className="py-6 px-8 text-right text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Governance</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  <AnimatePresence mode="popLayout">
                    {filteredVendors.map((vendor, index) => (
                      <motion.tr
                        key={vendor._id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ delay: index * 0.03 }}
                        className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
                      >
                        <td className="py-6 px-8">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm">
                                <span className="text-2xl font-black text-gray-400">{vendor.shopName?.charAt(0)}</span>
                              </div>
                              {vendor.isApproved && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                                  <span className="material-symbols-outlined text-[10px] text-white font-black">check</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-black text-gray-900 dark:text-white text-lg tracking-tight group-hover:text-primary transition-colors">{vendor.shopName}</p>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5 italic opacity-60">Established {new Date(vendor.createdAt).getFullYear()}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-6 px-8">
                          <p className="font-bold text-gray-700 dark:text-gray-300">{vendor.user?.name || "Independent Merchant"}</p>
                          <p className="text-sm text-gray-400 font-medium lowercase tracking-tight">{vendor.user?.email}</p>
                        </td>

                        <td className="py-6 px-8">
                          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            vendor.isApproved
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                              : "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${vendor.isApproved ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                            {vendor.isApproved ? "Verified Partner" : "Verification Pending"}
                          </span>
                        </td>

                        <td className="py-6 px-8 text-right">
                          <button
                            onClick={() => toggleApproval(vendor._id, !vendor.isApproved)}
                            disabled={actionLoading === vendor._id}
                            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                              vendor.isApproved
                                ? "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white"
                                : "bg-gray-900 text-white hover:bg-primary dark:bg-white dark:text-gray-900 dark:hover:bg-primary dark:hover:text-white"
                            } disabled:opacity-50 active:scale-95`}
                          >
                            {actionLoading === vendor._id ? (
                              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : vendor.isApproved ? (
                              "Revoke Access"
                            ) : (
                              "Grant Approval"
                            )}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {filteredVendors.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-4xl text-gray-200 dark:text-gray-700">group_off</span>
                </div>
                <h4 className="text-xl font-black text-gray-400 uppercase tracking-tighter">No partners found</h4>
                <p className="text-sm text-gray-400 mt-2 font-medium">Try broadening your search parameters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}