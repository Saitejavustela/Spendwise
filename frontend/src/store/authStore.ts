import { create } from "zustand";

interface AuthState {
  user: any | null;
  isLoggedIn: boolean;
  setUser: (payload: any) => void;
  logout: () => void;
}

// Check if token exists on initialization
const hasToken = typeof window !== "undefined" && !!localStorage.getItem("accessToken");

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: hasToken, // Initialize based on token presence

  setUser: (payload) =>
    set(() => {
      localStorage.setItem("accessToken", payload.accessToken);
      return { user: payload.user, isLoggedIn: true };
    }),

  logout: () =>
    set(() => {
      localStorage.removeItem("accessToken");
      return { user: null, isLoggedIn: false };
    }),
}));

