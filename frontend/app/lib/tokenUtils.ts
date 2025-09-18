import { NextRequest, NextResponse } from 'next/server';
import { TokenResponse } from '@/app/types/auth';

export type TokenData = TokenResponse;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

export const ACCESS_TOKEN_COOKIE = 'access_token';
export const REFRESH_TOKEN_COOKIE = 'refresh_token';

export function extractTokensFromCookies(request: NextRequest): {
  accessToken: string | null;
  refreshToken: string | null;
} {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value || null;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value || null;
  
  return { accessToken, refreshToken };
}

export function setTokenCookies(response: NextResponse, tokens: TokenData): void {
  response.cookies.set(ACCESS_TOKEN_COOKIE, tokens.access_token, {
    ...COOKIE_OPTIONS,
    maxAge: tokens.expires_in,
  });
  
  response.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refresh_token, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 30, // 30 days for refresh token
  });
}

export function clearTokenCookies(response: NextResponse): void {
  response.cookies.set(ACCESS_TOKEN_COOKIE, '', {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });
  
  response.cookies.set(REFRESH_TOKEN_COOKIE, '', {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });
}

export function createAuthHeaders(accessToken: string): HeadersInit {
  return {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
}

// Note: getAccessTokenFromCookies removed because HTTP-only cookies 
// cannot be accessed client-side. Use the WebSocket API route instead.