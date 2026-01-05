import { axiosInstance } from "@/api/axios";
import { create } from "zustand";

type Chat = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

type ChatState = {
  chats: Chat[];
  activeChatId: string | null;
  isLoading: boolean;

  fetchChats: () => Promise<void>;
  setActiveChat: (chatId: string) => void;
  clearChats: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeChatId: null,
  isLoading: false,

  fetchChats: async () => {
    set({ isLoading: true });

    try {
      const res = await axiosInstance.get("/chat");
      set({ chats: res.data.chats });
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      set({ chats: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  setActiveChat: (chatId) => {
    set({ activeChatId: chatId });
  },

  clearChats: () => {
    set({ chats: [], activeChatId: null });
  },
}));
