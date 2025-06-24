import React from 'react';
import { motion } from 'framer-motion';

interface DietFilterProps {
  options: string[];
  selected: string;
  onChange: (val: string) => void;
}

const DietFilter: React.FC<DietFilterProps> = ({ options, selected, onChange }) => {
  return (
    <motion.div className="mb-2">
      <label className="block text-orange-700 font-semibold mb-1">Dietary</label>
      <motion.select
        className="rounded-lg px-3 py-2 border border-orange-200 bg-white/60 backdrop-blur shadow focus:outline-none"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <option value="">All</option>
        {options.map((opt, idx) => (
          <motion.option
            key={opt}
            value={opt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </motion.option>
        ))}
      </motion.select>
    </motion.div>
  );
};

export default DietFilter;