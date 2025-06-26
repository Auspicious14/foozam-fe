import { useState } from "react";
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
  const [predictedDish, setPredictedDish] = useState<{ dish: string; confidence: number } | null>(null);

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

    const base64Image = await convertImageToBase64(file);
    if (!base64Image) {
      setLoading(false);
      setError("Failed to convert image to base64.");
      return;
    }
    const payload = {
      file: {
        name: file.name,
        type: file.type,
        uri: base64Image,
      },
    };
    try {
      const res = await axios.post(`${apiUrl}/foods/identify`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      const data = res.data;

      if (data.error) {
        setError(data.error);
      } else if (data.message && data.message.includes("Low confidence")) {
        setTop3(data.predictions);
        setUploadedImage(data.imageUrl || null);
        setError(
          "Low confidence. Tap a suggestion below or try another photo."
        );
      } else if (data.message && data.message.includes("Strong prediction")) {
        setTop3(data.predictions);
        setUploadedImage(data.imageUrl || null);
        setPredictedDish({dish: data.predictedDish,  confidence: data.confidence});
        setError(
          "Strong prediction not in dataset. Tap a suggestion below to add it."
        );
      } else {
        const { topPredictions, ...result } = data;
        setResult(result);
        setTop3(topPredictions || []);
        setError("");
      }
    } catch {
      setError("Invalid image or network error.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDishDetails = async (dish: string, cityParam?: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${apiUrl}/foods/${encodeURIComponent(dish)}${
          cityParam ? `?city=${encodeURIComponent(cityParam)}` : ""
        }`
      );
      const data = res.data;
      if (data.error) setError(data.error);
      else setResult(data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setError("Dish not found. Try another name.");
      } else if (error.response?.status === 500) {
        setError("Could not fetch dish details.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter locations by city/diet
  const filteredLocations =
    result?.locations?.filter((loc: any) => !city || loc.city === city) || [];

  const filteredTags =
    result?.tags?.filter((tag: string) => !diet || tag === diet) ||
    result?.tags;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-beige-50 to-green-100 font-poppins flex flex-col items-center py-8">
      {/* <h1 className="text-4xl font-bold mb-4 text-orange-700 drop-shadow-lg">Shazam for Food</h1> */}
      <PhotoDropzone
        onDrop={(file: File) => handleImageUpload(file)}
        loading={loading}
      />
      {loading && <Loader />}
      {error && (
        <div className="my-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded glassmorphism animate-fade-in">
          {error}
        </div>
      )}
      {(uploadedImage || result?.imageUrl) && (
        <div className="w-full flex flex-col items-center mb-6">
          <Image
            src={uploadedImage || result?.imageUrl}
            alt="Uploaded dish"
            width={320}
            height={256}
            className="rounded-xl shadow-lg object-contain bg-white/60 backdrop-blur"
            style={{ maxWidth: 320, height: "auto" }}
          />
          {/* {predictedDish && (
            <div className="mt-4 px-4 py-2 rounded-xl glassmorphism shadow text-center">
              <span className="block text-orange-700 font-semibold text-lg">
                Predicted Dish:
              </span>
              <span className="block text-2xl font-bold text-green-700 mt-1">
                {predictedDish.dish}
              </span>
              <span className="block text-gray-700 mt-1">
                Confidence:
                <span className="font-semibold text-orange-600">
                  {predictedDish.confidence}%
                </span>
              </span>
            </div>
          )} */}
        </div>
      )}
      {top3.length > 0 && (
        <div className="flex flex-col gap-2 mt-4 w-full max-w-md">
          <div className="mt-4 bg-red-100 border border-red-400 text-orange-700 px-4 py-3 rounded glassmorphism animate-fade-in">
            Top Predictions:
          </div>
          {top3.map((pred, idx) => (
            <button
              key={pred.dish}
              className="bg-white/60 backdrop-blur rounded-lg p-3 shadow hover:scale-105 transition-all border border-orange-200"
              // onClick={() => fetchDishDetails(pred.dish)}
            >
              <span className="font-semibold">{pred.dish}</span> (
              {pred.confidence}%)
            </button>
          ))}
        </div>
      )}
      {result && !error && (
        <div className="w-full max-w-xl mt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
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
            locations={filteredLocations}
            confidence={predictedDish?.confidence || result.confidence}
            message={result.message}
            predictedDish={predictedDish?.dish || ""}
            onAddDish={() => { }}
          />
        </div>
      )}
    </div>
  );
}
