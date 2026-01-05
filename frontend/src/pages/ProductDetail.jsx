import React, { useEffect, useState, useRef, useCallback, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/api";
import { CartContext } from "../context/CartContext";
import useAuth from "../hooks/useAuth";
import AnimatedButton from "../components/AnimatedButton";
import ReviewGallery from "../components/ReviewGallery";
import { motion } from "framer-motion";

/* -------------------------
   Small UI helpers
   -------------------------*/

// StarRating: renders five star icons, supports fractional average.
const StarRating = ({ value = 0, size = 16 }) => {
  const rounded = Math.round(value * 2) / 2;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const pos = i + 1;
        const filled = rounded >= pos;
        const half = !filled && rounded + 0.5 === pos;
        return (
          <span
            key={i}
            className="material-symbols-outlined transition-all duration-200"
            style={{
              fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
              fontSize: size,
              color: filled || half ? "#ec4899" : "#d1d5db",
            }}
            title={`${value} / 5`}
          >
            {half ? "star_half" : "star"}
          </span>
        );
      })}
    </div>
  );
};

// SkeletonCard: premium skeleton loading
const SkeletonCard = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}
  >
    <div className="h-40 bg-gradient-to-r from-gray-100 to-gray-50" />
    <div className="p-3 space-y-2">
      <div className="h-3 w-3/4 bg-gray-100 rounded-full" />
      <div className="h-3 w-1/2 bg-gray-100 rounded-full" />
      <div className="h-6 w-2/5 bg-gray-100 rounded-lg mt-1" />
    </div>
  </div>
);

