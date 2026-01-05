// src/components/vendor/Sidebar.jsx
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
  FiLogOut,
  FiMessageSquare,
  FiUsers,
  FiStar
} from "react-icons/fi";
import { BiStore, BiTrendingUp } from "react-icons/bi";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative ${isActive
      ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 shadow-sm"
      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
    } ${isCollapsed ? "justify-center px-2" : ""}`;

  const menuItems = [
    { path: "/vendor", label: "Dashboard", icon: <FiHome className="w-5 h-5" />, end: true, badge: null },
    { path: "/vendor/products", label: "Products", icon: <FiPackage className="w-5 h-5" />, badge: "24" },
    { path: "/vendor/orders", label: "Orders", icon: <FiShoppingCart className="w-5 h-5" />, badge: "5" },
    { path: "/vendor/bundles", label: "Bundles", icon: <FiUsers className="w-5 h-5" />, badge: null },
    { path: "/vendor/settings", label: "Settings", icon: <FiSettings className="w-5 h-5" />, badge: null },
  ];

  const isActive = (path, end = false) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const expandedWidth = isHovered && isCollapsed ? "w-64" : "w-20";

  return (
    <aside
      className={`min-h-full sticky top-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${isCollapsed ? expandedWidth : "w-64"} backdrop-blur-lg bg-white/95 dark:bg-gray-900/95`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          {(!isCollapsed || isHovered) ? (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <BiStore className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-900 rounded-full"></div>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Pamper Period</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <BiTrendingUp className="w-3 h-3 text-green-500" />
                  Pro Seller
                </p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg">
              <BiStore className="w-5 h-5 text-white" />
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isCollapsed && !isHovered ? "absolute bottom-24 left-1/2 transform -translate-x-1/2" : ""
              }`}
          >
            <FiChevronLeft className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""
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
              title={isCollapsed && !isHovered ? item.label : ""}
            >
              <div className={`relative transition-transform duration-200 group-hover:scale-110 ${isActive(item.path, item.end) ? "text-blue-600" : "text-gray-400"
                }`}>
                {item.icon}
                {isActive(item.path, item.end) && (
                  <div className="absolute -right-1 -top-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>

              {(!isCollapsed || isHovered) && (
                <span className="flex-1 transition-opacity duration-200">{item.label}</span>
              )}

              {item.badge && (!isCollapsed || isHovered) && (
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                  {item.badge}
                </span>
              )}

              {isActive(item.path, item.end) && (!isCollapsed || isHovered) && (
                <div className="w-1 h-6 bg-blue-500 rounded-full absolute right-3"></div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}