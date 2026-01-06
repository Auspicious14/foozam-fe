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
      className="glass-card p-6 md:p-12 rounded-[40px] relative overflow-hidden"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
    >
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 blur-[80px] rounded-full pointer-events-none -mr-32 -mt-32" />
      
      {showAddDish ? (
        <div className="flex flex-col items-center text-center py-8">
           <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center text-3xl mb-6">🔍</div>
          <span className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-3">
            Predicted Dish (Not in Dataset)
          </span>
          <h2 className="text-4xl font-black text-brand-dark mb-4 tracking-tight">
            {predictedDish}
          </h2>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-brand-orange rounded-full font-bold text-sm mb-10">
             Match Confidence: {confidence.toFixed(1)}%
          </div>
          <motion.button
            whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(255,138,0,0.3)" }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-4 bg-brand-dark text-white rounded-2xl shadow-xl font-bold transition-all focus:outline-none premium-shadow"
            onClick={onAddDish}
          >
            Add this Dish to Dataset
          </motion.button>
        </div>
      ) : (
        <div className="space-y-12 relative z-10">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row gap-12 lg:items-center">
            {imageUrl && (
              <div className="w-full lg:w-[40%]">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-br from-brand-orange to-brand-green rounded-[38px] opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative rounded-[32px] overflow-hidden shadow-2xl border-4 border-white transition-transform duration-700 group-hover:scale-[1.03]">
                    <Image
                      src={imageUrl}
                      alt={dish || "Food"}
                      width={500}
                      height={500}
                      className="w-full h-auto aspect-square object-cover"
                      priority
                    />
                  </div>
                  {confidence && (
                    <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-3xl shadow-2xl border border-gray-50 flex flex-col items-center min-w-[100px]">
                       <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Match</span>
                       <span className={`text-2xl font-black ${
                          confidenceLevel === "high" ? "text-brand-green" : "text-brand-orange"
                       }`}>{confidence}%</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="flex-1">
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 rounded-full bg-brand-dark text-white text-[10px] font-black uppercase tracking-widest">
                       FEATURED DISH
                    </span>
                    <span className="text-gray-300 font-bold text-sm">/</span>
                    <span className="text-brand-orange font-bold text-sm uppercase tracking-widest">
                      {origin?.country || "Global Flavor"}
                    </span>
                  </div>
                  
                  <h2 className="text-5xl sm:text-7xl font-black text-brand-dark leading-[0.9] tracking-tighter mb-6 font-playfair">
                    {dish}
                  </h2>

                  {alternativeNames.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3 mb-8">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Known locally as:</span>
                      {alternativeNames.map((alt, i) => (
                        <span key={alt} className="text-gray-500 font-bold italic text-sm">
                           {alt}{i < alternativeNames.length - 1 ? " • " : ""}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 relative mb-8">
                     <span className="absolute -top-3 left-6 px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">Description</span>
                     <p className="text-lg text-gray-600 leading-relaxed font-medium">
                        "{recipe}"
                     </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 6).map((tag) => (
                      <span
                        key={tag}
                        className="bg-white px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest text-gray-500 border border-gray-100 shadow-sm hover:border-brand-orange/30 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <ShareButton dishName={dish || ""} />
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Ingredients */}
             <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-2xl bg-orange-50 text-brand-orange flex items-center justify-center text-lg">🥕</div>
                   <h3 className="font-black text-brand-dark uppercase tracking-widest text-xs">Ingredients</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                   {tags.map(tag => (
                      <span key={tag} className="text-sm font-bold text-gray-600 px-3 py-1.5 bg-gray-50 rounded-lg">{tag}</span>
                   ))}
                </div>
             </div>

             {/* Nutrition */}
             <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-2xl bg-green-50 text-brand-green flex items-center justify-center text-lg">🥗</div>
                   <h3 className="font-black text-brand-dark uppercase tracking-widest text-xs">Vital Statistics</h3>
                </div>
                <div className="space-y-4">
                   <div className="flex items-end gap-2">
                      <span className="text-3xl font-black text-brand-dark leading-none">{nutritionalInfo?.calories || "---"}</span>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Calories / Serving</span>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {nutritionalInfo?.mainNutrients?.map(n => (
                         <span key={n} className="text-[10px] font-black uppercase tracking-wider bg-white border border-gray-100 px-2 py-1 rounded shadow-sm">{n}</span>
                      ))}
                   </div>
                </div>
             </div>

             {/* Connection */}
             <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-lg">🌍</div>
                   <h3 className="font-black text-brand-dark uppercase tracking-widest text-xs">Heritage</h3>
                </div>
                <p className="text-sm font-medium text-gray-500 leading-relaxed italic border-l-2 border-blue-100 pl-4 py-1">
                   {culturalContext || "A story still being told."}
                </p>
             </div>
          </div>

          {/* Similar Discoveries */}
          {similarDishes.length > 0 && (
             <div className="border-t border-gray-100 pt-10">
                <h3 className="font-black text-brand-dark uppercase tracking-[0.2em] text-[10px] mb-6">Similar Discoveries</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                   {similarDishes.slice(0, 4).map((d, i) => (
                      <div key={i} className="group cursor-pointer">
                         <p className="font-black text-brand-dark text-sm group-hover:text-brand-orange transition-colors">{d.name}</p>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{d.origin}</p>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {/* Map & Locations */}
          {userLocation && locations && locations.length > 0 && (
            <div className="pt-12 border-t border-gray-100">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                   <h3 className="text-4xl font-black text-brand-dark tracking-tighter mb-2">Taste it nearby</h3>
                   <p className="text-gray-400 font-medium tracking-tight">We found {locations.length} local spots serving this dish.</p>
                </div>
                <div className="flex gap-2">
                   <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">User Location</p>
                      <p className="text-xs font-bold text-gray-600 truncate max-w-[150px]">Lagos, Nigeria</p>
                   </div>
                </div>
              </div>
              
              <div className="rounded-[40px] overflow-hidden shadow-2xl border-[12px] border-white h-[450px] mb-12 relative group premium-shadow">
                <InteractiveMap
                  locations={locations}
                  userLocation={userLocation}
                />
                <div className="absolute top-6 left-6 z-[50]">
                   <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-white flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></div>
                      <span className="text-xs font-black text-brand-dark uppercase tracking-widest">Live Discoveries</span>
                   </div>
                </div>
              </div>

              {/* Places List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {displayedLocations.map((loc, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={loc.name + idx}
                      onClick={() => setSelectedPlace(loc)}
                      className="flex flex-col p-6 bg-gray-50/50 rounded-3xl border border-gray-100/50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-4">
                         <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-xl group-hover:bg-brand-orange group-hover:text-white transition-colors">
                           🏪
                         </div>
                         {loc.distance !== undefined && (
                           <span className="text-[10px] font-black text-brand-orange bg-white px-2.5 py-1.5 rounded-full border border-orange-50">
                             {(loc.distance / 1000).toFixed(1)}KM
                           </span>
                         )}
                      </div>
                      <h4 className="font-black text-brand-dark mb-1 group-hover:text-brand-orange transition-colors truncate">
                        {loc.name}
                      </h4>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed line-clamp-2">
                        {loc.address || "Curated Spot"}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {locations.length > 4 && (
                <div className="mt-12 group">
                  <button
                    onClick={() => setShowAllPlaces(!showAllPlaces)}
                    className="w-full py-5 rounded-3xl bg-gray-50 border border-gray-100 font-black text-xs uppercase tracking-[0.2em] text-gray-400 hover:bg-brand-dark hover:text-white transition-all overflow-hidden relative"
                  >
                    <span className="relative z-10">
                       {showAllPlaces ? "Show Less" : `Explore All ${locations.length} Locations`}
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
