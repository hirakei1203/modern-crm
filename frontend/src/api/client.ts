import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL

export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
  },
})

let csrfCookiePromise: Promise<void> | null = null

// Sanctum's SPA auth needs the CSRF cookie to be present before any
// state-changing (non-GET) request. Calling this is idempotent per page load.
export function ensureCsrfCookie(): Promise<void> {
  csrfCookiePromise ??= axios.get(`${API_URL}/sanctum/csrf-cookie`, { withCredentials: true }).then(() => undefined)

  return csrfCookiePromise
}
