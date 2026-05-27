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

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.error || `Request failed with status ${response.status}`,
      response.status,
      data.details
    );
  }

  return data as T;
}
