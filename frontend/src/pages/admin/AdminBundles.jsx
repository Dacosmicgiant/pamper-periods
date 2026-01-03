// import React, { useEffect, useState } from "react";
// import API from "../../api/api";
// import { Link } from "react-router-dom";
// import { useToast } from "../../components/Toast";
// import { motion } from "framer-motion";

// export default function AdminBundles() {
//   const [bundles, setBundles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [query, setQuery] = useState("");

//   const { toast } = useToast();

//   // ---------------- LOAD BUNDLES ----------------
//   const loadBundles = React.useCallback(async () => {
//     try {
//       const res = await API.get("/bundles");
//       setBundles(res.data);
//     } catch (err) {
//       toast.error("Failed to load bundles");
//     } finally {
//       setLoading(false);
//     }
//   }, [toast]);

//   useEffect(() => {
//     loadBundles();
//   }, [loadBundles]);

//   // ---------------- DELETE HANDLER ----------------
//   const deleteBundle = async (id) => {
//     if (!confirm("Delete this bundle permanently?")) return;

//     try {
//       await API.delete(`/bundles/${id}`);
//       toast.success("Bundle deleted");
//       setBundles((prev) => prev.filter((b) => b._id !== id));
//     } catch (err) {
//       toast.error("Delete failed");
//     }
//   };

//   // ---------------- FILTERED BUNDLES ----------------
//   const filtered = bundles.filter((b) =>
//     b.title.toLowerCase().includes(query.toLowerCase())
//   );

//   return (
//     <div className="p-6 max-w-7xl mx-auto font-display">

//       {/* PAGE HEADER */}
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-3xl font-bold">Bundle Management</h2>

//         <Link
//           to="/admin/bundles/create"
//           className="px-5 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90"
//         >
//           + Create Bundle
//         </Link>
//       </div>

//       {/* SEARCH BAR */}
//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder="Search bundles..."
//           className="w-full md:w-72 px-4 py-2 border rounded-lg bg-white shadow-sm"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//       </div>

//       {loading ? (
//         <div className="text-center py-20 text-lg">Loading bundles...</div>
//       ) : filtered.length === 0 ? (
//         <div className="text-center py-20 text-neutral text-lg">
//           No bundles found.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
//           {filtered.map((bundle) => (
//             <motion.div
//               key={bundle._id}
//               layout
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition p-4 flex flex-col"
//             >
//               {/* IMAGE */}
//               <div
//                 className="w-full h-48 rounded-lg bg-center bg-cover"
//                 style={{
//                   backgroundImage: `url("${bundle.images?.[0] || "/placeholder.jpg"
//                     }")`,
//                 }}
//               ></div>

//               {/* TITLE */}
//               <h3 className="text-lg font-bold mt-3">{bundle.title}</h3>

//               {/* PRICE */}
//               <div className="mt-1">
//                 <span className="text-primary font-bold text-lg">
//                   ₹{bundle.price}
//                 </span>

//                 {bundle.oldPrice && (
//                   <span className="ml-2 text-sm line-through text-neutral">
//                     ₹{bundle.oldPrice}
//                   </span>
//                 )}
//               </div>

//               {/* ITEMS COUNT */}
//               <div className="mt-2 text-sm text-neutral">
//                 Contains <span className="font-semibold">{bundle.items?.length}</span>{" "}
//                 items
//               </div>

//               {/* VENDOR */}
//               <div className="mt-3 text-sm text-neutral">
//                 Vendor:{" "}
//                 <span className="font-semibold">
//                   {bundle.vendor?.shopName || "Admin"}
//                 </span>
//               </div>

