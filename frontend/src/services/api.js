import axios from 'axios';

const TOKEN_KEY = 'vanraj_admin_token';
const baseURL = `${(import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '')}/api`;

export const tokenStore = {
  get: () => sessionStorage.getItem(TOKEN_KEY),
  set: (token) => sessionStorage.setItem(TOKEN_KEY, token),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
};

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 && tokenStore.get()) {
      tokenStore.clear();
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(normalizeError(error));
  },
);

/** Turns any axios error into { message, status, fields } for the UI. */
function normalizeError(error) {
  if (error.response) {
    const { status, data } = error.response;
    return {
      status,
      message: data?.message || 'Something went wrong. Please try again.',
      fields: data?.errors || {},
    };
  }
  if (error.code === 'ECONNABORTED') {
    return { status: 0, message: 'The server took too long to respond. Please try again.', fields: {} };
  }
  return {
    status: 0,
    message: 'Unable to reach the server. Check your connection and try again.',
    fields: {},
  };
}
