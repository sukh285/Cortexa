import { axiosInstance } from "@/api/axios";
import { create } from "zustand";

type User = {
  id: string;
  username: string | null;
  email: string;
  profileImage: string | null;
};

type AuthState = {
  user: User | null;

  isCheckingAuth: boolean;
  isAuthActionLoading: boolean;

  checkAuth: () => Promise<void>;
  login: (code: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isCheckingAuth: true,
  isAuthActionLoading: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      set({ user: res.data.user });
    } catch {
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (code: string) => {
    set({ isAuthActionLoading: true });
    try {
      await axiosInstance.post(
        "/auth/google",
        { code },
        { withCredentials: true }
      );
      const res = await axiosInstance.get("/auth/me");
      set({ user: res.data.user });
    } catch (error) {
      set({ user: null });
      console.error("Login failed", error);
    } finally {
      set({ isAuthActionLoading: false });
    }
  },

  logout: async () => {
    set({ isAuthActionLoading: true });
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      set({ isAuthActionLoading: false });
    }
  },
}));
