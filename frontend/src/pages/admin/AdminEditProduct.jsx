// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import API from "../../api/api";
// import AdminSidebar from "../../components/AdminSidebar";
// import { motion } from "framer-motion";

// export default function AdminEditProduct() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [categories, setCategories] = useState([]);

//   const [product, setProduct] = useState({
//     title: "",
//     description: "",
//     price: "",
//     stock: "",
//     discount: "",
//     category: "",
//     images: [],
//   });

//   const loadData = React.useCallback(async () => {
//     try {
//       const p = await API.get(`/products/${id}`);
//       const c = await API.get("/categories");
//       setProduct(p.data);
//       setCategories(c.data);
//       setLoading(false);
//     } catch (err) {
//       console.log(err);
//     }
//   }, [id]);

//   useEffect(() => {
//     loadData();
//   }, [loadData]);

//   const updateField = (field, value) => {
//     setProduct((prev) => ({ ...prev, [field]: value }));
//   };

//   const uploadImages = (e) => {
//     const files = [...e.target.files];
//     files.forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setProduct((prev) => ({
//           ...prev,
//           images: [...prev.images, reader.result],
//         }));
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const saveChanges = async () => {
//     await API.put(`/products/${id}`, product);
//     navigate("/admin/products");
//   };

//   const deleteImage = (index) => {
//     setProduct((prev) => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index),
//     }));
//   };

//   if (loading)
//     return <div className="text-center py-20">Loading product...</div>;

//   return (
//     <div className="flex max-w-7xl mx-auto mt-20 px-6 gap-6 font-display">

//       <AdminSidebar />

//       <div className="flex-1">
//         <h2 className="text-3xl font-black mb-6">Edit Product</h2>

//         <motion.div
//           className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           {/* FORM GRID */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//             <input
//               className="border p-3 rounded-xl bg-gray-50 dark:bg-gray-800"
//               placeholder="Title"
//               value={product.title}
//               onChange={(e) => updateField("title", e.target.value)}
//             />

//             <input
//               className="border p-3 rounded-xl bg-gray-50 dark:bg-gray-800"
//               placeholder="Price"
//               type="number"
//               value={product.price}
//               onChange={(e) => updateField("price", e.target.value)}
//             />

//             <input
//               className="border p-3 rounded-xl bg-gray-50 dark:bg-gray-800"
//               placeholder="Stock"
//               type="number"
//               value={product.stock}
//               onChange={(e) => updateField("stock", e.target.value)}
//             />

//             <input
//               className="border p-3 rounded-xl bg-gray-50 dark:bg-gray-800"
//               placeholder="Discount (%)"
//               type="number"
//               value={product.discount}
//               onChange={(e) => updateField("discount", e.target.value)}
//             />

//             <select
//               className="border p-3 rounded-xl bg-gray-50 dark:bg-gray-800"
//               value={product.category?._id || ""}
//               onChange={(e) => updateField("category", e.target.value)}
//             >
//               <option value="">Select category</option>
//               {categories.map((c) => (
//                 <option key={c._id} value={c._id}>
//                   {c.name}
//                 </option>
//               ))}
//             </select>

//             <textarea
//               className="border p-3 rounded-xl bg-gray-50 dark:bg-gray-800 md:col-span-2"
//               rows={4}
//               placeholder="Description"
//               value={product.description}
//               onChange={(e) => updateField("description", e.target.value)}
//             />

//             {/* IMAGES */}
//             <div className="md:col-span-2">
//               <p className="pb-2 font-semibold">Images</p>

//               <div className="grid grid-cols-3 gap-3 mb-4">
//                 {product.images.map((img, i) => (
//                   <div key={i} className="relative">
//                     <img
//                       src={img}
//                       className="w-full h-32 object-cover rounded-xl shadow"
//                     />
//                     <button
//                       onClick={() => deleteImage(i)}
//                       className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ))}
//               </div>

//               <input type="file" multiple onChange={uploadImages} />
//             </div>
//           </div>

//           {/* SAVE BUTTON */}
//           <button
//             onClick={saveChanges}
//             className="w-full mt-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90"
//           >
//             Save Changes
//           </button>
//         </motion.div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../api/api";
import AdminSidebar from "../../components/AdminSidebar";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: 0,
    stock: 0,
    discount: 0,
    categories: [],
    images: [],
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [pRes, cRes] = await Promise.all([
        API.get(`/products/${id}`),
        API.get("/categories"),
      ]);
      setProduct(pRes.data);
      setCategories(cRes.data || []);
    } catch (err) {
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateField = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const uploadImages = (e) => {
    const files = [...e.target.files];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setProduct((prev) => ({
          ...prev,
          images: [...prev.images, reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      await API.put(`/products/${id}`, product);
      navigate("/admin/products");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  const deleteImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Synchronizing Asset Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      <div className="flex gap-6 px-4 lg:px-8 py-10 max-w-[1600px] mx-auto">
        <AdminSidebar />

        <main className="flex-1">
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link to="/admin/products" className="text-emerald-500 hover:text-emerald-400 transition-colors">
                  Inventory
                </Link>
                <span className="text-slate-600 text-sm">/</span>
                <span className="text-slate-400 text-sm">Edit Asset</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">
                Update <span className="text-emerald-500">Asset</span>
              </h2>
              <p className="text-slate-500 mt-1">Refining: {product.title}</p>
            </div>

            <button
              onClick={() => navigate("/admin/products")}
              className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition text-slate-400 flex items-center gap-2 w-fit"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Catalog
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-8"
          >
            {/* MAIN FORM */}
            <div className="xl:col-span-2 space-y-8">
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Asset Title</label>
                  <input
                    className="w-full h-14 px-5 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:border-emerald-500 outline-none transition-all"
                    value={product.title}
                    onChange={(e) => updateField("title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Description</label>
                  <textarea
                    rows={6}
                    className="w-full p-5 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:border-emerald-500 outline-none transition-all resize-none"
                    value={product.description}
                    onChange={(e) => updateField("description", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Category</label>
                    <select
                      className="w-full h-14 px-5 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:border-emerald-500 outline-none transition-all appearance-none"
                      value={product.categories?.[0]?._id || product.categories?.[0] || ""}
                      onChange={(e) => updateField("categories", [e.target.value])}
                    >
                      <option value="">Uncategorized</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Stock Availability</label>
                    <input
                      type="number"
                      className="w-full h-14 px-5 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:border-emerald-500 outline-none transition-all"
                      value={product.stock}
                      onChange={(e) => updateField("stock", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* MEDIA SECTION */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-6">Gallery Management</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  <AnimatePresence mode="popLayout">
                    {product.images.map((img, i) => (
                      <motion.div
                        key={img}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-700 bg-slate-950"
                      >
                        <img src={img} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => deleteImage(i)}
                            className="p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  <label className="aspect-square border-2 border-dashed border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all gap-2 group">
                    <input type="file" multiple className="hidden" onChange={uploadImages} accept="image/*" />
                    <span className="material-symbols-outlined text-slate-600 group-hover:text-emerald-500 transition-colors">add_a_photo</span>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter group-hover:text-emerald-500">Add New</span>
                  </label>
                </div>
              </div>
            </div>

            {/* SIDEBAR / SUMMARY */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sticky top-10">
                <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-500">payments</span>
                  Pricing Metrics
                </h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Base Price (₹)</label>
                    <input
                      type="number"
                      className="w-full h-12 px-5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 outline-none transition-all"
                      value={product.price}
                      onChange={(e) => updateField("price", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Discount Percentage</label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full h-12 px-5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 outline-none transition-all"
                        value={product.discount}
                        onChange={(e) => updateField("discount", e.target.value)}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-600">%</span>
                    </div>
                  </div>

                  {/* LIVE CALCULATION DISPLAY */}
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-400">Final Customer Price:</span>
                      <span className="text-xs font-black text-emerald-500">-{product.discount}%</span>
                    </div>
                    <div className="text-2xl font-black text-white">
                      ₹{(product.price - (product.price * (product.discount / 100))).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="mt-10 space-y-3">
                  <button
                    onClick={saveChanges}
                    disabled={saving}
                    className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Commit Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => navigate("/admin/products")}
                    className="w-full h-14 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
                  >
                    Discard Edits
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}