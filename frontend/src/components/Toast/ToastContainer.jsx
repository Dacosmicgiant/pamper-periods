import React from "react";
import { AnimatePresence ,motion } from "framer-motion";

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25 }}
            className={`min-w-[260px] px-4 py-3 rounded-lg shadow-lg text-white flex justify-between items-center
            ${t.type === "success"
                ? "bg-green-600"
                : t.type === "error"
                  ? "bg-red-600"
                  : "bg-blue-600"
              }`}
          >
            <span>{t.message}</span>

            <button
              onClick={() => removeToast(t.id)}
              className="ml-3 text-white font-bold"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
