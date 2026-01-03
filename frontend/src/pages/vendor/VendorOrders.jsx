// import React, { useEffect, useState } from "react";
// import VendorSidebar from "../../components/vendor/VendorSidebar";
// import VendorTopbar from "../../components/vendor/VendorTopbar";
// import API from "../../api/api";
// import { useToast } from "../../components/Toast";
// import { motion, AnimatePresence } from "framer-motion";

// import {
//   Eye,
//   Package,
//   User,
//   IndianRupee,
//   Phone,
//   MapPin,
//   X,
// } from "lucide-react";

// const statusColors = {
//   processing: "bg-yellow-100 text-yellow-700",
//   packed: "bg-blue-100 text-blue-700",
//   shipped: "bg-purple-100 text-purple-700",
//   delivered: "bg-green-100 text-green-700",
//   cancelled: "bg-red-100 text-red-700",
// };

// export default function VendorOrders() {
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const { toast } = useToast();

//   const vendor = JSON.parse(localStorage.getItem("vendor"));
//   const vendorId = vendor?._id;

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   const loadOrders = async () => {
//     try {
//       const { data } = await API.get("/vendor/orders");
//       setOrders(data);
//     } catch (err) {
//       toast.error("Could not load orders");
//     }
//   };

//   const updateStatus = async (id, status) => {
//   try {
//     await API.put(`/orders/${id}/status`, { status })


//     setOrders(o =>
//       o.map(ord => (ord._id === id ? { ...ord, status } : ord))
//     );

//     toast.success("Order status updated!");
//   } catch (err) {
//     console.log("UPDATE ERROR", err.response?.data || err.message);
//     toast.error("Update failed",err);
//   }
// };


//   return (
//     <div className="flex min-h-screen">
//       <VendorSidebar />

//       <div className="flex-1">
//         <VendorTopbar title="Orders" />

//         <main className="p-6">
//           <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>

//           {orders.length === 0 ? (
//             <div className="p-10 text-center bg-white dark:bg-gray-900 rounded-xl shadow border">
//               <Package className="w-12 h-12 mx-auto text-gray-400 mb-3" />
//               <p className="text-xl text-gray-500">No orders yet</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {orders.map((o, idx) => (
//                 <motion.div
//                   key={o._id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: idx * 0.05 }}
//                   className="bg-white dark:bg-gray-900 p-5 rounded-xl border shadow-sm hover:shadow-md transition"
//                 >
//                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

//                     {/* LEFT */}
//                     <div>
//                       <div className="text-lg font-semibold flex items-center gap-2">
//                         <Package className="w-5 text-primary" />
//                         #{o._id.slice(-6)}
//                       </div>

//                       <div className="flex items-center gap-2 text-sm text-gray-700 mt-2">
//                         <User className="w-4" />
//                         {o.user?.name}
//                       </div>

//                       <div className="text-sm text-gray-500">{o.user?.email}</div>

//                       <div className="text-sm text-gray-500">
//                         <Phone className="w-4 inline-block mr-1" />
//                         {o.shippingAddress?.phone}
//                       </div>

//                       <div className="text-sm text-gray-500">
//                         <MapPin className="w-4 inline-block mr-1" />
//                         {o.shippingAddress?.address}
//                       </div>

//                       <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
//                         <IndianRupee className="w-4" />
//                         {o.vendorTotal} • {o.vendorItems.length} item(s)
//                       </div>
//                     </div>

//                     {/* RIGHT */}
//                     <div className="flex flex-col md:flex-row items-center gap-3">
//                       <span
//                         className={`px-3 py-1 text-sm rounded-full font-medium ${statusColors[o.status]}`}
//                       >
//                         {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
//                       </span>

//                       <select
//                         value={o.status}
//                         onChange={e => updateStatus(o._id, e.target.value)}
//                         className="p-2 rounded-lg border bg-gray-50 dark:bg-gray-800"
//                       >
//                         <option value="processing">Processing</option>
//                         <option value="packed">Packed</option>
//                         <option value="shipped">Shipped</option>
//                         <option value="delivered">Delivered</option>
//                         <option value="cancelled">Cancelled</option>
//                       </select>

//                       <button
//                         className="p-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//                         onClick={() => setSelectedOrder(o)}
//                       >
//                         <Eye className="w-5" />
//                       </button>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </main>
//       </div>

//       {/* MODAL */}
//       <AnimatePresence>
//         {selectedOrder && (
//           <motion.div
//             key="modal"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl max-w-lg w-full relative"
//             >
//               <button
//                 onClick={() => setSelectedOrder(null)}
//                 className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
//               >
//                 <X className="w-5" />
//               </button>

//               <h2 className="text-xl font-bold mb-4">Order Details</h2>

//               <p className="text-gray-700">
//                 <strong>Order ID:</strong> #{selectedOrder._id.slice(-6)}
//               </p>

//               <p className="mt-2">
//                 <strong>Customer:</strong> {selectedOrder.user?.name}
//                 <br />
//                 <strong>Email:</strong> {selectedOrder.user?.email}
//                 <br />
//                 <strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}
//                 <br />
//                 <strong>Address:</strong> {selectedOrder.shippingAddress?.address}
//               </p>

//               <h3 className="mt-4 font-semibold">Items from your shop:</h3>

//               <ul className="mt-2 space-y-2">
//                 {selectedOrder.vendorItems.map(item => (
//                   <li key={item._id} className="border p-2 rounded">
//                     {item.product?.title} — ₹{item.price} × {item.qty}
//                   </li>
//                 ))}
//               </ul>

//               <p className="mt-4 text-lg font-bold">
//                 Total: ₹{selectedOrder.vendorTotal}
//               </p>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import VendorSidebar from "../../components/vendor/VendorSidebar";
import VendorTopbar from "../../components/vendor/VendorTopbar";
import API from "../../api/api";
import { useToast } from "../../components/Toast";
import { motion as Motion, AnimatePresence } from "framer-motion";

import {
  Eye,
  Package,
  User,
  IndianRupee,
  Phone,
  MapPin,
  X,
} from "lucide-react";

const pinkBadge = "bg-pink-100 text-pink-700 border border-pink-300";

const statusColors = {
  processing: pinkBadge,
  packed: pinkBadge,
  shipped: pinkBadge,
  delivered: pinkBadge,
  cancelled: "bg-red-200 text-red-700 border border-red-300",
};

export default function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { toast } = useToast();

  const loadOrders = React.useCallback(async () => {
    try {
      const { data } = await API.get("/vendor/orders");
      setOrders(data);
    } catch {
      toast.error("Could not load orders");
    }
  }, [toast]);

  useEffect(() => {
    const t = setTimeout(() => {
      loadOrders();
    }, 0);
    return () => clearTimeout(t);
  }, [loadOrders]);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      setOrders((o) =>
        o.map((ord) => (ord._id === id ? { ...ord, status } : ord))
      );
      toast.success("Order status updated!");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="flex bg-white min-h-screen">
      <VendorSidebar />

      <div className="flex-1">
        <VendorTopbar title="Orders" />

        <main className="p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-pink-600 mb-6">Orders</h2>

          {/* NO ORDERS */}
          {orders.length === 0 ? (
            <div className="p-10 text-center rounded-xl border bg-pink-50">
              <Package className="w-12 h-12 mx-auto text-pink-400 mb-3" />
              <p className="text-xl text-pink-500">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o, idx) => (
                <Motion.div
                  key={o._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="bg-white border border-pink-100 shadow-sm p-5 rounded-xl hover:shadow-md transition"
                >
                  {/* CONTENT */}
                  <div className="flex justify-between gap-4 flex-wrap">

                    {/* LEFT */}
                    <div className="space-y-1">
                      <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                        <Package className="w-5 text-pink-500" /> #
                        {o._id.slice(-6)}
                      </h4>

                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <User className="w-4 text-pink-400" />
                        {o.user?.name}
                      </div>

                      <p className="text-xs text-gray-500">{o.user?.email}</p>

                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone className="w-3 text-pink-400" />
                        {o.shippingAddress?.phone}
                      </p>

                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 text-pink-400" />
                        {o.shippingAddress?.address}
                      </p>

                      <div className="mt-2 space-y-1">
                        {(o.vendorItems || []).slice(0, 3).map((i) => (
                          <div key={i._id} className="text-xs text-gray-600">
                            {(i.title || i.product)} — Qty: {i.quantity || i.qty || 1}
                          </div>
                        ))}
                        {(o.vendorItems || []).length > 3 && (
                          <div className="text-xs text-gray-400">
                            +{(o.vendorItems || []).length - 3} more items
                          </div>
                        )}
                      </div>

                      <p className="flex items-center gap-1 text-gray-700 mt-1 font-medium text-sm">
                        <IndianRupee className="w-4 text-pink-500" />
                        {o.vendorTotal} • {(o.vendorItems || []).reduce((s, i) => s + (i.quantity || i.qty || 1), 0)} items
                      </p>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[o.status]}`}
                      >
                        {o.status}
                      </span>

                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                        className="p-2 rounded-lg border border-pink-200 bg-pink-50 text-pink-700 text-xs"
                      >
                        <option value="processing">Processing</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="p-2 rounded-lg border border-pink-200 text-pink-600 hover:bg-pink-50"
                      >
                        <Eye className="w-4" />
                      </button>
                    </div>
                  </div>
                </Motion.div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <Motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/30 flex items-center justify-center px-4"
          >
            <div className="bg-white p-6 rounded-xl border-2 border-pink-200 max-w-md w-full">
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute right-5"
              >
                <X className="w-5 text-pink-600" />
              </button>

              <h2 className="text-xl font-bold text-pink-600 mb-3">
                Order Details
              </h2>

              <p className="text-gray-700 text-sm">
                <strong>ID:</strong> #{selectedOrder._id.slice(-6)}
              </p>

              <div className="mt-3 space-y-1 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-4 text-pink-500" />
                  <span className="font-medium">{selectedOrder.user?.name || "Customer"}</span>
                </div>
                {selectedOrder.user?.email && (
                  <div className="text-gray-500">{selectedOrder.user.email}</div>
                )}
                {selectedOrder.shippingAddress?.phone && (
                  <div className="text-gray-500 flex items-center gap-1">
                    <Phone className="w-4 text-pink-500" />
                    {selectedOrder.shippingAddress.phone}
                  </div>
                )}
                {selectedOrder.shippingAddress?.address && (
                  <div className="text-gray-500 flex items-center gap-1">
                    <MapPin className="w-4 text-pink-500" />
                    {selectedOrder.shippingAddress.address}
                  </div>
                )}
              </div>

              <h3 className="font-semibold mt-4">Items ({(selectedOrder.vendorItems || []).reduce((s, i) => s + (i.quantity || i.qty || 1), 0)}):</h3>
              <div className="mt-2 space-y-2">
                {selectedOrder.vendorItems.map((i) => (
                  <div key={i._id} className="p-2 bg-pink-50 rounded border border-pink-200 text-sm">
                    {(i.title || i.product)} — Qty: {i.quantity || i.qty || 1}
                  </div>
                ))}
              </div>

              <p className="mt-4 text-lg font-bold text-pink-600">
                Total: ₹{selectedOrder.vendorTotal}
              </p>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