//               {/* ACTION BUTTONS */}
//               <div className="mt-5 flex gap-3">
//                 <Link
//                   to={`/admin/bundles/edit/${bundle._id}`}
//                   className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-center hover:bg-blue-600"
//                 >
//                   Edit
//                 </Link>
//                 <button
//                   onClick={() => deleteBundle(bundle._id)}
//                   className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { Link } from "react-router-dom";
import { useToast } from "../../components/Toast";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminBundles() {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  const { toast } = useToast();

  // ---------------- LOAD BUNDLES ----------------
  const loadBundles = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/bundles");
      setBundles(res.data);
    } catch (err) {
      toast.error("Failed to load bundles");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadBundles();
  }, [loadBundles]);

  // ---------------- DELETE HANDLER ----------------
  const deleteBundle = async (id) => {
    if (!confirm("Are you sure you want to delete this bundle permanently?")) return;

    try {
      setDeleteLoading(id);
      await API.delete(`/bundles/${id}`);
      toast.success("Bundle deleted successfully");
      setBundles((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      toast.error("Failed to delete bundle");
    } finally {
      setDeleteLoading(null);
    }
  };

  // ---------------- FILTERED BUNDLES ----------------
  const filtered = bundles.filter((b) =>
    b.title.toLowerCase().includes(query.toLowerCase())
  );

  const stats = {
    total: bundles.length,
    active: bundles.filter(b => b.status === 'active').length,
    draft: bundles.filter(b => b.status === 'draft').length
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-gray-950 font-display">
      <AdminSidebar />

      <div className="flex-1 px-6 py-24 lg:px-10 max-w-7xl mx-auto">
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
              Bundle <span className="text-primary">Studio</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              Curate product collections and set promotional pricing.
            </p>
          </div>
          
          <Link
            to="/admin/bundles/create"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold overflow-hidden transition-all hover:pr-12 active:scale-95 shadow-xl"
          >
            <span className="material-symbols-outlined">add_circle</span>
            <span>Create New Bundle</span>
            <span className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <span className="material-symbols-outlined">arrow_forward</span>
            </span>
          </Link>
        </div>

        {/* ANALYTICS SNAPSHOT */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Curations', val: stats.total, color: 'blue', icon: 'auto_awesome_motion' },
            { label: 'Live on Store', val: stats.active, color: 'emerald', icon: 'rocket_launch' },
            { label: 'Draft Mode', val: stats.draft, color: 'amber', icon: 'edit_notifications' }
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-500/10 flex items-center justify-center`}>
                <span className={`material-symbols-outlined text-${stat.color}-600 dark:text-${stat.color}-400 text-2xl`}>{stat.icon}</span>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-none mt-1">{stat.val}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* TOOLBAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="relative w-full sm:w-96 group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
            <input
              type="text"
              placeholder="Filter by title or ID..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
             <button onClick={loadBundles} className="p-3 text-gray-400 hover:text-primary transition-colors">
                <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>refresh</span>
             </button>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
             <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
             <p className="text-gray-400 font-bold animate-pulse">Syncing bundles...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-24 bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800"
              >
                <span className="material-symbols-outlined text-7xl text-gray-200 dark:text-gray-700 mb-4">inventory_2</span>
                <h3 className="text-xl font-bold text-gray-400">No matching bundles found</h3>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filtered.map((bundle, index) => (
                  <motion.div
                    key={bundle._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex flex-col bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden"
                  >
                    {/* VISUAL WRAPPER */}
                    <div className="relative h-64 overflow-hidden">
                      <div
                        className="w-full h-full bg-center bg-cover transition-transform duration-1000 group-hover:scale-110"
                        style={{ backgroundImage: `url("${bundle.images?.[0] || "/placeholder.jpg"}")` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60" />
                      
                      <div className="absolute top-5 left-5 flex flex-col gap-2">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
                          bundle.status === 'active' 
                            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
                            : 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                        }`}>
                          {bundle.status}
                        </span>
                      </div>

                      {bundle.oldPrice > bundle.price && (
                        <div className="absolute bottom-5 right-5 bg-white dark:bg-gray-900 px-4 py-2 rounded-2xl shadow-xl">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Savings</p>
                          <p className="text-emerald-500 font-black text-lg leading-none">
                            {Math.round(((bundle.oldPrice - bundle.price) / bundle.oldPrice) * 100)}%
                          </p>
                        </div>
                      )}
                    </div>

                    {/* CONTENT WRAPPER */}
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="mb-6">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-primary transition-colors">
                          {bundle.title}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-black text-gray-900 dark:text-white italic">₹{bundle.price?.toLocaleString()}</span>
                          {bundle.oldPrice && (
                            <span className="text-sm font-bold text-gray-400 line-through opacity-60">₹{bundle.oldPrice?.toLocaleString()}</span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 dark:border-gray-800 mb-6">
                         <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg text-gray-400">layers</span>
                            <span className="text-xs font-bold text-gray-500">{bundle.items?.length || 0} Skus</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg text-gray-400">schedule</span>
                            <span className="text-xs font-bold text-gray-500">{new Date(bundle.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}</span>
                         </div>
                      </div>

                      <div className="flex gap-3 mt-auto">
                        <Link
                          to={`/admin/bundles/edit/${bundle._id}`}
                          className="flex-1 h-12 flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-primary hover:text-white transition-all transition-duration-300"
                        >
                          <span className="material-symbols-outlined text-sm">edit_note</span>
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteBundle(bundle._id)}
                          disabled={deleteLoading === bundle._id}
                          className="w-12 h-12 flex items-center justify-center bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                        >
                          {deleteLoading === bundle._id ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <span className="material-symbols-outlined">delete_sweep</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}