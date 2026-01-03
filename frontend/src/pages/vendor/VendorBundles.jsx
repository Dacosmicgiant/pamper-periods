// import React, { useEffect, useState } from "react";
// import VendorSidebar from "../../components/vendor/VendorSidebar";
// import VendorTopbar from "../../components/vendor/VendorTopbar";
// import API from "../../api/api";
// import { Link } from "react-router-dom";
// import { PlusCircle, Edit, Trash2, Package } from "lucide-react";

// export default function VendorBundles() {
//   const [bundles, setBundles] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadBundles = async () => {
//     try {
//       setLoading(true);
//       const { data } = await API.get("/vendor/bundles");
//       setBundles(data);
//     } catch (err) {
//       console.log(err.response?.data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadBundles();
//   }, []);

//   const deleteBundle = async (id) => {
//     if (!confirm("Are you sure you want to delete this bundle?")) return;

//     try {
//       await API.delete(`/vendor/bundles/${id}`);
//       loadBundles();
//     } catch {
//       alert("Failed to delete bundle");
//     }
//   };

//   return (
//     <div className="flex">
//       <VendorSidebar />

//       <div className="flex-1">
//         <VendorTopbar title="Bundles" />

//         <main className="p-6">

//           {/* HEADER */}
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold">Your Bundles</h2>

//             <Link
//               to="/vendor/bundles/new"
//               className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
//             >
//               <PlusCircle className="w-5" />
//               Add New Bundle
//             </Link>
//           </div>

//           {/* LOADING */}
//           {loading && (
//             <div className="text-center py-20">
//               <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
//               <p className="mt-3 text-gray-500">Loading bundles...</p>
//             </div>
//           )}

//           {/* EMPTY */}
//           {!loading && bundles.length === 0 && (
//             <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl border shadow">
//               <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
//               <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Bundles Found</h3>
//               <p className="text-gray-500 mt-2">Create your first bundle!</p>

//               <Link
//                 to="/vendor/bundles/new"
//                 className="inline-block mt-5 px-6 py-3 bg-primary text-white rounded-lg shadow hover:opacity-90"
//               >
//                 Create Bundle
//               </Link>
//             </div>
//           )}

//           {/* GRID VIEW */}
//           {!loading && bundles.length > 0 && (
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//               {bundles.map((b) => (
//                 <div
//                   key={b._id}
//                   className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border p-5 hover:shadow-md transition"
//                 >
//                   {/* Image */}
//                   <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 mb-4">
//                     {b.images?.length > 0 ? (
//                       <img
//                         src={b.images[0]}
//                         className="w-full h-full object-cover"
//                         alt={b.title}
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center text-gray-400">
//                         <Package className="w-10 h-10" />
//                       </div>
//                     )}
//                   </div>

//                   {/* Title */}
//                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
//                     {b.title}
//                   </h3>

//                   {/* Price */}
//                   {/* Price */}
// <div className="mt-2">
//   {b.discountPercent > 0 && (
//     <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded">
//       {b.discountPercent}% OFF
//     </span>
//   )}

//   <div className="text-primary font-bold text-xl mt-1">
//     ₹{b.price}
//   </div>

//   {b.oldPrice && (
//     <div className="text-sm text-gray-500 line-through">
//       ₹{b.oldPrice}
//     </div>
//   )}
// </div>


//                   {/* Item Count */}
//                   <p className="text-sm text-gray-500 mt-1">
//                     {b.items?.length || 0} items included
//                   </p>
//                   <p className="mt-2 text-sm text-gray-600">
//   Stock:{" "}
//   <span className={b.stock > 0 ? "text-green-600" : "text-red-600"}>
//     {b.stock > 0 ? b.stock : "Out of stock"}
//   </span>
// </p>

//                   {/* Status */}
//                   <span
//                     className={`mt-3 inline-block px-3 py-1 text-sm rounded-full ${
//                       b.isActive
//                         ? "bg-green-100 text-green-700"
//                         : "bg-gray-200 text-gray-700"
//                     }`}
//                   >
//                     {b.isActive ? "Active" : "Inactive"}
//                   </span>

//                   {/* ACTIONS */}
//                   <div className="flex items-center justify-between mt-5 pt-4 border-t">
//                     <Link
//                       to={`/vendor/bundles/${b._id}/edit`}
//                       className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
//                     >
//                       <Edit className="w-4" />
//                       Edit
//                     </Link>

