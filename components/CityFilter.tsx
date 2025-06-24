import React from 'react';
import { motion } from 'framer-motion';

interface CityFilterProps {
  cities: string[];
  selectedCity: string;
  onCityChange: (city: string) => void;
}

const CityFilter: React.FC<CityFilterProps> = ({ cities, selectedCity, onCityChange }) => {
  return (
    <motion.div className="mb-2">
      <label className="block text-orange-700 font-semibold mb-1">City</label>
      <motion.select
        className="rounded-lg px-3 py-2 border border-orange-200 bg-white/60 backdrop-blur shadow focus:outline-none"
        value={selectedCity}
        onChange={(e) => onCityChange(e.target.value)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <option value="">All</option>
        {cities.map((city, idx) => (
          <motion.option
            key={city}
            value={city}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
          >
            {city}
          </motion.option>
        ))}
      </motion.select>
    </motion.div>
  );
};

export default CityFilter;