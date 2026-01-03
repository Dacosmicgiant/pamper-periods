// // import React, { useEffect, useState, useContext } from "react";
// // import { useParams } from "react-router-dom";
// // import { motion, AnimatePresence } from "framer-motion";
// // import API from "../api/api";
// // import { CartContext } from "../context/CartContext";
// // import { useAuth } from "../context/AuthContext";

// // export default function BundleDetail() {
// //   const { id } = useParams();
// //   const { addToCart } = useContext(CartContext);
// //   const { user } = useAuth();

// //   const [bundle, setBundle] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [similar, setSimilar] = useState([]);

// //   const [color, setColor] = useState("");
// //   const [variant, setVariant] = useState("");

// //   const [wish, setWish] = useState(false);
// //   const [shareOpen, setShareOpen] = useState(false);

// //   // -------------------------
// //   // LOAD BUNDLE
// //   // -------------------------
// //   useEffect(() => {
// //     const load = async () => {
// //       try {
// //         const { data } = await API.get(`/bundles/${id}`);
// //         setBundle(data);

// //         const sim = await API.get("/bundles");
// //         setSimilar(sim.data.filter((b) => b._id !== id).slice(0, 4));
// //       } catch (err) {
// //         console.log("Bundle load failed", err);
// //       }
// //       setLoading(false);
// //     };
// //     load();
// //   }, [id]);

// //   if (loading)
// //     return (
// //       <div className="text-center py-40 text-xl font-semibold">
// //         Loading bundle...
// //       </div>
// //     );

// //   if (!bundle)
// //     return (
// //       <div className="text-center py-40 text-xl text-red-500 font-semibold">
// //         Bundle not found
// //       </div>
// //     );

// //   // -------------------------
// //   // ADD TO WISHLIST
// //   // -------------------------
// //   const handleWishlist = async () => {
// //     if (!user) return alert("Please login to use wishlist");

// //     try {
// //       await API.post(`/users/${user._id}/wishlist`, {
// //         productId: bundle._id,
// //         type: "bundle",
// //       });

// //       setWish(true);
// //     } catch (err) {
// //       console.log(err);
// //     }
// //   };

// //   const shareText = `Check out this bundle: ${bundle.title} — ₹${bundle.price}`;
// //   const shareUrl = window.location.href;

// //   // -------------------------
// //   // RETURN UI
// //   // -------------------------
// //   return (
// //     <div className="max-w-7xl mx-auto px-6 py-12 font-display">

// //       {/* =================== BANNER =================== */}
// //       <div className="relative w-full rounded-3xl overflow-hidden shadow-lg">
// //         <img
// //           src={bundle.images?.[0] || "/src/assets/placeholder.jpg"}
// //           alt={bundle.title}
// //           className="w-full h-[350px] object-cover rounded-3xl"
// //         />

// //         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

// //         <div className="absolute bottom-6 left-6 text-white">
// //           <h1 className="text-3xl md:text-4xl font-black">{bundle.title}</h1>
// //           <p className="mt-2 text-lg opacity-90 max-w-xl">
// //             {bundle.description || "Premium curated bundle for all occasions"}
// //           </p>
// //         </div>

// //         {/* Wishlist Button */}
// //         <button
// //           onClick={handleWishlist}
// //           className="absolute top-6 right-6 bg-white/90 p-3 rounded-full shadow-xl hover:bg-white"
// //         >
// //           <span
// //             className="material-symbols-outlined text-pink-600"
// //             style={{ fontVariationSettings: wish ? "'FILL' 1" : "'FILL' 0" }}
// //           >
// //             favorite
// //           </span>
// //         </button>

// //         {/* Share Button */}
// //         <button
// //           onClick={() => setShareOpen(true)}
// //           className="absolute top-6 right-20 bg-white/90 p-3 rounded-full shadow-xl hover:bg-white"
// //         >
// //           <span className="material-symbols-outlined">share</span>
// //         </button>
// //       </div>

// //       {/* =================== PRICE + ADD TO CART =================== */}
// //       <div className="mt-10 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border">
// //         <div className="flex items-center justify-between">
// //           <div>
// //             <div className="text-3xl font-extrabold text-pink-600">
// //               ₹{bundle.price}
// //             </div>
// //             {bundle.oldPrice && (
// //               <div className="text-gray-500 line-through mt-1">
// //                 ₹{bundle.oldPrice}
// //               </div>
// //             )}
// //           </div>

