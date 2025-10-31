/**
 * Client-side API helper for making authenticated requests to Next.js API routes
 * These routes then proxy to the backend
 */

import axios, { AxiosError, AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    // Handle authentication errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Redirect to login page with return URL (only if not already on login page)
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        const returnUrl = encodeURIComponent(window.location.pathname);
        window.location.href = `/login?next=${returnUrl}`;
      }
      throw new Error("Authentication required");
    }
    
    // Extract error message from backend ApiError response
    let message = "An unexpected error occurred";
    
    if (error.response?.data) {
      const data = error.response.data;
      // Backend returns ApiError object with message field
      if (typeof data === "object" && "message" in data && data.message) {
        message = data.message;
      } else if (typeof data === "string") {
        message = data;
      }
    } else if (error.message) {
      message = error.message;
    }
    
    throw new Error(message);
  }
);

async function request<T>(
  path: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.request<T>({ url: path, ...config });
  return response.data;
}

export async function get<T>(
  path: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return request<T>(path, { method: "GET", ...config });
}

export async function post<T>(
  path: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  return request<T>(path, { method: "POST", data, ...config });
}

export async function put<T>(
  path: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  return request<T>(path, { method: "PUT", data, ...config });
}

export async function patch<T>(
  path: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  return request<T>(path, { method: "PATCH", data, ...config });
}

export async function del<T>(
  path: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return request<T>(path, { method: "DELETE", ...config });
}
