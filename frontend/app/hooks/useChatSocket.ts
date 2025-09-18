import { useState, useEffect, useRef, useCallback } from 'react';
import { Message } from '@/app/components/Message';
import { useChatStore } from '@/app/stores/chatStore';

// WebSocket message types based on backend schema
type OutgoingMessageType = 
  | 'user_message' 
  | 'assistant_message' 
  | 'response_generating' 
  | 'response_streaming' 
  | 'response_error' 
  | 'connection_established' 
  | 'error';

type IncomingMessageType = 'user_message' | 'get_history';

interface WebSocketMessage {
  type: OutgoingMessageType;
  content: string;
  chat_id?: number;
  message_id?: number;
  response_id?: string;
  status?: 'complete' | 'generating' | 'error';
  extra_data?: Record<string, any>;
  timestamp?: string;
}

interface IncomingWebSocketMessage {
  type: IncomingMessageType;
  content?: string;
}

export const useChatSocket = (chatId?: number) => {
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const { messages, addOrUpdateMessage } = useChatStore();

  const connect = useCallback(async () => {
    if (!chatId) return;
    
    setIsConnecting(true);
    
    try {
      // Fetch authenticated WebSocket URL from our API
      const response = await fetch(`/api/ws/chat/${chatId}`, {
        credentials: 'include' // Include HTTP-only cookies
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get WebSocket URL');
      }
      
      const { wsUrl } = await response.json();
      socketRef.current = new WebSocket(wsUrl);
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      setIsConnecting(false);
      return;
    }

    socketRef.current.onopen = () => {
      console.log('WebSocket connected to chat:', chatId);
      setIsConnected(true);
      setIsConnecting(false);
      
      // Request chat history
      const historyRequest: IncomingWebSocketMessage = {
        type: 'get_history'
      };
      socketRef.current?.send(JSON.stringify(historyRequest));
    };

    socketRef.current.onmessage = (event) => {
      try {
        const wsMessage: WebSocketMessage = JSON.parse(event.data);
        
        switch (wsMessage.type) {
          case 'connection_established':
            console.log('WebSocket connection established:', wsMessage.content);
            break;
            
          case 'user_message':
          case 'assistant_message':
          case 'response_generating':
          case 'response_streaming':
          case 'response_error':
            if (wsMessage.message_id) {
              const message: Message = {
                id: wsMessage.message_id,
                chat_id: wsMessage.chat_id,
                content: wsMessage.content,
                role: wsMessage.type === 'user_message' ? 'user' : 'assistant',
                response_id: wsMessage.response_id,
                status: wsMessage.status || 'complete',
                extra_data: wsMessage.extra_data,
                timestamp: wsMessage.timestamp ? new Date(wsMessage.timestamp) : new Date()
              };
              
              addOrUpdateMessage(message);
            }
            break;
            
          case 'error':
            console.error('WebSocket error message:', wsMessage.content);
            break;
            
          default:
            console.log('Unknown WebSocket message type:', wsMessage.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socketRef.current.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      setIsConnected(false);
      setIsConnecting(false);
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      setIsConnecting(false);
    };
  }, [chatId, addOrUpdateMessage]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  useEffect(() => {
    if (chatId) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [chatId, connect, disconnect]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !isConnected || !socketRef.current) return;

    const message: IncomingWebSocketMessage = {
      type: 'user_message',
      content: input.trim()
    };

    try {
      socketRef.current.send(JSON.stringify(message));
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return { 
    messages, 
    input, 
    setInput, 
    handleSubmit, 
    isConnected, 
    isConnecting,
    connect,
    disconnect
  };
};