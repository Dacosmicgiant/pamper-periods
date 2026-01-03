// import React, { useEffect, useState } from "react";
// import API from "../api/api";
// import ProductCard from "../components/ProductCard";
// import { FiSearch, FiFilter } from "react-icons/fi";

// export default function Products() {
//   const [items, setItems] = useState([]);
//   const [q, setQ] = useState("");
//   const [sort, setSort] = useState("newest");
//   const [category, setCategory] = useState("all");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");

//   const [page, setPage] = useState(1);
//   const [limit] = useState(12);
//   const [totalPages, setTotalPages] = useState(1);

//   const [categories, setCategories] = useState([]);

//   const load = React.useCallback(async () => {
//     let url = `/products?q=${encodeURIComponent(q)}&sort=${sort}&page=${page}&limit=${limit}`;

//     if (category !== "all") url += `&category=${category}`;
//     if (minPrice) url += `&min=${minPrice}`;
//     if (maxPrice) url += `&max=${maxPrice}`;

//     try {
//       const res = await API.get(url);
//       setItems(res.data.items);
//       setTotalPages(res.data.pages || 1);
//     } catch (err) {
//       console.warn(err);
//     }
//   }, [q, sort, page, limit, category, minPrice, maxPrice]);

//   const loadCategories = React.useCallback(async () => {
//     try {
//       const res = await API.get("/categories");
//       setCategories(res.data);
//     } catch (err) { }
//   }, []);

//   useEffect(() => {
//     loadCategories();
//   }, [loadCategories]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   return (
//     <div className="max-w-7xl mt-18 mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">

//       {/* =================== FILTER SIDEBAR =================== */}
//       <aside className="bg-white shadow-md rounded-xl p-5 h-fit sticky top-24 border border-pink-100">
//         <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//           <FiFilter /> Filters
//         </h2>

//         {/* Search */}
//         <div className="relative mb-5">
//           <FiSearch className="absolute left-3 top-3 text-gray-400" />
//           <input
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//             placeholder="Search products"
//             className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400"
//           />
//         </div>

//         {/* Category filter */}
//         <div className="mb-6">
//           <label className="font-medium text-sm text-gray-700">Category</label>
//           <select
//             value={category}
//             onChange={(e) => {
//               setCategory(e.target.value);
//               setPage(1);
//             }}
//             className="w-full mt-2 p-2 border rounded-lg"
//           >
//             <option value="all">All</option>
//             {categories.map((c) => (
//               <option key={c._id} value={c.name}>
//                 {c.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Price filter */}
//         <div className="mb-6">
//           <label className="font-medium text-sm text-gray-700">Price Range</label>
//           <div className="flex items-center gap-3 mt-2">
//             <input
//               type="number"
//               placeholder="Min"
//               value={minPrice}
//               onChange={(e) => setMinPrice(e.target.value)}
//               className="w-full p-2 border rounded-lg"
//             />
//             <input
//               type="number"
//               placeholder="Max"
//               value={maxPrice}
//               onChange={(e) => setMaxPrice(e.target.value)}
//               className="w-full p-2 border rounded-lg"
//             />
//           </div>
//         </div>

//         {/* Sort filter */}
//         <div className="mb-4">
//           <label className="font-medium text-sm text-gray-700">Sort By</label>
//           <select
//             value={sort}
//             onChange={(e) => setSort(e.target.value)}
//             className="w-full mt-2 p-2 border rounded-lg"
//           >
//             <option value="newest">Newest</option>
//             <option value="price_asc">Price (Low → High)</option>
//             <option value="price_desc">Price (High → Low)</option>
//           </select>
//         </div>

//         <button
//           onClick={() => {
//             setQ("");
//             setCategory("all");
//             setMinPrice("");
//             setMaxPrice("");
//             setSort("newest");
//           }}
//           className="mt-4 w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
//         >
//           Reset Filters
//         </button>
//       </aside>

//       {/* =================== PRODUCTS GRID =================== */}
//       <main>
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-semibold">
//             Showing <span className="text-pink-600">{items.length}</span> items
//           </h2>
//         </div>

//         <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {items.map((p) => (
//             <ProductCard key={p._id} p={p} />
//           ))}
//         </div>

