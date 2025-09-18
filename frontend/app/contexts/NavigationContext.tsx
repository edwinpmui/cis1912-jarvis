'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type ViewType = 'chat' | 'profile' | 'notes';

interface ViewMetadata {
  title: string;
  icon?: string;
}

interface NavigationContextType {
  currentView: ViewType;
  currentParams?: Record<string, any>;
  navigateToView: (view: ViewType, params?: Record<string, any>) => void;
  registerView: (view: ViewType, metadata: ViewMetadata) => void;
  getViewMetadata: (view: ViewType) => ViewMetadata | undefined;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: React.ReactNode;
  initialView?: ViewType;
}

export function NavigationProvider({ children, initialView = 'chat' }: NavigationProviderProps) {
  const [currentView, setCurrentView] = useState<ViewType>(initialView);
  const [currentParams, setCurrentParams] = useState<Record<string, any> | undefined>(undefined);
  const [viewMetadata, setViewMetadata] = useState<Map<ViewType, ViewMetadata>>(new Map());

  const navigateToView = useCallback((view: ViewType, params?: Record<string, any>) => {
    setCurrentView(view);
    setCurrentParams(params);
  }, []);

  const registerView = useCallback((view: ViewType, metadata: ViewMetadata) => {
    setViewMetadata(prev => new Map(prev).set(view, metadata));
  }, []);

  const getViewMetadata = useCallback((view: ViewType) => {
    return viewMetadata.get(view);
  }, [viewMetadata]);

  const value: NavigationContextType = {
    currentView,
    currentParams,
    navigateToView,
    registerView,
    getViewMetadata,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}