// //           <button
// //             onClick={() =>
// //               addToCart(bundle, 1, "bundle", { color, variant })
// //             }
// //             className="px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-lg rounded-xl shadow-lg hover:opacity-90 transition"
// //           >
// //             Add Bundle to Cart
// //           </button>
// //         </div>
// //       </div>

// //       {/* =================== CUSTOMIZATION =================== */}
// //       <div className="mt-10 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border">
// //         <h3 className="text-xl font-bold mb-4">Customize Bundle</h3>

// //         {/* Color options */}
// //         <div className="mb-6">
// //           <p className="text-sm font-semibold mb-2">Choose Color</p>
// //           <div className="flex gap-3">
// //             {["Red", "Blue", "Pink", "Black"].map((c) => (
// //               <button
// //                 key={c}
// //                 onClick={() => setColor(c)}
// //                 className={`px-4 py-2 border rounded-full ${
// //                   color === c ? "bg-pink-600 text-white" : "bg-gray-100"
// //                 }`}
// //               >
// //                 {c}
// //               </button>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Variant options */}
// //         <div>
// //           <p className="text-sm font-semibold mb-2">Choose Variant</p>
// //           <div className="flex gap-3">
// //             {["Standard", "Premium", "Luxury"].map((v) => (
// //               <button
// //                 key={v}
// //                 onClick={() => setVariant(v)}
// //                 className={`px-4 py-2 border rounded-full ${
// //                   variant === v ? "bg-pink-600 text-white" : "bg-gray-100"
// //                 }`}
// //               >
// //                 {v}
// //               </button>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* =================== SHARE POPUP =================== */}
// //       <AnimatePresence>
// //         {shareOpen && (
// //           <motion.div
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 1 }}
// //             exit={{ opacity: 0 }}
// //             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
// //           >
// //             <motion.div
// //               initial={{ scale: 0.8, opacity: 0 }}
// //               animate={{ scale: 1, opacity: 1 }}
// //               exit={{ scale: 0.8, opacity: 0 }}
// //               className="bg-white w-80 p-6 rounded-xl shadow-lg"
// //             >
// //               <h3 className="text-lg font-bold mb-4">Share Bundle</h3>

// //               <button
// //                 onClick={() =>
// //                   window.open(
// //                     `https://wa.me/?text=${encodeURIComponent(
// //                       shareText + " " + shareUrl
// //                     )}`,
// //                     "_blank"
// //                   )
// //                 }
// //                 className="w-full py-3 bg-green-500 text-white rounded-lg mb-3"
// //               >
// //                 Share on WhatsApp
// //               </button>

// //               <button
// //                 onClick={() => {
// //                   navigator.clipboard.writeText(shareUrl);
// //                   alert("Link copied!");
// //                 }}
// //                 className="w-full py-3 bg-gray-200 rounded-lg"
// //               >
// //                 Copy Link
// //               </button>

// //               <button
// //                 onClick={() => setShareOpen(false)}
// //                 className="mt-4 text-sm text-red-500"
// //               >
// //                 Close
// //               </button>
// //             </motion.div>
// //           </motion.div>
// //         )}
// //       </AnimatePresence>

// //       {/* =================== SIMILAR ITEMS SECTION (OPTIONAL) =================== */}
// //       <div className="mt-16">
// //         <h2 className="text-2xl font-bold mb-6">Similar Bundles</h2>

// //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
// //           {similar.map((item) => (
// //             <div
// //               key={item._id}
// //               className="p-4 bg-white shadow rounded-xl hover:shadow-lg transition"
// //             >
// //               <img
// //                 src={item.images?.[0]}
// //                 alt={item.title}
// //                 className="h-40 w-full object-cover rounded-lg mb-3"
// //               />
// //               <h4 className="font-bold">{item.title}</h4>
// //               <p className="text-pink-600 font-semibold">₹{item.price}</p>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// import React, { useEffect, useState, useContext } from "react";
// import { useParams } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import API from "../api/api";
// import { CartContext } from "../context/CartContext";
// import { useAuth } from "../context/AuthContext";

// export default function BundleDetail() {
//   const { id } = useParams();
//   const { addToCart } = useContext(CartContext);
//   const { user } = useAuth();

