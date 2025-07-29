// import { getProfile, refreshToken } from '@/api/client/auth';
// import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
// import { useAuth } from '@/providers/AuthProvider';
//
// interface PendingRequest {
//   resolve: (token?: string) => void;
//   reject: (error: unknown) => void;
// }
//
// type RetryableRequestConfig = AxiosRequestConfig & { _retry?: boolean };
//
// class TokenRefreshHandler {
//   private isRefreshing = false;
//   private failedQueue: PendingRequest[] = [];
//
//   addRequest(request: PendingRequest) {
//     this.failedQueue.push(request);
//   }
//
//   processQueue(error: unknown, token: string | null = null) {
//     this.failedQueue.forEach(({ resolve, reject }) => {
//       if (error) reject(error);
//       else resolve(token ?? undefined);
//     });
//     this.failedQueue = [];
//   }
//
//   getRefreshing() {
//     return this.isRefreshing;
//   }
//
//   setRefreshing(value: boolean) {
//     this.isRefreshing = value;
//   }
// }
//
// const tokenRefreshHandler = new TokenRefreshHandler();
//
// export function addAuthInterceptor(api: AxiosInstance) {
//   const { accessToken: token } = useAuth();
//
//   api.interceptors.request.use(
//     async (config) => {
//       // const token = await getAccessTokenCookie();
//
//       if (token && config.headers) {
//         config.headers['Authorization'] = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error),
//   );
//
//   api.interceptors.response.use(
//     (response) => response,
//     async (error: AxiosError) => {
//       const originalRequest = error.config as RetryableRequestConfig;
//
//       if (
//         error.response?.status === 401 &&
//         originalRequest &&
//         !originalRequest._retry &&
//         !originalRequest.url?.includes('/auth/login') &&
//         !originalRequest.url?.includes('/auth/register') &&
//         !originalRequest.url?.includes('/auth/refresh') &&
//         !originalRequest.url?.includes('/auth/reset-password')
//       ) {
//         if (tokenRefreshHandler.getRefreshing()) {
//           return new Promise((resolve, reject) => {
//             tokenRefreshHandler.addRequest({ resolve, reject });
//           }).then((token) => {
//             if (token && originalRequest.headers) {
//               originalRequest.headers['Authorization'] = 'Bearer ' + token;
//             }
//             return api(originalRequest);
//           });
//         }
//
//         originalRequest._retry = true;
//         tokenRefreshHandler.setRefreshing(true);
//
//         try {
//           const response = await refreshToken();
//           const { accessToken } = response.data;
//
//           setAccessTokenCookie(accessToken);
//
//           const profileRes = await getProfile();
//           if (onAuthRefreshSuccess) {
//             onAuthRefreshSuccess(profileRes.data);
//           }
//
//           if (originalRequest.headers) {
//             originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
//           }
//
//           tokenRefreshHandler.processQueue(null, accessToken);
//           return api(originalRequest);
//         } catch (err) {
//           tokenRefreshHandler.processQueue(err, null);
//
//           if (onAuthRefreshSuccess) {
//             onAuthRefreshSuccess(null);
//           }
//
//           clearAccessTokenCookie();
//
//           return Promise.reject(err);
//         } finally {
//           tokenRefreshHandler.setRefreshing(false);
//         }
//       }
//
//       return Promise.reject(error);
//     },
//   );
// }
