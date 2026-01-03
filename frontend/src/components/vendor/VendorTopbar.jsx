import React, { useState, useRef, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import {
  FiBell,
  FiHelpCircle,
  FiSearch,
  FiChevronDown,
  FiSettings,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import { BiTrendingUp } from "react-icons/bi";

export default function VendorTopbar({ title }) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfileDropdown(false);

      if (notificationRef.current && !notificationRef.current.contains(e.target))
        setShowNotifications(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
  <header className="sticky top-0 z-30 w-full backdrop-blur bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800 backdrop-saturate-150">
    <div className="flex items-center justify-between px-6 py-4">

      {/* Title */}
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h1>

      {/* Right actions */}
      <div className="flex items-center gap-3">

        {/* Help */}
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-300">
          <FiHelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <div ref={notificationRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-300"
          >
            <FiBell className="w-5 h-5" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="p-4 text-sm text-gray-600 dark:text-gray-300">
                No new notifications
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        {/* <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 p-1 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <img
              src="https://i.pravatar.cc/40?img=8"
              className="w-8 h-8 rounded-full"
              alt=""
            />
            <FiChevronDown
              className={`w-4 h-4 text-gray-500 transition ${showProfileDropdown ? "rotate-180" : ""
                }`}
            />
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-60 rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">

              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="font-semibold text-gray-900 dark:text-white">{user?.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</div>
              </div>

              <button className="flex items-center gap-3 w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">
                <FiUser className="w-4 h-4" /> Profile
              </button>

              <button className="flex items-center gap-3 w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">
                <FiSettings className="w-4 h-4" /> Settings
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-3 w-full p-3 text-left hover:bg-red-50 dark:hover:bg-red-900/30 text-sm text-red-600 dark:text-red-400"
              >
                <FiLogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div> */}
      </div>
    </div>
  </header>
);

}
