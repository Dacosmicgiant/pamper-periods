// import React, { useEffect, useState } from "react";
// import API from "../../api/api";
// import AdminSidebar from "../../components/AdminSidebar";
// import { motion, AnimatePresence } from "framer-motion";

// export default function AdminCategories() {
//   const [categories, setCategories] = useState([]);
//   const [showModal, setShowModal] = useState(false);

//   const [editing, setEditing] = useState(null);

//   const [form, setForm] = useState({
//     name: "",
//     icon: "",
//     description: "",
//   });

//   const load = React.useCallback(async () => {
//     const res = await API.get("/categories");
//     setCategories(res.data);
//   }, []);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const saveCategory = async () => {
//     if (editing) {
//       await API.put(`/categories/${editing._id}`, form);
//     } else {
//       await API.post("/categories", form);
//     }
//     setShowModal(false);
//     setEditing(null);
//     load();
//   };

//   const deleteCategory = async (id) => {
//     await API.delete(`/categories/${id}`);
//     load();
//   };

//   const openAdd = () => {
//     setEditing(null);
//     setForm({ name: "", icon: "", description: "" });
//     setShowModal(true);
//   };

//   const openEdit = (c) => {
//     setEditing(c);
//     setForm(c);
//     setShowModal(true);
//   };

//   return (
//     <div className="flex max-w-7xl mx-auto px-6 mt-20 gap-6 font-display">
//       <AdminSidebar />

//       <div className="flex-1">
//         <div className="flex justify-between mb-8">
//           <h2 className="text-3xl font-black">Categories</h2>
//           <button
//             onClick={openAdd}
//             className="px-5 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl shadow hover:opacity-90"
//           >
//             + Add Category
//           </button>
//         </div>

//         {/* CATEGORY LIST */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {categories.map((c) => (
//             <motion.div
//               key={c._id}
//               className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//             >
//               <div className="text-4xl">{c.icon || "📦"}</div>
//               <h3 className="text-xl font-bold mt-3">{c.name}</h3>
//               <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
//                 {c.description || "No description"}
//               </p>

//               <div className="flex gap-3 mt-4">
//                 <button
//                   onClick={() => openEdit(c)}
//                   className="px-3 py-2 bg-yellow-300 rounded"
//                 >
//                   Edit
//                 </button>

//                 <button
//                   onClick={() => deleteCategory(c._id)}
//                   className="px-3 py-2 bg-red-300 rounded"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {categories.length === 0 && (
//           <div className="text-center text-gray-500 mt-20">No categories yet.</div>
//         )}
//       </div>

//       {/* ADD/EDIT MODAL */}
//       <AnimatePresence>
//         {showModal && (
//           <motion.div
//             className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               className="bg-white dark:bg-gray-900 p-8 rounded-2xl w-[450px] shadow-2xl border border-gray-200 dark:border-gray-700"
//               initial={{ scale: 0.9, y: 20, opacity: 0 }}
//               animate={{ scale: 1, y: 0, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//             >
//               <h3 className="text-2xl font-bold mb-6">
//                 {editing ? "Edit Category" : "Add Category"}
//               </h3>

//               <div className="space-y-4">
//                 <input
//                   className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800"
//                   placeholder="Category Name"
//                   value={form.name}
//                   onChange={(e) =>
//                     setForm({ ...form, name: e.target.value })
//                   }
//                 />

//                 <input
//                   className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800"
//                   placeholder="Icon (Emoji or URL)"
//                   value={form.icon}
//                   onChange={(e) =>
//                     setForm({ ...form, icon: e.target.value })
//                   }
//                 />

//                 <textarea
//                   className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800"
//                   placeholder="Description"
//                   value={form.description}
//                   onChange={(e) =>
//                     setForm({ ...form, description: e.target.value })
//                   }
//                 />

//                 <button
//                   className="w-full py-3 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl text-white font-semibold"
//                   onClick={saveCategory}
//                 >
//                   Save
//                 </button>

