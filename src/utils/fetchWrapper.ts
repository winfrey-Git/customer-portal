/**
 * A wrapper around the fetch API to handle common request/response patterns
 * including authentication, error handling, and JSON parsing
 */

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions extends RequestInit {
  method?: RequestMethod;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Wrapper around fetch to handle common patterns
 */
export async function fetchWrapper<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  // Set default headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Convert params to query string if provided
  let queryString = '';
  if (options.params) {
    const params = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    queryString = params.toString() ? `?${params.toString()}` : '';
  }

  // Prepare request config
  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Important for cookies, authentication, etc.
  };

  // Stringify body if it's an object/array and not already a string
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${url}${queryString}`, config);
    
    // Handle empty responses (like 204 No Content)
    if (response.status === 204) {
      return undefined as unknown as T;
    }

    const data = await response.json().catch(() => ({}));

    // Handle error responses
    if (!response.ok) {
      const error = new Error(data.message || 'An error occurred');
      (error as any).status = response.status;
      (error as any).data = data;
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Helper methods for common HTTP methods
export const http = {
  get: <T = any>(url: string, params?: Record<string, any>, options: Omit<RequestOptions, 'body' | 'method'> = {}) =>
    fetchWrapper<T>(url, { ...options, method: 'GET', params }),
    
  post: <T = any>(
    url: string,
    body?: any,
    options: Omit<RequestOptions, 'body' | 'method'> = {}
  ) => fetchWrapper<T>(url, { ...options, method: 'POST', body }),
  
  put: <T = any>(
    url: string,
    body?: any,
    options: Omit<RequestOptions, 'body' | 'method'> = {}
  ) => fetchWrapper<T>(url, { ...options, method: 'PUT', body }),
  
  delete: <T = any>(
    url: string,
    options: Omit<RequestOptions, 'body' | 'method'> = {}
  ) => fetchWrapper<T>(url, { ...options, method: 'DELETE' }),
  
  patch: <T = any>(
    url: string,
    body?: any,
    options: Omit<RequestOptions, 'body' | 'method'> = {}
  ) => fetchWrapper<T>(url, { ...options, method: 'PATCH', body }),
};
