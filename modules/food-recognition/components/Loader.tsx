import React from "react";
import { motion } from "framer-motion";

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-6">
      <div className="w-16 h-16 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <g>
              <motion.rect
                x="20"
                y="6"
                width="8"
                height="20"
                rx="4"
                fill="#fb923c"
                initial={{ y: 6 }}
                animate={{ y: [6, 2, 6] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  repeatType: "reverse",
                }}
              />
              <motion.rect
                x="34"
                y="22"
                width="8"
                height="20"
                rx="4"
                fill="#34d399"
                initial={{ y: 22 }}
                animate={{ y: [22, 18, 22] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  repeatType: "reverse",
                  delay: 0.3,
                }}
              />
              <motion.rect
                x="6"
                y="22"
                width="8"
                height="20"
                rx="4"
                fill="#fbbf24"
                initial={{ y: 22 }}
                animate={{ y: [22, 18, 22] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  repeatType: "reverse",
                  delay: 0.6,
                }}
              />
            </g>
          </svg>
        </motion.div>
      </div>
      <span className="mt-2 text-orange-700 font-semibold">Tasting…</span>
    </div>
  );
};

export default Loader;
