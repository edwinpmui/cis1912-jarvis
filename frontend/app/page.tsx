'use client';

import { useEffect, useState } from 'react';
import App from './App';
import { useChatSocket } from './hooks/useChatSocket';
import { useChatStore } from './stores/chatStore';
import AuthGuard from './components/auth/AuthGuard';

export default function Home() {
  const { currentChat, createQuickChat } = useChatStore();
  const { messages, input, setInput, handleSubmit, isConnected, isConnecting } = useChatSocket(currentChat?.id);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  // Enhanced submit handler that creates chat if needed
  const enhancedHandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // If no current chat, create one first
    if (!currentChat) {
      setIsCreatingChat(true);
      try {
        await createQuickChat(input.trim());
        setInput('');
      } catch (error) {
        console.error('Failed to create chat:', error);
      } finally {
        setIsCreatingChat(false);
      }
    } else {
      // Use WebSocket to send message
      handleSubmit(e);
    }
  };
  
  return (
    <AuthGuard>
      <App 
        messages={messages}
        input={input}
        setInput={setInput}
        handleSubmit={enhancedHandleSubmit}
        isConnected={isConnected}
        isConnecting={isConnecting}
        isCreatingChat={isCreatingChat}
      />
    </AuthGuard>
  );
}
