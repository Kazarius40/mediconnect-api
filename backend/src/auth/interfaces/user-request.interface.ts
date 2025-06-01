export interface UserRequest extends Request {
  user: {
    userId: number;
    email: string;
    jti: string;
  };
}
