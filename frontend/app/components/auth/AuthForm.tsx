'use client';

import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Heading,
  Card,
  TextField,
} from '@radix-ui/themes';
import { authService } from '@/app/services/authService';
import { useProfileStore } from '@/app/stores/profileStore';

interface AuthFormProps {
  onAuthSuccess: () => void;
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [msgColor, setMsgColor] = useState('red');

  const { fetchProfile } = useProfileStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignupMode) {
        await authService.signup({
          username,
          password,
          first_name: firstName,
        });
        setMsgColor('green');
        setMessage('Signup successful!');
      } else {
        await authService.signin({
          username,
          password,
        });
        await fetchProfile();
        onAuthSuccess();
      }
    } catch (err: any) {
      setMessage(err.message || 'Authentication failed');
      setMsgColor('red');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignupMode(!isSignupMode);
    setMessage('');
    setFirstName('');
  };

  return (
    <Flex
      align="center"
      justify="center"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--gray-1)'
      }}
    >
      <Card style={{ width: '400px', padding: '2rem' }}>
        <Flex direction="column" gap="4">
          <Heading size="6" align="center">
            {isSignupMode ? 'Sign Up' : 'Sign In'}
          </Heading>

          {message && (
            <Text size="2" color={msgColor as any} align="center">
              {message}
            </Text>
          )}

          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="3">
              {isSignupMode && (
                <Box>
                  <Text size="2" weight="medium" mb="1">
                    First Name
                  </Text>
                  <TextField.Root
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    required
                  />
                </Box>
              )}

              <Box>
                <Text size="2" weight="medium" mb="1">
                  Username
                </Text>
                <TextField.Root
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </Box>

              <Box>
                <Text size="2" weight="medium" mb="1">
                  Password
                </Text>
                <TextField.Root
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </Box>

              <Button
                type="submit"
                size="3"
                disabled={loading}
                style={{ marginTop: '1rem' }}
              >
                {loading ? 'Loading...' : (isSignupMode ? 'Sign Up' : 'Sign In')}
              </Button>
            </Flex>
          </form>

          <Flex align="center" justify="center" gap="2" mt="2">
            <Text size="2">
              {isSignupMode ? 'Already have an account?' : "Don't have an account?"}
            </Text>
            <Button
              variant="ghost"
              size="2"
              onClick={toggleMode}
              disabled={loading}
            >
              {isSignupMode ? 'Sign In' : 'Sign Up'}
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}