import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/app/config/api';
import { setTokenCookies, type TokenData } from '@/app/lib/tokenUtils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward request to backend OAuth2 token endpoint
    // OAuth2 requires application/x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('username', body.username);
    formData.append('password', body.password);

    const response = await fetch(`${API_CONFIG.authUrl}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Authentication failed' }));
      return NextResponse.json(
        { error: errorData.detail || 'Authentication failed' },
        { status: response.status }
      );
    }

    const tokens: TokenData = await response.json();

    // Create success response
    const successResponse = NextResponse.json({
      message: 'Authentication successful',
      user_id: tokens.user_id
    });

    // Store tokens in secure HTTP-only cookies
    setTokenCookies(successResponse, tokens);

    return successResponse;
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}