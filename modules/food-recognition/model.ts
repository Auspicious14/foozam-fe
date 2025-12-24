export interface FoodRecognitionResult {
  recognitionId: string;
  foodName: string;
  confidence: 'high' | 'medium' | 'low';
  alternativeNames: string[];
  origin: {
    country: string;
    region?: string;
  };
  ingredients: string[];
  description: string;
  culturalContext: string;
  nutritionalInfo?: {
    calories?: string;
    mainNutrients?: string[];
  };
  similarDishes?: Array<{
    name: string;
    origin: string;
  }>;
}

export interface NearbyLocation {
  name: string;
  address: string;
  distance: number;
  rating?: number;
  priceLevel?: string;
  phone?: string;
  website?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface FoozamResponse {
  success: boolean;
  data: {
    recognition: FoodRecognitionResult;
    nearbyPlaces: NearbyLocation[];
    similarRecognitions?: FoodRecognitionResult[];
  };
  timestamp: string;
}

export interface FeedbackPayload {
  recognitionId: string;
  correctFoodName: string;
  correctOrigin: string;
  userId?: string;
  correctIngredients?: string[];
  correctDescription?: string;
}

export interface UserHistoryEntry {
  _id: string;
  userId: string;
  recognitionId: FoodRecognitionResult;
  foodName: string;
  origin: string;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
  };
  isFavorite: boolean;
  tags: string[];
  createdAt: string;
}

export interface UserStats {
  totalScans: number;
  uniqueFoods: number;
  uniqueOrigins: number;
  favorites: number;
  topFoods: Array<{ food: string; count: number }>;
}
