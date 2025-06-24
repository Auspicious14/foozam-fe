import React from 'react';
import { motion, useAnimation } from 'framer-motion';

interface Props {
  dishName: string;
}

const ShareButton: React.FC<Props> = ({ dishName }) => {
  const controls = useAnimation();

  const handleShare = async () => {
    controls.start({
      scale: [1, 1.15, 0.95, 1],
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.5, times: [0, 0.2, 0.8, 1] }
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Found a delicious dish!',
          text: `Found ${dishName}! #FoodShazam`,
          url: window.location.href,
        });
      } catch (error) {
        // ignore
      }
    } else {
      alert('Sharing is not supported in this browser.');
    }
  };

  return (
    <motion.button
      onClick={handleShare}
      animate={controls}
      whileTap={{ scale: 0.95 }}
      className="relative mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg shadow-lg font-semibold overflow-hidden focus:outline-none hover:bg-orange-600 transition-all"
    >
      <span className="absolute inset-0 pointer-events-none">
        <motion.span
          initial={{ scale: 0, opacity: 0.4 }}
          animate={controls}
          style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '9999px', display: 'block', width: '100%', height: '100%' }}
        />
      </span>
      Share on X
    </motion.button>
  );
};

export default ShareButton;