'use client';

import {
  Box,
  Flex,
  Text,
  Avatar,
} from '@radix-ui/themes';
import { useProfileStore } from '@/app/stores/profileStore';
import BaseSidebarView from '../BaseSidebarView';

export default function ProfilePage() {
  const { user } = useProfileStore();

  if (!user) {
    return (
      <BaseSidebarView error="No user data available">
        <Text>No user logged in.</Text>
      </BaseSidebarView>
    );
  }

  return (
    <BaseSidebarView>
      <Box p="4" style={{ width: '100%' }}>
        <Flex direction="column" gap="4" align="center">
          <Avatar
            size="6"
            fallback={user.first_name.charAt(0).toUpperCase()}
            radius="full"
          />

          <Box style={{ width: '100%', maxWidth: '300px' }}>
            <Flex direction="column" gap="3">
              <Box>
                <Text size="2" weight="medium" color="gray">
                  Name:&nbsp;
                </Text>
                <Text size="3" weight="medium">
                  {user.first_name}
                </Text>
              </Box>

              <Box>
                <Text size="2" weight="medium" color="gray">
                  Username:&nbsp;
                </Text>
                <Text size="3" weight="medium">
                  {user.username}
                </Text>
              </Box>

              <Box>
                <Text size="2" weight="medium" color="gray">
                  Member&nbsp;Since:&nbsp;
                </Text>
                <Text size="3" weight="medium">
                  {new Date(user.created_at).toLocaleDateString()}
                </Text>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </BaseSidebarView>
  );
}