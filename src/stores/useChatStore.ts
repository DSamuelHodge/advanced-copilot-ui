import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chat, Message, GeminiModel, ArtifactData } from '../lib/types';

const createInitialChat = (): Chat => ({
  id: crypto.randomUUID(),
  title: 'New Chat',
  messages: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

interface ChatStore {
  chats: Chat[];
  currentChatId: string | null;
  isLoading: boolean;
  selectedModel: GeminiModel;
  error: string | null;
  
  createChat: () => string;
  setCurrentChat: (id: string) => void;
  deleteChat: (id: string) => void;
  updateChatTitle: (id: string, title: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateMessage: (chatId: string, messageId: string, updates: Partial<Message>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedModel: (model: GeminiModel) => void;
  getCurrentChat: () => Chat | undefined;
  updateArtifact: (chatId: string, messageId: string, artifact: ArtifactData) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [createInitialChat()],
      currentChatId: null,
      isLoading: false,
      selectedModel: GeminiModel.PRO,
      error: null,

      createChat: () => {
        const newChat = createInitialChat();
        set((state) => ({
          chats: [newChat, ...state.chats],
          currentChatId: newChat.id,
        }));
        return newChat.id;
      },

      setCurrentChat: (id: string) => {
        set({ currentChatId: id });
      },

      deleteChat: (id: string) => {
        set((state) => {
          const newChats = state.chats.filter((chat) => chat.id !== id);
          const newCurrentId = state.currentChatId === id 
            ? (newChats[0]?.id || null)
            : state.currentChatId;
          return { chats: newChats, currentChatId: newCurrentId };
        });
      },

      updateChatTitle: (id: string, title: string) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === id
              ? { ...chat, title, updatedAt: new Date().toISOString() }
              : chat
          ),
        }));
      },

      addMessage: (chatId: string, message: Message) => {
        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id !== chatId) return chat;
            
            const shouldUpdateTitle = chat.title === 'New Chat' && message.role === 'user';
            const newTitle = shouldUpdateTitle 
              ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
              : chat.title;
            
            return {
              ...chat,
              title: newTitle,
              messages: [...chat.messages, message],
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      updateMessage: (chatId: string, messageId: string, updates: Partial<Message>) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, ...updates } : msg
                  ),
                }
              : chat
          ),
        }));
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setSelectedModel: (model: GeminiModel) => {
        set({ selectedModel: model });
      },

      getCurrentChat: () => {
        const state = get();
        const chatId = state.currentChatId || state.chats[0]?.id;
        return state.chats.find((chat) => chat.id === chatId);
      },

      updateArtifact: (chatId: string, messageId: string, artifact: ArtifactData) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, artifact } : msg
                  ),
                }
              : chat
          ),
        }));
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        chats: state.chats,
        currentChatId: state.currentChatId,
        selectedModel: state.selectedModel,
      }),
    }
  )
);
