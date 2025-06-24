import { useState } from 'react';
import PhotoDropzone from '../../components/PhotoDropzone';
import ResultCard from '../../components/ResultCard';
import DietFilter from '../../components/DietFilter';
import CityFilter from '../../components/CityFilter';
import Loader from '../../components/Loader';

const DIET_OPTIONS = ['vegetarian', 'gluten-free', 'vegan'];
const CITY_OPTIONS = ['Lagos', 'Abuja', 'Ibadan', 'Ilorin', 'Osun', 'Ogun', 'Oyo', 'Kano', 'Houston', 'London'];

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [diet, setDiet] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [top3, setTop3] = useState<any[]>([]);

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    setError('');
    setResult(null);
    setTop3([]);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/foods/identify', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else if (data.predictions && data.predictions.length) {
        setTop3(data.predictions);
        setError('Low confidence. Tap a suggestion below or try another photo.');
      } else if (data.dish) {
        fetchDishDetails(data.dish);
      } else if (data.message) {
        setError(data.message);
        setTop3(data.predictions || []);
      } else {
        setError('No dish found. Try another photo.');
      }
    } catch {
      setError('Invalid image or network error.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDishDetails = async (dish: string, cityParam?: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/foods/${encodeURIComponent(dish)}${cityParam ? `?city=${encodeURIComponent(cityParam)}` : ''}`);
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch {
      setError('Could not fetch dish details.');
    } finally {
      setLoading(false);
    }
  };

  // Filter locations by city/diet
  const filteredLocations = result?.locations?.filter(
    (loc: any) =>
      (!city || loc.city === city)
  ) || [];

  const filteredTags = result?.tags?.filter(
    (tag: string) => !diet || tag === diet
  ) || result?.tags;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-beige-50 to-green-100 font-poppins flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold mb-4 text-orange-700 drop-shadow-lg">Shazam for Food</h1>
      <PhotoDropzone onUpload={handleImageUpload} />
      {loading && <Loader />}
      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded glassmorphism animate-fade-in">
          {error}
        </div>
      )}
      {top3.length > 0 && (
        <div className="flex flex-col gap-2 mt-4 w-full max-w-md">
          {top3.map((pred, idx) => (
            <button
              key={pred.dish}
              className="bg-white/60 backdrop-blur rounded-lg p-3 shadow hover:scale-105 transition-all border border-orange-200"
              onClick={() => fetchDishDetails(pred.dish)}
            >
              <span className="font-semibold">{pred.dish}</span> ({pred.confidence}%)
            </button>
          ))}
        </div>
      )}
      {result && !error && (
        <div className="w-full max-w-xl mt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <DietFilter options={DIET_OPTIONS} selected={diet} onChange={setDiet} />
            <CityFilter options={CITY_OPTIONS} selected={city} onChange={setCity} />
          </div>
          <ResultCard
            dish={result.dish}
            recipe={result.recipe}
            tags={filteredTags}
            locations={filteredLocations}
          />
        </div>
      )}
    </div>
  );
}