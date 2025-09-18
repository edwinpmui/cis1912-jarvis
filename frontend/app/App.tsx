'use client';

import { useState, useEffect } from "react";
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ProfilePage from './components/profile/ProfilePage';
import NotesPage from './components/NotesPage';
import { Message } from './components/Message';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';

interface AppProps {
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isConnected: boolean;
  isConnecting: boolean;
  isCreatingChat: boolean;
}

function AppContent({ messages, input, setInput, handleSubmit, isConnected, isConnecting, isCreatingChat }: AppProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const { currentView, registerView } = useNavigation();

  useEffect(() => {
    registerView('chat', { title: 'Chat' });
    registerView('profile', { title: 'Profile' });
    registerView('notes', { title: 'Notes' });
  }, [registerView]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'chat':
        return (
          <ChatArea 
            messages={messages}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isConnected={isConnected}
            isConnecting={isConnecting}
            isCreatingChat={isCreatingChat}
          />
        );
      case 'profile':
        return <ProfilePage />;
      case 'notes':
        return <NotesPage />;
      default:
        return (
          <ChatArea 
            messages={messages}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isConnected={isConnected}
            isConnecting={isConnecting}
            isCreatingChat={isCreatingChat}
          />
        );
    }
  };

  return (
    <Sidebar 
      isSidebarExpanded={isSidebarExpanded}
      setIsSidebarExpanded={setIsSidebarExpanded}
    >
      {renderCurrentView()}
    </Sidebar>
  );
}

export default function App({ messages, input, setInput, handleSubmit, isConnected, isConnecting, isCreatingChat }: AppProps) {
  return (
    <NavigationProvider initialView="chat">
      <AppContent 
        messages={messages}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isConnected={isConnected}
        isConnecting={isConnecting}
        isCreatingChat={isCreatingChat}
      />
    </NavigationProvider>
  );
} 