//         {/* =================== PAGINATION =================== */}
//         <div className="flex items-center justify-center gap-3 mt-10">
//           <button
//             disabled={page <= 1}
//             onClick={() => setPage((p) => Math.max(1, p - 1))}
//             className={`px-4 py-2 rounded-lg border ${page <= 1 ? "opacity-40" : "hover:bg-pink-50"
//               }`}
//           >
//             Prev
//           </button>

//           <div className="px-4 py-2 bg-pink-100 rounded-lg text-pink-700 font-semibold">
//             Page {page} / {totalPages}
//           </div>

//           <button
//             disabled={page >= totalPages}
//             onClick={() => setPage((p) => p + 1)}
//             className={`px-4 py-2 rounded-lg border ${page >= totalPages ? "opacity-40" : "hover:bg-pink-50"
//               }`}
//           >
//             Next
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// }
// import React, { useEffect, useState } from "react";
// import API from "../api/api";
// import ProductCard from "../components/ProductCard";
// import { FiSearch, FiSliders, FiX } from "react-icons/fi";

// export default function Products() {
//   const [items, setItems] = useState([]);
//   const [q, setQ] = useState("");
//   const [sort, setSort] = useState("newest");
//   const [category, setCategory] = useState("all");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [pincode, setPincode] = useState(""); // ⭐ pincode filter (unchanged)

//   const [page, setPage] = useState(1);
//   const [limit] = useState(12);
//   const [totalPages, setTotalPages] = useState(1);

//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ⭐ NEW: mobile filter drawer state (UI only, no logic change)
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   /* ================================
//            LOAD ITEMS
//   ================================= */
//   const load = React.useCallback(
//     async () => {
//       let url = `/products?q=${encodeURIComponent(
//         q
//       )}&sort=${sort}&page=${page}&limit=${limit}`;

//       if (category !== "all") url += `&category=${category}`;
//       if (minPrice) url += `&priceMin=${minPrice}`;
//       if (maxPrice) url += `&priceMax=${maxPrice}`;
//       if (pincode) url += `&pincode=${pincode}`; // ⭐ SAME: pincode filter

//       try {
//         // setLoading(true); // Moved to useEffect to avoid sync state update lint
//         const res = await API.get(url);
//         setItems(res.data.items);
//         setTotalPages(res.data.pages || 1);
//       } catch (err) {
//         console.warn(err);
//       }
//       setLoading(false);
//     },
//     [q, sort, page, limit, category, minPrice, maxPrice, pincode]
//   );

//   /* ================================
//           LOAD CATEGORIES
//   ================================= */
//   const loadCategories = React.useCallback(async () => {
//     try {
//       const res = await API.get("/categories");
//       setCategories(res.data);
//     } catch (err) {
//       console.warn(err);
//     }
//   }, []);

//   useEffect(() => {
//     loadCategories();
//   }, [loadCategories]);

//   useEffect(() => {
//     setLoading(true);
//     load();
//   }, [load]);

//   /* ================================
//           SKELETON CARD
//   ================================= */
//   const SkeletonCard = () => (
//     <div className="animate-pulse bg-white rounded-2xl shadow p-4 border border-pink-100">
//       <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
//       <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//       <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//       <div className="h-6 bg-gray-200 rounded w-1/3 mt-4"></div>
//     </div>
//   );


//   /* ================================
//         FILTER SIDEBAR CONTENT
//      (reused for desktop + mobile)
//   ================================= */
//   const renderFilters = () => (
//     <>
//       <h2 className="text-lg md:text-xl font-bold mb-5 flex items-center gap-2 text-gray-800">
//         <FiSliders /> Filters
//       </h2>

//       {/* Search */}
//       <div className="relative mb-5">
//         <FiSearch className="absolute left-3 top-3 text-gray-400" />
//         <input
//           value={q}
//           onChange={(e) => {
//             setQ(e.target.value);
//             setPage(1);
//           }}
//           placeholder="Search products..."
//           className="w-full pl-10 pr-4 py-2.5 rounded-xl 
//               border border-gray-300 focus:ring-2 focus:ring-pink-400
//               bg-white/70 backdrop-blur-md text-sm md:text-base"
//         />
//       </div>

