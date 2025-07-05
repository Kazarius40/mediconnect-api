import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRequest } from '../interfaces/user-request.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthProfileService } from '../services/auth-profile.service';
import {
  GetProfileDocs,
  UpdateProfileDocs,
} from '../../swagger/methods/auth/auth/auth-profile-docs.swagger';
import { AuthUpdateProfileDto } from '../dto/auth-update-profile.dto';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
export class AuthProfileController {
  constructor(private readonly authProfileService: AuthProfileService) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @GetProfileDocs()
  getProfile(@Request() req: UserRequest) {
    return this.authProfileService.getProfile(req.user);
  }

  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @UpdateProfileDocs()
  async updateProfile(
    @Request() req: UserRequest,
    @Body() dto: AuthUpdateProfileDto,
  ) {
    return await this.authProfileService.updateProfile(req.user.id, dto);
  }
}
