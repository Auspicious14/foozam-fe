import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

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
  isOpen: boolean;
  onClose: () => void;
  place: Location | null;
  userLocation: { lat: number; lon: number } | null;
}

const PlaceDetailsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  place,
  userLocation,
}) => {
  if (!place) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Map Header */}
            <div className="h-64 relative">
              {userLocation && (
                <InteractiveMap
                  locations={[place]}
                  userLocation={userLocation}
                  selectedLocation={place}
                />
              )}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-[110] bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                    {place.name}
                  </h2>
                  <p className="text-gray-500 flex items-center gap-1.5 text-sm">
                    <span className="text-red-500">📍</span>
                    {place.address || "Address not available"}
                  </p>
                </div>
                {place.distance !== undefined && (
                  <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-2xl font-bold text-sm">
                    {(place.distance / 1000).toFixed(1)} km away
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-lg">
                      ⭐
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                        Rating
                      </p>
                      <p className="font-bold text-gray-800">
                        {place.rating ? `${place.rating} / 5` : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-lg">
                      💰
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                        Price Level
                      </p>
                      <p className="font-bold text-gray-800">
                        {place.priceLevel || "Moderate"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {place.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-lg">
                        📞
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                          Phone
                        </p>
                        <p className="font-bold text-gray-800">{place.phone}</p>
                      </div>
                    </div>
                  )}
                  {place.website && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-lg">
                        🌐
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                          Website
                        </p>
                        <a
                          href={place.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-orange-500 hover:underline"
                        >
                          Visit Site
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-auto">
                <button
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`,
                      "_blank"
                    )
                  }
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2"
                >
                  <span>🚀</span> Get Directions
                </button>
                <button
                  onClick={onClose}
                  className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PlaceDetailsModal;
