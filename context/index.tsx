import React, { ReactNode } from "react";
import { FoodRecognitionProvider } from "../modules/food-recognition/context";
import { HistoryProvider } from "../modules/history/context";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <FoodRecognitionProvider>
      <HistoryProvider>{children}</HistoryProvider>
    </FoodRecognitionProvider>
  );
};
