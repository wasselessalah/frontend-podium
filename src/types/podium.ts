// Types pour le système de podium

export interface PodiumEntry {
  _id: string;
  name: string;
  position: number;
  score: number;
  team?: string;
  category: "individual" | "team" | "mixed";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
  message?: string;
}

export type CategoryType = "individual" | "team" | "mixed" | "all";
