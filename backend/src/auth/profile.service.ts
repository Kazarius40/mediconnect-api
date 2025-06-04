import { Injectable } from '@nestjs/common';
import { UserProfileResponse } from './swagger/auth-response.swagger';

@Injectable()
export class ProfileService {
  constructor() {}

  getProfile(user: UserProfileResponse): UserProfileResponse {
    return user;
  }
}
