const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export interface User {
  _id: string;
  username: string;
  email: string;
  name: string;
  score: number;
  position: number | null;
  team: string;
  category: string;
  avatar: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface UserRegisterData {
  username: string;
  email: string;
  password: string;
  name: string;
  team?: string;
  category?: string;
}

export interface UserLoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}

export const userApi = {
  // Inscription
  register: async (userData: UserRegisterData): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      // Stocker le token
      if (data.data?.token) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Connexion
  login: async (credentials: UserLoginData): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la connexion");
      }

      // Stocker le token
      if (data.data?.token) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Obtenir le profil de l'utilisateur connecté
  getMe: async (): Promise<User> => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erreur lors de la récupération du profil");
    }

    return data.data;
  },

  // Obtenir tous les utilisateurs (classement)
  getAll: async (category?: string): Promise<User[]> => {
    let url = `${API_URL}/users?limit=100`;
    if (category) {
      url += `&category=${category}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Erreur lors de la récupération des utilisateurs"
      );
    }

    return data.data;
  },

  // Obtenir le top 3
  getTop3: async (category?: string): Promise<User[]> => {
    let url = `${API_URL}/users/top3`;
    if (category) {
      url += `?category=${category}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erreur lors de la récupération du top 3");
    }

    return data.data;
  },

  // Mettre à jour son profil
  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erreur lors de la mise à jour du profil");
    }

    // Mettre à jour le localStorage
    localStorage.setItem("user", JSON.stringify(data.data));

    return data.data;
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },

  // Obtenir l'utilisateur depuis le localStorage
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
};
