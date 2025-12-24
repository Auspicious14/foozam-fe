import React, { createContext, useContext, useState, useCallback } from "react";
import api from "../../lib/api";
import { RecognitionHistoryItem, HistoryResponse } from "./model";

interface HistoryContextType {
  history: RecognitionHistoryItem[];
  loading: boolean;
  error: string | null;
  fetchHistory: () => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [history, setHistory] = useState<RecognitionHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<HistoryResponse>("/food/history");
      if (response.data.success) {
        setHistory(response.data.data);
      } else {
        setError("Failed to fetch history");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "An error occurred while fetching history"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <HistoryContext.Provider value={{ history, loading, error, fetchHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
};
