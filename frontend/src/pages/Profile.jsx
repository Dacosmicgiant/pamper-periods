// import React, { useEffect, useState } from "react";
// import useAuth from "../hooks/useAuth";
// import API from "../api/api";
// import { Link } from "react-router-dom";

// export default function Profile() {
//   const { user } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [addresses, setAddresses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [editMode, setEditMode] = useState(false);
//   const [editName, setEditName] = useState("");
//   const [editAvatar, setEditAvatar] = useState("");

//   const loadData = async () => {
//     try {
//       const [ordersRes, addrRes] = await Promise.all([
//         API.get("/user/orders"),
//         API.get("/user/addresses"),
//       ]);

//       setOrders(ordersRes.data);
//       setAddresses(addrRes.data);
//     } catch (err) {
//       console.log("LOAD ERROR", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!user) return;
//     setEditName(user.name || "");
//     setEditAvatar(user.avatar || "");
//     loadData();
//   }, [user]);

//   const updateProfile = async () => {
//     try {
//       const { data } = await API.put("/user/me", {
//         name: editName,
//         avatar: editAvatar,
//       });
//       localStorage.setItem("user", JSON.stringify(data));
//       window.location.reload();
//     } catch (err) {
//       alert("Update failed");
//     }
//   };

//   if (!user)
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <Link to="/login">Login required</Link>
//       </div>
//     );

//   if (loading)
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         Loading...
//       </div>
//     );

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">My Account</h1>

//       {/* Profile Section */}
//       <div className="bg-white p-6 rounded-xl shadow mb-8">
//         {!editMode ? (
//           <>
//             <h2 className="text-xl font-bold">{user.name}</h2>
//             <p className="text-gray-600">{user.email}</p>
//             <button
//               onClick={() => setEditMode(true)}
//               className="mt-4 bg-pink-600 text-white px-5 py-2 rounded-lg"
//             >
//               Edit Profile
//             </button>
//           </>
//         ) : (
//           <div className="space-y-4">
//             <input
//               className="border p-2 w-full rounded"
//               value={editName}
//               onChange={(e) => setEditName(e.target.value)}
//             />
//             <input
//               className="border p-2 w-full rounded"
//               value={editAvatar}
//               onChange={(e) => setEditAvatar(e.target.value)}
//             />

//             <button
//               onClick={updateProfile}
//               className="bg-green-600 text-white px-5 py-2 rounded-lg"
//             >
//               Save
//             </button>
//             <button
//               onClick={() => setEditMode(false)}
//               className="ml-3 bg-gray-300 px-5 py-2 rounded-lg"
//             >
//               Cancel
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Addresses */}
//       <div className="bg-white p-6 rounded-xl shadow mb-8">
//         <div className="flex justify-between mb-4">
//           <h2 className="text-xl font-bold">Saved Addresses</h2>
//           <Link
//             to="/add-address"
//             className="bg-pink-600 text-white px-4 py-2 rounded-lg"
//           >
//             + Add
//           </Link>
//         </div>

//         {addresses.map((a) => (
//           <div key={a._id} className="border p-4 rounded-lg mb-3">
//             <p className="font-bold">{a.name}</p>
//             <p>{a.address}</p>
//             <p>
//               {a.city}, {a.state} - {a.pincode}
//             </p>
//             <p>📞 {a.phone}</p>

//             <Link
//               to={`/edit-address/${a._id}`}
//               className="text-blue-600 underline mt-2 inline-block"
//             >
//               Edit
//             </Link>
//           </div>
//         ))}
//       </div>

//       {/* Orders */}
//       <div className="bg-white p-6 rounded-xl shadow">
//         <h2 className="text-xl font-bold mb-4">Orders</h2>

