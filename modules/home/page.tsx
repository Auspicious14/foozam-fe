import { useState, useEffect } from "react";
import PhotoDropzone from "../../components/PhotoDropzone";
import ResultCard from "../../components/ResultCard";
import DietFilter from "../../components/DietFilter";
import CityFilter from "../../components/CityFilter";
import Loader from "../../components/Loader";
import axios from "axios";
import Image from "next/image";

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

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [diet, setDiet] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [top3, setTop3] = useState<any[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [predictedDish, setPredictedDish] = useState<{
    dish: string;
    confidence: number;
  } | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [locationError, setLocationError] = useState<string>("");
  const [dishLocations, setDishLocations] = useState<any[]>([]);

  const fetchLocations = async (dish: string) => {
    if (!location) return;
    try {
      const res = await axios.get(
        `${apiUrl}/dishes/${encodeURIComponent(dish)}/locations?lat=${
          location.lat
        }&lon=${location.lon}`
      );
      setDishLocations(res.data);
    } catch (error) {
      console.error("Failed to fetch dish locations:", error);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.log({ error });
          setLocationError(
            "Could not get your location. Please enable location services in your browser."
          );
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  }, []);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    setError("");
    setResult(null);
    setTop3([]);
    setPredictedDish(null);
    setUploadedImage(null);

    try {
      const base64Image = await convertImageToBase64(file);
      const payload = {
        file: { name: file.name, type: file.type, uri: base64Image },
      };

      const res = await axios.post(
        `${apiUrl}/dishes/identify${
          location ? `?lat=${location.lat}&lon=${location.lon}` : ""
        }`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = res.data;

      setUploadedImage(data.imageUrl || null);

      if (data.error) {
        setError(`An error occurred: ${data.error}`);
      } else if (data.message?.includes("Low confidence")) {
        setTop3(data.predictions);
        setError("We're not quite sure, but here are our best guesses.");
      } else if (data.message?.includes("Strong prediction")) {
        setTop3(data.predictions);
        setPredictedDish({
          dish: data.predictedDish,
          confidence: data.confidence,
        });
        setError("This looks like a new dish! You can add it to our dataset.");
      } else {
        setResult(data);
        setTop3(data.topPredictions || []);
        setError("");
        fetchLocations(data.dish);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          `Error: ${err.response.data.error || "Could not identify the dish."}`
        );
      } else {
        setError(
          "An unexpected network error occurred. Please check your connection."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddDish = async () => {
    if (!predictedDish || !uploadedImage) return;

    setLoading(true);
    setError("");
    try {
      await axios.post(`${apiUrl}/dishes`, {
        dishName: predictedDish.dish,
        imageUrl: uploadedImage,
        confidence: predictedDish.confidence,
      });
      const newDish = {
        dish: predictedDish.dish,
        recipe:
          "This dish has been successfully added to our dataset. Recipe and other details will be available soon.",
        tags: [],
        locations: [],
      };
      setResult(newDish);
      setTop3([]);
      setPredictedDish(null);
      fetchLocations(newDish.dish);
    } catch (error) {
      setError("Failed to add the dish. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDishDetails = async (dish: string, cityParam?: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${apiUrl}/dishes/${encodeURIComponent(dish)}${
          cityParam ? `?city=${encodeURIComponent(cityParam)}` : ""
        }`
      );
      const data = res.data;
      if (data.error) {
        setError(`An error occurred: ${data.error}`);
      } else {
        setResult(data);
        fetchLocations(data.dish);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 404) {
          setError(
            `Sorry, we couldn't find a dish named "${dish}". Please try another one.`
          );
        } else {
          setError(
            `Error: ${
              err.response.data.error || "Could not fetch dish details."
            }`
          );
        }
      } else {
        setError(
          "An unexpected network error occurred. Please check your connection."
        );
      }
    } finally {
      setLoading(false);
    }
  };
  // console.log({ locationError, location });
  // Filter locations by city/diet
  const filteredLocations =
    result?.locations?.filter((loc: any) => !city || loc.city === city) || [];

  const filteredTags =
    result?.tags?.filter((tag: string) => !diet || tag === diet) ||
    result?.tags;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-beige-50 to-green-100 font-poppins flex flex-col items-center py-8 px-4">
      <h1 className="text-5xl font-bold mb-6 text-orange-700 drop-shadow-lg text-center">
        Shazam for Food
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-lg">
        Discover and share amazing Nigerian food recipes. Just upload a photo of
        a dish, and we'll tell you all about it!
      </p>

      <PhotoDropzone
        onDrop={(file: File) => handleImageUpload(file)}
        loading={loading}
      />

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

      {(uploadedImage || result?.imageUrl) && (
        <div className="w-full flex flex-col items-center mb-6 animate-fade-in">
          <Image
            src={uploadedImage || result?.imageUrl}
            alt="Uploaded dish"
            width={320}
            height={256}
            className="rounded-xl shadow-lg object-contain bg-white/60 backdrop-blur"
            style={{ maxWidth: 320, height: "auto" }}
            priority
          />
        </div>
      )}

      {top3.length > 0 && (
        <div className="flex flex-col gap-3 mt-4 w-full max-w-md animate-fade-in">
          <h3 className="text-xl font-semibold text-center text-orange-700">
            {error ? "Tap a suggestion" : "Top Predictions"}
          </h3>
          {top3.map((pred) => (
            <button
              key={pred.dish}
              className="bg-white/60 backdrop-blur rounded-lg p-3 shadow hover:scale-105 transition-all border border-orange-200 text-left"
              onClick={() => fetchDishDetails(pred.dish)}
            >
              <span className="font-semibold text-lg text-green-800">
                {pred.dish}
              </span>
              <span className="text-gray-600 ml-2">
                ({pred.confidence.toFixed(2)}% confidence)
              </span>
            </button>
          ))}
        </div>
      )}

      {result && !error && (
        <div className="w-full max-w-2xl mt-6 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-4 mb-4 justify-center">
            <DietFilter
              options={DIET_OPTIONS}
              selected={diet}
              onChange={setDiet}
            />
            <CityFilter
              cities={CITY_OPTIONS as string[]}
              selectedCity={city}
              onCityChange={setCity}
            />
          </div>
          <ResultCard
            dish={result.dish}
            recipe={result.recipe}
            tags={filteredTags}
            locations={dishLocations}
            userLocation={location}
            confidence={predictedDish?.confidence || result.confidence}
            message={result.message}
            predictedDish={predictedDish?.dish || ""}
            onAddDish={handleAddDish}
          />
        </div>
      )}
    </div>
  );
}
