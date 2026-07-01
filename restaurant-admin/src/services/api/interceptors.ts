import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestHeaders,
} from "axios";

import { authStorage } from "@/services/storage/authStorage";

export function setupInterceptors(api: AxiosInstance) {
  api.interceptors.request.use((config) => {
    const token = authStorage.getToken();

    if (token) {
      config.headers = config.headers ?? ({} as AxiosRequestHeaders);
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        authStorage.clear();

        window.location.href = "/login";
      }

      return Promise.reject(error);
    }
  );
}