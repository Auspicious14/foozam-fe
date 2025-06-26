import React from 'react';
import { motion } from 'framer-motion';
import ShareButton from './ShareButton';

interface Props {
  dish?: string;
  recipe?: string;
  tags?: string[];
  locations?: { name: string; city: string }[];
  message?: string;
  predictedDish?: string;
  confidence?: number;
  onAddDish?: () => void;
}

const ResultCard: React.FC<Props> = ({
  dish,
  recipe,
  tags = [],
  locations = [],
  message,
  predictedDish,
  confidence,
  onAddDish,
}) => {
  const showAddDish =
    message && message.toLowerCase().includes('not in dataset') && predictedDish && confidence !== undefined;

  return (
    <motion.div
      className="glassmorphism p-6 rounded-2xl shadow-xl mb-6"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 80, damping: 12 }}
    >
      {showAddDish ? (
        <div className="flex flex-col items-center">
          <span className="text-orange-700 font-semibold text-lg mb-2">
            Predicted Dish (not in dataset):
          </span>
          <span className="text-2xl font-bold text-green-700 mb-1">
            {predictedDish}
          </span>
          <span className="text-gray-700 mb-4">
            Confidence:{' '}
            <span className="font-semibold text-orange-600">
              {confidence}%
            </span>
          </span>
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: '0 0 0 4px #fb923c44' }}
            whileTap={{ scale: 0.96 }}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg shadow-lg font-semibold transition-all focus:outline-none"
            onClick={onAddDish}
          >
            Add Dish
          </motion.button>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-orange-700 mb-2">{dish}</h2>
          <p className="mb-3 text-gray-700">{recipe}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map(tag => (
              <span key={tag} className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                {tag}
              </span>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-600">Where to find:</h3>
            <div className="flex flex-col gap-2">
              {locations.map((loc, idx) => (
                <motion.div
                  key={loc.name + loc.city}
                  className="bg-white/60 backdrop-blur rounded-lg px-3 py-2 shadow border border-orange-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <span className="font-semibold">{loc.name}</span> <span className="text-gray-500">({loc.city})</span>
                </motion.div>
              ))}
            </div>
          </div>
          <ShareButton dishName={dish || ''} />
        </>
      )}
    </motion.div>
  );
};

export default ResultCard;