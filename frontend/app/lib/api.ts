import { API_CONFIG } from '@/app/config/api';


export interface ApiError {
  message: string;
  status: number;
}

/**
 * ApiClient used for making requests to the frontend server.
 */
export class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = '', timeout: number = API_CONFIG.timeout) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    headers: Record<string, string> = {},
    options: RequestInit = {},
    isRetry: boolean = false
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();

    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
      };

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: requestHeaders,
        credentials: 'include',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Handle 401 errors with token refresh retry
        if (response.status === 401 && !isRetry && endpoint !== '/api/auth/refresh' && endpoint !== '/api/auth/signin') {
          try {
            // Try to refresh token
            await fetch('/api/auth/refresh', {
              method: 'POST',
              credentials: 'include',
            });

            // Retry original request
            return this.request<T>(endpoint, headers, options, true);
          } catch {
            // If refresh fails, let the original 401 error propagate
          }
        }

        const errorData = await response.json().catch(() => ({}));
        const error: ApiError = {
          message: errorData.error || errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        };
        throw error;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          const timeoutError: ApiError = {
            message: 'Request timeout',
            status: 408,
          };
          throw timeoutError;
        }

        const networkError: ApiError = {
          message: error.message || 'Network error',
          status: 0,
        };
        throw networkError;
      }

      throw error;
    }
  }

  async get<T>(endpoint: string, headers: Record<string, string> = {}): Promise<T> {
    return this.request<T>(endpoint, headers, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, headers: Record<string, string> = {}): Promise<T> {
    return this.request<T>(endpoint, headers, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, headers: Record<string, string> = {}): Promise<T> {
    return this.request<T>(endpoint, headers, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, headers: Record<string, string> = {}): Promise<T> {
    return this.request<T>(endpoint, headers, { method: 'DELETE' });
  }
}

// Auth is explicitly not proxied.
export const apiClient = new ApiClient();
export const proxyApiClient = new ApiClient(API_CONFIG.proxyUrl);