//                     <button
//                       onClick={() => deleteBundle(b._id)}
//                       className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//                     >
//                       <Trash2 className="w-4" />
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//         </main>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import VendorSidebar from "../../components/vendor/VendorSidebar";
import VendorTopbar from "../../components/vendor/VendorTopbar";
import API from "../../api/api";
import { Link } from "react-router-dom";
import { PlusCircle, Edit, Trash2, Package, Eye, BarChart3, TrendingUp, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VendorBundles() {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    outOfStock: 0,
    totalRevenue: 0
  });
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [statusFilter, setStatusFilter] = useState("all");

  const loadBundles = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/vendor/bundles");
      setBundles(data);
      
      // Calculate stats
      const activeBundles = data.filter(b => b.isActive);
      const outOfStockBundles = data.filter(b => b.stock === 0);
      const totalRevenue = data.reduce((sum, b) => sum + (b.price * (b.sold || 0)), 0);
      
      setStats({
        total: data.length,
        active: activeBundles.length,
        outOfStock: outOfStockBundles.length,
        totalRevenue: totalRevenue
      });
    } catch (err) {
      console.log("Error loading bundles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBundles();
  }, []);

  const deleteBundle = async (id) => {
    if (!confirm("Are you sure you want to delete this bundle? This action cannot be undone.")) return;

    try {
      await API.delete(`/vendor/bundles/${id}`);
      loadBundles();
    } catch {
      alert("Failed to delete bundle");
    }
  };

  // Filter bundles based on status
  const filteredBundles = bundles.filter(bundle => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return bundle.isActive;
    if (statusFilter === "inactive") return !bundle.isActive;
    if (statusFilter === "outOfStock") return bundle.stock === 0;
    if (statusFilter === "inStock") return bundle.stock > 0;
    return true;
  });

  const calculateDiscount = (price, oldPrice) => {
    if (!oldPrice || oldPrice <= price) return 0;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <VendorSidebar />

      <div className="flex-1">
        <VendorTopbar title="Bundle Management" />

        <main className="p-4 lg:p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Bundles</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
                </div>
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-pink-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Header with Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Bundles</h2>
              <p className="text-gray-600 mt-1">Manage and organize your product bundles</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
              {/* View Mode Toggle */}
              <div className="flex bg-white border border-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 rounded-md flex items-center gap-2 transition-colors ${
                    viewMode === "grid" 
                      ? "bg-pink-600 text-white" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">grid_view</span>
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 rounded-md flex items-center gap-2 transition-colors ${
                    viewMode === "list" 
                      ? "bg-pink-600 text-white" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">list</span>
                  List
                </button>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              >
                <option value="all">All Bundles</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="inStock">In Stock</option>
                <option value="outOfStock">Out of Stock</option>
              </select>

              {/* Add New Button */}
              <Link
                to="/vendor/bundles/new"
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                Add New Bundle
              </Link>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading bundles...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredBundles.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Bundles Found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {statusFilter !== "all" 
                  ? `No bundles match your filter criteria. Try changing your filters.`
                  : `You haven't created any bundles yet. Start by creating your first bundle package.`}
              </p>
              <Link
                to="/vendor/bundles/new"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <PlusCircle className="w-5 h-5" />
                Create Your First Bundle
              </Link>
            </div>
          )}

          {/* Bundles Grid View */}
          {!loading && viewMode === "grid" && filteredBundles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredBundles.map((bundle, index) => (
                  <motion.div
                    key={bundle._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      {bundle.images?.length > 0 ? (
                        <img
                          src={bundle.images[0]}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          alt={bundle.title}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Discount Badge */}
                      {bundle.oldPrice && bundle.oldPrice > bundle.price && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          {calculateDiscount(bundle.price, bundle.oldPrice)}% OFF
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${
                        bundle.isActive 
                          ? "bg-green-100 text-green-700" 
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {bundle.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-2">
                        {bundle.title}
                      </h3>

                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {bundle.description || "No description available"}
                      </p>

                      {/* Price */}
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-gray-900">₹{bundle.price}</span>
                          {bundle.oldPrice && bundle.oldPrice > bundle.price && (
                            <span className="text-lg text-gray-500 line-through">₹{bundle.oldPrice}</span>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="text-center">
                          <div className="text-sm font-semibold text-gray-900">{bundle.items?.length || 0}</div>
                          <div className="text-xs text-gray-500">Items</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-sm font-semibold ${bundle.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                            {bundle.stock || 0}
                          </div>
                          <div className="text-xs text-gray-500">Stock</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-gray-900">{bundle.sold || 0}</div>
                          <div className="text-xs text-gray-500">Sold</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <Link
                          to={`/vendor/bundles/${bundle._id}/edit`}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteBundle(bundle._id)}
                          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Bundles List View */}
          {!loading && viewMode === "list" && filteredBundles.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Product</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Price</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Stock</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBundles.map((bundle, index) => (
                      <tr 
                        key={bundle._id} 
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                              {bundle.images?.length > 0 ? (
                                <img 
                                  src={bundle.images[0]} 
                                  className="w-full h-full object-cover"
                                  alt={bundle.title}
                                />
                              ) : (
                                <Package className="w-8 h-8 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{bundle.title}</h4>
                              <p className="text-sm text-gray-500">{bundle.items?.length || 0} items</p>
                              {bundle.sold > 0 && (
                                <p className="text-xs text-gray-500">{bundle.sold} sold</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="font-bold text-gray-900">₹{bundle.price}</div>
                            {bundle.oldPrice && bundle.oldPrice > bundle.price && (
                              <div className="text-sm text-gray-500 line-through">₹{bundle.oldPrice}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
                            bundle.stock > 10 ? "bg-green-100 text-green-700" :
                            bundle.stock > 0 ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {bundle.stock > 0 ? `${bundle.stock} in stock` : "Out of stock"}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
                            bundle.isActive 
                              ? "bg-green-100 text-green-700" 
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {bundle.isActive ? "Active" : "Inactive"}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/vendor/bundles/${bundle._id}`}
                              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/vendor/bundles/${bundle._id}/edit`}
                              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => deleteBundle(bundle._id)}
                              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination/Info */}
          {!loading && filteredBundles.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-500">
                Showing <span className="font-semibold">{filteredBundles.length}</span> of <span className="font-semibold">{bundles.length}</span> bundles
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-semibold">{stats.active}</span> active • 
                <span className="font-semibold text-green-600 mx-2">{stats.total - stats.outOfStock}</span> in stock •
                <span className="font-semibold text-red-600 mx-2">{stats.outOfStock}</span> out of stock
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}