//   const [bundle, setBundle] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [similar, setSimilar] = useState([]);

//   const [color, setColor] = useState("");
//   const [variant, setVariant] = useState("");

//   const [wish, setWish] = useState(false);
//   const [shareOpen, setShareOpen] = useState(false);

//   // -------------------------
//   // LOAD BUNDLE
//   // -------------------------
//   useEffect(() => {
//     const load = async () => {
//       try {
//         const { data } = await API.get(`/bundles/${id}`);
//         setBundle(data);

//         const sim = await API.get("/bundles");
//         setSimilar(sim.data.filter((b) => b._id !== id).slice(0, 4));
//       } catch (err) {
//         console.log("Bundle load failed", err);
//       }
//       setLoading(false);
//     };
//     load();
//   }, [id]);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center py-40">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
//         <span className="ml-4 text-xl font-semibold text-gray-700">Loading bundle...</span>
//       </div>
//     );

//   if (!bundle)
//     return (
//       <div className="text-center py-40">
//         <div className="text-6xl mb-4">😔</div>
//         <div className="text-2xl font-bold text-gray-800 mb-2">Bundle not found</div>
//         <p className="text-gray-600">The bundle you're looking for doesn't exist or has been removed.</p>
//       </div>
//     );

//   // -------------------------
//   // ADD TO WISHLIST
//   // -------------------------
//   const handleWishlist = async () => {
//     if (!user) return alert("Please login to use wishlist");

//     try {
//       await API.post(`/users/${user._id}/wishlist`, {
//         productId: bundle._id,
//         type: "bundle",
//       });

//       setWish(true);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const shareText = `Check out this bundle: ${bundle.title} — ₹${bundle.price}`;
//   const shareUrl = window.location.href;

//   // -------------------------
//   // RETURN UI
//   // -------------------------
//   return (
//     <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 font-display">

//       {/* =================== BREADCRUMB =================== */}
//       <nav className="flex mb-8 text-sm text-gray-500">
//         <a href="/" className="hover:text-pink-600 transition-colors">Home</a>
//         <span className="mx-2">/</span>
//         <a href="/bundles" className="hover:text-pink-600 transition-colors">Bundles</a>
//         <span className="mx-2">/</span>
//         <span className="text-gray-800 font-medium truncate">{bundle.title}</span>
//       </nav>

//       {/* =================== MAIN CONTENT GRID =================== */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        
//         {/* Image Gallery */}
//         <div className="space-y-4">
//           <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white p-4">
//             <img
//               src={bundle.images?.[0] || "/src/assets/placeholder.jpg"}
//               alt={bundle.title}
//               className="w-full h-80 object-cover rounded-xl"
//             />
            
//             {/* Action Buttons */}
//             <div className="absolute top-6 right-6 flex flex-col gap-3">
//               <button
//                 onClick={handleWishlist}
//                 className="bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
//               >
//                 <span
//                   className="material-symbols-outlined text-pink-600 group-hover:scale-110 transition-transform"
//                   style={{ fontVariationSettings: wish ? "'FILL' 1" : "'FILL' 0" }}
//                 >
//                   favorite
//                 </span>
//               </button>

//               <button
//                 onClick={() => setShareOpen(true)}
//                 className="bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
//               >
//                 <span className="material-symbols-outlined text-gray-700 group-hover:scale-110 transition-transform">share</span>
//               </button>
//             </div>

//             {/* Discount Badge */}
//             {bundle.oldPrice && (
//               <div className="absolute top-6 left-6">
//                 <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
//                   {Math.round((1 - bundle.price / bundle.oldPrice) * 100)}% OFF
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Thumbnail Gallery */}
//           <div className="grid grid-cols-4 gap-3">
//             {[1, 2, 3, 4].map((index) => (
//               <div key={index} className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-pink-500 transition-colors cursor-pointer">
//                 <img
//                   src={bundle.images?.[index] || bundle.images?.[0] || "/src/assets/placeholder.jpg"}
//                   alt={`${bundle.title} view ${index + 1}`}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Product Info */}
//         <div className="space-y-6">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-3">{bundle.title}</h1>
//             <p className="text-gray-600 text-lg leading-relaxed">
//               {bundle.description || "Premium curated bundle for all occasions. Carefully selected items that complement each other perfectly."}
//             </p>
//           </div>

