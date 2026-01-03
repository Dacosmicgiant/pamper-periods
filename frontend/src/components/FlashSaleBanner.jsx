import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FlashSaleBanner({ sale }) {
  const [timeLeft, setTimeLeft] = useState({});
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!sale?.expiresAt || !sale?.active) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(sale.expiresAt).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft(null);
        setIsVisible(false);
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sale]);

  const closeBanner = () => {
    setIsVisible(false);
  };

  if (!sale?.active || !timeLeft || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="w-full bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white py-4 relative overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-1/2 translate-y-1/2 animate-pulse delay-1000"></div>
        </div>

        {/* Sparkle Effects */}
        <div className="absolute top-2 left-1/4 text-yellow-300 animate-bounce">✨</div>
        <div className="absolute bottom-2 right-1/4 text-yellow-300 animate-bounce delay-500">✨</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Sale Info */}
            <div className="flex items-center gap-4">
              <motion.div
                className="flex items-center gap-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-2xl">🔥</span>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                  {sale.title}
                </h3>
              </motion.div>

              <div className="hidden sm:block h-6 w-px bg-white/30"></div>

              <motion.div
                className="flex items-center gap-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-lg font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  {sale.percentage}% OFF STOREWIDE
                </span>
              </motion.div>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium opacity-90">Ends in:</span>
                </div>
                
                <div className="flex gap-2">
                  {/* Hours */}
                  <motion.div 
                    className="flex flex-col items-center"
                    key={`hours-${timeLeft.hours}`}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[3rem] text-center">
                      <span className="font-mono font-bold text-lg">
                        {String(timeLeft.hours).padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-xs opacity-80 mt-1">HRS</span>
                  </motion.div>

                  <span className="font-bold text-lg opacity-80">:</span>

                  {/* Minutes */}
                  <motion.div 
                    className="flex flex-col items-center"
                    key={`minutes-${timeLeft.minutes}`}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[3rem] text-center">
                      <span className="font-mono font-bold text-lg">
                        {String(timeLeft.minutes).padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-xs opacity-80 mt-1">MIN</span>
                  </motion.div>

                  <span className="font-bold text-lg opacity-80">:</span>

                  {/* Seconds */}
                  <motion.div 
                    className="flex flex-col items-center"
                    key={`seconds-${timeLeft.seconds}`}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[3rem] text-center">
                      <span className="font-mono font-bold text-lg text-yellow-300">
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-xs opacity-80 mt-1">SEC</span>
                  </motion.div>
                </div>
              </div>

              {/* Close Button */}
              <motion.button
                onClick={closeBanner}
                className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Progress Bar */}
          <motion.div 
            className="w-full bg-white/20 h-1 mt-3 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="h-full bg-yellow-300 rounded-full"
              animate={{ 
                width: ["0%", "100%"],
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-1/2 left-10 text-2xl opacity-20"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          ⚡
        </motion.div>
        <motion.div
          className="absolute bottom-4 right-20 text-xl opacity-20"
          animate={{
            y: [0, 10, 0],
            rotate: [0, -15, 15, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        >
          🎯
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}