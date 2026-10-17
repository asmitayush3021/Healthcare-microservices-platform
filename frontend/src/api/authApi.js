import apiClient from './axios';

/**
 * Auth API
 *
 * Gateway routes (StripPrefix=1 removes /auth prefix before forwarding):
 *   POST /auth/login    → auth-service POST /login
 *   GET  /auth/validate → auth-service GET  /validate
 *
 * Login request body:  { email: string, password: string }
 * Login response body: { token: string }
 */

/**
 * Authenticate a user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ token: string }>}
 */
export async function login(email, password) {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data; // { token }
}

/**
 * Validate the current JWT token stored in localStorage.
 * Returns true if valid, false otherwise.
 * @returns {Promise<boolean>}
 */
export async function validateToken() {
  try {
    await apiClient.get('/auth/validate');
    return true;
  } catch {
    return false;
  }
}
