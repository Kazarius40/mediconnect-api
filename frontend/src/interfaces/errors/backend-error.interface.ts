export interface BackendError {
  field?: string;
  message: string;
}

export interface BackendErrorResponse {
  statusCode: number;
  errors?: BackendError[];
  message?: string | string[];
}
