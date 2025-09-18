import { NextRequest } from 'next/server';
import { extractTokensFromCookies } from '@/app/lib/tokenUtils';
import { API_CONFIG } from '@/app/config/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await params;
  
  try {
    // Extract token from HTTP-only cookies
    const { accessToken } = extractTokensFromCookies(request);
    
    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: 'Authentication token missing' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return the authenticated WebSocket URL
    const wsUrl = `${API_CONFIG.wsUrl}/chat/ws/${chatId}?token=${encodeURIComponent(accessToken)}`;
    
    return new Response(JSON.stringify({ wsUrl }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}