import React from "react";
import { motion } from "framer-motion";

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
        <motion.div
           className="absolute inset-0 border-4 border-brand-orange rounded-full"
           style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }}
           animate={{ rotate: 360 }}
           transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <motion.div
           className="absolute inset-3 border-4 border-brand-green rounded-full opacity-50"
           style={{ borderBottomColor: 'transparent', borderRightColor: 'transparent' }}
           animate={{ rotate: -360 }}
           transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />
      </div>
      <div className="flex flex-col items-center">
         <span className="text-brand-dark font-black tracking-widest text-[10px] uppercase">Analyzing Palette</span>
         <span className="text-gray-400 font-bold text-[8px] uppercase tracking-widest mt-1">Please wait a moment</span>
      </div>
    </div>
  );
};


export default Loader;
