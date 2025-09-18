import { create } from 'zustand';
import { chatService } from '@/app/services/chatService';
import { Message } from '@/app/components/Message';

export interface Chat {
  id: number;
  title: string;
  user_id: string;
  created_at: string;
  message_count?: number;
  messages?: Message[];
}


interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchChats: () => Promise<void>;
  createQuickChat: (message: string) => Promise<Chat>;
  setCurrentChat: (chat: Chat | null) => void;
  fetchChat: (chatId: number) => Promise<void>;
  deleteChat: (chatId: number) => Promise<void>;
  addOrUpdateMessage: (message: Message) => void;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  currentChat: null,
  messages: [],
  isLoading: false,
  error: null,

  fetchChats: async () => {
    set({ isLoading: true, error: null });
    try {
      const chats = await chatService.getChats();
      set({ chats, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch chats',
        isLoading: false
      });
      throw error;
    }
  },

  createQuickChat: async (message: string) => {
    set({ isLoading: true, error: null });
    try {
      const chat = await chatService.createQuickChat({ message });
      
      // Convert backend response to frontend format
      const chatWithMessages: Chat = {
        ...chat,
        messages: chat.messages.map(msg => ({
          id: msg.id,
          chat_id: msg.chat_id,
          content: msg.content,
          role: msg.role,
          response_id: msg.response_id,
          status: msg.status,
          extra_data: msg.extra_data,
          timestamp: new Date(msg.created_at)
        }))
      };

      set(state => ({
        chats: [chatWithMessages, ...state.chats],
        currentChat: chatWithMessages,
        messages: chatWithMessages.messages || [],
        isLoading: false
      }));

      return chatWithMessages;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create chat',
        isLoading: false
      });
      throw error;
    }
  },

  setCurrentChat: (chat: Chat | null) => {
    set({
      currentChat: chat,
      messages: chat?.messages || []
    });
  },

  fetchChat: async (chatId: number) => {
    set({ isLoading: true, error: null });
    try {
      const chat = await chatService.getChat(chatId);
      
      const chatWithMessages: Chat = {
        ...chat,
        messages: chat.messages.map(msg => ({
          id: msg.id,
          chat_id: msg.chat_id,
          content: msg.content,
          role: msg.role,
          response_id: msg.response_id,
          status: msg.status,
          extra_data: msg.extra_data,
          timestamp: new Date(msg.created_at)
        }))
      };

      set({
        currentChat: chatWithMessages,
        messages: chatWithMessages.messages || [],
        isLoading: false
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch chat',
        isLoading: false
      });
      throw error;
    }
  },

  deleteChat: async (chatId: number) => {
    set({ isLoading: true, error: null });
    try {
      await chatService.deleteChat(chatId);
      
      set(state => ({
        chats: state.chats.filter(chat => chat.id !== chatId),
        currentChat: state.currentChat?.id === chatId ? null : state.currentChat,
        messages: state.currentChat?.id === chatId ? [] : state.messages,
        isLoading: false
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to delete chat',
        isLoading: false
      });
      throw error;
    }
  },

  addOrUpdateMessage: (message: Message) => {
    set(state => {
      const existingIndex = state.messages.findIndex(m => m.id === message.id);
      
      if (existingIndex >= 0) {
        // Update existing message with all new attributes
        const updatedMessages = [...state.messages];
        updatedMessages[existingIndex] = message;
        return { messages: updatedMessages };
      } else {
        // Add new message
        return { messages: [...state.messages, message] };
      }
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));