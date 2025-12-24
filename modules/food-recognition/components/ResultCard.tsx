import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ShareButton from "./ShareButton";
import dynamic from "next/dynamic";
import Image from "next/image";
import PlaceDetailsModal from "./PlaceDetailsModal";

const InteractiveMap = dynamic(() => import("./InteractiveMap"), {
  ssr: false,
});

interface Location {
  name: string;
  lat: number;
  lon: number;
  address?: string;
  distance?: number;
  rating?: number;
  priceLevel?: string;
  phone?: string;
  website?: string;
}

interface Props {
  dish?: string;
  recipe?: string;
  tags?: string[];
  locations?: Location[];
  userLocation: { lat: number; lon: number } | null;
  message?: string;
  predictedDish?: string;
  confidence?: number;
  confidenceLevel?: "high" | "medium" | "low";
  imageUrl?: string;
  alternativeNames?: string[];
  similarDishes?: Array<{ name: string; origin: string }>;
  origin?: { country: string; region?: string };
  nutritionalInfo?: { calories?: string; mainNutrients?: string[] };
  culturalContext?: string;
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
  confidenceLevel,
  imageUrl,
  alternativeNames = [],
  similarDishes = [],
  origin,
  nutritionalInfo,
  culturalContext,
  onAddDish,
}) => {
  const [showAllPlaces, setShowAllPlaces] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Location | null>(null);

  const displayedLocations = showAllPlaces ? locations : locations.slice(0, 4);

  const showAddDish =
    message &&
    message.toLowerCase().includes("not in dataset") &&
    predictedDish &&
    confidence !== undefined;

  return (
    <motion.div
      className="glassmorphism p-6 md:p-8 rounded-3xl shadow-xl border border-white/20"
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
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-8">
            {imageUrl && (
              <div className="w-full md:w-1/3">
                <div className="relative group">
                  <Image
                    src={imageUrl}
                    alt={dish || "Food"}
                    width={400}
                    height={300}
                    className="w-full h-auto rounded-2xl shadow-lg object-cover border-4 border-white transition-transform duration-300 group-hover:scale-[1.02]"
                    priority
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-black/10 pointer-events-none" />
                </div>
              </div>
            )}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-500 bg-orange-50 px-2 py-0.5 rounded">
                      {origin?.country || "Unknown Origin"}
                    </span>
                    {confidence && (
                      <span
                        className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          confidenceLevel === "high"
                            ? "text-green-600 bg-green-50"
                            : confidenceLevel === "medium"
                            ? "text-orange-600 bg-orange-50"
                            : "text-red-600 bg-red-50"
                        }`}
                      >
                        {confidence}% Match ({confidenceLevel})
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                    {dish}
                  </h2>

                  {alternativeNames.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-tighter">
                        Also known as:
                      </span>
                      {alternativeNames.map((alt) => (
                        <span
                          key={alt}
                          className="text-xs font-semibold text-gray-600 italic"
                        >
                          {alt}
                          {alt !== alternativeNames[alternativeNames.length - 1]
                            ? ","
                            : ""}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {tags.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-lg text-xs font-medium border border-zinc-200"
                      >
                        {tag}
                      </span>
                    ))}
                    {tags.length > 5 && (
                      <span className="text-xs text-zinc-400 self-center ml-1">
                        +{tags.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full sm:w-auto">
                  <ShareButton dishName={dish || ""} />
                </div>
              </div>

              {/* Description Section (Mobile/Tablet view - inside flex-1) */}
              <div className="relative mt-6">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-orange-200 rounded-full hidden md:block" />
                <p className="text-lg text-gray-700 leading-relaxed italic">
                  "{recipe}"
                </p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ingredients Section */}
            <div className="bg-white/50 rounded-2xl p-5 border border-white/50 shadow-sm">
              <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                <span className="p-1.5 bg-orange-100 text-orange-600 rounded-lg text-sm">
                  🍅
                </span>
                Main Ingredients
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-white/80 text-gray-700 px-3 py-1.5 rounded-xl text-sm font-medium border border-zinc-200 shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
                {tags.length === 0 && (
                  <span className="text-sm text-gray-400 italic">
                    Ingredients list not available
                  </span>
                )}
              </div>
            </div>

            {/* Dietary / Nutritional Info */}
            <div className="bg-white/50 rounded-2xl p-5 border border-white/50 shadow-sm">
              <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                <span className="p-1.5 bg-green-100 text-green-600 rounded-lg text-sm">
                  🥗
                </span>
                Dietary & Nutrition
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                  <span className="text-sm text-gray-500">Est. Calories</span>
                  <span className="font-bold text-gray-900">
                    {nutritionalInfo?.calories || "N/A"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {nutritionalInfo?.mainNutrients?.map((nutrient) => (
                    <span
                      key={nutrient}
                      className="text-xs font-bold bg-white px-2 py-1 rounded-md border border-zinc-100 text-gray-700"
                    >
                      {nutrient}
                    </span>
                  )) || (
                    <span className="text-xs text-gray-400 italic">
                      No detailed nutrition data
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Cultural Context */}
            <div className="bg-white/50 rounded-2xl p-5 border border-white/50 shadow-sm">
              <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg text-sm">
                  🌍
                </span>
                Cultural Context
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {culturalContext ||
                  "No cultural details available for this dish."}
              </p>
            </div>

            {/* Similar Dishes Section */}
            <div className="bg-white/50 rounded-2xl p-5 border border-white/50 shadow-sm">
              <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                <span className="p-1.5 bg-purple-100 text-purple-600 rounded-lg text-sm">
                  🍲
                </span>
                Similar Dishes
              </h3>
              <div className="space-y-3">
                {similarDishes.length > 0 ? (
                  similarDishes.map((dish, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between group"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                          {dish.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {dish.origin}
                        </span>
                      </div>
                      <span className="text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        ✨
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No similar dishes identified
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location Section */}
          {userLocation && locations && locations.length > 0 && (
            <div className="pt-4 border-t border-zinc-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 font-bold text-gray-900">
                  <span className="p-1.5 bg-red-100 text-red-600 rounded-lg text-sm">
                    📍
                  </span>
                  Where to Find Nearby
                </h3>
                <span className="text-xs text-zinc-500">
                  {locations.length} places found
                </span>
              </div>
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white h-[350px] mb-8 group relative">
                <InteractiveMap
                  locations={locations}
                  userLocation={userLocation}
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[50] pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg text-xs font-bold text-gray-800 border border-white/50">
                    Explore the area
                  </div>
                </div>
              </div>

              {/* Places List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {displayedLocations.map((loc, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={loc.name + idx}
                      onClick={() => setSelectedPlace(loc)}
                      className="flex items-start gap-4 p-4 bg-white/40 rounded-2xl border border-white/40 hover:bg-white/80 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        🏪
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-sm font-bold text-gray-800 truncate group-hover:text-orange-600 transition-colors">
                            {loc.name}
                          </span>
                          {loc.distance !== undefined && (
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full whitespace-nowrap border border-orange-100">
                              {(loc.distance / 1000).toFixed(1)}km
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 truncate mt-0.5">
                          {loc.address || "Nearby location"}
                        </span>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] text-gray-400 font-medium">
                            Click for details
                          </span>
                          <span className="text-orange-500 text-[10px]">→</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {locations.length > 4 && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setShowAllPlaces(!showAllPlaces)}
                    className="group flex items-center gap-2 px-8 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-all shadow-sm"
                  >
                    {showAllPlaces
                      ? "Show Less"
                      : `See More (${locations.length - 4} more)`}
                    <span
                      className={`transition-transform duration-300 ${
                        showAllPlaces ? "rotate-180" : ""
                      }`}
                    >
                      ↓
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <PlaceDetailsModal
        isOpen={!!selectedPlace}
        onClose={() => setSelectedPlace(null)}
        place={selectedPlace}
        userLocation={userLocation}
      />
    </motion.div>
  );
};

export default ResultCard;
