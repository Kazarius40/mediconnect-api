import { IsNotEmpty, IsString } from 'class-validator';
import { RefreshTokenSwagger } from '../../swagger/methods/auth/dto/refresh-token.dto.swagger';

export class AuthRefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  @RefreshTokenSwagger()
  refreshToken: string;
}
