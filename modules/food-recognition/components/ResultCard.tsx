import React from "react";
import { motion } from "framer-motion";
import ShareButton from "./ShareButton";
import dynamic from "next/dynamic";
import Image from "next/image";

const InteractiveMap = dynamic(() => import("./InteractiveMap"), {
  ssr: false,
});

interface Location {
  name: string;
  lat: number;
  lon: number;
  address?: string;
  distance?: number;
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
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white h-[300px] mb-6">
                <InteractiveMap
                  locations={locations}
                  userLocation={userLocation}
                />
              </div>

              {/* Places List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {locations.slice(0, 6).map((loc, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-white/40 rounded-xl border border-white/40 hover:bg-white/60 transition-colors"
                  >
                    <span className="text-lg">🏪</span>
                    <div className="flex flex-col flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-sm font-bold text-gray-800 line-clamp-1">
                          {loc.name}
                        </span>
                        {loc.distance !== undefined && (
                          <span className="text-[10px] font-medium text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                            {(loc.distance / 1000).toFixed(1)}km
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 line-clamp-1">
                        {loc.address || "Nearby location"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ResultCard;
