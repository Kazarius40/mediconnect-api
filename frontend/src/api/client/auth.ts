import {
  ForgotPasswordDto,
  MessageResponse,
  RegisterDto,
  ResendVerificationDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from '@/interfaces/auth/auth';
import api from '../axios';

export const registerUser = (data: RegisterDto) =>
  api.post<MessageResponse>('/auth/register', data);

export const resendVerification = (data: ResendVerificationDto) =>
  api.post<MessageResponse>('/auth/resend-verification', data);

export const forgotPassword = (data: ForgotPasswordDto) =>
  api.post<MessageResponse>('/auth/forgot-password', data);

export const resetPassword = (data: ResetPasswordDto) =>
  api.post<MessageResponse>('/auth/reset-password', data);

export const verifyEmail = (data: VerifyEmailDto) =>
  api.post<MessageResponse>('/auth/verify-email', data);
