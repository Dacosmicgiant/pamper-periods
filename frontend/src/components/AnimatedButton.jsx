import React from "react";
import {motion} from "framer-motion";

export default function AnimatedButton({ children, onClick, className = "" }) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`px-6 py-3 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-bold shadow-md ${className}`}
    >
      {children}
    </motion.button>
  );
}