//           {/* Price Section */}
//           <div className="flex items-baseline gap-3">
//             <div className="text-4xl font-bold text-pink-600">₹{bundle.price}</div>
//             {bundle.oldPrice && (
//               <div className="text-xl text-gray-500 line-through">₹{bundle.oldPrice}</div>
//             )}
//           </div>

//           {/* Customization Section */}
//           <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-sm border border-gray-100">
//             <h3 className="text-xl font-bold text-gray-900 mb-5">Customize Your Bundle</h3>

//             {/* Color Selection */}
//             <div className="mb-6">
//               <div className="flex items-center justify-between mb-3">
//                 <p className="text-sm font-semibold text-gray-700">Choose Color</p>
//                 <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{color || "Not selected"}</span>
//               </div>
//               <div className="flex gap-2">
//                 {["Red", "Blue", "Pink", "Black"].map((c) => (
//                   <button
//                     key={c}
//                     onClick={() => setColor(c)}
//                     className={`flex-1 py-3 border-2 rounded-xl font-medium transition-all duration-300 ${
//                       color === c 
//                         ? "border-pink-500 bg-pink-50 text-pink-700 shadow-sm" 
//                         : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm"
//                     }`}
//                   >
//                     {c}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Variant Selection */}
//             <div>
//               <div className="flex items-center justify-between mb-3">
//                 <p className="text-sm font-semibold text-gray-700">Choose Variant</p>
//                 <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{variant || "Not selected"}</span>
//               </div>
//               <div className="flex gap-2">
//                 {["Standard", "Premium", "Luxury"].map((v) => (
//                   <button
//                     key={v}
//                     onClick={() => setVariant(v)}
//                     className={`flex-1 py-3 border-2 rounded-xl font-medium transition-all duration-300 ${
//                       variant === v 
//                         ? "border-pink-500 bg-pink-50 text-pink-700 shadow-sm" 
//                         : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm"
//                     }`}
//                   >
//                     {v}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Add to Cart Button */}
//           <button
//             onClick={() => addToCart({ ...bundle, type: "bundle" }, 1, variant, color)}
//             className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100 transition-all duration-300 flex items-center justify-center gap-3"
//           >
//             <span className="material-symbols-outlined">shopping_bag</span>
//             Add Bundle to Cart
//           </button>

//           {/* Features */}
//           <div className="grid grid-cols-3 gap-4 text-center">
//             <div className="p-3 bg-blue-50 rounded-xl">
//               <div className="text-blue-600 material-symbols-outlined mx-auto mb-2">local_shipping</div>
//               <div className="text-sm font-medium text-gray-700">Free Shipping</div>
//             </div>
//             <div className="p-3 bg-green-50 rounded-xl">
//               <div className="text-green-600 material-symbols-outlined mx-auto mb-2">verified</div>
//               <div className="text-sm font-medium text-gray-700">Quality Assured</div>
//             </div>
//             <div className="p-3 bg-purple-50 rounded-xl">
//               <div className="text-purple-600 material-symbols-outlined mx-auto mb-2">support_agent</div>
//               <div className="text-sm font-medium text-gray-700">24/7 Support</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* =================== SHARE POPUP =================== */}
//       <AnimatePresence>
//         {shareOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
//             onClick={() => setShareOpen(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               className="bg-white w-96 p-6 rounded-2xl shadow-2xl mx-4"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-xl font-bold text-gray-900">Share this bundle</h3>
//                 <button
//                   onClick={() => setShareOpen(false)}
//                   className="text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   <span className="material-symbols-outlined">close</span>
//                 </button>
//               </div>

//               <div className="space-y-3">
//                 <button
//                   onClick={() =>
//                     window.open(
//                       `https://wa.me/?text=${encodeURIComponent(
//                         shareText + " " + shareUrl
//                       )}`,
//                       "_blank"
//                     )
//                   }
//                   className="w-full py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
//                 >
//                   <span className="material-symbols-outlined">chat</span>
//                   Share on WhatsApp
//                 </button>

