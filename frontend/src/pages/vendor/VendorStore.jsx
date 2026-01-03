// import React, { useEffect, useState, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import API from "../../api/api";
// import { Star, StarHalf, User, MessageCircle } from "lucide-react";

// /**
//  * VendorStore.jsx
//  * Full upgraded vendor store + reviews + login-required modal
//  */

// export default function VendorStore() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [vendor, setVendor] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Review form state
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [reviewLoading, setReviewLoading] = useState(false);

//   // Login modal
//   const [loginPopup, setLoginPopup] = useState(false);

//   /* -------------------------------
//         Load vendor store data
//   --------------------------------*/
//   const loadVendor = useCallback(async () => {
//     try {
//       const res = await API.get(`/vendor-public/${id}`);
//       setVendor(res.data.vendor || {});
//       setProducts(Array.isArray(res.data.products) ? res.data.products : []);
//     } catch (err) {
//       console.error("Vendor Store Load Error:", err);
//       setVendor({});
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   useEffect(() => {
//     loadVendor();
//   }, [loadVendor]);

//   /* -------------------------------
//         Loading + Not found UI
//   --------------------------------*/
//   if (loading) {
//   return (
//     <div className="max-w-7xl mx-auto px-6 py-12 space-y-10 bg-white">

//       {/* Header Loading */}
//       <div className="flex items-center gap-6 animate-fadeIn">
//         <div className="w-28 h-28 rounded-full skeleton"></div>

//         <div className="flex-1 space-y-3">
//           <div className="w-48 h-6 rounded skeleton"></div>
//           <div className="w-32 h-4 rounded skeleton"></div>
//           <div className="w-full h-3 rounded skeleton"></div>
//           <div className="w-2/3 h-3 rounded skeleton"></div>
//         </div>
//       </div>

//       {/* Banner Loading */}
//       <div className="w-full h-64 rounded-xl skeleton"></div>

//       {/* Products Loading */}
//       <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {[1, 2, 3, 4, 5, 6].map((i) => (
//           <div key={i} className="p-4 bg-white rounded-xl shadow space-y-3 animate-fadeIn">
//             <div className="w-full h-48 rounded skeleton"></div>
//             <div className="w-3/4 h-4 rounded skeleton"></div>
//             <div className="w-1/2 h-4 rounded skeleton"></div>
//           </div>
//         ))}
//       </div>

//       {/* Reviews Loading */}
//       <div className="mt-12 space-y-4">
//         {[1, 2].map((i) => (
//           <div key={i} className="p-4 bg-white rounded-xl shadow flex gap-4 animate-fadeIn">
//             <div className="w-10 h-10 rounded-full skeleton"></div>
//             <div className="flex-1 space-y-3">
//               <div className="w-32 h-4 rounded skeleton"></div>
//               <div className="w-full h-3 rounded skeleton"></div>
//               <div className="w-2/3 h-3 rounded skeleton"></div>
//             </div>
//           </div>
//         ))}
//       </div>

//     </div>
//   );
// }


//   if (!vendor || !vendor._id) {
//     return (
//       <div className="text-center py-20 text-red-500 text-xl">
//         Vendor not found.
//       </div>
//     );
//   }

//   /* -------------------------------
//         Helpers
//   --------------------------------*/
//   const badgeList = [];
//   if (vendor.badges?.topRated) badgeList.push("Top Rated");
//   if (vendor.badges?.trusted) badgeList.push("Trusted Seller");
//   if (vendor.badges?.fastShipping) badgeList.push("Fast Shipping");

//   const StarDisplay = ({ rating }) => {
//     const r = Number(rating) || 0;
//     const fullStars = Math.floor(r);
//     const halfStar = r % 1 >= 0.5;
//     return (
//       <div className="flex items-center">
//         {[...Array(fullStars)].map((_, i) => (
//           <Star key={`f${i}`} size={18} className="text-yellow-500" />
//         ))}
//         {halfStar && <StarHalf size={18} className="text-yellow-500" />}
//         {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
//           <Star key={`e${i}`} size={18} className="text-gray-300" />
//         ))}
//       </div>
//     );
//   };

//   /* -------------------------------
//         Login required modal
//   --------------------------------*/
//   const LoginRequiredModal = ({ open, onClose }) => {
//     if (!open) return null;
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-80 shadow-xl animate-fadeIn">
//           <h2 className="text-lg font-semibold mb-2 text-center">Login Required</h2>
//           <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
//             You must be logged in to submit a review.
//           </p>

//           <div className="flex gap-3">
//             <button
//               onClick={onClose}
//               className="flex-1 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={() => navigate("/login")}
//               className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
//             >
//               Login
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   /* -------------------------------
//         Submit review
//   --------------------------------*/
//   const submitReview = async () => {
//     const userToken = localStorage.getItem("token");
//     if (!userToken) {
//       setLoginPopup(true);
//       return;
//     }

//     if (!rating) {
//       alert("Select a star rating");
//       return;
//     }
//     if (!comment.trim()) {
//       alert("Write a review");
//       return;
//     }

//     try {
//       setReviewLoading(true);
//       await API.post(`/vendor-public/${id}/review`, { rating, comment });

//       // success
//       setRating(0);
//       setComment("");
//       await loadVendor();
//       alert("Review submitted!");
//     } catch (err) {
//       console.error("Submit review error:", err);
//       alert(err.response?.data?.message || "Review failed");
//     } finally {
//       setReviewLoading(false);
//     }
//   };

//   /* -------------------------------
//         Render
//   --------------------------------*/
//   return (
//     <div className="max-w-7xl mx-auto px-6 py-12">
//       {/* Header */}
//       <div className="flex items-center gap-6">
//         <img
//           src={vendor.logo || "/placeholder.jpg"}
//           alt="Vendor Logo"
//           className="w-28 h-28 rounded-full object-cover border shadow"
//         />

//         <div>
//           <h1 className="text-3xl font-bold">{vendor.shopName}</h1>

//           <div className="flex items-center gap-2 mt-1">
//             <StarDisplay rating={vendor.rating || 0} />
//             <span className="text-black-600 ml-1">
//               {vendor.rating ? Number(vendor.rating).toFixed(1) : "0.0"} (
//               {vendor.numReviews || vendor.reviews?.length || 0} reviews)
//             </span>
//           </div>

//           <p className="text-black-600 mt-2">
//             {vendor.description || "No description available."}
//           </p>

//           <div className="flex gap-2 mt-3">
//             {badgeList.length > 0 ? (
//               badgeList.map((b, i) => (
//                 <span key={i} className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
//                   {b}
//                 </span>
//               ))
//             ) : (
//               <span className="text-gray-400 text-sm">No badges</span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Banner */}
//       {vendor.banner && (
//         <div className="mt-8">
//           <img src={vendor.banner} alt="Banner" className="w-full h-64 object-cover rounded-xl shadow" />
//         </div>
//       )}

//       {/* Products */}
//       <h2 className="mt-12 text-2xl font-semibold mb-4">Products</h2>

//       {products.length === 0 ? (
//         <div className="text-gray-500 mt-10">No products available.</div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {products.map((p) => (
//             <div key={p._id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 cursor-pointer">
//               <img src={p.images?.[0] || "/placeholder.jpg"} alt={p.title} className="w-full h-48 object-cover rounded" />
//               <h3 className="mt-3 font-semibold">{p.title}</h3>
//               <p className="text-pink-600 font-bold text-lg">₹{p.price}</p>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Reviews */}
//       <h2 className="mt-14 text-2xl font-semibold mb-4">Customer Reviews</h2>

//       {vendor.reviews && vendor.reviews.length > 0 ? (
//         <div className="space-y-4">
//           {vendor.reviews.map((r, i) => (
//             <div key={i} className="p-4 bg-white rounded-xl shadow border flex items-start gap-3">
//               <User className="w-10 h-10 text-gray-400" />
//               <div className="flex-1">
//                 <div className="flex items-center justify-between">
//                   <StarDisplay rating={r.rating} />
//                   <span className="text-sm text-gray-500">
//                     {r.name || "Customer"}
//                   </span>
//                 </div>
//                 <p className="mt-1 text-gray-700">{r.comment}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500">No reviews yet.</p>
//       )}

//       {/* Review Form */}
//       <div className="mt-10 p-6 bg-gray-50 rounded-xl shadow border">
//         <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
//           <MessageCircle /> Write a Review
//         </h3>

//         <div className="flex gap-1 mb-3">
//           {[1, 2, 3, 4, 5].map((num) => (
//             <Star
//               key={num}
//               size={28}
//               className={`cursor-pointer ${rating >= num ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
//               onClick={() => setRating(num)}
//             />
//           ))}
//         </div>

//         <textarea
//           rows={4}
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           placeholder="Share your experience..."
//           className="w-full p-3 border rounded-xl outline-none"
//         />

//         <div className="flex justify-end">
//           <button
//             onClick={submitReview}
//             disabled={reviewLoading}
//             className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow disabled:opacity-50"
//           >
//             {reviewLoading ? "Submitting..." : "Submit Review"}
//           </button>
//         </div>
//       </div>

//       {/* Login modal */}
//       <LoginRequiredModal open={loginPopup} onClose={() => setLoginPopup(false)} />
//     </div>
//   );
// }
import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api/api";
import { motion } from "framer-motion";
import {
  MapPin,
  Award,
  Zap,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

export default function VendorStore() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadVendor = useCallback(async () => {
    try {
      const res = await API.get(`/vendor-public/${id}`);
      setVendor(res.data.vendor || {});
      setProducts(Array.isArray(res.data.products) ? res.data.products : []);
    } catch (err) {
      console.error("Vendor Store Load Error:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadVendor();
  }, [loadVendor]);

  const Badge = ({ icon: Icon, label, color }) => (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all hover:scale-105 ${color}`}>
      <Icon size={12} />
      {label}
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="size-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
    </div>
  );

  if (!vendor?._id) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-slate-400">
      <ShoppingBag size={48} className="mb-4 opacity-20" />
      <p className="font-serif italic text-xl">The boutique could not be found.</p>
      <Link to="/" className="mt-6 text-xs font-black uppercase tracking-widest border-b border-slate-900 pb-1 text-slate-900">Return to Gallery</Link>
    </div>
  );

  return (
    <div className="min-h-screen pb-24">
      {/* HERO BANNER - Now more immersive */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        {vendor.banner ? (
          <img src={vendor.banner} alt="Cover" className="w-full h-full object-cover scale-105" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-pink-200 via-rose-100 to-pink-200" />
        )}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="flex flex-col lg:flex-row gap-12 -mt-32">
          
          {/* SIDEBAR PROFILE - Frosted Glass effect */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full lg:w-[360px] shrink-0"
          >
            <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.05)] p-8 border border-white sticky top-24">
              <div className="relative -mt-24 mb-6 flex justify-center">
                <img
                  src={vendor.logo || "/placeholder.jpg"}
                  alt={vendor.shopName}
                  className="size-36 rounded-[2.5rem] object-cover border-[6px] border-white shadow-xl rotate-3"
                />
              </div>

              <div className="text-center">
                <h1 className="text-3xl font-serif text-slate-900 mb-2">{vendor.shopName}</h1>
                <div className="flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                  <MapPin size={12} className="text-pink-500 mr-1" />
                  {vendor.address?.city || "Boutique"}, {vendor.address?.state || "Collection"}
                </div>
                
                <p className="text-sm text-slate-500 font-light leading-relaxed mb-8">
                  {vendor.description || "Curating excellence in every product for our distinguished clientele."}
                </p>

                {/* Badges - Styled as minimalist pills */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {vendor.badges?.topRated && <Badge icon={Award} label="Top Rated" color="bg-amber-50 text-amber-700 border-amber-100" />}
                  {vendor.badges?.trusted && <Badge icon={ShieldCheck} label="Verified" color="bg-slate-50 text-slate-700 border-slate-100" />}
                  {vendor.badges?.fastShipping && <Badge icon={Zap} label="Priority" color="bg-pink-50 text-pink-700 border-pink-100" />}
                </div>

                <button className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-slate-200 hover:bg-pink-600 transition-all">
                  Contact Designer
                </button>
              </div>
            </div>
          </motion.div>

          {/* PRODUCTS GRID */}
          <div className="flex-1 lg:pt-16">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-serif text-slate-900">Curated <span className="italic font-light">Collection</span></h2>
                <div className="h-0.5 w-10 bg-pink-400 mt-2 rounded-full" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {products.length} Items Available
              </span>
            </div>

            {products.length === 0 ? (
              <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-20 text-center border border-white">
                <ShoppingBag size={40} className="mx-auto mb-4 opacity-10" />
                <p className="font-serif italic text-slate-400">The collection is currently being curated.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((p, idx) => (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group"
                  >
                    <Link to={`/product/${p._id}`}>
                      <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-white border-[6px] border-white shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:shadow-pink-100 group-hover:-translate-y-2">
                        <img
                          src={p.images?.[0]}
                          alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                      </div>
                      <div className="mt-6 px-2">
                        <h3 className="text-sm font-bold text-slate-800 tracking-tight transition-colors group-hover:text-pink-600">{p.title}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-serif text-slate-900 font-light">₹{p.price}</span>
                          <div className="size-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-all">
                            <ArrowRight size={14} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}