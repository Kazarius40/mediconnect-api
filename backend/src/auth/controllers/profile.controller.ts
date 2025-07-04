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
import { ProfileService } from '../services/profile.service';
import {
  GetProfileDocs,
  UpdateProfileDocs,
} from '../../swagger/methods/auth/auth/auth-profile-docs.swagger';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @GetProfileDocs()
  getProfile(@Request() req: UserRequest) {
    return this.profileService.getProfile(req.user);
  }

  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @UpdateProfileDocs()
  async updateProfile(
    @Request() req: UserRequest,
    @Body() dto: UpdateProfileDto,
  ) {
    return await this.profileService.updateProfile(req.user.id, dto);
  }
}