//                 <button
//                   onClick={() => {
//                     navigator.clipboard.writeText(shareUrl);
//                     alert("Link copied to clipboard!");
//                   }}
//                   className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-3"
//                 >
//                   <span className="material-symbols-outlined">link</span>
//                   Copy Link
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* =================== SIMILAR BUNDLES =================== */}
//       <section className="mb-16">
//         <div className="flex items-center justify-between mb-8">
//           <h2 className="text-2xl font-bold text-gray-900">You might also like</h2>
//           <a href="/bundles" className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-2 transition-colors">
//             View all
//             <span className="material-symbols-outlined text-lg">arrow_forward</span>
//           </a>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {similar.map((item) => (
//             <div
//               key={item._id}
//               className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-pink-200"
//             >
//               <div className="relative overflow-hidden">
//                 <img
//                   src={item.images?.[0]}
//                   alt={item.title}
//                   className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
//                 />
//                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
//               </div>
              
//               <div className="p-4">
//                 <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
//                   {item.title}
//                 </h4>
//                 <div className="flex items-center justify-between">
//                   <p className="text-pink-600 font-bold text-lg">₹{item.price}</p>
//                   <button className="text-gray-400 hover:text-pink-600 transition-colors">
//                     <span className="material-symbols-outlined">shopping_bag</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }

