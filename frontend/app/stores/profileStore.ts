import { create } from 'zustand';
import { authService } from '@/app/services/authService';
import { UserResponse } from '@/app/types/auth';

interface ProfileState {
  user: UserResponse | null;
  isLoading: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  clearError: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.getProfile();
      set({
        user,
        isLoading: false
      });
    } catch (error: any) {
      set({
        user: null,
        isLoading: false,
        error: error.message || 'Failed to get profile'
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));