import React from "react";
import { motion, useAnimation } from "framer-motion";

interface Props {
  dishName: string;
}

const ShareButton: React.FC<Props> = ({ dishName }) => {
  const controls = useAnimation();

  const handleShare = () => {
    controls.start({
      scale: [1, 1.15, 0.95, 1],
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.5, times: [0, 0.2, 0.8, 1] },
    });

    const shareText = `I just discovered ${dishName} using FooZam! 🍲✨ #FooZam #FoodRecognition`;
    const shareUrl = window.location.href;
    const xIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}`;

    window.open(xIntentUrl, "_blank");
  };

  return (
    <motion.button
      onClick={handleShare}
      animate={controls}
      whileTap={{ scale: 0.95 }}
      className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-black text-white rounded-xl shadow-lg font-bold hover:bg-zinc-800 transition-all active:scale-95"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-white"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      <span>Post on X</span>
    </motion.button>
  );
};

export default ShareButton;
