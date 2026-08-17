/**
 * API configuration for production deployment.
 * In development, VITE_API_URL is empty and Vite's proxy handles /api routes.
 * In production, VITE_API_URL points to the Render backend service URL.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Prepends the API base URL to a path.
 * @param path - API path starting with / (e.g., '/api/auth/me')
 */
export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

/**
 * Returns the Socket.IO server URL.
 * In production, uses VITE_API_URL. In development, falls back to same-host:5000.
 */
export function getSocketUrl(): string {
  if (API_BASE_URL) {
    return API_BASE_URL;
  }
  return `${window.location.protocol}//${window.location.hostname}:5000`;
}
