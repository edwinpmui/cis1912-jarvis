'use client';

import { useState, useEffect } from 'react';
import { Flex, Spinner, Text } from '@radix-ui/themes';
import { authService } from '@/app/services/authService';
import { useProfileStore } from '@/app/stores/profileStore';
import AuthForm from './AuthForm';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchProfile, user } = useProfileStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (user) {
          setIsAuthenticated(true);
        } else {
          await authService.getProfile();
          await fetchProfile();
          setIsAuthenticated(true);
        }
      } catch (error: any) {
        setIsAuthenticated(false);
        if (error.status !== 401) {
          console.error('Auth check failed:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [fetchProfile, user]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <Flex
        align="center"
        justify="center"
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--gray-1)'
        }}
      >
        <Flex direction="column" align="center" gap="4">
          <Spinner size="3" />
          <Text size="2" color="gray">Loading...</Text>
        </Flex>
      </Flex>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  return <>{children}</>;
}