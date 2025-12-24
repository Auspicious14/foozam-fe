import { useState, useEffect } from "react";
import PhotoDropzone from "./components/PhotoDropzone";
import ResultCard from "./components/ResultCard";
import FeedbackForm from "./components/FeedbackForm";
import DietFilter from "./components/DietFilter";
import CityFilter from "./components/CityFilter";
import Loader from "./components/Loader";
import Image from "next/image";
import { useFoodRecognition } from "./context";

const DIET_OPTIONS = ["vegetarian", "gluten-free", "vegan"];
const CITY_OPTIONS = [
  "Lagos",
  "Abuja",
  "Ibadan",
  "Ilorin",
  "Osun",
  "Ogun",
  "Oyo",
  "Kano",
  "Houston",
  "London",
];

export default function FoodRecognitionPage() {
  const { loading, error, recognitionResult, recognizeFood, submitFeedback } =
    useFoodRecognition();

  const [diet, setDiet] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [lastFile, setLastFile] = useState<File | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string>("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError(
            "Could not get your location. Please enable location services for better results."
          );
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  }, []);

  const handleImageUpload = async (file: File) => {
    setLastFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setUploadedImage(e.target?.result as string);
    reader.readAsDataURL(file);

    await recognizeFood(file, location || undefined);
  };

  const handleRetry = async () => {
    if (lastFile) {
      await recognizeFood(lastFile, location || undefined);
    }
  };

  const handleFeedback = async (correctName: string, correctOrigin: string) => {
    if (recognitionResult?.data.recognition.recognitionId) {
      await submitFeedback({
        recognitionId: recognitionResult.data.recognition.recognitionId,
        correctFoodName: correctName,
        correctOrigin: correctOrigin,
      });
    }
  };

  const recognition = recognitionResult?.data.recognition;
  const nearbyPlaces = recognitionResult?.data.nearbyPlaces || [];

  // Filter nearby places by city (if city is selected)
  const filteredPlaces = nearbyPlaces.filter(
    (place) => !city || place.address.toLowerCase().includes(city.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-beige-50 to-green-100 font-poppins flex flex-col items-center py-6 px-4 sm:py-12 sm:px-6">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 text-orange-700 drop-shadow-lg text-center tracking-tight">
          Foozam
        </h1>
        <p className="text-center text-gray-600 mb-8 sm:mb-12 max-w-lg text-base sm:text-lg leading-relaxed px-2">
          Discover amazing food! Just upload a photo, and we'll tell you all
          about it!
        </p>

        <div className="w-full max-w-md mx-auto mb-8 sm:mb-12">
          <PhotoDropzone onDrop={handleImageUpload} loading={loading} />
        </div>

        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-sm">
            <Loader />
          </div>
        )}

        <div className="w-full max-w-2xl space-y-4 sm:space-y-6">
          {locationError && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-r-xl shadow-sm animate-fade-in text-sm sm:text-base">
              <div className="flex items-center">
                <span className="mr-2">📍</span>
                {locationError}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-800 p-4 rounded-r-xl shadow-sm animate-fade-in text-sm sm:text-base">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </div>
                {lastFile && !loading && (
                  <button
                    onClick={handleRetry}
                    className="text-xs sm:text-sm font-bold uppercase tracking-wider text-red-600 hover:text-red-700 underline-offset-4 hover:underline transition-all flex items-center"
                  >
                    <span className="mr-1">🔄</span> Retry with image
                  </button>
                )}
              </div>
            </div>
          )}

          {uploadedImage && !recognition && !loading && (
            <div className="flex flex-col items-center space-y-4 animate-fade-in py-4">
              <div className="relative group">
                <Image
                  src={uploadedImage}
                  alt="Uploaded food"
                  width={400}
                  height={300}
                  className="rounded-2xl shadow-2xl object-cover border-4 border-white transition-transform duration-300 group-hover:scale-[1.02]"
                  style={{ width: "100%", height: "auto", maxWidth: "400px" }}
                  priority
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-black/10 pointer-events-none" />
              </div>
              {!error && (
                <p className="text-gray-500 text-sm font-medium animate-pulse">
                  Analyzing your delicious discovery...
                </p>
              )}
            </div>
          )}

          {recognition && (
            <div className="animate-fade-in space-y-6 sm:space-y-8">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <DietFilter
                  options={DIET_OPTIONS}
                  selected={diet}
                  onChange={setDiet}
                />
                <CityFilter
                  cities={CITY_OPTIONS}
                  selectedCity={city}
                  onCityChange={setCity}
                />
              </div>

              <div className="transform transition-all duration-500 hover:translate-y-[-4px]">
                <ResultCard
                  dish={recognition.foodName}
                  recipe={recognition.description}
                  tags={recognition.ingredients}
                  origin={recognition.origin}
                  nutritionalInfo={recognition.nutritionalInfo}
                  culturalContext={recognition.culturalContext}
                  locations={filteredPlaces.map((p) => ({
                    name: p.name,
                    lat: p.coordinates.latitude,
                    lon: p.coordinates.longitude,
                  }))}
                  userLocation={
                    location
                      ? { lat: location.latitude, lon: location.longitude }
                      : null
                  }
                  confidence={
                    recognition.confidence === "high"
                      ? 95
                      : recognition.confidence === "medium"
                      ? 70
                      : 40
                  }
                />
              </div>

              <div className="bg-white/40 backdrop-blur-md rounded-3xl p-1 shadow-inner">
                <FeedbackForm
                  initialFoodName={recognition.foodName}
                  onSubmit={handleFeedback}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