//         {orders.length === 0 ? (
//           <p>No orders</p>
//         ) : (
//           orders.map((o) => (
//             <Link
//               key={o._id}
//               to={`/order/${o._id}`}
//               className="block border p-4 rounded-lg mb-3"
//             >
//               <p className="font-bold">Order #{o._id.slice(-6)}</p>
//               <p>₹{o.total}</p>
//             </Link>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import API from "../api/api";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");

  const loadData = async () => {
    try {
      const [ordersRes, addrRes] = await Promise.all([
        API.get("/user/orders"),
        API.get("/user/addresses"),
      ]);

      setOrders(ordersRes.data);
      setAddresses(addrRes.data);
    } catch (err) {
      console.log("LOAD ERROR", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    setEditName(user.name || "");
    setEditAvatar(user.avatar || "");
    loadData();
  }, [user]);

  const updateProfile = async () => {
    try {
      const { data } = await API.put("/user/me", {
        name: editName,
        avatar: editAvatar,
      });
      localStorage.setItem("user", JSON.stringify(data));
      window.location.reload();
    } catch (err) {
      alert("Update failed");
    }
  };

  // =================== AUTH GUARD ===================
  if (!user)
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full p-6 sm:p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🔒</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-5 sm:mb-6 text-sm sm:text-base">
            Please login to access your profile
          </p>
          <Link
            to="/login"
            className="inline-block w-full sm:w-auto text-center px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );

  // =================== LOADING STATE ===================
  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-pink-600 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-gray-700 font-medium text-sm sm:text-base">
            Loading your profile...
          </p>
        </div>
      </div>
    );

  // =================== MAIN LAYOUT ===================
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6 sm:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            My Account
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage your profile, addresses, and orders
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* ================= LEFT: PROFILE + ORDERS ================= */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                {/* Avatar */}
                <div className="relative self-center sm:self-start">
                  <img
                    src={
                      user.avatar ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    }
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-lg"
                    alt="Profile"
                  />
                  <div className="absolute -bottom-1.5 sm:-bottom-2 -right-1.5 sm:-right-2 bg-pink-500 text-white p-1.5 sm:p-2 rounded-full">
                    <span className="material-symbols-outlined text-base sm:text-lg">
                      person
                    </span>
                  </div>
                </div>

                {/* Info / Edit */}
                <div className="flex-1 w-full">
                  {!editMode ? (
                    <>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                          {user.name}
                        </h3>
                        <span className="px-2.5 sm:px-3 py-1 bg-blue-100 text-blue-700 text-[11px] sm:text-xs font-semibold rounded-full">
                          {user.role || "Customer"}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base break-all">
                        <span className="material-symbols-outlined text-gray-400 text-base sm:text-lg">
                          mail
                        </span>
                        {user.email}
                      </p>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        Member since{" "}
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>

                      <button
                        onClick={() => setEditMode(true)}
                        className="mt-4 w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-1.5 sm:gap-2"
                      >
                        <span className="material-symbols-outlined text-sm sm:text-base">
                          edit
                        </span>
                        Edit Profile
                      </button>
                    </>
                  ) : (
                    <div className="space-y-4 w-full">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          Full Name
                        </label>
                        <input
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm sm:text-base"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Enter your name"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          Profile Image URL
                        </label>
                        <input
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm sm:text-base"
                          value={editAvatar}
                          onChange={(e) => setEditAvatar(e.target.value)}
                          placeholder="https://example.com/avatar.jpg"
                        />
                        {editAvatar && (
                          <div className="mt-2 flex items-center gap-2">
                            <p className="text-xs sm:text-sm text-gray-500">
                              Preview:
                            </p>
                            <img
                              src={editAvatar}
                              className="w-10 h-10 sm:w-16 sm:h-16 rounded-full object-cover border"
                              alt="Preview"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6">
                        <button
                          onClick={updateProfile}
                          className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex-1 flex items-center justify-center gap-1.5 sm:gap-2"
                        >
                          <span className="material-symbols-outlined text-sm sm:text-base">
                            check
                          </span>
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditMode(false)}
                          className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 text-gray-700 text-sm sm:text-base font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 flex-1 flex items-center justify-center gap-1.5 sm:gap-2"
                        >
                          <span className="material-symbols-outlined text-sm sm:text-base">
                            close
                          </span>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Orders Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Order History
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Your recent purchases
                  </p>
                </div>
                <span className="self-start sm:self-auto px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-full">
                  {orders.length} orders
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-8 sm:py-10 px-4">
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">📦</div>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                    No orders yet
                  </p>
                  <Link
                    to="/products"
                    className="inline-block px-5 sm:px-6 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <Link
                      key={o._id}
                      to={`/order/${o._id}`}
                      className="block bg-gradient-to-r from-white to-gray-50 p-4 sm:p-5 rounded-xl border border-gray-100 hover:border-pink-300 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2.5 sm:gap-3 mb-1.5 sm:mb-2">
                            <span className="material-symbols-outlined text-gray-400 text-base sm:text-lg">
                              receipt_long
                            </span>
                            <p className="font-bold text-gray-900 text-sm sm:text-base break-all">
                              Order #{o._id.slice(-8).toUpperCase()}
                            </p>
                          </div>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            {new Date(o.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>

                        <div className="flex flex-col items-start sm:items-end">
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">
                            ₹{o.total?.toLocaleString()}
                          </p>
                          <span
                            className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold mt-1.5 sm:mt-2 ${
                              o.status === "delivered"
                                ? "bg-green-100 text-green-700"
                                : o.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : o.status === "shipped"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {o.status?.charAt(0).toUpperCase() +
                              o.status?.slice(1) || "Processing"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                        <p className="text-xs sm:text-sm text-gray-600">
                          Items:{" "}
                          {o.items?.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          ) || 1}{" "}
                          products
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT: ADDRESSES + STATS + QUICK ================= */}
          <div className="space-y-6 lg:space-y-8">
            {/* Addresses Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Saved Addresses
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Your delivery locations
                  </p>
                </div>
                <Link
                  to="/add-address"
                  className="inline-flex items-center justify-center px-3.5 sm:px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs sm:text-sm font-semibold rounded-xl hover:shadow-lg transition-all duration-300 gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">
                    add
                  </span>
                  Add New
                </Link>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-7 sm:py-8 px-3">
                  <div className="text-3xl sm:text-4xl mb-2.5 sm:mb-3">🏠</div>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                    No addresses saved
                  </p>
                  <Link
                    to="/add-address"
                    className="text-pink-600 hover:text-pink-700 font-medium text-xs sm:text-sm"
                  >
                    Add your first address
                  </Link>
                </div>
              ) : (
                <div className="space-y-3.5 sm:space-y-4">
                  {addresses.map((a) => (
                    <div
                      key={a._id}
                      className="border border-gray-200 p-3.5 sm:p-4 rounded-xl hover:border-pink-300 transition-colors bg-gradient-to-br from-white to-gray-50"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="material-symbols-outlined text-gray-400 text-base sm:text-lg">
                            location_on
                          </span>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">
                            {a.name}
                          </p>
                        </div>
                        {a.isDefault && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[11px] sm:text-xs font-medium rounded-full whitespace-nowrap">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm mb-1.5 sm:mb-2">
                        {a.address}
                      </p>
                      <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3">
                        {a.city}, {a.state} - {a.pincode}
                      </p>
                      <p className="text-gray-600 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
                        <span className="material-symbols-outlined text-gray-400 text-sm sm:text-base">
                          call
                        </span>
                        {a.phone}
                      </p>

                      <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                        <Link
                          to={`/edit-address/${a._id}`}
                          className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs sm:text-sm">
                            edit
                          </span>
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl shadow-lg p-4 sm:p-6 text-white">
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
                Account Summary
              </h3>
              <div className="space-y-3.5 sm:space-y-4">
                <div className="flex items-center justify-between py-2.5 sm:py-3 border-b border-white/20">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="material-symbols-outlined text-base sm:text-lg">
                      shopping_bag
                    </span>
                    <span className="font-medium text-sm sm:text-base">
                      Total Orders
                    </span>
                  </div>
                  <span className="font-bold text-lg">
                    {orders.length}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5 sm:py-3 border-b border-white/20">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="material-symbols-outlined text-base sm:text-lg">
                      location_on
                    </span>
                    <span className="font-medium text-sm sm:text-base">
                      Saved Addresses
                    </span>
                  </div>
                  <span className="font-bold text-lg">
                    {addresses.length}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5 sm:py-3">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="material-symbols-outlined text-base sm:text-lg">
                      account_circle
                    </span>
                    <span className="font-medium text-sm sm:text-base">
                      Member Since
                    </span>
                  </div>
                  <span className="font-bold text-base sm:text-lg">
                    {new Date(user.createdAt).getFullYear()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2.5 sm:space-y-3">
                <Link
                  to="/products"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                    <span className="material-symbols-outlined text-pink-600 text-base sm:text-lg">
                      shopping_cart
                    </span>
                  </div>
                  <span className="font-medium text-gray-700 text-sm sm:text-base">
                    Continue Shopping
                  </span>
                </Link>

                <Link
                  to="/wishlist"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                    <span className="material-symbols-outlined text-pink-600 text-base sm:text-lg">
                      favorite
                    </span>
                  </div>
                  <span className="font-medium text-gray-700 text-sm sm:text-base">
                    View Wishlist
                  </span>
                </Link>

                <button
                  onClick={() => setEditMode(true)}
                  className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                    <span className="material-symbols-outlined text-pink-600 text-base sm:text-lg">
                      settings
                    </span>
                  </div>
                  <span className="font-medium text-gray-700 text-sm sm:text-base">
                    Account Settings
                  </span>
                </button>
              </div>
            </div>
          </div>
          {/* ================= END RIGHT ================= */}
        </div>
      </div>
    </div>
  );
}
