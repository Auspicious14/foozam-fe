export interface RecognitionHistoryItem {
  recognitionId: string;
  foodName: string;
  confidence: "high" | "medium" | "low";
  description: string;
  ingredients: string[];
  imageUrl?: string;
  createdAt: string;
}

export interface HistoryResponse {
  success: boolean;
  data: RecognitionHistoryItem[];
}
