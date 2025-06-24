import React from 'react';
import { motion } from 'framer-motion';
import ShareButton from './ShareButton';

interface Location {
  name: string;
  city: string;
}

interface ResultCardProps {
  dish: string;
  recipe: string;
  tags: string[];
  locations: Location[];
}

const ResultCard: React.FC<ResultCardProps> = ({ dish, recipe, tags, locations }) => {
  return (
    <motion.div
      className="glassmorphism p-6 rounded-2xl shadow-xl mb-6"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 80, damping: 12 }}
    >
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
      <ShareButton dishName={dish} />
    </motion.div>
  );
};

export default ResultCard;