//                 <button
//                   className="w-full py-3 bg-gray-200 dark:bg-gray-700 rounded-xl"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import API from "../../api/api";
import AdminSidebar from "../../components/AdminSidebar";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    name: "",
    icon: "",
    description: "",
  });

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveCategory = async () => {
    try {
      if (editing) {
        await API.put(`/categories/${editing._id}`, form);
      } else {
        await API.post("/categories", form);
      }
      setShowModal(false);
      setEditing(null);
      setForm({ name: "", icon: "", description: "" });
      load();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await API.delete(`/categories/${id}`);
        load();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", icon: "", description: "" });
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm(c);
    setShowModal(true);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const popularIcons = ["📦", "👕", "📱", "💄", "🏠", "🎮", "📚", "⚽", "🎨", "🍳"];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] font-display">
      <AdminSidebar />

      <main className="flex-1 px-4 lg:px-8 pt-24 pb-12 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="space-y-1">
            <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-2">
              <span className="w-8 h-[2px] bg-primary"></span>
              Inventory
            </nav>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Categories <span className="text-primary">Hub</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Manage your product taxonomy and organization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-72 h-12 pl-12 pr-4 bg-white dark:bg-gray-800 border-none rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary transition-all duration-300"
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                search
              </span>
            </div>
            <button
              onClick={openAdd}
              className="h-12 px-6 bg-gray-900 dark:bg-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-primary/20 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined !text-xl">add_circle</span>
              New Category
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Total", val: categories.length, color: "blue", icon: "grid_view" },
            { label: "Visuals", val: categories.filter(c => c.icon).length, color: "emerald", icon: "auto_awesome" },
            { label: "Detailed", val: categories.filter(c => c.description).length, color: "purple", icon: "subject" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 group cursor-default"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-${stat.color}-500/10 rounded-full blur-3xl group-hover:bg-${stat.color}-500/20 transition-colors`} />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{stat.val}</h3>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-500/10 flex items-center justify-center`}>
                  <span className={`material-symbols-outlined text-${stat.color}-500`}>{stat.icon}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-bold animate-pulse">Syncing Database...</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-gray-50 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500 shadow-inner">
                      {category.icon || "📦"}
                    </div>
                    <div className="flex gap-1">
                       <button 
                        onClick={() => openEdit(category)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all"
                       >
                         <span className="material-symbols-outlined !text-xl">edit_square</span>
                       </button>
                       <button 
                        onClick={() => deleteCategory(category._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                       >
                         <span className="material-symbols-outlined !text-xl">delete</span>
                       </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {category.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2 min-h-[40px]">
                    {category.description || "No description provided for this category."}
                  </p>

                  <div className="pt-4 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      ID: {category._id?.slice(-6)}
                    </span>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredCategories.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-4xl text-gray-300">search_off</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">No results found</h4>
                <p className="text-gray-500 max-w-xs mx-auto mt-2">We couldn't find any categories matching your current search criteria.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Modal Upgrade */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
              >
                <div className="px-8 pt-8 pb-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                    {editing ? "Update" : "Create"} <span className="text-primary text-base font-medium ml-1">Category</span>
                  </h3>
                  <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <span className="material-symbols-outlined text-gray-400">close</span>
                  </button>
                </div>

                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Title</label>
                    <input
                      className="w-full h-14 px-5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-primary text-gray-900 dark:text-white font-medium transition-all"
                      placeholder="e.g. Electronics"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Identity Icon</label>
                    <div className="flex flex-wrap gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-3xl">
                      {popularIcons.map((icon) => (
                        <button
                          key={icon}
                          onClick={() => setForm({ ...form, icon })}
                          className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center transition-all ${
                            form.icon === icon 
                              ? "bg-primary text-white scale-110 shadow-lg shadow-primary/30" 
                              : "bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                      <input 
                        type="text" 
                        placeholder="Or emoji" 
                        value={form.icon}
                        onChange={(e) => setForm({ ...form, icon: e.target.value })}
                        className="flex-1 min-w-[100px] h-11 px-4 bg-white dark:bg-gray-700 rounded-xl text-sm border-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
                    <textarea
                      rows={3}
                      className="w-full p-5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-primary text-gray-900 dark:text-white font-medium transition-all resize-none"
                      placeholder="Brief summary of this category..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>

                  <button
                    onClick={saveCategory}
                    disabled={!form.name}
                    className="w-full h-14 bg-gray-900 dark:bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-gray-900/10 dark:shadow-primary/20 hover:-translate-y-1 active:scale-[0.98] transition-all disabled:opacity-50 disabled:transform-none"
                  >
                    {editing ? "Save Changes" : "Deploy Category"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}