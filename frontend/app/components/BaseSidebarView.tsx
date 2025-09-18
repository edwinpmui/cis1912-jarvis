'use client';

import React, { useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Spinner,
} from '@radix-ui/themes';

interface BaseSidebarViewProps {
  title?: string;
  loading?: boolean;
  error?: string;
  children: React.ReactNode;
  onViewEnter?: () => void;
  onViewLeave?: () => void;
}

export default function BaseSidebarView({
  title,
  loading = false,
  error,
  children,
  onViewEnter,
  onViewLeave,
}: BaseSidebarViewProps) {
  useEffect(() => {
    onViewEnter?.();
    return () => {
      onViewLeave?.();
    };
  }, [onViewEnter, onViewLeave]);

  if (loading) {
    return (
      <Flex
        align="center"
        justify="center"
        style={{ height: '100vh', flex: 1 }}
      >
        <Spinner size="3" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex
        align="center"
        justify="center"
        style={{ height: '100vh', flex: 1 }}
        p="4"
      >
        <Box style={{ textAlign: 'center' }}>
          <Heading size="5" mb="2">
            Error
          </Heading>
          <Text color="red" size="3">
            {error}
          </Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Box style={{ flex: 1 }}>
      <Flex
        style={{ flex: 1, overflow: 'auto', maxWidth: '1000px', width: '80%', margin: '0 auto' }}
        px="9"
        align="center"
        justify="center"
      >
        {children}
      </Flex>
    </Box>
  );
}