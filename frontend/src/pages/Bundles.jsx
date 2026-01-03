import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import { motion, AnimatePresence } from "framer-motion";

export default function BundleList() {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/bundles");
        setBundles(res.data);
      } catch (err) {
        console.log("Error loading bundles", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-rose-50/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-12 sm:py-20">
        
        {/* Hero Header */}
        <header className="relative mb-16 text-center sm:text-left">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 mb-4 rounded-full bg-pink-100 text-pink-600 text-xs font-bold uppercase tracking-widest"
          >
            Exclusive Collections
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight"
          >
            Gift Bundles <span className="text-pink-500">&</span> Combos
          </motion.h2>
          <p className="mt-4 text-gray-500 max-w-2xl text-lg font-light">
            Beautifully curated sets designed to make every occasion unforgettable.
          </p>
        </header>

        {/* Loading State */}
        {loading ? (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-96 bg-pink-50 animate-pulse rounded-[2.5rem]" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence>
                {bundles.map((b, index) => (
                  <motion.div
                    key={b._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`/bundle/${b._id}`} className="group relative block h-full">
                      {/* Card Container */}
                      <div className="relative h-full bg-white rounded-[2.5rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-pink-50 group-hover:shadow-[0_20px_50px_rgba(236,72,153,0.15)] group-hover:-translate-y-2 transition-all duration-500 ease-out flex flex-col">
                        
                        {/* Image Section */}
                        <div className="relative aspect-[1/1] rounded-[2rem] overflow-hidden bg-pink-50/50">
                          <img
                            src={b.images?.[0] || "/src/assets/placeholder.jpg"}
                            alt={b.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          
                          {/* Item Count Float */}
                          {b.items?.length > 0 && (
                            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-pink-600 px-3 py-1 text-[11px] font-bold rounded-full shadow-sm">
                              {b.items.length} GIFTS
                            </span>
                          )}

                          {/* Discount Badge (Example if oldPrice exists) */}
                          {b.oldPrice && (
                            <span className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 text-[11px] font-bold rounded-full shadow-md">
                              SAVE
                            </span>
                          )}
                        </div>

                        {/* Content Section */}
                        <div className="mt-6 px-2 flex flex-col flex-grow">
                          <h3 className="text-xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors line-clamp-1">
                            {b.title}
                          </h3>
                          
                          <p className="mt-2 text-gray-400 text-sm line-clamp-2 leading-relaxed">
                            {b.description || "A premium curation of gifts designed for elegance and joy."}
                          </p>

                          {/* Pricing & CTA */}
                          <div className="mt-6 pt-5 border-t border-pink-50 flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter">Total Value</p>
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-pink-600">₹{b.price}</span>
                                {b.oldPrice && (
                                  <span className="text-sm text-gray-300 line-through font-medium">₹{b.oldPrice}</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="h-12 w-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-lg shadow-pink-200 group-hover:rotate-12 transition-transform duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {bundles.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-40 rounded-[3rem] bg-white border-2 border-dashed border-pink-100"
              >
                <div className="text-6xl mb-4">🎁</div>
                <h3 className="text-2xl font-bold text-gray-800">No Bundles Found</h3>
                <p className="text-gray-400 mt-2">Check back soon for new gift arrivals!</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}