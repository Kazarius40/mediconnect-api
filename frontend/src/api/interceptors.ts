import { getCookie, setCookie } from '@/utils/cookies/cookies.util';
import { refreshToken } from '@/api/auth';
import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { isPublicPath } from '@/utils/routes/publicPaths';

interface PendingRequest {
  resolve: (token?: string) => void;
  reject: (error: unknown) => void;
}

type RetryableRequestConfig = AxiosRequestConfig & { _retry?: boolean };

class TokenRefreshHandler {
  private isRefreshing = false;
  private failedQueue: PendingRequest[] = [];

  addRequest(request: PendingRequest) {
    this.failedQueue.push(request);
  }

  processQueue(error: unknown, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) reject(error);
      else resolve(token ?? undefined);
    });
    this.failedQueue = [];
  }

  getRefreshing() {
    return this.isRefreshing;
  }

  setRefreshing(value: boolean) {
    this.isRefreshing = value;
  }
}

const tokenRefreshHandler = new TokenRefreshHandler();

export function addAuthInterceptor(api: AxiosInstance) {
  api.interceptors.request.use((config) => {
    const token = getCookie('accessToken');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequestConfig;

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('/auth/login') &&
        !originalRequest.url?.includes('/auth/register') &&
        !originalRequest.url?.includes('/auth/refresh') &&
        !originalRequest.url?.includes('/auth/reset-password')
      ) {
        if (tokenRefreshHandler.getRefreshing()) {
          return new Promise((resolve, reject) => {
            tokenRefreshHandler.addRequest({ resolve, reject });
          }).then((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
            }
            return api(originalRequest);
          });
        }

        originalRequest._retry = true;
        tokenRefreshHandler.setRefreshing(true);

        try {
          const response = await refreshToken();
          const { accessToken } = response.data;

          setCookie('accessToken', accessToken, {
            sameSite: 'Lax',
            maxAge: 3600,
            secure: process.env.NODE_ENV === 'production',
          });

          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
          }
          tokenRefreshHandler.processQueue(null, accessToken);
          return api(originalRequest);
        } catch (err) {
          tokenRefreshHandler.processQueue(err, null);

          if (
            typeof window !== 'undefined' &&
            window.location.pathname !== '/auth/login' &&
            !isPublicPath(window.location.pathname)
          ) {
            window.location.href = '/auth/login';
          }

          return Promise.reject(err);
        } finally {
          tokenRefreshHandler.setRefreshing(false);
        }
      }

      return Promise.reject(error);
    },
  );
}
