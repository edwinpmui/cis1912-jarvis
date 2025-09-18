export interface UserSignupRequest {
  username: string;
  password: string;
  first_name: string;
}

export interface UserSigninRequest {
  username: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  first_name: string;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  user_id?: number;
}

// OAuth2 token response from backend
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user_id?: number;
}

// Token refresh request
export interface TokenRefreshRequest {
  refresh_token: string;
}