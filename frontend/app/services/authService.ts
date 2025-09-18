import { apiClient } from '@/app/lib/api';
import { UserSignupRequest, UserSigninRequest, UserResponse, AuthResponse } from '@/app/types/auth';

export class AuthService {
  async signup(data: UserSignupRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/api/auth/signup', data);
  }

  async signin(data: UserSigninRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/api/auth/signin', data);
  }

  async signout(): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/api/auth/signout');
  }

  async getProfile(): Promise<UserResponse> {
    return apiClient.get<UserResponse>('/api/auth/profile');
  }
}

export const authService = new AuthService();