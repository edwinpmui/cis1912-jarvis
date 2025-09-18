import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/app/config/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward request to backend signup endpoint
    const response = await fetch(`${API_CONFIG.authUrl}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Signup failed' }));
      return NextResponse.json(
        { error: errorData.message || 'Signup failed' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}