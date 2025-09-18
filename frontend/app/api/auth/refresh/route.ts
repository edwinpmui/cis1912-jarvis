import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/app/config/api';
import { extractTokensFromCookies, setTokenCookies, clearTokenCookies, type TokenData } from '@/app/lib/tokenUtils';

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = extractTokensFromCookies(request);

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token available' },
        { status: 401 }
      );
    }

    // Forward refresh request to backend
    // OAuth2 requires application/x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('refresh_token', refreshToken);

    const response = await fetch(`${API_CONFIG.authUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      // Clear cookies if refresh fails
      const errorResponse = NextResponse.json(
        { error: 'Token refresh failed' },
        { status: 401 }
      );
      clearTokenCookies(errorResponse);
      return errorResponse;
    }

    const tokens: TokenData = await response.json();

    // Create success response
    const successResponse = NextResponse.json({
      message: 'Token refreshed successfully'
    });

    // Update tokens in cookies
    setTokenCookies(successResponse, tokens);

    return successResponse;
  } catch (error) {
    console.error('Token refresh error:', error);
    const errorResponse = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    clearTokenCookies(errorResponse);
    return errorResponse;
  }
}