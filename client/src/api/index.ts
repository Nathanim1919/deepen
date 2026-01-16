import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// API Configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || "10000"),
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// Create axios instance with enhanced configuration
export const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true,
});

// Enhanced error types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

// Request interceptor for logging and auth
api.interceptors.request.use(
  (config) => {
    // Add timestamp for request tracking
    (config as any).metadata = { startTime: Date.now() };

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params
      });
    }

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging, error handling, and retry logic
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      const duration = Date.now() - ((response.config as any).metadata?.startTime || 0);
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        duration: `${duration}ms`,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig & { _retryCount?: number };

    // Log error
    console.error("❌ API Error:", {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      data: error.response?.data,
    });

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear any stored auth tokens
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');

      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Retry logic for network errors
    if (!error.response && config && (config._retryCount || 0) < API_CONFIG.retryAttempts) {
      config._retryCount = (config._retryCount || 0) + 1;

      console.log(`🔄 Retrying request (${config._retryCount}/${API_CONFIG.retryAttempts}): ${config.url}`);

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay * (config._retryCount || 1)));

      return api(config);
    }

    return Promise.reject(error);
  }
);

// Enhanced error handler utility
export const handleApiError = (error: unknown, defaultMessage: string = "An error occurred"): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    return {
      message: (axiosError.response?.data as any)?.message || axiosError.message || defaultMessage,
      code: axiosError.code,
      status: axiosError.response?.status,
      details: axiosError.response?.data,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: "UNKNOWN_ERROR",
    };
  }

  return {
    message: defaultMessage,
    code: "UNKNOWN_ERROR",
  };
};

// Utility function for consistent API calls
export const apiCall = async <T>(
  apiFunction: () => Promise<AxiosResponse<T>>,
  errorMessage: string = "API call failed"
): Promise<T> => {
  try {
    const response = await apiFunction();
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error, errorMessage);
    throw new Error(apiError.message);
  }
};

// Export configuration for use in other files
export { API_CONFIG };
