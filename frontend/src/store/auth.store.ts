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
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      set({ user: res.data.user });
    } catch (error) {
      set({ user: null });
      console.error("Error checking auth:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
        await axiosInstance.post("/auth/logout");
        set({ user: null });
    } catch (error) {
        console.error("Error logging out:", error);
    }
  },
}));