// frontend/src/pages/BundleDetail.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/api";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function BundleDetail() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useAuth();

  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similar, setSimilar] = useState([]);
  const [color, setColor] = useState("");
  const [variant, setVariant] = useState("");
  const [shareOpen, setShareOpen] = useState(false);

  // Slider state
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = bundle?.images?.length > 0 ? bundle.images : ["/src/assets/placeholder.jpg"];

  const prevImage = () => setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  const nextImage = () => setCurrentIndex((i) => (i + 1) % images.length);
  const goToImage = (idx) => setCurrentIndex(idx);

  // Keyboard Support for Gallery
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length]);

  // Data Fetching
  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/bundles/${id}`);
        if (!mounted) return;
        setBundle(data);

        // Fetch Similar Bundles
        const sim = await API.get("/bundles");
        if (mounted && sim?.data) {
          setSimilar(sim.data.filter((b) => b._id !== id).slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to load bundle", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, [id]);

  useEffect(() => { setCurrentIndex(0); }, [id]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600 mb-4" />
      <p className="text-pink-600 font-medium animate-pulse uppercase tracking-widest text-xs">Curating your bundle...</p>
    </div>
  );

  if (!bundle) return (
    <div className="text-center py-40">
      <span className="text-6xl">🌸</span>
      <h2 className="text-2xl font-bold mt-4 text-gray-800">Bundle not found</h2>
      <Link to="/bundles" className="mt-4 inline-block text-pink-600 hover:underline">Back to Shop</Link>
    </div>
  );

  const handleAddToCart = () => {
    if (!variant || !color) {
      if (!window.confirm("Continue without selecting color/variant?")) return;
    }
    addToCart({ ...bundle, type: "bundle" }, 1, variant, color);
    alert("Added to cart!");
  };

  const itemsSubtotal = (bundle.items || []).reduce((s, it) => s + (it.price || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 font-sans selection:bg-pink-100 selection:text-pink-600">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-8 text-sm text-gray-500">
        <Link to="/" className="hover:text-pink-600 transition">Home</Link>
        <span>/</span>
        <Link to="/bundles" className="hover:text-pink-600 transition">Bundles</Link>
        <span>/</span>
        <span className="text-pink-600 font-medium truncate uppercase tracking-wider text-xs">{bundle.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* LEFT: IMAGE GALLERY */}
        <div className="space-y-4">
          <div className="relative group rounded-3xl overflow-hidden bg-gray-50 aspect-square shadow-2xl shadow-pink-100/50 border border-pink-50">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full object-cover"
              alt={bundle.title}
            />
            {images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={prevImage} className="bg-white/90 p-2 rounded-full shadow-lg hover:text-pink-600"><span className="material-symbols-outlined">chevron_left</span></button>
                <button onClick={nextImage} className="bg-white/90 p-2 rounded-full shadow-lg hover:text-pink-600"><span className="material-symbols-outlined">chevron_right</span></button>
              </div>
            )}
            {bundle.oldPrice && (
              <div className="absolute top-4 left-4 bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                SAVE {Math.round((1 - bundle.price / bundle.oldPrice) * 100)}%
              </div>
            )}
          </div>
          
          {/* THUMBNAILS */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => goToImage(idx)}
                className={`flex-none w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  idx === currentIndex ? "border-pink-500 ring-2 ring-pink-100" : "border-transparent opacity-70"
                }`}
              >
                <img src={img} className="w-full h-full object-cover" alt="preview" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: INFO & ADD TO CART */}
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">{bundle.title}</h1>
            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-4xl font-black text-pink-600">₹{bundle.price}</span>
              {bundle.oldPrice && <span className="text-xl text-gray-400 line-through font-light">₹{bundle.oldPrice}</span>}
            </div>
            <p className="text-gray-600 leading-relaxed text-lg">{bundle.description || "Indulge in our premium curated selection."}</p>
          </div>

          {/* CUSTOMIZATION CARD */}
          <div className="bg-pink-50/50 rounded-3xl p-6 border border-pink-100 space-y-6 mb-8">
            <div>
              <label className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-3 block">Choose Color</label>
              <div className="flex flex-wrap gap-2">
                {["Rose Pink", "Blush", "Mauve", "Midnight"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      color === c ? "bg-pink-600 text-white shadow-lg shadow-pink-200" : "bg-white text-gray-600 hover:border-pink-300 border"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-3 block">Select Variant</label>
              <div className="grid grid-cols-3 gap-2">
                {["Standard", "Premium", "Luxury"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setVariant(v)}
                    className={`py-3 rounded-xl text-xs font-bold transition-all ${
                      variant === v ? "bg-pink-600 text-white shadow-lg shadow-pink-200" : "bg-white text-gray-600 border"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* BUTTON ACTIONS */}
          <div className="flex gap-3 mb-10">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-pink-200 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              Add Bundle to Cart
            </button>
            <button 
              onClick={() => setShareOpen(true)}
              className="px-6 rounded-2xl border-2 border-gray-200 text-gray-400 hover:border-pink-300 hover:text-pink-600 transition-colors flex items-center justify-center"
              title="Share"
            >
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>

          {/* BUNDLE ITEMS LIST */}
          <div className="border-t border-gray-100 pt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Items Included</h3>
            <div className="space-y-4">
              {bundle.items?.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-50 hover:border-pink-100 transition shadow-sm">
                  <div className="flex items-center gap-4">
                    <img src={it.image || "/src/assets/placeholder.jpg"} className="w-14 h-14 object-cover rounded-xl" alt={it.title} />
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{it.title}</p>
                      <p className="text-xs text-gray-500 uppercase">Premium Select</p>
                    </div>
                  </div>
                  <span className="font-bold text-pink-600">₹{it.price}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between items-center px-4 py-3 bg-pink-50/30 rounded-xl border border-dashed border-pink-200">
              <span className="text-sm font-medium text-pink-800">Bundle Value</span>
              <span className="font-bold text-gray-900 text-lg">₹{itemsSubtotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SIMILAR BUNDLES SECTION */}
      {similar.length > 0 && (
        <section className="mt-20 border-t border-gray-50 pt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900 border-l-4 border-pink-600 pl-4 uppercase tracking-tighter">You Might Also Love</h2>
            <Link to="/bundles" className="text-pink-600 font-bold text-sm hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {similar.map((item) => (
              <Link to={`/bundles/${item._id}`} key={item._id} className="group">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-4 shadow-md group-hover:shadow-pink-100 transition-all">
                  <img src={item.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-bold uppercase tracking-widest">View Detail</span>
                  </div>
                </div>
                <h4 className="font-bold text-gray-800 line-clamp-1 group-hover:text-pink-600 transition">{item.title}</h4>
                <p className="text-pink-600 font-black">₹{item.price}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* SHARE MODAL */}
      <AnimatePresence>
        {shareOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShareOpen(false)}
          >
            <motion.div 
              initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.9 }}
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm text-center shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setShareOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-pink-600 transition">
                <span className="material-symbols-outlined">close</span>
              </button>
              <div className="w-20 h-20 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl">share</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Share the Love</h3>
              <p className="text-gray-500 mb-8 leading-relaxed text-sm px-4">Show your friends this amazing bundle!</p>
              
              <div className="grid gap-3">
                <button 
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(bundle.title + " " + window.location.href)}`)}
                  className="w-full py-4 bg-[#25D366] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-green-100 transition"
                >
                  WhatsApp
                </button>
                <button 
                  onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link Copied!"); }}
                  className="w-full py-4 bg-pink-600 text-white rounded-2xl font-bold hover:bg-pink-700 shadow-lg shadow-pink-100 transition"
                >
                  Copy Link
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}