import { axiosInstance } from "@/api/axios";
import { create } from "zustand";

type Chat = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

type Message = {
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
  isLoading?: boolean;
};

let navigateFn: ((path: string) => void) | null = null;

export const setChatNavigate = (fn: (path: string) => void) => {
  navigateFn = fn;
};

type ChatState = {
  chats: Chat[];
  messages: Message[];
  activeChatId: string | null;

  isFetchingChats: boolean;
  isSendingMessage: boolean;
  isFetchingMessages: boolean;

  fetchChats: () => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  setActiveChat: (chatId: string | null) => void;
  reset: () => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  messages: [],
  activeChatId: null,

  isFetchingChats: false,
  isSendingMessage: false,
  isFetchingMessages: false,

  fetchChats: async () => {
    set({ isFetchingChats: true });
    try {
      const res = await axiosInstance.get("/chat");
      set({ chats: res.data.chats });
    } catch (err) {
      console.error("fetchChats failed", err);
    } finally {
      set({ isFetchingChats: false });
    }
  },

  fetchMessages: async (chatId) => {
    try {
      set({ isFetchingMessages: true });
      const res = await axiosInstance.get(`/chat/${chatId}`);
      set({ messages: res.data.messages });
    } catch (err) {
      console.error("fetchMessages failed", err);
      set({ messages: [] });
    } finally {
      set({ isFetchingMessages: false });
    }
  },

  sendMessage: async (message) => {
    const { activeChatId } = get();
    set({ isSendingMessage: true });

    // 1. Add USER message immediately
    set((state) => ({
      messages: [
        ...state.messages,
        {
          role: "USER",
          content: message,
          createdAt: new Date().toISOString(),
        },
        {
          role: "ASSISTANT",
          content: "",
          createdAt: new Date().toISOString(),
          isLoading: true,
        },
      ],
    }));

    try {
      const endpoint = activeChatId ? `/chat/${activeChatId}` : "/chat";
      const res = await axiosInstance.post(endpoint, { message });

      const returnedChatId = res.data.chatId;

      // 2. If new chat → update URL + sidebar
      if (!activeChatId && returnedChatId) {
        set({ activeChatId: returnedChatId });
        navigateFn?.(`/chat/${returnedChatId}`);
        await get().fetchChats();
      }

      // 3. Replace loading assistant message
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.isLoading
            ? {
                role: "ASSISTANT",
                content: res.data.reply,
                createdAt: new Date().toISOString(),
              }
            : msg
        ),
      }));
    } catch (err) {
      console.error("sendMessage failed", err);

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.isLoading
            ? {
                role: "ASSISTANT",
                content: "Something went wrong. Please try again.",
                createdAt: new Date().toISOString(),
              }
            : msg
        ),
      }));
    } finally {
      set({ isSendingMessage: false });
    }
  },

  setActiveChat: (chatId) => {
    set({ activeChatId: chatId });
  },

  reset: () => {
    set({
      messages: [],
      activeChatId: null,
      isFetchingChats: false,
      isSendingMessage: false,
    });
  },
}));
