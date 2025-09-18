import { proxyApiClient } from '@/app/lib/api';
import {
  ChatListResponse,
  ChatCreate,
  ChatResponse,
  QuickChatRequest,
  MessageCreate,
  MessageResponse,
} from '@/app/types/chat';

export class ChatService {
  async getChats(skip: number = 0, limit: number = 100): Promise<ChatListResponse[]> {
    return proxyApiClient.get<ChatListResponse[]>(`/chat/chats?skip=${skip}&limit=${limit}`);
  }

  async getChat(chatId: number): Promise<ChatResponse> {
    return proxyApiClient.get<ChatResponse>(`/chat/chats/${chatId}`);
  }

  async createChat(data: ChatCreate): Promise<ChatResponse> {
    return proxyApiClient.post<ChatResponse>('/chat/chats', data);
  }

  async createQuickChat(data: QuickChatRequest): Promise<ChatResponse> {
    return proxyApiClient.post<ChatResponse>('/chat/chats/quick', data);
  }

  async deleteChat(chatId: number): Promise<void> {
    return proxyApiClient.delete<void>(`/chat/chats/${chatId}`);
  }

  async sendMessage(chatId: number, data: MessageCreate): Promise<MessageResponse> {
    return proxyApiClient.post<MessageResponse>(`/chat/chats/${chatId}/messages`, data);
  }

  async getMessages(chatId: number, skip: number = 0, limit: number = 100): Promise<MessageResponse[]> {
    return proxyApiClient.get<MessageResponse[]>(`/chat/chats/${chatId}/messages?skip=${skip}&limit=${limit}`);
  }
}

export const chatService = new ChatService();