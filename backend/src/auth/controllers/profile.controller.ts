import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRequest } from '../interfaces/user-request.interface';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserProfileResponse } from '../swagger/auth-response.swagger';
import { ProfileService } from '../services/profile.service';

@ApiTags('Auth')
@Controller('auth')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user profile data' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile data',
    type: UserProfileResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  getProfile(@Request() req: UserRequest) {
    return this.profileService.getProfile(req.user);
  }
}
