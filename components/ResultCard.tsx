import React from "react";
import { motion } from "framer-motion";
import ShareButton from "./ShareButton";
import dynamic from "next/dynamic";

const InteractiveMap = dynamic(() => import("./InteractiveMap"), {
  ssr: false,
});

interface Location {
  name: string;
  lat: number;
  lon: number;
}

interface Props {
  dish?: string;
  recipe?: string;
  tags?: string[];
  locations?: Location[];
  userLocation?: { lat: number; lon: number } | null;
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
  userLocation,
  message,
  predictedDish,
  confidence,
  onAddDish,
}) => {
  const showAddDish =
    message &&
    message.toLowerCase().includes("not in dataset") &&
    predictedDish &&
    confidence !== undefined;

  return (
    <motion.div
      className="glassmorphism p-6 md:p-8 rounded-2xl shadow-xl"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 12 }}
    >
      {showAddDish ? (
        <div className="flex flex-col items-center text-center">
          <span className="text-orange-700 font-semibold text-lg mb-2">
            Predicted Dish (Not in Dataset)
          </span>
          <span className="text-3xl font-bold text-green-700 mb-1">
            {predictedDish}
          </span>
          <span className="text-gray-700 mb-6">
            Confidence:{" "}
            <span className="font-semibold text-orange-600">
              {confidence.toFixed(2)}%
            </span>
          </span>
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: "0 0 0 4px #fb923c44" }}
            whileTap={{ scale: 0.96 }}
            className="px-8 py-3 bg-orange-500 text-white rounded-lg shadow-lg font-semibold transition-all focus:outline-none"
            onClick={onAddDish}
          >
            Add Dish to Dataset
          </motion.button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-3xl font-bold text-orange-700">{dish}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <ShareButton dishName={dish || ""} />
          </div>
          <p className="mb-6 text-gray-800 leading-relaxed">{recipe}</p>
          {userLocation && locations && locations.length > 0 && (
            <div>
              <h3 className="font-semibold text-xl mb-3 text-orange-600">
                Where to Find It
              </h3>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <InteractiveMap
                  locations={locations}
                  userLocation={userLocation}
                />
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default ResultCard;