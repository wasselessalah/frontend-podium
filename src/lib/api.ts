// API client pour le backend
import type { PodiumEntry, ApiResponse } from "@/types/podium";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const podiumApi = {
  // Récupérer tous les classements
  async getAll(category?: string): Promise<PodiumEntry[]> {
    const url =
      category && category !== "all"
        ? `${API_URL}/podium?category=${category}`
        : `${API_URL}/podium`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // Temps réel
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        "Erreur lors de la récupération des données"
      );
    }

    const result: ApiResponse<PodiumEntry[]> = await response.json();
    return result.data || [];
  },

  // Récupérer le top 3
  async getTop3(category?: string): Promise<PodiumEntry[]> {
    const url =
      category && category !== "all"
        ? `${API_URL}/podium/top3?category=${category}`
        : `${API_URL}/podium/top3`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        "Erreur lors de la récupération du top 3"
      );
    }

    const result: ApiResponse<PodiumEntry[]> = await response.json();
    return result.data || [];
  },

  // Créer une nouvelle entrée
  async create(data: Partial<PodiumEntry>): Promise<PodiumEntry> {
    const response = await fetch(`${API_URL}/podium`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(
        response.status,
        error.error || "Erreur lors de la création"
      );
    }

    const result: ApiResponse<PodiumEntry> = await response.json();
    return result.data!;
  },

  // Mettre à jour une entrée
  async update(id: string, data: Partial<PodiumEntry>): Promise<PodiumEntry> {
    const response = await fetch(`${API_URL}/podium/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new ApiError(response.status, "Erreur lors de la mise à jour");
    }

    const result: ApiResponse<PodiumEntry> = await response.json();
    return result.data!;
  },

  // Supprimer une entrée
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/podium/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new ApiError(response.status, "Erreur lors de la suppression");
    }
  },
};
