import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/api";
// import logo from '../assets/logo.png';

import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

import {
  FiShoppingCart,
  FiHeart,
  FiPackage,
  FiGrid,
  FiBriefcase,
  FiUser,
  FiLogOut
} from "react-icons/fi";

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const [wishlistCount, setWishlistCount] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(false);

  const navigate = useNavigate();

  /* ----------------------------------------------------
     LOAD WISHLIST COUNT
  ---------------------------------------------------- */
  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const { data } = await API.get(`/users/${user._id}/wishlist`);
        setWishlistCount(data?.length || 0);
      } catch (err) {
        console.log("Wishlist load error");
      }
    })();
  }, [user]);

  /* ----------------------------------------------------
     LOGOUT
  ---------------------------------------------------- */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 w-full z-40 backdrop-blur-xl bg-white/80 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
        
        {/* ---------------- LOGO ---------------- */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-pink-700 flex items-center justify-center text-white font-bold shadow-md">
            PP
          </div>
          {/* <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md">
  <img 
    src={logo} 
    alt="Pamper Periods Logo" 
    className="w-full h-full object-contain" 
  />
</div> */}
          <div>
            <div className="text-lg font-semibold">Pamper Periods</div>
            <div className="text-xs text-gray-600">Premium gift marketplace</div>
          </div>
        </Link>

        {/* ---------------- CENTER LINKS ---------------- */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/products" className="text-sm hover:text-pink-600">Products</Link>
          <Link to="/bundles" className="text-sm hover:text-pink-600">Bundles</Link>
          <Link to="/about" className="text-sm hover:text-pink-600">About Us</Link>
        </nav>

        {/* ---------------- RIGHT SECTION ---------------- */}
        <div className="flex items-center gap-4">

          {/* ❤️ WISHLIST */}
          {user && (
            <Link to="/wishlist" className="relative">
              <FiHeart className="w-6 h-6 text-pink-600" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-700 text-white rounded-full text-xs px-2">
                  {wishlistCount}
                </span>
              )}
            </Link>
          )}

          {/* 🛒 CART */}
          <Link to="/cart" className="relative">
            <FiShoppingCart className="w-6 h-6 text-pink-600" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-700 text-white rounded-full text-xs px-2">
                {cart.length}
              </span>
            )}
          </Link>

          {/* ---------------- PROFILE / LOGIN ---------------- */}
          {!user ? (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="px-3 py-1 rounded-md border border-pink-300 hover:bg-pink-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 rounded-md bg-pink-600 text-white hover:bg-pink-700"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div className="relative">
              {/* PROFILE BUTTON */}
              <button
                onClick={() => setOpenDropdown(!openDropdown)}
                className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center border border-pink-300 hover:bg-pink-200"
              >
                <FiUser className="text-pink-700" size={20} />
              </button>

              {/* ---------------- DROPDOWN ---------------- */}
              <AnimatePresence>
                {openDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg border border-pink-100 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-gray-100 text-sm text-gray-600">
                      Hi, <span className="font-semibold">{user.name}</span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setOpenDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-pink-50 text-sm"
                    >
                      <FiUser /> Profile
                    </Link>
{/* 
                    <Link
                      to="/orders"
                      onClick={() => setOpenDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-pink-50 text-sm"
                    >
                      <FiPackage /> My Orders
                    </Link> */}

                    {/* ⭐ VENDOR DASHBOARD */}
                    {user.role === "vendor" && (
                      <Link
                        to="/vendor"
                        onClick={() => setOpenDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-pink-50 text-sm text-pink-700 font-semibold"
                      >
                        <FiBriefcase /> Vendor Dashboard
                      </Link>
                    )}

                    {/* ⭐ ADMIN DASHBOARD */}
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setOpenDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-pink-50 text-sm text-pink-700 font-semibold"
                      >
                        <FiGrid /> Admin Dashboard
                      </Link>
                    )}

                    {/* LOGOUT */}
                    <button
                      onClick={logout}
                      className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-sm text-red-600"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
