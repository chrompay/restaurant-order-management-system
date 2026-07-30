export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "admin" | "customer" | "manager" | "staff" | "kitchen" | "delivery";
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;

  data: {
    token: string;
    user: User;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: User;
}

export interface AuthContextType {
  user: User | null;

  token: string | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => void;

  updateUser: (user: User) => void;
}