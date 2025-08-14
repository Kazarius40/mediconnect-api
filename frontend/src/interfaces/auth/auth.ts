// DTOs
export interface RegisterDto {
  email: string;
  password: string;
}

export interface ResendVerificationDto {
  email: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

export interface VerifyEmailDto {
  token: string;
}

// Responses
export interface MessageResponse {
  message: string;
}
