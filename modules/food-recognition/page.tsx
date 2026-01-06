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
    <div className="min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-white pt-16 pb-24 px-4 border-b border-gray-50 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-30">
           <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-brand-orange/20 blur-[100px] rounded-full animate-pulse-slow"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-brand-green/20 blur-[100px] rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-brand-orange text-sm font-bold mb-8 animate-fade-in border border-orange-100 shadow-sm">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
             </span>
             Powered by Advanced AI
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black mb-6 text-brand-dark tracking-tight leading-[1.1]">
            What's on your <span className="text-brand-orange">plate?</span>
          </h1>
          <p className="text-gray-500 text-lg sm:text-xl mb-12 max-w-2xl leading-relaxed font-medium">
            Discover ingredients, nutritional facts, and local spots for any dish in seconds. Just snap and let FooZam do the magic.
          </p>

          <div className="w-full max-w-md mx-auto relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-brand-orange to-brand-green rounded-[32px] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
             <div className="relative">
                <PhotoDropzone onDrop={handleImageUpload} loading={loading} />
             </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="w-full max-w-5xl mx-auto py-16 px-6">
        {loading && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/40 backdrop-blur-md animate-fade-in">
             <div className="flex flex-col items-center gap-6">
                <div className="loader w-16 h-16 border-4"></div>
                <div className="flex flex-col items-center">
                   <p className="text-2xl font-black text-brand-dark tracking-tight">Analyzing Flavor...</p>
                   <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-2">Checking ingredients & origins</p>
                </div>
             </div>
          </div>
        )}

        <div className="space-y-12">
          {locationError && (
             <div className="bg-amber-50 border border-amber-200 text-amber-900 p-5 rounded-3xl shadow-sm flex items-start gap-4 animate-fade-in">
                <div className="p-2 bg-white rounded-xl shadow-sm text-xl">📍</div>
                <div className="flex-1">
                   <p className="font-bold">Location Access</p>
                   <p className="text-sm text-amber-800/80 leading-relaxed mt-1">{locationError}</p>
                </div>
             </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-900 p-6 rounded-3xl shadow-sm animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                   <div className="p-2 bg-white rounded-xl shadow-sm text-xl">⚠️</div>
                   <div>
                      <p className="font-bold">Oops! Something went wrong</p>
                      <p className="text-sm text-red-800/80 mt-1">{error}</p>
                   </div>
                </div>
                {lastFile && !loading && (
                  <button
                    onClick={handleRetry}
                    className="whitespace-nowrap bg-white text-red-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-sm hover:bg-red-50 transition-all flex items-center justify-center gap-2 border border-red-100"
                  >
                    <span>🔄</span> Retry Scan
                  </button>
                )}
              </div>
            </div>
          )}

          {uploadedImage && !recognition && !loading && (
            <div className="flex flex-col items-center py-12 animate-fade-in">
              <div className="relative">
                <div className="absolute -inset-4 bg-brand-orange/10 blur-3xl rounded-full"></div>
                <div className="relative border-8 border-white shadow-2xl rounded-[40px] overflow-hidden w-full max-w-sm mx-auto transition-transform hover:scale-[1.02] duration-500">
                  <Image
                    src={uploadedImage}
                    alt="Uploaded food"
                    width={400}
                    height={400}
                    className="object-cover w-full h-full aspect-square"
                    priority
                  />
                </div>
              </div>
              <p className="mt-12 text-gray-400 font-bold uppercase tracking-[0.2em] text-xs animate-pulse">
                Processing Deliciousness...
              </p>
            </div>
          )}

          {recognition && (
            <div className="animate-fade-in space-y-12">
              <div className="transform-gpu">
                <ResultCard
                  dish={recognition.foodName}
                  recipe={recognition.description}
                  tags={recognition.ingredients}
                  imageUrl={uploadedImage || undefined}
                  alternativeNames={recognition.alternativeNames}
                  similarDishes={recognition.similarDishes}
                  origin={recognition.origin}
                  nutritionalInfo={recognition.nutritionalInfo}
                  culturalContext={recognition.culturalContext}
                  locations={filteredPlaces.map((p) => ({
                    name: p.name,
                    lat: p.coordinates.latitude,
                    lon: p.coordinates.longitude,
                    address: p.address,
                    distance: p.distance,
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
                  confidenceLevel={recognition.confidence as any}
                />
              </div>

              <div className="bg-gray-50 rounded-[40px] p-8 sm:p-12 border border-gray-100 overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                       <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                    </svg>
                 </div>
                 <div className="relative max-w-xl">
                    <h3 className="text-3xl font-black text-brand-dark mb-4 tracking-tight">Help us improve</h3>
                    <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                       Is our analysis correct? Your feedback helps FooZam become even more accurate for foodies everywhere.
                    </p>
                    <FeedbackForm
                      initialFoodName={recognition.foodName}
                      onSubmit={handleFeedback}
                    />
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
