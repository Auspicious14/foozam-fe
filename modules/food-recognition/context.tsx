import React, { createContext, useContext, useState, ReactNode } from 'react';
import api from '../../lib/api';
import { FoozamResponse, FeedbackPayload, UserHistoryEntry, UserStats } from './model';

interface FoodRecognitionContextType {
  loading: boolean;
  error: string | null;
  recognitionResult: FoozamResponse | null;
  userHistory: UserHistoryEntry[];
  userStats: UserStats | null;
  recognizeFood: (image: File, location?: { latitude: number; longitude: number; city?: string }, userId?: string) => Promise<void>;
  submitFeedback: (payload: FeedbackPayload) => Promise<void>;
  fetchUserHistory: (userId: string) => Promise<void>;
  fetchUserStats: (userId: string) => Promise<void>;
  toggleFavorite: (historyId: string, isFavorite: boolean) => Promise<void>;
}

const FoodRecognitionContext = createContext<FoodRecognitionContextType | undefined>(undefined);

export const FoodRecognitionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognitionResult, setRecognitionResult] = useState<FoozamResponse | null>(null);
  const [userHistory, setUserHistory] = useState<UserHistoryEntry[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  const recognizeFood = async (image: File, location?: { latitude: number; longitude: number; city?: string }, userId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', image);
      if (location?.latitude) formData.append('latitude', location.latitude.toString());
      if (location?.longitude) formData.append('longitude', location.longitude.toString());
      if (location?.city) formData.append('city', location.city);
      if (userId) formData.append('userId', userId);

      const response = await api.post<FoozamResponse>('/food/recognize', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setRecognitionResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to recognize food');
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (payload: FeedbackPayload) => {
    setLoading(true);
    try {
      await api.post('/food/feedback', payload);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserHistory = async (userId: string) => {
    try {
      const response = await api.get<UserHistoryEntry[]>(`/food/history/${userId}`);
      setUserHistory(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch history');
    }
  };

  const fetchUserStats = async (userId: string) => {
    try {
      const response = await api.get<UserStats>(`/food/stats/user/${userId}`);
      setUserStats(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch stats');
    }
  };

  const toggleFavorite = async (historyId: string, isFavorite: boolean) => {
    try {
      await api.patch(`/food/history/${historyId}`, { isFavorite });
      setUserHistory(prev => prev.map(item => item._id === historyId ? { ...item, isFavorite } : item));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update favorite');
    }
  };

  return (
    <FoodRecognitionContext.Provider
      value={{
        loading,
        error,
        recognitionResult,
        userHistory,
        userStats,
        recognizeFood,
        submitFeedback,
        fetchUserHistory,
        fetchUserStats,
        toggleFavorite,
      }}
    >
      {children}
    </FoodRecognitionContext.Provider>
  );
};

export const useFoodRecognition = () => {
  const context = useContext(FoodRecognitionContext);
  if (!context) {
    throw new Error('useFoodRecognition must be used within a FoodRecognitionProvider');
  }
  return context;
};
