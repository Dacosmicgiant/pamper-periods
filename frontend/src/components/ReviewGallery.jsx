import React from "react";
import { motion } from "framer-motion";

export default function ReviewGallery({ reviews = [] }) {
  if (!reviews.length)
    return (
      <motion.div 
        className="text-center py-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-3">reviews</div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">No reviews yet</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Be the first to share your experience!</p>
      </motion.div>
    );

  return (
    <div className="space-y-6">
      {reviews.map((r, idx) => (
        <motion.div
          key={idx}
          className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                {r.user?.name ? r.user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xs">check</span>
              </div>
            </motion.div>

            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                    {r.user?.name || "Anonymous User"}
                  </h3>
                  {r.user?.verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      Verified
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.span
                        key={i}
                        className="material-symbols-outlined text-lg"
                        style={{
                          fontVariationSettings:
                            i < r.rating ? "'FILL' 1" : "'FILL' 0",
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: idx * 0.1 + i * 0.1 }}
                      >
                        star
                      </motion.span>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-2">
                    {r.rating}.0
                  </span>
                </div>
              </div>

              {/* Comment */}
              <motion.p 
                className="text-gray-700 dark:text-gray-300 leading-relaxed text-base line-clamp-4 group-hover:line-clamp-none transition-all duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 + 0.5 }}
              >
                {r.comment || "No review text provided."}
              </motion.p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  {r.createdAt && (
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">calendar_today</span>
                      <span>{new Date(r.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  )}
                  
                  {/* Helpful Count */}
                  {r.helpfulCount > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">thumb_up</span>
                      <span>{r.helpfulCount} helpful</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-base">thumb_up</span>
                    Helpful
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-base">flag</span>
                    Report
                  </button>
                </div>
              </div>

              {/* Product Info (if available) */}
              {r.product && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-center bg-cover border border-gray-200 dark:border-gray-600"
                         style={{ backgroundImage: `url("${r.product.image}")` }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {r.product.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {r.product.variant}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Load More Button */}
      {reviews.length > 5 && (
        <motion.div 
          className="text-center pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button className="px-8 py-3 bg-gradient-to-r from-primary to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 mx-auto">
            <span className="material-symbols-outlined">expand_more</span>
            Load More Reviews
          </button>
        </motion.div>
      )}
    </div>
  );
}