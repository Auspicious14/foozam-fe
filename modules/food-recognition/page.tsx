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
    const reader = new FileReader();
    reader.onload = (e) => setUploadedImage(e.target?.result as string);
    reader.readAsDataURL(file);

    await recognizeFood(file, location || undefined);
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
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-beige-50 to-green-100 font-poppins flex flex-col items-center py-8 px-4">
      <h1 className="text-5xl font-bold mb-6 text-orange-700 drop-shadow-lg text-center">
        Foozam
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-lg">
        Discover and share amazing food! Just upload a photo, and we'll tell you
        all about it!
      </p>

      <PhotoDropzone onDrop={handleImageUpload} loading={loading} />

      {loading && <Loader />}

      {locationError && (
        <div className="my-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-xl glassmorphism animate-fade-in w-full max-w-md text-center">
          {locationError}
        </div>
      )}

      {error && (
        <div className="my-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl glassmorphism animate-fade-in w-full max-w-md text-center">
          {error}
        </div>
      )}

      {uploadedImage && (
        <div className="w-full flex flex-col items-center mb-6 animate-fade-in">
          <Image
            src={uploadedImage}
            alt="Uploaded food"
            width={320}
            height={256}
            className="rounded-xl shadow-lg object-contain bg-white/60 backdrop-blur"
            style={{ maxWidth: 320, height: "auto" }}
            priority
          />
        </div>
      )}

      {recognition && (
        <div className="w-full max-w-2xl mt-6 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-4 mb-4 justify-center">
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
          <ResultCard
            dish={recognition.foodName}
            recipe={recognition.description}
            tags={recognition.ingredients}
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
          <FeedbackForm
            initialFoodName={recognition.foodName}
            onSubmit={handleFeedback}
          />
        </div>
      )}
    </div>
  );
}