//       {/* ⭐ PINCODE FILTER */}
//       <div className="mb-5">
//         <label className="font-semibold text-xs md:text-sm">
//           Search by Pincode
//         </label>
//         <input
//           type="number"
//           value={pincode}
//           onChange={(e) => {
//             setPincode(e.target.value);
//             setPage(1);
//           }}
//           placeholder="Enter delivery pincode"
//           className="w-full mt-2 p-2.5 rounded-xl border bg-white/70 border-gray-300 text-sm md:text-base"
//         />
//         <p className="text-[11px] md:text-xs text-gray-500 mt-1">
//           Only shows items from vendors matching this pincode.
//         </p>
//       </div>

//       {/* Category */}
//       <div className="mb-5">
//         <label className="font-semibold text-xs md:text-sm">Category</label>
//         <select
//           value={category}
//           onChange={(e) => {
//             setCategory(e.target.value);
//             setPage(1);
//           }}
//           className="w-full mt-2 p-2.5 rounded-xl border bg-white/70 focus:ring-2 focus:ring-pink-400 border-gray-300 text-sm md:text-base"
//         >
//           <option value="all">All</option>
//           {categories.map((c) => (
//             <option key={c._id} value={c._id}>
//               {c.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Price */}
//       <div className="mb-5">
//         <label className="font-semibold text-xs md:text-sm">
//           Price Range
//         </label>
//         <div className="flex items-center gap-3 mt-2">
//           <input
//             type="number"
//             placeholder="Min"
//             value={minPrice}
//             onChange={(e) => {
//               setMinPrice(e.target.value);
//               setPage(1);
//             }}
//             className="w-full p-2.5 rounded-xl border bg-white/70 border-gray-300 text-sm md:text-base"
//           />
//           <input
//             type="number"
//             placeholder="Max"
//             value={maxPrice}
//             onChange={(e) => {
//               setMaxPrice(e.target.value);
//               setPage(1);
//             }}
//             className="w-full p-2.5 rounded-xl border bg-white/70 border-gray-300 text-sm md:text-base"
//           />
//         </div>
//       </div>

//       {/* Sort */}
//       <div className="mb-5">
//         <label className="font-semibold text-xs md:text-sm">Sort By</label>
//         <select
//           value={sort}
//           onChange={(e) => {
//             setSort(e.target.value);
//             setPage(1);
//           }}
//           className="w-full mt-2 p-2.5 bg-white/70 rounded-xl border border-gray-300 text-sm md:text-base"
//         >
//           <option value="newest">Newest</option>
//           <option value="price_asc">Price (Low → High)</option>
//           <option value="price_desc">Price (High → Low)</option>
//         </select>
//       </div>

//       {/* Reset */}
//       <button
//         onClick={() => {
//           setQ("");
//           setCategory("all");
//           setMinPrice("");
//           setMaxPrice("");
//           setPincode(""); // ⭐ RESET PINCODE
//           setSort("newest");
//           setPage(1);
//         }}
//         className="mt-4 w-full py-3 rounded-xl bg-pink-600 text-white text-sm md:text-base font-semibold hover:bg-pink-700 transition"
//       >
//         Reset Filters
//       </button>
//     </>
//   );

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 mt-16">
//       {/* ======= TOP BAR (Title + Mobile Filter Button) ======= */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//           All Products
//         </h1>

//         {/* Mobile Filter Toggle */}
//         <div className="flex items-center justify-between sm:justify-end gap-3">
//           <p className="text-sm text-gray-600 sm:hidden">
//             Showing{" "}
//             <span className="font-semibold text-pink-600">
//               {items.length}
//             </span>{" "}
//             items
//           </p>

//           <button
//             type="button"
//             onClick={() => setIsFilterOpen(true)}
//             className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-pink-300 bg-white/80 text-pink-700 text-sm font-medium shadow-sm hover:bg-pink-50 sm:hidden"
//           >
//             <FiSliders className="w-4 h-4" />
//             Filters
//           </button>
//         </div>
//       </div>

//       {/* ======= LAYOUT: SIDEBAR + GRID (Desktop) ======= */}
//       <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
//         {/* ======= FILTER SIDEBAR (Desktop / Tablet) ======= */}
//         <aside
//           className="hidden md:block bg-white/70 backdrop-blur-xl shadow-lg 
//           rounded-2xl p-6 h-fit sticky top-28 
//           border border-pink-200/60"
//         >
//           {renderFilters()}
//         </aside>

