import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/app/config/api';
import { extractTokensFromCookies, createAuthHeaders } from '@/app/lib/tokenUtils';

export async function GET(request: NextRequest) {
  try {
    const { accessToken } = extractTokensFromCookies(request);

    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token available' },
        { status: 401 }
      );
    }

    // Forward request to backend with Authorization header
    const response = await fetch(`${API_CONFIG.authUrl}/auth/profile`, {
      method: 'GET',
      headers: createAuthHeaders(accessToken),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Token expired or invalid' },
          { status: 401 }
        );
      }

      const errorData = await response.json().catch(() => ({ message: 'Profile fetch failed' }));
      return NextResponse.json(
        { error: errorData.message || 'Profile fetch failed' },
        { status: response.status }
      );
    }

    const profile = await response.json();
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}