// 1. Centralized API base URL
const API_BASE_URL = '/api/auth';

/**
 * A central helper function for making API requests.
 * It handles JSON stringification, headers, and response/error parsing.
 * @param {string} endpoint - The API endpoint (e.g., '/login')
 * @param {object} [body] - The request body object (optional)
 * @param {string} [method] - The HTTP method (defaults to 'POST')
 * @returns {Promise<any>} The response data from the API
 */
const apiRequest = async (endpoint, method = 'POST', body = null) => {
  const config = {
    method,
    headers: {},
  };

  if (body) {
    config.headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = { message: 'Success' };
  }

  if (!response.ok) {
    const error = new Error(data.message || `API error: ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

// --- Public API Functions ---

/**
 * Registers a new user.
 * @param {object} userData - User data
 * @param {string} userData.email
 * @param {string} userData.phone
 * @param {string} userData.password
 * @param {string} userData.role - 'seeker' or 'poster'
 * @returns {Promise<any>} The response data from the API
 */
export const registerUser = (userData) => {
  return apiRequest('/register', 'POST', userData);
};

/**
 * Logs in a user.
 * @param {object} credentials - User credentials
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @returns {Promise<any>} The response data from the API
 */
export const loginUser = (credentials) => {
  return apiRequest('/login', 'POST', credentials);
};

/**
 * Logs out the current user.
 * This function makes an API call to the server to clear the
 * httpOnly session cookie.
 * @returns {Promise<any>} The response data from the API
 */
export const logoutUser = () => {
  return apiRequest('/logout', 'POST');
};