//         {/* =================== PRODUCTS GRID =================== */}
//         <main>
//           {/* Desktop count */}
//           <h2 className="hidden md:block text-lg md:text-xl font-semibold mb-4">
//             Showing{" "}
//             <span className="text-pink-600 font-bold">{items.length}</span>{" "}
//             items
//           </h2>

//           <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
//             {loading
//               ? Array(8)
//                 .fill(0)
//                 .map((_, i) => <SkeletonCard key={i} />)
//               : items.map((p) => <ProductCard key={p._id} p={p} />)}
//           </div>

//           {/* Pagination */}
//           <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10">
//             <button
//               disabled={page <= 1}
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               className={`w-full sm:w-auto px-4 py-2 rounded-xl border font-medium text-sm sm:text-base ${page <= 1
//                 ? "opacity-40 cursor-not-allowed"
//                 : "hover:bg-pink-50 hover:border-pink-300"
//                 }`}
//             >
//               Prev
//             </button>

//             <div className="w-full sm:w-auto text-center px-4 py-2 bg-pink-100 rounded-xl text-pink-700 font-semibold shadow text-sm sm:text-base">
//               Page {page} / {totalPages}
//             </div>

//             <button
//               disabled={page >= totalPages}
//               onClick={() => setPage((p) => p + 1)}
//               className={`w-full sm:w-auto px-4 py-2 rounded-xl border font-medium text-sm sm:text-base ${page >= totalPages
//                 ? "opacity-40 cursor-not-allowed"
//                 : "hover:bg-pink-50 hover:border-pink-300"
//                 }`}
//             >
//               Next
//             </button>
//           </div>
//         </main>
//       </div>

//       {/* ======= MOBILE FILTER DRAWER ======= */}
//       {isFilterOpen && (
//         <>
//           {/* Overlay */}
//           <div
//             className="fixed inset-0 bg-black/40 z-40 md:hidden"
//             onClick={() => setIsFilterOpen(false)}
//           />

//           {/* Drawer Panel */}
//           <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 shadow-2xl md:hidden flex flex-col">
//             {/* Header */}
//             <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
//               <div className="flex items-center gap-2">
//                 <FiSliders className="text-pink-600" />
//                 <span className="font-semibold text-gray-800 text-sm">
//                   Filters
//                 </span>
//               </div>
//               <button
//                 onClick={() => setIsFilterOpen(false)}
//                 className="p-2 rounded-full hover:bg-gray-100"
//               >
//                 <FiX className="w-5 h-5 text-gray-600" />
//               </button>
//             </div>

