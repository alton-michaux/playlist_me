import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

// Module-level handles registered by AuthContext
let _refresh: (() => Promise<string>) | null = null;
let _logout: (() => void) | null = null;

/** Called by AuthContext on mount to wire up the refresh and logout callbacks. */
export function setAuthHandlers(
  refresh: () => Promise<string>,
  logout: () => void
): void {
  _refresh = refresh;
  _logout = logout;
}

// Extend InternalAxiosRequestConfig to track retry attempts
interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableConfig | undefined;

    if (
      error.response?.status === 401 &&
      config &&
      !config._retry &&
      _refresh
    ) {
      config._retry = true;

      try {
        const newToken = await _refresh();

        // Inject the fresh token into the retry request.
        // Token can appear in Authorization header or as a query param.
        if (config.headers?.['Authorization']) {
          config.headers['Authorization'] = `Bearer ${newToken}`;
        }
        if (config.params && typeof config.params === 'object' && 'token' in config.params) {
          (config.params as Record<string, string>)['token'] = newToken;
        }

        return apiClient(config);
      } catch {
        _logout?.();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
