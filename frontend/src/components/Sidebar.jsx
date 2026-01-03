import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  FiHome, 
  FiPackage, 
  FiShoppingCart, 
  FiBarChart2, 
  FiSettings, 
  FiChevronLeft,
  FiExternalLink,
  FiUser,
  FiHelpCircle,
  FiLogOut
} from "react-icons/fi";
import { BiStore } from "react-icons/bi";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
      isActive
        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 shadow-sm"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
    } ${isCollapsed ? "justify-center px-2" : ""}`;

  const menuItems = [
    { path: "/vendor", label: "Dashboard", icon: <FiHome className="w-5 h-5" />, end: true },
    { path: "/vendor/products", label: "Products", icon: <FiPackage className="w-5 h-5" /> },
    { path: "/vendor/orders", label: "Orders", icon: <FiShoppingCart className="w-5 h-5" /> },
    { path: "/vendor/analytics", label: "Analytics", icon: <FiBarChart2 className="w-5 h-5" /> },
    { path: "/vendor/settings", label: "Settings", icon: <FiSettings className="w-5 h-5" /> },
  ];

  return (
    <aside className={`h-screen sticky top-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
      isCollapsed ? "w-20" : "w-64"
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <BiStore className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-900 rounded-full"></div>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">My Store</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Pro Seller</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto">
              <BiStore className="w-5 h-5 text-white" />
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              isCollapsed ? "absolute bottom-24 left-1/2 transform -translate-x-1/2" : ""
            }`}
          >
            <FiChevronLeft className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : ""
            }`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={linkClass}
              title={isCollapsed ? item.label : ""}
            >
              <div className={`relative ${isActive(location, item.path) ? "text-blue-600" : "text-gray-400"}`}>
                {item.icon}
                {isActive(location, item.path) && (
                  <div className="absolute -right-1 -top-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
              {!isCollapsed && (
                <span className="flex-1">{item.label}</span>
              )}
              {!isCollapsed && isActive(location, item.path) && (
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Quick Stats - Only show when expanded */}
        {!isCollapsed && (
          <div className="px-4 pb-4">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Today's Sales</span>
                <span className="text-xs text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">+12%</span>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">₹24,568</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                <div className="bg-blue-500 h-1.5 rounded-full w-3/4"></div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
          {/* View Store Button */}
          <button
            onClick={() => window.open("/", "_blank")}
            className={`w-full flex items-center justify-center gap-2 px-3 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 ${
              isCollapsed ? "px-2" : ""
            }`}
            title={isCollapsed ? "View Store" : ""}
          >
            <FiExternalLink className="w-4 h-4" />
            {!isCollapsed && "View Store"}
          </button>

          {/* Support & Logout - Only show when expanded */}
          {!isCollapsed && (
            <div className="flex items-center gap-2 pt-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm">
                <FiHelpCircle className="w-4 h-4" />
                Help
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm">
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}

          {/* Collapsed Icons Only */}
          {isCollapsed && (
            <div className="flex justify-center gap-1 pt-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors" title="Help">
                <FiHelpCircle className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors" title="Logout">
                <FiLogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* User Profile - Bottom */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Sarah Vendor</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
              </div>
              <FiUser className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

// Helper function to check active route
function isActive(location, path) {
  return location.pathname === path || (path !== "/vendor" && location.pathname.startsWith(path));
}