// PremiumCard: enhanced card design
const PremiumCard = ({ p }) => {
  const image = p.images?.[0] || "/placeholder.jpg";
  return (
    <Link
      to={`/product/${p._id}`}
      className="group block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <div
          style={{ backgroundImage: `url("${image}")` }}
          className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
        <div className="absolute left-2 top-2 px-2 py-1 rounded-full bg-white/90 text-xs font-medium text-gray-700">
          {p.vendor?.shopName || "Seller"}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-2 text-gray-900 mb-1 group-hover:text-pink-600 transition-colors">
          {p.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="text-base font-semibold text-gray-900">₹{p.price}</div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <StarRating value={p.rating || 0} size={12} />
          </div>
        </div>
      </div>
    </Link>
  );
};

/* -------------------------
   Main Component
   ------------------------- */
export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [mainIndex, setMainIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const [related, setRelated] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);

  const [customersAlsoViewed, setCustomersAlsoViewed] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [ratingInput, setRatingInput] = useState(0);
  const [commentInput, setCommentInput] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);

  const zoomRef = useRef(null);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: "50%", y: "50%" });

  // NEW: detect mobile to disable zoom on small screens
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const enableZoom = !isMobile;

  // ---- load product
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        if (!active) return;
        setProduct(data);
        setMainIndex(0);
      } catch (err) {
        console.error("Product load error:", err);
        setProduct(null);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  // ---- related (same vendor)
  useEffect(() => {
    setRelated([]);
    setRelatedLoading(true);
    if (!product?.vendor?._id) {
      setRelatedLoading(false);
      return;
    }

    let active = true;
    (async () => {
      try {
        const { data } = await API.get(
          `/products?vendor=${product.vendor._id}&limit=8`
        );
        if (!active) return;
        setRelated(
          (data?.items || data || []).filter((p) => p._id !== product._id)
        );
      } catch (err) {
        console.warn("Related load err", err);
      } finally {
        setRelatedLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [product?.vendor?._id, product?._id]);

  // ---- customers also viewed (by category or vendor fallback)
  useEffect(() => {
    setCustomersAlsoViewed([]);
    setCustomersLoading(true);

    if (!product) {
      setCustomersLoading(false);
      return;
    }

    let active = true;
    (async () => {
      try {
        if (product.category) {
          const { data } = await API.get(
            `/products?category=${encodeURIComponent(product.category)}&limit=12`
          );
          if (!active) return;
          setCustomersAlsoViewed(
            (data?.items || data || []).filter((p) => p._id !== product._id)
          );
        } else if (product.vendor?._id) {
          const { data } = await API.get(
            `/products?vendor=${product.vendor._id}&limit=12`
          );
          if (!active) return;
          setCustomersAlsoViewed(
            (data?.items || data || []).filter((p) => p._id !== product._id)
          );
        } else {
          setCustomersAlsoViewed([]);
        }
      } catch (err) {
        console.warn("Customers viewed load err", err);
      } finally {
        setCustomersLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [product]);

  // ---- review detection
  useEffect(() => {
    if (!product || !user) return;
    const exists = product.reviews?.some(
      (r) => String(r.user) === String(user._id)
    );
    setHasReviewed(Boolean(exists));
  }, [product, user]);

  // ---- image modal handlers
  const openModal = (i = 0) => {
    setModalIndex(i);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "";
  };
  const nextModal = useCallback(
    () =>
      setModalIndex(
        (i) => (i + 1) % (product?.images?.length || 1)
      ),
    [product]
  );
  const prevModal = useCallback(
    () =>
      setModalIndex(
        (i) =>
          (i - 1 + (product?.images?.length || 1)) %
          (product?.images?.length || 1)
      ),
    [product]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (!isModalOpen) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextModal();
      if (e.key === "ArrowLeft") prevModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isModalOpen, nextModal, prevModal]);

  // ---- zoom position
  const handleMouseMove = (e) => {
    if (!zoomRef.current) return;
    const rect = zoomRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: `${x}%`, y: `${y}%` });
  };

  // ---- submit review
  async function submitReview() {
    if (!user) return alert("Please login first!");
    if (!ratingInput) return alert("Select a rating");
    if (commentInput.length < 10)
      return alert("Comment must be at least 10 characters");

    try {
      setSubmitting(true);
      await API.post(`/products/${product._id}/review`, {
        rating: ratingInput,
        comment: commentInput,
      });

      // reload product data
      const { data } = await API.get(`/products/${product._id}`);
      setProduct(data);
      setRatingInput(0);
      setCommentInput("");
      setHasReviewed(true);
      alert("Review submitted!");
    } catch (err) {
      alert(err.response?.data?.message || "Review failed");
    } finally {
      setSubmitting(false);
    }
  }

  // ---- add to cart
  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <div className="text-base font-medium text-gray-600">
            Loading product details...
          </div>
        </div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : ["/placeholder.jpg"];
  const mainImage = images[mainIndex];

  // ===== PRICE CALCULATIONS (robust)
  const basePrice = Number(product.price || 0);

  // If backend supplies finalPrice use it; otherwise compute from product.discount + product.flashDiscount
  const computedFinal = (() => {
    if (product.finalPrice && Number(product.finalPrice) > 0)
      return Number(product.finalPrice);
    const vendorDisc =
      (basePrice * Number(product.discount || 0)) / 100;
    const flashDisc =
      (basePrice * Number(product.flashDiscount || 0)) / 100;
    return Math.round(basePrice - vendorDisc - flashDisc);
  })();

  const finalPrice = computedFinal;
  const totalSavings = Math.max(0, basePrice - finalPrice);
  const discountPercent =
    basePrice > 0
      ? Math.round((totalSavings / basePrice) * 100)
      : 0;

  // Flash / vendor badges
  const hasFlash = Number(product.flashDiscount || 0) > 0;
  const hasVendorDiscount = Number(product.discount || 0) > 0;

  // review stats
  const reviews = product.reviews || [];
  const reviewsCount = reviews.length;
  const avgRating =
    reviewsCount === 0
      ? 0
      : Math.round(
        (reviews.reduce(
          (s, r) => s + (r.rating || 0),
          0
        ) /
          reviewsCount) *
        10
      ) / 10;
  const breakdownCounts = [5, 4, 3, 2, 1].map(
    (st) =>
      reviews.filter(
        (r) => Math.round(r.rating || 0) === st
      ).length
  );
  const breakdownTotal =
    breakdownCounts.reduce((s, n) => s + n, 0) || 1;

  return (
    <div className="min-h-screen bg-white text-gray-900 py-6 sm:py-8 lg:py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Sleek Breadcrumb */}
        <nav className="flex items-center gap-1.5 mb-6 text-xs sm:text-sm text-gray-500">
          <Link
            to="/"
            className="hover:text-pink-600 transition-colors duration-200 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">
              home
            </span>
            Home
          </Link>
          <span className="material-symbols-outlined text-sm text-pink-400">
            chevron_right
          </span>
          <Link
            to="/products"
            className="hover:text-pink-600 transition-colors duration-200"
          >
            Products
          </Link>
          <span className="material-symbols-outlined text-sm text-pink-400">
            chevron_right
          </span>
          <span className="font-medium text-gray-900 truncate max-w-[160px] sm:max-w-xs">
            {product.title}
          </span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
        >
          {/* LEFT: Sleek Image Gallery */}
          <div className="flex flex-col gap-4">
            <motion.div
              ref={zoomRef}
              onMouseMove={
                enableZoom
                  ? (e) => isZooming && handleMouseMove(e)
                  : undefined
              }
              onMouseEnter={
                enableZoom ? () => setIsZooming(true) : undefined
              }
              onMouseLeave={
                enableZoom ? () => setIsZooming(false) : undefined
              }
              onClick={() => openModal(mainIndex)}
              className={`w-full aspect-square rounded-2xl shadow-lg bg-center bg-cover border border-gray-100 overflow-hidden group relative ${enableZoom ? "cursor-zoom-in" : "cursor-pointer"
                }`}
              style={{
                backgroundImage: `url("${mainImage}")`,
                backgroundPosition:
                  enableZoom && isZooming
                    ? `${zoomPos.x} ${zoomPos.y}`
                    : "center",
                backgroundSize:
                  enableZoom && isZooming ? "200%" : "cover",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>

            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {images.map((img, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`aspect-square rounded-lg overflow-hidden border transition-all duration-200 ${idx === mainIndex
                    ? "ring-2 ring-pink-500 ring-offset-1 border-pink-500"
                    : "border-gray-200 hover:border-pink-300"
                    }`}
                  onClick={() => setMainIndex(idx)}
                >
                  <div
                    className="w-full h-full bg-center bg-cover transition-transform duration-300 hover:scale-105"
                    style={{ backgroundImage: `url("${img}")` }}
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* RIGHT: Sleek Product Details */}
          <div className="flex flex-col gap-5 lg:gap-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-2">
                  {product.title}
                </h1>

                {/* Rating + Reviews */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="flex items-center gap-1.5">
                    <StarRating value={avgRating} size={16} />
                    <span className="text-xs sm:text-sm text-gray-600 font-medium">
                      {avgRating}
                    </span>
                  </div>
                  <span className="hidden sm:inline text-gray-300">
                    •
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {reviewsCount} reviews
                  </span>
                  <span className="hidden sm:inline text-gray-300">
                    •
                  </span>
                  <div
                    className={`text-[11px] sm:text-xs px-2 py-1 rounded-full ${product.stock === 0
                      ? "bg-red-100 text-red-700"
                      : product.stock <= 10
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                      }`}
                  >
                    {product.stock === 0
                      ? "Out of stock"
                      : `${product.stock} in stock`}
                  </div>
                </div>
              </div>

              {/* =========================
                  ENHANCED PRICE UI
                 ========================= */}
              <div className="relative p-4 sm:p-5 bg-gray-50 rounded-xl border border-gray-100">
                {/* Top-left badges */}
                <div className="absolute left-4 -top-3 flex gap-2">
                  {discountPercent > 0 && (
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow">
                      -{discountPercent}% OFF
                    </div>
                  )}
                  {hasFlash && (
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium border border-yellow-200">
                      FLASH {product.flashDiscount}% OFF
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Final price (prominent) */}
                  <div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900">
                      ₹{finalPrice.toLocaleString()}
                    </div>
                    <div className="mt-1 text-[11px] sm:text-xs text-gray-500">
                      <span>Inclusive of taxes</span>
                      {hasVendorDiscount && (
                        <span className="ml-2 inline-block px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] rounded">
                          Vendor {product.discount}% off
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Old price & savings */}
                  <div className="ml-auto text-right">
                    {totalSavings > 0 ? (
                      <>
                        <div className="text-sm sm:text-base line-through text-gray-400">
                          ₹{basePrice.toLocaleString()}
                        </div>
                        <div className="text-xs sm:text-sm text-green-600 font-medium mt-1">
                          You save ₹{totalSavings.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-1">
                          ({discountPercent}% off)
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-gray-500">
                        No discounts
                      </div>
                    )}
                  </div>
                </div>

                {/* subtle note row */}
                <div className="mt-3 sm:mt-4 text-[11px] sm:text-xs text-gray-500 flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      local_shipping
                    </span>
                    <span>Free delivery</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      verified
                    </span>
                    <span>100% secure checkout</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed border-b border-gray-100 pb-3 sm:pb-4">
                {product.description}
              </p>

              {/* Sleek Quantity + Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 sm:p-4 bg-white rounded-xl border border-gray-100">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white w-full sm:w-auto">
                  <button
                    className="px-3 py-2 hover:bg-gray-50 transition-colors text-gray-600"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    <span className="material-symbols-outlined text-base">
                      remove
                    </span>
                  </button>
                  <input
                    className="w-12 text-center h-9 outline-none bg-transparent font-medium text-sm"
                    type="number"
                    value={qty}
                    min={1}
                    onChange={(e) =>
                      setQty(
                        Math.max(1, Number(e.target.value || 1))
                      )
                    }
                  />
                  <button
                    className="px-3 py-2 hover:bg-gray-50 transition-colors text-gray-600"
                    onClick={() => setQty((q) => q + 1)}
                  >
                    <span className="material-symbols-outlined text-base">
                      add
                    </span>
                  </button>
                </div>

                <AnimatedButton
                  onClick={handleAddToCart}
                  className="flex-1 px-5 sm:px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg shadow-sm hover:shadow transition-all duration-200 text-sm sm:text-base"
                >
                  <span className="material-symbols-outlined text-sm mr-1.5">
                    shopping_cart
                  </span>
                  Add to Cart
                </AnimatedButton>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (!user) return alert("Please login");
                    API.post(
                      "/users/wishlist",
                      { productId: product._id }
                    )
                      .then(() => alert("Added to wishlist"))
                      .catch(() => alert("Wishlist error"));
                  }}
                  className="h-10 w-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center self-end sm:self-auto"
                  title="Add to wishlist"
                >
                  <span className="material-symbols-outlined text-base">
                    favorite
                  </span>
                </motion.button>
              </div>

              {/* Sleek Vendor Card */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow transition-all duration-200 flex items-center gap-3"
              >
                <div
                  className="w-10 h-10 rounded-lg bg-center bg-cover border border-gray-200"
                  style={{
                    backgroundImage: `url("${product.vendor?.logo || "/placeholder.jpg"
                      }")`,
                  }}
                />
                <div className="flex-1">
                  <div className="text-[11px] text-gray-500 font-medium">
                    Sold by
                  </div>
                  <Link
                    to={`/vendor/${product.vendor?._id}`}
                    className="text-sm font-semibold text-gray-900 hover:text-pink-600 transition-colors"
                  >
                    {product.vendor?.shopName}
                  </Link>
                </div>
                <Link
                  to={`/vendor/${product.vendor?._id}`}
                  className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-medium rounded-lg transition-all duration-200"
                >
                  Visit Store
                </Link>
              </motion.div>
            </motion.div>

            {/* Sleek Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {/* Rating Summary */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">
                      {avgRating}
                    </div>
                    <div className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                      average rating
                    </div>
                    <StarRating value={avgRating} size={16} />
                  </div>
                  <div className="text-right">
                    <div className="text-base sm:text-lg font-semibold text-gray-900">
                      {reviewsCount}
                    </div>
                    <div className="text-[11px] sm:text-xs text-gray-500">
                      total reviews
                    </div>
                  </div>
                </div>

                {/* Sleek Breakdown */}
                <div className="space-y-1.5 sm:space-y-2">
                  {[5, 4, 3, 2, 1].map((s, idx) => {
                    const count = breakdownCounts[idx];
                    const pct = Math.round(
                      (count / breakdownTotal) * 100
                    );
                    return (
                      <div
                        key={s}
                        className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs"
                      >
                        <div className="w-8 font-medium text-gray-600">
                          {s}★
                        </div>
                        <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${pct}%` }}
                            className="h-2 rounded-full bg-gradient-to-r from-pink-400 to-rose-500"
                          />
                        </div>
                        <div className="w-10 sm:w-12 text-right font-medium text-gray-700">
                          {pct}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Write Review Section */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-pink-500 text-base">
                    rate_review
                  </span>
                  Share Your Experience
                </h3>

                {!user ? (
                  <div className="text-center py-3 sm:py-4">
                    <div className="text-gray-500 text-xs sm:text-sm mb-3">
                      Please login to write a review
                    </div>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-all duration-200 text-xs sm:text-sm"
                    >
                      <span className="material-symbols-outlined text-sm">
                        login
                      </span>
                      Login to Review
                    </Link>
                  </div>
                ) : hasReviewed ? (
                  <div className="text-center py-3 sm:py-4">
                    <div className="material-symbols-outlined text-3xl sm:text-4xl text-green-500 mb-2">
                      check_circle
                    </div>
                    <div className="text-sm font-semibold text-green-600 mb-1">
                      Review Submitted
                    </div>
                    <div className="text-[11px] sm:text-xs text-gray-500">
                      Thank you for your feedback!
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex gap-0.5 justify-center">
                      {[1, 2, 3, 4, 5].map((st) => (
                        <motion.button
                          key={st}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setRatingInput(st)}
                          title={`${st} star`}
                          className="transition-transform duration-150"
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{
                              fontVariationSettings:
                                st <= ratingInput
                                  ? "'FILL' 1"
                                  : "'FILL' 0",
                              color:
                                st <= ratingInput
                                  ? "#ec4899"
                                  : "#d1d5db",
                              fontSize: 24,
                            }}
                          >
                            star
                          </span>
                        </motion.button>
                      ))}
                    </div>

                    <textarea
                      rows={3}
                      value={commentInput}
                      onChange={(e) =>
                        setCommentInput(e.target.value)
                      }
                      className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-200 resize-none text-xs sm:text-sm"
                      placeholder="Share your detailed experience with this product..."
                    />

                    <div className="flex gap-2 justify-end">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={submitReview}
                        disabled={submitting}
                        className="px-5 sm:px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 text-xs sm:text-sm"
                      >
                        {submitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-sm">
                              send
                            </span>
                            Submit Review
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>

              {/* Reviews Gallery */}
              <div className="mt-1 sm:mt-2">
                <ReviewGallery reviews={reviews.slice(0, 3)} />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Sleek Related Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 sm:mt-12"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              More from this seller
            </h2>
            {related.length > 0 && (
              <Link
                to={`/vendor/${product.vendor?._id}`}
                className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1 text-xs sm:text-sm transition-colors"
              >
                View all
                <span className="material-symbols-outlined text-base">
                  arrow_forward
                </span>
              </Link>
            )}
          </div>

          {relatedLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : related.length === 0 ? (
            <div className="text-center py-6 sm:py-8 bg-white rounded-xl border border-gray-100">
              <div className="material-symbols-outlined text-3xl sm:text-4xl text-gray-300 mb-2">
                inventory_2
              </div>
              <div className="text-gray-500 text-xs sm:text-sm">
                No other products from this seller
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {related.map((rp) => (
                <PremiumCard key={rp._id} p={rp} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Sleek Customers Also Viewed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 sm:mt-12 mb-6 sm:mb-10"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            Customers also viewed
          </h2>

          {customersLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : customersAlsoViewed.length === 0 ? (
            <div className="text-center py-6 sm:py-8 bg-white rounded-xl border border-gray-100">
              <div className="material-symbols-outlined text-3xl sm:text-4xl text-gray-300 mb-2">
                visibility_off
              </div>
              <div className="text-gray-500 text-xs sm:text-sm">
                No recommendations available
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {customersAlsoViewed.map((cp) => (
                <PremiumCard key={cp._id} p={cp} />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Sleek Modal Gallery */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4"
        >
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white bg-white/10 hover:bg-white/20 rounded-lg p-1.5 sm:p-2 transition-all duration-200 z-10"
          >
            <span className="material-symbols-outlined text-base sm:text-lg">
              close
            </span>
          </button>

          <div className="relative w-full max-w-4xl">
            <motion.img
              key={modalIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={images[modalIndex]}
              alt=""
              className="w-full h-auto max-h-[65vh] sm:max-h-[70vh] object-contain rounded-lg shadow-xl"
            />

            <div className="absolute inset-y-0 left-1 sm:left-2 flex items-center">
              <button
                onClick={prevModal}
                className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all duration-200"
              >
                <span className="material-symbols-outlined text-lg sm:text-xl">
                  chevron_left
                </span>
              </button>
            </div>

            <div className="absolute inset-y-0 right-1 sm:right-2 flex items-center">
              <button
                onClick={nextModal}
                className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all duration-200"
              >
                <span className="material-symbols-outlined text-lg sm:text-xl">
                  chevron_right
                </span>
              </button>
            </div>

            <div className="absolute bottom-2 sm:bottom-3 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2.5 sm:px-3 py-1 rounded-lg backdrop-blur-sm text-[11px] sm:text-sm">
              {modalIndex + 1} / {images.length}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
