// // src/pages/admin/AdminOrders.jsx
// import React, { useEffect, useState } from "react";
// import API from "../../api/api";
// import AdminSidebar from "../../components/AdminSidebar";

// const STATUS_COLORS = {
//   pending: "bg-yellow-100 text-yellow-800",
//   processing: "bg-blue-100 text-blue-800",
//   shipped: "bg-indigo-100 text-indigo-800",
//   completed: "bg-green-100 text-green-800",
//   cancelled: "bg-red-100 text-red-800",
//   refunded: "bg-gray-100 text-gray-800",
// };

// export default function AdminOrders() {
//   const [orders, setOrders] = useState([]);
//   const [filter, setFilter] = useState("");
//   const [q, setQ] = useState("");

//   const load = React.useCallback(async () => {
//     const res = await API.get("/admin/orders", { params: { status: filter, q } });
//     setOrders(res.data);
//   }, [filter, q]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const updateStatus = async (orderId, status) => {
//     if (!confirm(`Change order ${orderId} to "${status}"?`)) return;
//     await API.put(`/admin/orders/${orderId}/status`, { status });
//     load();
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6 flex gap-6 font-display">

//       {/* LEFT SIDE—SIDEBAR */}
//       <AdminSidebar />

//       {/* RIGHT SIDE—MAIN CONTENT */}
//       <div className="flex-1 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm">

//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-black">Orders Management</h2>

//           <div className="flex gap-2">
//             <input
//               placeholder="Search order / email"
//               value={q}
//               onChange={(e) => setQ(e.target.value)}
//               className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800"
//             />

//             <select
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800"
//             >
//               <option value="">All statuses</option>
//               <option value="pending">Pending</option>
//               <option value="processing">Processing</option>
//               <option value="shipped">Shipped</option>
//               <option value="completed">Completed</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b text-left bg-gray-50 dark:bg-gray-700/40">
//                 <th className="p-3">Order</th>
//                 <th className="p-3">Customer</th>
//                 <th className="p-3">Vendor</th>
//                 <th className="p-3">Amount</th>
//                 <th className="p-3">Status</th>
//                 <th className="p-3">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {orders.map((o) => (
//                 <tr key={o._id} className="border-b">
//                   <td className="p-3">
//                     <div className="font-semibold">
//                       {o.orderNumber || o._id.slice(0, 8)}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {new Date(o.createdAt).toLocaleString()}
//                     </div>
//                   </td>

//                   <td className="p-3">
//                     {o.shipping?.name || o.customerName || o.customerEmail}
//                   </td>

//                   <td className="p-3">{o.vendor?.shopName || "—"}</td>

//                   <td className="p-3 font-bold">₹{o.totalAmount}</td>

//                   <td className="p-3">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs ${STATUS_COLORS[o.status]}`}
//                     >
//                       {o.status}
//                     </span>
//                   </td>

//                   <td className="p-3">
//                     <div className="flex gap-2">
//                       {o.status !== "shipped" && (
//                         <button
//                           onClick={() => updateStatus(o._id, "shipped")}
//                           className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded"
//                         >
//                           Ship
//                         </button>
//                       )}

//                       {o.status !== "completed" && (
//                         <button
//                           onClick={() => updateStatus(o._id, "completed")}
//                           className="px-3 py-1 bg-green-100 text-green-700 rounded"
//                         >
//                           Complete
//                         </button>
//                       )}

