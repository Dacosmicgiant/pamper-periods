// import React, { useEffect, useState } from "react";
// import API from "../../api/api";
// import AdminSidebar from "../../components/AdminSidebar";
// import { motion, AnimatePresence } from "framer-motion";

// export default function AdminProducts() {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [showAdd, setShowAdd] = useState(false);

//   const [newProd, setNewProd] = useState({
//     title: "",
//     price: "",
//     discount: 0,
//     stock: 0,
//     description: "",
//     category: "",
//     images: [],
//   });

//   const load = React.useCallback(async () => {
//     const p = await API.get("/products");
//     const c = await API.get("/categories");

//     setProducts(p.data.items || []);
//     setCategories(c.data || []);
//   }, []);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const handleImageUpload = (e) => {
//     const files = [...e.target.files];
//     files.forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setNewProd((prev) => ({
//           ...prev,
//           images: [...prev.images, reader.result],
//         }));
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const createProduct = async () => {
//     await API.post("/products", newProd);
//     setShowAdd(false);
//     load();
//   };

//   return (
//     <div className="flex gap-6 px-6 mt-20 max-w-7xl mx-auto font-display">
//       <AdminSidebar />

//       <div className="flex-1">
//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-3xl font-black tracking-tight">Products</h2>
//           <button
//             onClick={() => setShowAdd(true)}
//             className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium shadow-md hover:opacity-95 transition"
//           >
//             + Add Product
//           </button>
//         </div>

//         {/* TABLE */}
//         <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
//           <table className="w-full">
//             <thead className="bg-gray-100 dark:bg-gray-800 text-left">
//               <tr>
//                 <th className="py-4 px-4 text-sm font-semibold">Product</th>
//                 <th className="py-4 px-4 text-sm font-semibold">Price</th>
//                 <th className="py-4 px-4 text-sm font-semibold">Stock</th>
//                 <th className="py-4 px-4 text-sm font-semibold">Discount</th>
//                 <th className="py-4 px-4 text-sm font-semibold"></th>
//               </tr>
//             </thead>

//             <tbody>
//               {products.map((p) => (
//                 <tr
//                   key={p._id}
//                   className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition"
//                 >
//                   <td className="py-4 px-4 flex items-center gap-4">
//                     <img
//                       src={p.images?.[0]}
//                       alt=""
//                       className="w-14 h-14 rounded-lg object-cover shadow-sm"
//                     />
//                     <div>
//                       <p className="font-semibold">{p.title}</p>
//                       <span className="text-gray-500 text-sm">
//                         {p.category?.name}
//                       </span>
//                     </div>
//                   </td>

//                   <td className="py-4 px-4 font-medium">₹{p.price}</td>
//                   <td className="py-4 px-4">{p.stock}</td>
//                   <td className="py-4 px-4">{p.discount}%</td>

//                   <td className="py-4 px-4">
//                     <div className="flex gap-3">
//                       <button className="px-3 py-2 rounded-lg bg-yellow-400 text-sm shadow">
//                         Edit
//                       </button>
//                       <button className="px-3 py-2 rounded-lg bg-red-400 text-sm shadow">
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {products.length === 0 && (
//             <div className="text-center py-12 text-gray-500">
//               No products available
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ===================================== */}
//       {/* PREMIUM ADD PRODUCT MODAL */}
//       {/* ===================================== */}

//       <AnimatePresence>
//         {showAdd && (
//           <motion.div
//             className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               className="bg-white dark:bg-gray-900 p-8 rounded-2xl w-[500px] shadow-2xl border border-gray-200 dark:border-gray-700"
//               initial={{ scale: 0.9, opacity: 0, y: 30 }}
//               animate={{ scale: 1, opacity: 1, y: 0 }}
//               exit={{ scale: 0.95, opacity: 0 }}
//             >
//               <h3 className="text-2xl font-bold mb-6">Add New Product</h3>

//               <div className="space-y-4">

//                 <input
//                   className="w-full border p-3 rounded-xl bg-gray-50 dark:bg-gray-800"
//                   placeholder="Product Title"
//                   onChange={(e) => setNewProd({ ...newProd, title: e.target.value })}
//                 />

//                 <textarea
//                   className="w-full border p-3 rounded-xl bg-gray-50 dark:bg-gray-800"
//                   placeholder="Description"
//                   onChange={(e) =>
//                     setNewProd({ ...newProd, description: e.target.value })
//                   }
//                 />

//                 <div className="grid grid-cols-2 gap-4">
//                   <input
//                     className="w-full border p-3 rounded-xl bg-gray-50 dark:bg-gray-800"
//                     placeholder="Price"
//                     type="number"
//                     onChange={(e) =>
//                       setNewProd({ ...newProd, price: e.target.value })
//                     }
//                   />

//                   <input
//                     className="w-full border p-3 rounded-xl bg-gray-50 dark:bg-gray-800"
//                     placeholder="Stock"
//                     type="number"
//                     onChange={(e) =>
//                       setNewProd({ ...newProd, stock: e.target.value })
//                     }
//                   />
//                 </div>

//                 <input
//                   className="w-full border p-3 rounded-xl bg-gray-50 dark:bg-gray-800"
//                   placeholder="Discount (%)"
//                   type="number"
//                   onChange={(e) =>
//                     setNewProd({ ...newProd, discount: e.target.value })
//                   }
//                 />

//                 {/* Category dropdown */}
//                 <select
//                   className="w-full border p-3 rounded-xl bg-gray-50 dark:bg-gray-800"
//                   onChange={(e) =>
//                     setNewProd({ ...newProd, category: e.target.value })
//                   }
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map((c) => (
//                     <option key={c._id} value={c._id}>
//                       {c.name}
//                     </option>
//                   ))}
//                 </select>

//                 {/* IMAGES */}
//                 <div>
//                   <p className="font-medium mb-1">Images</p>

//                   <div className="grid grid-cols-3 gap-2 mb-3">
//                     {newProd.images.map((img, i) => (
//                       <img
//                         key={i}
//                         src={img}
//                         className="w-full h-24 object-cover rounded-xl shadow"
//                       />
//                     ))}
//                   </div>

//                   <input type="file" multiple onChange={handleImageUpload} />
//                 </div>

//                 <button
//                   className="w-full py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-semibold shadow hover:opacity-90"
//                   onClick={createProduct}
//                 >
//                   Save Product
//                 </button>

//                 <button
//                   className="w-full py-3 bg-gray-200 dark:bg-gray-700 rounded-xl mt-2"
//                   onClick={() => setShowAdd(false)}
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
// frontend/src/pages/admin/AdminProducts.jsx
import React, { useEffect, useState, useMemo } from "react";
import API from "../../api/api";
import AdminSidebar from "../../components/AdminSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [newProd, setNewProd] = useState({
    title: "",
    price: "",
    discount: 0,
    stock: 0,
    description: "",
    category: "",
    images: [],
    featured: false,
  });

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      const p = await API.get("/products");
      const c = await API.get("/categories");
      setProducts(p.data.items || p.data || []);
      setCategories(c.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleImageUpload = (e) => {
    const files = [...e.target.files];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setNewProd((prev) => ({
          ...prev,
          images: [...prev.images, reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const createProduct = async () => {
    try {
      if (!newProd.title || !newProd.price) {
        alert("Title and price are required");
        return;
      }
      await API.post("/products", newProd);
      setShowAdd(false);
      setNewProd({
        title: "", price: "", discount: 0, stock: 0,
        description: "", category: "", images: [], featured: false,
      });
      load();
    } catch (error) {
      console.error("Error creating product:", error);
      alert(error.response?.data?.message || "Failed to create product");
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/products/${productId}`);
      load();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  const removeImage = (index) => {
    setNewProd((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const toggleFeatured = async (id, nextValue) => {
    const prevProducts = [...products];
    setProducts((list) =>
      list.map((p) =>
        p._id === id ? { ...p, featured: nextValue } : p
      )
    );
    try {
      await API.put(`/products/${id}/featured`, { featured: nextValue });
    } catch (err) {
      console.error("Featured update error:", err);
      setProducts(prevProducts);
    }
  };

  const filteredProducts = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerCaseSearch) ||
        p.categories?.[0]?.name?.toLowerCase().includes(lowerCaseSearch)
    );
  }, [products, searchTerm]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      <div className="flex gap-6 px-4 lg:px-8 py-10 max-w-[1600px] mx-auto">
        <AdminSidebar />

        <main className="flex-1">
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10 gap-6">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tight">
                Inventory <span className="text-emerald-500">Hub</span>
              </h2>
              <p className="text-slate-400 mt-1">Manage, track and update your store assets.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAdd(true)}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined">add</span>
                New Product
              </button>
              <button
                onClick={load}
                className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition text-slate-400"
              >
                <span className="material-symbols-outlined">refresh</span>
              </button>
            </div>
          </div>

          {/* SEARCH */}
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 pl-14 pr-6 bg-slate-900/50 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/40 transition-all outline-none"
            />
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500">
              search
            </span>
          </div>

          {/* TABLE */}
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center bg-slate-900/20 rounded-3xl border border-slate-800/50 backdrop-blur-sm">
              <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500">Fetching products...</p>
            </div>
          ) : (
            <div className="bg-slate-900/30 rounded-3xl border border-slate-800/60 overflow-hidden backdrop-blur-md shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/40 text-slate-400 text-xs uppercase tracking-[0.15em]">
                      <th className="py-5 px-6 font-bold">Product</th>
                      <th className="py-5 px-6 font-bold">Pricing</th>
                      <th className="py-5 px-6 font-bold">Inventory</th>
                      <th className="py-5 px-6 font-bold text-center">Featured</th>
                      <th className="py-5 px-6 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredProducts.map((p, idx) => (
                      <motion.tr
                        key={p._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hover:bg-slate-800/20 transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <img
                              src={p.images?.[0] || "/placeholder.jpg"}
                              className="w-12 h-12 rounded-lg object-cover bg-slate-800 border border-slate-700 shadow-inner"
                              alt=""
                            />
                            <div>
                              <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                                {p.title}
                              </div>
                              <div className="text-xs text-slate-500 font-medium">
                                {p.categories?.[0]?.name || "Uncategorized"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-white font-bold">₹{p.price}</div>
                          <div className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">
                            {p.discount}% OFF
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider border ${
                            p.stock > 10 ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500' :
                            p.stock > 0 ? 'border-amber-500/20 bg-amber-500/10 text-amber-500' :
                            'border-rose-500/20 bg-rose-500/10 text-rose-500'
                          }`}>
                            {p.stock} units
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => toggleFeatured(p._id, !p.featured)}
                            className={`w-10 h-5 rounded-full relative transition-all duration-300 mx-auto ${
                              p.featured ? "bg-emerald-500" : "bg-slate-700"
                            }`}
                          >
                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${p.featured ? "translate-x-5" : ""}`} />
                          </button>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/admin/products/edit/${p._id}`}
                              className="w-9 h-9 flex items-center justify-center bg-slate-800 text-slate-400 hover:text-white hover:bg-emerald-600 rounded-lg transition-all shadow-sm"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </Link>
                            <button
                              onClick={() => deleteProduct(p._id)}
                              className="w-9 h-9 flex items-center justify-center bg-slate-800 text-slate-400 hover:text-white hover:bg-rose-600 rounded-lg transition-all shadow-sm"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredProducts.length === 0 && (
                <div className="py-24 text-center">
                  <span className="material-symbols-outlined text-5xl text-slate-800 mb-2">inventory_2</span>
                  <p className="text-slate-500 font-medium">No results found in your catalog.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2rem] shadow-3xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-2xl font-black text-white">Add New Asset</h3>
                <button onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-white transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                {/* Product Title */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Title</label>
                  <input
                    className="w-full h-12 px-5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 outline-none transition-all"
                    placeholder="Product name"
                    value={newProd.title}
                    onChange={(e) => setNewProd({ ...newProd, title: e.target.value })}
                  />
                </div>

                {/* Price & Discount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Price (₹)</label>
                    <input
                      type="number"
                      className="w-full h-12 px-5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 outline-none transition-all"
                      placeholder="0.00"
                      value={newProd.price}
                      onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Discount (%)</label>
                    <input
                      type="number"
                      className="w-full h-12 px-5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 outline-none transition-all"
                      placeholder="0"
                      value={newProd.discount}
                      onChange={(e) => setNewProd({ ...newProd, discount: e.target.value })}
                    />
                  </div>
                </div>

                {/* Stock & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Stock Units</label>
                    <input
                      type="number"
                      className="w-full h-12 px-5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 outline-none transition-all"
                      placeholder="Quantity"
                      value={newProd.stock}
                      onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Category</label>
                    <select
                      className="w-full h-12 px-5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 outline-none transition-all appearance-none"
                      value={newProd.category}
                      onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    >
                      <option value="">Choose...</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Description</label>
                  <textarea
                    rows={3}
                    className="w-full p-5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 outline-none transition-all resize-none"
                    placeholder="Describe the product..."
                    value={newProd.description}
                    onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  />
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    id="feat"
                    className="w-5 h-5 accent-emerald-500"
                    checked={Boolean(newProd.featured)}
                    onChange={(e) => setNewProd({ ...newProd, featured: e.target.checked })}
                  />
                  <label htmlFor="feat" className="text-sm font-bold text-slate-300">Highlight this product as Featured</label>
                </div>

                {/* Image Upload Area */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Media</label>
                  <div className="grid grid-cols-4 gap-4">
                    {newProd.images.map((img, i) => (
                      <div key={i} className="relative group aspect-square">
                        <img src={img} className="w-full h-full object-cover rounded-xl border border-slate-700" alt="" />
                        <button onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-xl flex items-center justify-center cursor-pointer transition-all">
                      <input type="file" multiple className="hidden" onChange={handleImageUpload} />
                      <span className="material-symbols-outlined text-slate-600">add_a_photo</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-950/50 border-t border-slate-800 flex gap-4">
                <button
                  onClick={createProduct}
                  disabled={!newProd.title || !newProd.price}
                  className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/10"
                >
                  Confirm & Publish
                </button>
                <button
                  onClick={() => setShowAdd(false)}
                  className="px-6 h-12 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
                >
                  Discard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}