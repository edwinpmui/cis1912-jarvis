export const API_CONFIG = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001',
  authUrl: process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8000',
  proxyUrl: process.env.NEXT_PUBLIC_PROXY_URL || 'http://localhost:3000/api/proxy',
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost',
  timeout: 10000,
} as const;
