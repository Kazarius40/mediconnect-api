import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRequest } from '../interfaces/user-request.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProfileService } from '../services/profile.service';
import { GetProfileDocs } from '../../swagger/methods/auth/auth/auth-profile-docs.swagger';

@ApiTags('Auth')
@Controller('auth')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @GetProfileDocs()
  getProfile(@Request() req: UserRequest) {
    return this.profileService.getProfile(req.user);
  }
}
