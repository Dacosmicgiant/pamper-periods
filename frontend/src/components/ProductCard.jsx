import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
import API from "../api/api";
import useAuth from "../hooks/useAuth";
import { motion } from "framer-motion";

export default function ProductCard({ p }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // --- Compute correct discount UI ---
  const basePrice = p.price;
  const final = p.finalPrice ?? p.price;

  const discountPercent =
    basePrice > final ? Math.round(((basePrice - final) / basePrice) * 100) : 0;

  // Load Wishlist State
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await API.get(`/users/${user._id}/wishlist`);
        const exists = data.some((item) => item._id === p._id);
        setLiked(exists);
      } catch (err) {
        console.log("Wishlist fetch error", err);
      }
    })();
  }, [user, p._id]);

  // Toggle Wishlist
  const toggleWishlist = async (e) => {
    e.preventDefault(); // Prevent navigating to product page
    if (!user) return alert("Please login first");
    if (loading) return;

    setLoading(true);
    try {
      if (!liked) {
        await API.post(`/users/${user._id}/wishlist`, { productId: p._id });
        setLiked(true);
      } else {
        await API.delete(`/users/${user._id}/wishlist/${p._id}`);
        setLiked(false);
      }
    } catch (err) {
      console.log("Wishlist error", err);
    }
    setLoading(false);
  };

  return (
    <motion.div
      className="group relative bg-white rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-500 p-4 border border-slate-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
    >
      {/* ❤️ Wishlist Button */}
      <motion.button
        onClick={toggleWishlist}
        disabled={loading}
        className="absolute top-6 right-6 z-20 bg-white/80 backdrop-blur-md p-2.5 rounded-full shadow-sm border border-slate-50 hover:bg-white transition-all"
        whileTap={{ scale: 0.9 }}
      >
        <FiHeart
          className={`text-lg transition-all ${
            liked 
              ? "text-rose-500 fill-rose-500" 
              : "text-slate-300 hover:text-rose-400"
          } ${loading ? "opacity-50" : ""}`}
        />
      </motion.button>

      {/* 🔥 Discount Badge */}
      {discountPercent > 0 && (
        <div className="absolute top-6 left-6 z-10 bg-rose-500 text-white px-3 py-1 text-[10px] font-bold rounded-full shadow-lg shadow-rose-200 uppercase tracking-widest">
          {discountPercent}% Off
        </div>
      )}

      {/* IMAGE */}
      <Link to={`/product/${p._id}`}>
        <div className="aspect-[4/5] rounded-[1.5rem] overflow-hidden relative bg-slate-50">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-rose-50/50 animate-pulse" />
          )}
          <img
            src={p.images?.[0] || "/placeholder.jpg"}
            alt={p.title}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Add To Cart Button */}
          <div className="absolute inset-x-0 bottom-4 px-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <button className="w-full bg-white/90 backdrop-blur-md py-3 rounded-xl text-slate-700 text-xs font-bold shadow-sm hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2">
              <FiShoppingCart size={14} />
              Quick Add
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-5 px-1 space-y-2">
          {/* Vendor & Category */}
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            <span>{p.vendor?.shopName || "Boutique"}</span>
            <span className="text-rose-300">•</span>
            <span>{p.category?.name || "Premium"}</span>
          </div>

          <h3 className="font-bold text-slate-700 text-sm line-clamp-1 group-hover:text-rose-500 transition-colors">
            {p.title}
          </h3>

          {/* Ratings */}
          <div className="flex items-center gap-1.5">
            <div className="flex text-rose-300">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  size={10}
                  className={i < Math.floor(p.rating ?? 4) ? "fill-rose-300" : "text-slate-200"}
                />
              ))}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">({p.ratingCount ?? 0})</span>
          </div>

          {/* PRICING */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-lg font-bold text-slate-800">
              ₹{final.toLocaleString()}
            </span>
            {final < basePrice && (
              <span className="text-xs line-through text-slate-300">
                ₹{basePrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Savings & Flash Sale */}
          {p.flashDiscount > 0 && (
            <div className="pt-1">
              <span className="bg-rose-50 text-rose-500 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border border-rose-100">
                Flash {p.flashDiscount}% Off
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}