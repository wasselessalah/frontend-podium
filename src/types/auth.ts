// Types pour l'authentification

export interface Admin {
  id: string;
  username: string;
  role: "superadmin" | "admin";
}

export interface LoginResponse {
  success: boolean;
  data?: {
    token: string;
    admin: Admin;
  };
  error?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  admin: Admin | null;
  token: string | null;
}
