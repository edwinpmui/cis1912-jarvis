import { NextResponse } from 'next/server';
import { clearTokenCookies } from '@/app/lib/tokenUtils';

export async function POST() {
  try {
    // Create response and clear auth cookies
    const response = NextResponse.json({ 
      message: 'Signed out successfully' 
    });
    
    clearTokenCookies(response);
    
    return response;
  } catch (error) {
    console.error('Signout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}