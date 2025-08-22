import api from './axios';

export interface RegisterDto {
  email: string;
  password: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

export const registerUser = (data: RegisterDto) =>
  api.post<{ message: string }>('/auth/register', data);

export const resendVerification = (data: { email: string }) =>
  api.post<{ message: string }>('/auth/resend-verification', data);

export const forgotPassword = (data: { email: string }) =>
  api.post<{ message: string }>('/auth/forgot-password', data);

export const resetPassword = (data: ResetPasswordDto) =>
  api.post<{ message: string }>('/auth/reset-password', data);

export const verifyEmail = (data: { token: string }) =>
  api.post<{ message: string }>('/auth/verify-email', data);
