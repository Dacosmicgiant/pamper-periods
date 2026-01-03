import React, { useEffect, useState, useRef } from "react";
import API from "../api/api";
import FlashSaleBanner from "../components/FlashSaleBanner";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Star,
  ArrowRight,
  Gift,
  Heart,
  Sparkles,
  Truck,
  Shield,
  Clock,
  ShoppingBag,
  Crown,
  Award,
  CheckCircle,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [flashSale, setFlashSale] = useState(null);
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const heroImgRef = useRef(null);
  const floatingRef = useRef(null);
  const featuredRef = useRef(null);
  const sectionsRef = useRef([]);

  const safeImg = (img) =>
    img && img.trim() !== "" ? img : "/placeholder.jpg";

  const addToSections = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  const navigate = useNavigate();

  const handleSubscribeClick = () => {
    navigate("/contact-us");
    console.log("Navigating to Contact Us page...");
  };

  // Load vendors once
  useEffect(() => {
    const loadVendors = async () => {
      try {
        const { data } = await API.get("/vendor-public");
        setVendors(data);
      } catch (err) {
        console.log("Vendor load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadVendors();
  }, []);

  // Load featured, categories, reviews + animations
  useEffect(() => {
    API.get("/products/featured")
      .then((r) =>
        setFeatured(Array.isArray(r.data) ? r.data.slice(0, 6) : [])
      )
      .catch(() => setFeatured([]));

    API.get("/categories")
      .then((r) => setCategories(Array.isArray(r.data) ? r.data : []))
      .catch(() => {});

    API.get("/reviews")
      .then((r) => setReviews(Array.isArray(r.data) ? r.data : []))
      .catch(() => {});

    // Enhanced animations
    if (heroImgRef.current) {
      gsap.to(heroImgRef.current, {
        y: 160,
        ease: "none",
        scrollTrigger: {
          trigger: heroImgRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    if (floatingRef.current) {
      gsap.to(floatingRef.current, {
        y: -35,
        rotation: 2,
        repeat: -1,
        yoyo: true,
        duration: 4,
        ease: "sine.inOut",
      });
    }

    if (featuredRef.current) {
      gsap.fromTo(
        featuredRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: featuredRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    sectionsRef.current.forEach((sec, index) => {
      gsap.fromTo(
        sec,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: sec,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  // Premium image placeholders
  const HERO_IMG =
    "https://images.unsplash.com/photo-1542831371-d531d36971e6?q=80&w=1200&auto=format&fit=crop";

  const CATEGORY_IMGS = [
    "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1533777324565-a040eb52fac2?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1596461404964-48393731e625?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop",
  ];

  const REVIEW_IMAGES = [
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
  ];

  const imgOf = (p, idx = 0, fallback = HERO_IMG) =>
    (p?.images && p.images[idx]) || fallback;

  return (
    <div className="font-sans bg-gradient-to-br from-white to-pink-50/30 text-gray-900 overflow-hidden">
      {/* Flash sale banner */}
      <FlashSaleBanner sale={flashSale} />

      {/* ======================= HERO SECTION ======================= */}
      <section className="relative min-h-[80vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div
          ref={heroImgRef}
          className="absolute inset-0 -z-10 bg-cover bg-center scale-110"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-pink-50/85 to-purple-50/80" />

        {/* Floating Elements */}
        <div className="absolute top-10 left-4 sm:top-16 sm:left-10 w-4 h-4 sm:w-6 sm:h-6 bg-pink-400 rounded-full opacity-20 animate-pulse" />
        <div className="absolute bottom-32 right-6 sm:bottom-40 sm:right-20 w-5 h-5 sm:w-8 sm:h-8 bg-purple-400 rounded-full opacity-30 animate-bounce" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 lg:gap-16 items-center py-16 sm:py-20 lg:py-0">
          {/* LEFT TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-5 sm:space-y-6 text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-pink-200 shadow-sm">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span className="text-xs sm:text-sm font-medium text-pink-700">
                Premium Gifting Experience
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Unforgettable
              <span className="block bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Moments
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto md:mx-0">
              Curated premium hampers, handcrafted gift boxes, and personalized
              surprises designed to make every celebration extraordinary.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-pink-500" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-pink-500" />
                <span>Quality Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-pink-500" />
                <span>Same Day Delivery</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center md:justify-start">
              <Link
                to="/products"
                className="group relative px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 justify-center text-sm sm:text-base"
              >
                <span className="font-semibold">Explore Collection</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/bundles"
                className="px-6 sm:px-8 py-3.5 sm:py-4 border-2 border-pink-200 bg-white/80 backdrop-blur-sm text-pink-600 rounded-2xl hover:bg-pink-50 hover:border-pink-300 transition-all duration-300 font-semibold text-sm sm:text-base text-center"
              >
                Gift Bundles
              </Link>
            </div>
          </motion.div>

          {/* RIGHT HERO IMAGE / VIDEO */}
          <motion.div
            ref={floatingRef}
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative w-full max-w-xl mx-auto md:mx-0"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-64 sm:h-80 md:h-[420px] lg:h-[520px] object-cover"
              >
                <source src="/video1.mp4" type="video/mp4" />
              </video>

              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
            </div>

            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="absolute -bottom-4 sm:-bottom-6 -left-2 sm:-left-6 bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-gray-100 max-w-[210px] sm:max-w-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm sm:text-base">
                    5000+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Gifts Delivered
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute -top-4 sm:-top-6 -right-2 sm:-right-6 bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-gray-100 max-w-[210px] sm:max-w-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm sm:text-base">
                    98%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Happy Customers
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ======================= FEATURED GIFTS ======================= */}
     <section className="relative py-20 lg:py-28 overflow-hidden" ref={featuredRef}>
  {/* Ambient Background Elements - Using White/Purple to contrast your Pink bg */}
  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full opacity-30 blur-[120px] -translate-y-1/2 translate-x-1/4" />
  <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-100 rounded-full opacity-20 blur-[100px]" />

  <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
    {/* Header Section */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-20 gap-6"
    >
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-8 bg-slate-900" />
          <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
            Premium Selection
          </span>
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-slate-900 leading-tight">
          Featured <span className="italic font-normal">Gifts</span>
        </h2>
        <p className="mt-6 text-slate-600 text-lg font-light leading-relaxed">
          A curated gallery of our most sought-after treasures, designed for those who celebrate with intention.
        </p>
      </div>

      <motion.div whileHover={{ x: 5 }} className="hidden md:block">
        <Link to="/featured" className="group flex items-center gap-3 text-slate-900 font-bold tracking-tight">
          Explore Collection 
          <div className="p-3 bg-white rounded-full shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
            <ArrowRight className="w-5 h-5" />
          </div>
        </Link>
      </motion.div>
    </motion.div>

    {/* Featured Products Grid */}
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {loading ? (
        new Array(3).fill(0).map((_, i) => (
          <div key={i} className="rounded-[2.5rem] h-[500px] bg-white/40 animate-pulse border border-white/60" />
        ))
      ) : (
        featured.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group"
          >
            <div className="relative bg-white/60 backdrop-blur-md rounded-[2.5rem] p-4 border border-white/80 shadow-[0_20px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] transition-all duration-500">
              
              {/* IMAGE AREA */}
              <Link to={`/product/${product._id}`} className="block relative aspect-[4/5] rounded-[1.8rem] overflow-hidden bg-slate-100">
                <img
                  src={safeImg(product.images?.[0])}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  alt={product.title}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                
                {/* Floating Badge */}
                <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] font-black text-slate-800">{product.rating?.toFixed(1) || "4.8"}</span>
                  </div>
                </div>
              </Link>

              {/* PRODUCT INFO */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-xl text-slate-900 leading-tight group-hover:text-pink-600 transition-colors line-clamp-1">
                    {product.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Price</p>
                    <p className="text-2xl font-light text-slate-900">₹{product.finalPrice}</p>
                  </div>
                  
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>

    {/* Mobile-only View All */}
    <div className="mt-12 text-center md:hidden">
      <Link
        to="/featured"
        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold shadow-sm border border-slate-100"
      >
        View All Featured
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </div>
</section>

      {/* ======================= CATEGORIES ======================= */}
     <section
  className="max-w-7xl mx-auto py-12 sm:py-16 lg:py-20 px-6 lg:px-8 relative z-10"
  ref={addToSections}
>
  {/* MINIMALIST HEADER */}
  <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-2xl sm:text-3xl lg:text-4xl font-serif text-slate-900 tracking-tight"
    >
      Shop By <span className="italic font-light">Category</span>
    </motion.h2>
    <div className="h-0.5 w-12 bg-slate-900/10 mt-4 rounded-full" />
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mt-4 text-slate-500 text-xs sm:text-sm font-medium tracking-wide uppercase opacity-70"
    >
      Find the perfect piece for your special moments
    </motion.p>
  </div>

  {/* COMPACT CATEGORIES GRID */}
  {Array.isArray(categories) && categories.length > 0 && (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {categories.slice(0, 4).map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          whileHover={{ y: -8 }}
        >
          <Link
            to={`/products`}
            className="group block relative text-center"
          >
            {/* The Image Container - Forced to square and shrunk */}
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-white shadow-sm border-[6px] border-white transition-all duration-500 group-hover:shadow-xl group-hover:shadow-pink-200 group-hover:border-pink-50">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${
                    CATEGORY_IMGS[i % CATEGORY_IMGS.length]
                  })`,
                }}
              />
              {/* Soft overlay to make white text pop if needed, but we use bottom labels now */}
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-500" />
            </div>

            {/* LABEL - Placed below the image for a cleaner "boutique" look */}
            <div className="mt-4">
              <span className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-[0.15em] transition-colors group-hover:text-pink-600">
                {c.name}
              </span>
              <p className="text-[10px] text-slate-400 font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">
                Explore Items
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )}
</section>

      {/* ======================= PREMIUM VENDORS SECTION ======================= */}
      <section
        className="max-w-7xl mx-auto py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8"
        ref={addToSections}
      >
        <div className="bg-gradient-to-br from-white to-emerald-50 rounded-3xl shadow-xl border border-emerald-100 p-6 sm:p-8 lg:p-12">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-14 lg:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 sm:gap-3 bg-emerald-100 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl mb-4 sm:mb-6"
            >
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              <span className="text-sm sm:text-lg font-semibold text-emerald-700">
                Verified Partners
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-gray-900"
            >
              Our Premium Partners
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Collaborating with the finest artisans and brands worldwide.
            </motion.p>
          </div>

          {/* VENDOR LIST */}
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Skeleton Loader */}
            {loading &&
              [...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-3xl bg-white shadow animate-pulse border border-gray-100"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl mx-auto bg-gray-200 mb-4 sm:mb-6" />
                  <div className="w-28 sm:w-32 h-4 rounded bg-gray-200 mx-auto mb-2 sm:mb-3" />
                  <div className="w-20 sm:w-24 h-3 rounded bg-gray-200 mx-auto mb-2 sm:mb-3" />
                  <div className="w-16 sm:w-20 h-3 rounded bg-gray-200 mx-auto mb-4 sm:mb-5" />
                  <div className="h-9 sm:h-10 rounded-xl bg-gray-200" />
                </div>
              ))}

            {/* No Vendors */}
            {!loading && vendors.length === 0 && (
              <div className="text-center text-gray-500 text-base sm:text-lg col-span-full py-8 sm:py-10">
                No vendors found.
              </div>
            )}

            {/* Real Vendors */}
            {!loading &&
              vendors.length > 0 &&
              vendors.slice(0, 6).map((v, idx) => {
                const safeLogo =
                  v.logo && v.logo.trim() !== "" ? v.logo : "/placeholder.jpg";

                return (
                  <motion.div
                    key={v._id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <Link
                      to={`/vendor/${v._id}`}
                      className="block bg-white p-6 sm:p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 text-center border border-gray-100 group-hover:border-emerald-200"
                    >
                      <div className="relative mb-4 sm:mb-6">
                        <img
                          src={safeLogo}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl mx-auto object-cover shadow-md border-4 border-white group-hover:border-emerald-100 transition-colors"
                          alt={v.shopName}
                        />

                        {v.isVerified && (
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </div>
                        )}
                      </div>

                      <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 group-hover:text-emerald-600 transition-colors">
                        {v.storeName}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                        {v.specialty || "Premium Collections"}
                      </p>

                      <div className="flex items-center justify-center gap-1 mb-2 sm:mb-3">
                        {[...Array(5)].map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            className={`w-3 h-3 sm:w-4 sm:h-4 ${
                              starIndex < Math.floor(v.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-xs sm:text-sm text-gray-600 ml-1">
                          {v.rating}
                        </span>
                      </div>

                      <div className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                        {v.productsCount || 0}+ Products
                      </div>

                      <button className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 group-hover:scale-105 text-xs sm:text-sm">
                        Visit Store
                      </button>
                    </Link>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </section>

      {/* ======================= EDUCATION / BLOG KNOWLEDGE ======================= */}
     <section
  className="max-w-7xl mx-auto py-16 sm:py-24 px-4 sm:px-6 lg:px-8"
  ref={addToSections}
>
  <div className="relative overflow-hidden bg-gradient-to-b from-white to-pink-50/50 rounded-[3rem] shadow-2xl shadow-pink-100/30 border border-pink-100/50 p-8 sm:p-12 lg:p-16">
    {/* Decorative Elements */}
    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-pink-300/10 rounded-full blur-3xl" />

    {/* Header */}
    <div className="text-center relative z-10 mb-16 lg:mb-20">
      <motion.span 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-pink-600 font-bold tracking-[0.2em] uppercase text-xs mb-4 block"
      >
        Wellness Guide
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight"
      >
        Health & Hygiene <span className="text-pink-600">Essentials</span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
      >
        Empowering you with the knowledge to navigate your cycle with confidence, 
        comfort, and proper care.
      </motion.p>
    </div>

    {/* CONTENT GRID */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
      
      {/* Article 1: Selection */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-xl hover:shadow-pink-200/40 transition-all duration-500"
      >
        <div className="h-48 rounded-3xl overflow-hidden mb-8 border border-pink-50">
          <img
            src="https://images.unsplash.com/photo-1599009434801-987f3439a6c8?w=900&q=80"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            alt="Sanitary pads selection"
          />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-pink-600 transition">Choosing Your Fit</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          Every body is unique. Choosing the right pad depends on balancing your 
          daily activity level with your specific flow intensity.
        </p>
        <ul className="space-y-3">
          {['Heavy flow: Choose Extra-Long (XL)', 'Active days: Use breathable cotton', 'Overnight: Wide-back wings'].map((tip, i) => (
            <li key={i} className="flex items-center gap-3 text-xs font-bold text-pink-700 bg-pink-50/50 p-2 rounded-xl">
              <span className="material-symbols-outlined text-sm">check_circle</span> {tip}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Article 2: Product Types */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        viewport={{ once: true }}
        className="group bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-xl hover:shadow-pink-200/40 transition-all duration-500"
      >
        <div className="h-48 rounded-3xl overflow-hidden mb-8 border border-pink-50">
          <img
            src="https://images.unsplash.com/photo-1598170845058-32b9d7983731?w=900&q=80"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            alt="Cup vs pads"
          />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-pink-600 transition">Modern Options</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          From traditional pads to menstrual cups, understanding the pros and cons 
          helps you make an eco-friendly and comfortable choice.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <div className="bg-gray-50 p-3 rounded-2xl text-center border border-gray-100">
            <p className="text-[10px] uppercase tracking-tighter text-gray-400 font-bold mb-1">Pads</p>
            <p className="text-xs font-bold text-gray-700">Easy & Familiar</p>
          </div>
          <div className="bg-pink-50/50 p-3 rounded-2xl text-center border border-pink-100">
            <p className="text-[10px] uppercase tracking-tighter text-pink-400 font-bold mb-1">Cups</p>
            <p className="text-xs font-bold text-pink-700">Sustainable</p>
          </div>
        </div>
      </motion.div>

      {/* Article 3: Care & Relief */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        viewport={{ once: true }}
        className="group bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-xl hover:shadow-pink-200/40 transition-all duration-500"
      >
        <div className="h-48 rounded-3xl overflow-hidden mb-8 border border-pink-50">
          <img
            src="https://images.unsplash.com/photo-1598440947619-2c35c048c09a?w=900&q=80"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            alt="Managing cramps"
          />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-pink-600 transition">Relief & Comfort</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          Managing period discomfort doesn't always require medication. Natural 
          lifestyle adjustments can significantly reduce pain.
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-3 bg-white rounded-2xl shadow-sm">
            <span className="p-2 bg-pink-100 text-pink-600 rounded-lg material-symbols-outlined text-sm">spa</span>
            <div>
              <p className="text-xs font-bold text-gray-800">Hydration</p>
              <p className="text-[10px] text-gray-500">Reduces bloating & cramps</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-3 bg-white rounded-2xl shadow-sm">
            <span className="p-2 bg-orange-100 text-orange-600 rounded-lg material-symbols-outlined text-sm">hot_tub</span>
            <div>
              <p className="text-xs font-bold text-gray-800">Heat Therapy</p>
              <p className="text-[10px] text-gray-500">Relaxes uterine muscles</p>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  </div>
</section>

      {/* ======================= TESTIMONIALS SECTION ======================= */}
      {/* <section
        className="max-w-7xl mx-auto py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8"
        ref={addToSections}
      >
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-xl border border-purple-100 p-6 sm:p-8 lg:p-12">
          <div className="text-center mb-10 sm:mb-14 lg:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4"
            >
              Love From Our Customers
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Join thousands of satisfied customers who found their perfect
              gift.
            </motion.p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {((Array.isArray(reviews) && reviews.length > 0)
              ? reviews.slice(0, 6)
              : new Array(3).fill(0).map((_, i) => ({
                  userPhoto: REVIEW_IMAGES[i % REVIEW_IMAGES.length],
                  userName: ["Sarah Johnson", "Mike Chen", "Emma Davis"][i],
                  comment: [
                    "The attention to detail in packaging and the quality of products exceeded my expectations! Will definitely order again.",
                    "Fast delivery and beautiful presentation. My wife was thrilled with the romantic rose box. 5 stars!",
                    "Exceptional customer service and premium quality gifts. Made my anniversary celebration extra special.",
                  ][i],
                  rating: 5,
                  purchase: ["Eternal Rose Box", "Luxury Hamper", "Custom Jewelry"][i],
                }))).map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-5 sm:p-6 lg:p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100"
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <img
                    src={r.userPhoto}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-purple-200"
                    alt={r.userName}
                  />
                  <div>
                    <div className="font-bold text-sm sm:text-lg">
                      {r.userName}
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, starIdx) => (
                        <Star
                          key={starIdx}
                          className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  {r.comment}
                </p>
                <div className="text-xs sm:text-sm text-purple-600 font-semibold">
                  Purchased: {r.purchase}
                </div>
              </motion.div>
            ))}
          </div>

         
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mt-10 sm:mt-12 lg:mt-16 pt-8 sm:pt-10 border-t border-gray-200"
          >
            {[
              { number: "10K+", label: "Happy Customers" },
              { number: "4.9/5", label: "Average Rating" },
              { number: "50+", label: "Cities Served" },
              { number: "24/7", label: "Customer Support" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section> */}
      <section className="relative py-20 lg:py-28 overflow-hidden" ref={addToSections}>
  {/* Soft ambient light to blend with your pink background */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

  <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
    {/* HEADER */}
    <div className="text-center mb-16 sm:mb-20">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="inline-block px-4 py-1.5 rounded-full border border-pink-200 bg-white/50 backdrop-blur-sm text-[10px] font-black uppercase tracking-[0.3em] text-pink-500 mb-6"
      >
        Testimonials
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-serif text-slate-900 leading-tight"
      >
        Love From Our <span className="italic font-light">Community</span>
      </motion.h2>
    </div>

    {/* TESTIMONIALS GRID */}
    <div className="grid gap-6 md:grid-cols-3">
      {((Array.isArray(reviews) && reviews.length > 0)
        ? reviews.slice(0, 3)
        : [
            {
              userName: "Sarah Johnson",
              comment: "The attention to detail in packaging and product quality exceeded my expectations!",
              purchase: "Eternal Rose Box",
              photo: REVIEW_IMAGES[0]
            },
            {
              userName: "Mike Chen",
              comment: "Fast delivery and beautiful presentation. My wife was thrilled with the rose box.",
              purchase: "Luxury Hamper",
              photo: REVIEW_IMAGES[1]
            },
            {
              userName: "Emma Davis",
              comment: "Exceptional service and premium quality gifts. Made our anniversary extra special.",
              purchase: "Custom Jewelry",
              photo: REVIEW_IMAGES[2]
            }
          ]).map((r, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="relative bg-white/70 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-sm hover:shadow-xl hover:shadow-pink-100/50 transition-all duration-500"
        >
          {/* Quote Icon */}
          <span className="absolute top-8 right-8 text-pink-100 font-serif text-6xl leading-none select-none">“</span>

          <div className="flex items-center gap-4 mb-6">
            <img
              src={r.userPhoto || r.photo}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
              alt={r.userName}
            />
            <div>
              <div className="font-bold text-slate-900 tracking-tight">{r.userName}</div>
              <div className="flex gap-0.5 mt-1">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="w-2.5 h-2.5 fill-pink-400 text-pink-400" />
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed mb-6 italic">
            "{r.comment}"
          </p>

          <div className="flex items-center gap-2">
            <div className="h-px w-4 bg-slate-200" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Item: {r.purchase}
            </span>
          </div>
        </motion.div>
      ))}
    </div>

    {/* MINIMALIST STATS */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mt-20 py-10 border-y border-slate-900/5 flex flex-wrap justify-center items-center gap-12 sm:gap-20"
    >
      {[
        { number: "10K+", label: "Happy Customers" },
        { number: "4.9/5", label: "Average Rating" },
        { number: "50+", label: "Cities Served" },
        { number: "24/7", label: "Support" },
      ].map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-2xl sm:text-3xl font-serif text-slate-900 mb-1">
            {stat.number}
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {stat.label}
          </div>
        </div>
      ))}
    </motion.div>
  </div>
</section>

      {/* ======================= NEWSLETTER SECTION ======================= */}
      <section
        className="max-w-4xl mx-auto py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8"
        ref={addToSections}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 rounded-3xl p-6 sm:p-8 lg:p-12 text-center text-white shadow-2xl relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-20 sm:w-32 h-20 sm:h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-32 sm:w-48 h-32 sm:h-48 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-14 h-14 sm:w-20 sm:h-20 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center mx-auto mb-4 sm:mb-6"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 text-white text-2xl sm:text-3xl">
                🎁
              </div>
            </motion.div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              Join Our Gift Community
            </h2>
            <p className="text-sm sm:text-lg text-pink-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Get exclusive access to early sales, special offers, and gift
              inspiration delivered to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border-0 focus:ring-4 ring-white/20 text-gray-900 placeholder-gray-500 text-sm sm:text-base"
              />
              <button
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-pink-600 rounded-2xl font-bold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                onClick={handleSubscribeClick}
              >
                <span className="text-lg sm:text-xl">✨</span>
                Subscribe
              </button>
            </div>

            <p className="text-xs sm:text-sm text-pink-200 mt-3 sm:mt-4">
              No spam, unsubscribe at any time • Exclusive member benefits
            </p>
          </div>
        </motion.div>
      </section>

      {/* ======================= PREMIUM FOOTER (if you add later) ======================= */}
    </div>
  );
}