//                       {o.status !== "cancelled" && (
//                         <button
//                           onClick={() => updateStatus(o._id, "cancelled")}
//                           className="px-3 py-1 bg-red-100 text-red-700 rounded"
//                         >
//                           Cancel
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {orders.length === 0 && (
//             <div className="p-6 text-gray-500 text-center">
//               No orders found.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import AdminSidebar from "../../components/AdminSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-700 border-amber-200 ring-amber-500/20",
  processing: "bg-blue-100 text-blue-700 border-blue-200 ring-blue-500/20",
  shipped: "bg-purple-100 text-purple-700 border-purple-200 ring-purple-500/20",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200 ring-emerald-500/20",
  cancelled: "bg-rose-100 text-rose-700 border-rose-200 ring-rose-500/20",
  refunded: "bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20",
};

const STATUS_ICONS = {
  pending: "schedule",
  processing: "sync",
  shipped: "local_shipping",
  completed: "check_circle",
  cancelled: "cancel",
  refunded: "keyboard_return"
};

const STATUS_OPTIONS = [
  { value: "", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, revenue: 0 });

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/orders", { params: { status: filter, q: search } });
      setOrders(res.data);

      const completedOrders = res.data.filter(o => o.status === "completed");
      setStats({
        total: res.data.length,
        pending: res.data.filter(o => o.status === "pending").length,
        completed: completedOrders.length,
        revenue: completedOrders.reduce((sum, o) => sum + (o.total || 0), 0)
      });
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadOrders();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [filter, search]);

  const updateStatus = async (orderId, status) => {
    if (!confirm(`Move order to ${status.toUpperCase()}?`)) return;
    try {
      await API.put(`/admin/orders/${orderId}/status`, { status });
      toast.success(`Order marked as ${status}`);
      loadOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Status update failed");
    }
  };

  const getOrderItemsCount = (order) => order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />

      <main className="flex-1 p-4 lg:p-8 mt-16 max-w-[1400px] mx-auto">
        {/* HEADER SECTION */}
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Orders <span className="text-pink-600">Hub</span>
              </h1>
              <p className="text-slate-500 font-medium mt-1">Real-time commerce management & logistics</p>
            </div>
            
            <div className="flex items-center gap-3">
               <button onClick={loadOrders} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-pink-600 hover:border-pink-200 transition-all shadow-sm">
                  <span className="material-symbols-outlined block">refresh</span>
               </button>
            </div>
          </div>
        </header>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Volume', value: stats.total, icon: 'analytics', color: 'blue' },
            { label: 'In Queue', value: stats.pending, icon: 'hourglass_empty', color: 'amber' },
            { label: 'Completed', value: stats.completed, icon: 'verified', color: 'emerald' },
            { label: 'Net Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: 'payments', color: 'pink' },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl bg-${item.color}-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <span className={`material-symbols-outlined text-${item.color}-600`}>{item.icon}</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                <h3 className="text-2xl font-black text-slate-800">{item.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ACTION BAR */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 shadow-sm">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              type="text" placeholder="Search by ID, Customer Name, or Email..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-pink-500/20 transition-all text-slate-700"
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-pink-500/20 text-slate-700 font-medium"
              value={filter} onChange={(e) => setFilter(e.target.value)}
            >
              {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>

        {/* MAIN DATA TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 font-bold text-slate-400">Syncing orders...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase">Order Details</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase">Customer</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase">Inventory</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase">Revenue</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase">Logistics</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence>
                    {orders.map((order, idx) => (
                      <motion.tr 
                        key={order._id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <p className="font-bold text-slate-900 leading-tight">
                            {order.orderNumber || `#${order._id.slice(-6).toUpperCase()}`}
                          </p>
                          <p className="text-xs font-medium text-slate-400 mt-1">{formatDateTime(order.createdAt)}</p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-700">{order.user?.name || 'Guest'}</span>
                            <span className="text-xs text-slate-400">{order.user?.email || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                             <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                               {getOrderItemsCount(order)} Units
                             </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="font-black text-slate-900">₹{order.total?.toLocaleString()}</span>
                          <p className="text-[10px] uppercase font-bold text-slate-400">{order.paymentMethod}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ring-4 ${STATUS_COLORS[order.status]}`}>
                            <span className="material-symbols-outlined text-sm">{STATUS_ICONS[order.status]}</span>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => setSelectedOrder(order)}
                              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-pink-600 hover:text-white transition-all shadow-sm"
                            >
                              <span className="material-symbols-outlined text-xl">visibility</span>
                            </button>
                            <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>
                            {order.status !== 'completed' && order.status !== 'cancelled' && (
                              <button 
                                onClick={() => updateStatus(order._id, 'completed')}
                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                              >
                                <span className="material-symbols-outlined text-xl">done_all</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {!loading && orders.length === 0 && (
                <div className="py-20 text-center">
                   <span className="material-symbols-outlined text-6xl text-slate-200">order_approve</span>
                   <p className="mt-4 text-slate-500 font-bold text-lg">No orders matched your criteria</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MODAL SYSTEM */}
        <AnimatePresence>
          {selectedOrder && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedOrder(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-black text-slate-900">
                        {selectedOrder.orderNumber || `#${selectedOrder._id.toUpperCase()}`}
                      </h2>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_COLORS[selectedOrder.status]}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <p className="text-slate-500 font-medium text-sm mt-1">Placed on {formatDateTime(selectedOrder.createdAt)}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="w-12 h-12 rounded-2xl hover:bg-white flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all shadow-sm border border-transparent hover:border-slate-200">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Customer & Shipping */}
                    <div className="space-y-6">
                      <section>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Customer Contact</h4>
                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                           <p className="font-black text-slate-800 text-lg">{selectedOrder.user?.name || selectedOrder.shippingAddress?.name}</p>
                           <p className="text-slate-500 font-medium">{selectedOrder.user?.email}</p>
                           <p className="text-slate-500 font-medium mt-1">{selectedOrder.shippingAddress?.phone}</p>
                        </div>
                      </section>
                      <section>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Logistics Address</h4>
                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                           <p className="text-slate-700 font-bold leading-relaxed">
                            {selectedOrder.shippingAddress?.address}<br/>
                            {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}<br/>
                            <span className="text-pink-600 font-black">{selectedOrder.shippingAddress?.pincode}</span>
                           </p>
                        </div>
                      </section>
                    </div>

                    {/* Order items */}
                    <section>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Package Contents</h4>
                      <div className="space-y-3">
                        {selectedOrder.items?.map((item, i) => (
                          <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                            <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                              <span className="material-symbols-outlined text-3xl">inventory_2</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-slate-800 line-clamp-1">{item.title || "Product Item"}</p>
                              <p className="text-xs font-bold text-slate-400">Qty: {item.quantity || 1} × ₹{item.price}</p>
                            </div>
                            <div className="text-right font-black text-slate-900">
                              ₹{(item.price * (item.quantity || 1)).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* Pricing Summary */}
                  <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/20 blur-3xl -mr-16 -mt-16"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase mb-1">Subtotal</p>
                        <p className="text-xl font-bold">₹{selectedOrder.total?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase mb-1">Tax/Gst</p>
                        <p className="text-xl font-bold">Included</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase mb-1">Discount</p>
                        <p className="text-xl font-bold text-rose-400">-₹{selectedOrder.discount || 0}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-pink-400 text-xs font-black uppercase mb-1">Total Payable</p>
                        <p className="text-3xl font-black text-white">₹{(selectedOrder.finalAmount || selectedOrder.total).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50/30">
                  <div className="flex gap-2">
                    <span className="material-symbols-outlined text-slate-400">info</span>
                    <p className="text-xs font-bold text-slate-400 max-w-[200px]">Inventory is automatically adjusted upon completion.</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setSelectedOrder(null)} className="px-8 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition-all">Dismiss</button>
                    <button className="px-8 py-3 bg-pink-600 text-white rounded-2xl font-bold shadow-lg shadow-pink-200 hover:bg-pink-700 hover:-translate-y-0.5 transition-all">Print Invoice</button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}