//             {/* Content */}
//             <div className="flex-1 overflow-y-auto p-4">
//               {renderFilters()}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import API from "../api/api";
import ProductCard from "../components/ProductCard";
import { FiSearch, FiSliders, FiX, FiMapPin, FiPackage, FiChevronLeft, FiChevronRight, FiFilter } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Products() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [pincode, setPincode] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const load = React.useCallback(async () => {
    let url = `/products?q=${encodeURIComponent(q)}&sort=${sort}&page=${page}&limit=${limit}`;
    if (category !== "all") url += `&category=${category}`;
    if (minPrice) url += `&priceMin=${minPrice}`;
    if (maxPrice) url += `&priceMax=${maxPrice}`;
    if (pincode) url += `&pincode=${pincode}`;

    try {
      const res = await API.get(url);
      setItems(res.data.items);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.warn(err);
    }
    setLoading(false);
  }, [q, sort, page, limit, category, minPrice, maxPrice, pincode]);

  const loadCategories = React.useCallback(async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);
  useEffect(() => { setLoading(true); load(); }, [load]);

  const SkeletonCard = () => (
    <div className="animate-pulse bg-white rounded-[2.5rem] p-5 border border-slate-100">
      <div className="aspect-[4/5] bg-slate-100 rounded-[2rem] mb-4" />
      <div className="h-5 bg-slate-100 rounded-full w-2/3 mb-3" />
      <div className="h-4 bg-slate-50 rounded-full w-1/3" />
    </div>
  );

  const renderFilters = () => (
    <div className="space-y-10">
      <div className="hidden md:block">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Filter By</h3>
      </div>

      {/* Pincode Section */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
          <FiMapPin className="text-pink-500" /> Location
        </label>
        <div className="relative">
          <input
            type="number"
            value={pincode}
            onChange={(e) => { setPincode(e.target.value); setPage(1); }}
            placeholder="Enter Pincode"
            className="w-full pl-4 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-pink-500/20 transition-all placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Collection</label>
        <div className="flex flex-wrap gap-2">
          {['all', ...categories.map(c => c._id)].map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                category === cat 
                ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
              }`}
            >
              {cat === 'all' ? 'Everything' : categories.find(c => c._id === cat)?.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Price Range</label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">₹</span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
              className="w-full pl-7 pr-3 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-pink-500/20"
            />
          </div>
          <div className="h-[2px] w-3 bg-slate-200" />
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">₹</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
              className="w-full pl-7 pr-3 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-pink-500/20"
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => { setQ(""); setCategory("all"); setMinPrice(""); setMaxPrice(""); setPincode(""); setSort("newest"); setPage(1); }}
        className="w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition-all border border-dashed border-slate-200 hover:border-pink-200"
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] mt-16 pb-24">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        
        {/* Superior Header */}
        <div className="relative z-10 mb-16">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <motion.div initial={{y: 10, opacity: 0}} animate={{y: 0, opacity: 1}} className="flex items-center gap-2 text-pink-500 font-bold text-[10px] uppercase tracking-[0.3em] mb-3">
                <span className="w-8 h-[2px] bg-pink-500" /> Curated Selection
              </motion.div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
                Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600">Style.</span>
              </h1>
            </div>

            <div className="flex flex-1 max-w-2xl items-center gap-4">
               {/* Search Bar - Integrated in Header */}
              <div className="relative flex-1 group">
                <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors z-10" />
                <input
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setPage(1); }}
                  placeholder="Search products..."
                  className="w-full pl-14 pr-6 py-4 rounded-[2rem] border border-slate-100 bg-white focus:ring-4 focus:ring-pink-50 shadow-sm transition-all"
                />
              </div>

              <div className="hidden md:block shrink-0">
                <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value); setPage(1); }}
                    className="appearance-none bg-white border border-slate-100 rounded-[2rem] pl-6 pr-12 py-4 shadow-sm text-sm font-bold focus:ring-4 focus:ring-pink-50 cursor-pointer outline-none"
                >
                    <option value="newest">New Arrivals</option>
                    <option value="price_asc">Price: Low-High</option>
                    <option value="price_desc">Price: High-Low</option>
                </select>
              </div>

              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center justify-center w-14 h-14 bg-slate-900 text-white rounded-full shadow-xl"
              >
                <FiFilter size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Refined Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-32">
              {renderFilters()}
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
              {loading
                ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
                : items.map((p) => <ProductCard key={p._id} p={p} />)}
            </div>

            {/* Pagination UI - Minimalist */}
            <div className="mt-24 flex flex-col items-center gap-6">
                <div className="flex items-center gap-3">
                  <button 
                    disabled={page <= 1}
                    onClick={() => {setPage(p => p - 1); window.scrollTo(0,0);}}
                    className="h-14 w-14 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white hover:shadow-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <FiChevronLeft size={20} />
                  </button>
                  
                  <div className="px-8 h-14 flex items-center rounded-full bg-white border border-slate-100 font-bold text-sm text-slate-900 shadow-sm">
                    Page {page} <span className="mx-2 text-slate-300 font-light">of</span> {totalPages}
                  </div>

                  <button 
                    disabled={page >= totalPages}
                    onClick={() => {setPage(p => p + 1); window.scrollTo(0,0);}}
                    className="h-14 w-14 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white hover:shadow-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modern Mobile Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 h-[85vh] bg-white z-[101] rounded-t-[3rem] shadow-2xl p-10 overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
              <div className="flex justify-between items-center mb-12">
                <span className="font-black text-3xl tracking-tight text-slate-900">Filters</span>
                <button onClick={() => setIsFilterOpen(false)} className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-full text-slate-400">
                    <FiX size={20}/>
                </button>
              </div>
              {renderFilters()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}