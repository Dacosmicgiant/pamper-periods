// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";

// export default function AdminSidebar() {
//   const { pathname } = useLocation();
//   const [collapsed, setCollapsed] = useState(false);

//   const menu = [
//     { label: "Dashboard", to: "/admin", icon: "dashboard" },
//     { label: "Products", to: "/admin/products", icon: "inventory_2" },
//     { label: "Categories", to: "/admin/categories", icon: "category" },
//     { label: "Vendors", to: "/admin/vendors", icon: "storefront" },
//     { label: "Coupons", to: "/admin/coupons", icon: "local_offer" },
//     { label: "Flash Sales", to: "/admin/discounts", icon: "bolt" },
//     { label: "Bundles", to: "/admin/bundles", icon: "monitoring" },
//     { label: "Orders", to: "/admin/orders", icon: "receipt_long" },
//   ];

//   return (
//     <aside
//       className={`
//         fixed lg:static top-0 left-0 z-40
//         ${collapsed ? "w-20" : "w-64"}
//         h-full lg:h-fit
//         transition-all duration-300 
//         bg-white/40 dark:bg-gray-900/40 
//         backdrop-blur-xl shadow-xl 
//         border border-white/20 dark:border-gray-700/20
//         rounded-r-2xl lg:rounded-2xl
//         px-4 py-6
//       `}
//     >

//       {/* Collapse Button */}
//       <button
//         onClick={() => setCollapsed(!collapsed)}
//         className="
//           absolute -right-3 top-6 w-7 h-7 rounded-full 
//           bg-white dark:bg-gray-800 shadow-md 
//           flex items-center justify-center 
//           hover:scale-105 transition
//         "
//       >
//         <span className="material-symbols-outlined text-gray-700 dark:text-gray-300 text-xl">
//           {collapsed ? "chevron_right" : "chevron_left"}
//         </span>
//       </button>

//       {/* Logo */}
//       {!collapsed && (
//         <h2 className="text-2xl font-black mb-6 text-gray-900 dark:text-gray-200">
//           Admin Panel
//         </h2>
//       )}

//       {/* MENU */}
//       <ul className="space-y-2 mt-4">
//         {menu.map((item, index) => {
//           const active = pathname === item.to;

//           return (
//             <li key={index}>
//               <Link
//                 to={item.to}
//                 className={`
//                   group flex items-center gap-3 px-4 py-3 rounded-xl
//                   transition-all duration-200 relative overflow-hidden
//                   ${
//                     active
//                       ? "bg-gradient-to-r from-pink-600 to-pink-400 text-white shadow-lg scale-[1.02]"
//                       : "text-gray-800 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/50 hover:scale-[1.02]"
//                   }
//                 `}
//               >
//                 <span className="material-symbols-outlined text-[22px]">
//                   {item.icon}
//                 </span>

//                 {!collapsed && (
//                   <span className="font-medium">{item.label}</span>
//                 )}

//                 {/* Ripple Hover Effect */}
//                 <span className="
//                   absolute inset-0 opacity-0 group-hover:opacity-10 
//                   bg-gradient-to-r from-pink-600 to-purple-500
//                   transition-all duration-300
//                 "></span>
//               </Link>
//             </li>
//           );
//         })}
//       </ul>
//     </aside>
//   );
// }
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    { label: "Dashboard", to: "/admin", icon: "dashboard" },
    { label: "Products", to: "/admin/products", icon: "inventory_2" },
    { label: "Categories", to: "/admin/categories", icon: "category" },
    { label: "Vendors", to: "/admin/vendors", icon: "storefront" },
    { label: "Coupons", to: "/admin/coupons", icon: "local_offer" },
    { label: "Flash Sales", to: "/admin/discounts", icon: "bolt" },
    { label: "Bundles", to: "/admin/bundles", icon: "monitoring" },
    { label: "Orders", to: "/admin/orders", icon: "receipt_long" },
  ];

  return (
    <aside
      className={`
        relative h-full transition-all duration-500 ease-in-out
        ${collapsed ? "w-20" : "w-72"}
        bg-white dark:bg-gray-900 flex flex-col
      `}
    >
      {/* Sidebar Header / Logo area */}
      <div className="p-8 flex items-center justify-between">
        {!collapsed && (
          <motion.h2 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400"
          >
            Management
          </motion.h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 flex items-center justify-center hover:bg-pink-50 hover:text-pink-600 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">
            {collapsed ? "side_navigation" : "menu_open"}
          </span>
        </button>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
        {menu.map((item, index) => {
          const active = pathname === item.to;

          return (
            <Link
              key={index}
              to={item.to}
              className={`
                relative group flex items-center gap-4 px-4 py-4 rounded-2xl
                transition-all duration-300 overflow-hidden
                ${active 
                  ? "bg-pink-600 text-white shadow-xl shadow-pink-100" 
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                }
              `}
            >
              {/* Active Indicator Background */}
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-pink-600"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <div className="relative z-10 flex items-center gap-4">
                <span className={`material-symbols-outlined text-[22px] transition-transform duration-300 group-hover:scale-110 ${active ? "text-white" : "text-gray-400 group-hover:text-pink-600"}`}>
                  {item.icon}
                </span>

                {!collapsed && (
                  <span className="font-bold text-sm tracking-tight uppercase tracking-widest text-[11px]">
                    {item.label}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      {!collapsed && (
        <div className="p-8 border-t border-gray-50 dark:border-gray-800">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">System Health</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase">All Services Online</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}