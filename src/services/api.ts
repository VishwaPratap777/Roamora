/* =====================================================
   API Base — Fetch wrapper with auth support
   ===================================================== */

const API_BASE = '/api';

export class ApiError extends Error {
  status: number;
  details?: string[];

  constructor(message: string, status: number, details?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Get the auth token from Clerk (if available)
 */
async function getAuthToken(): Promise<string | null> {
  try {
    // Access Clerk from the window object (set by ClerkProvider)
    const clerk = (window as any).__clerk_frontend_api
      ? (window as any).Clerk
      : null;
    if (clerk?.session) {
      return await clerk.session.getToken();
    }
  } catch {
    // No auth available
  }
  return null;
}

/**
 * Base fetch wrapper with JSON parsing, auth injection, and error handling
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  // Try to attach auth token
  const token = await getAuthToken();
  const authHeaders: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options?.headers,
    },
    ...options,
  });

  // Robustly parse the response depending on its content type
  let data: any = {};
  const contentType = response.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (parseError) {
      data = { error: 'Failed to parse JSON response from server' };
    }
  } else {
    try {
      const text = await response.text();
      // If it looks like HTML (common for Gateway/Proxy errors), extract readable text or use status
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        data = { error: `Server error: ${response.statusText || response.status}` };
      } else {
        data = { error: text || `Request failed with status ${response.status}` };
      }
    } catch {
      data = { error: `Request failed with status ${response.status}` };
    }
  }

  if (!response.ok) {
    throw new ApiError(
      data.error || `Request failed with status ${response.status}`,
      response.status,
      data.details
    );
  }

  return data as T;
}
