import { Injectable } from '@nestjs/common';
import { UserProfileResponse } from '../../swagger/responses/auth-response.swagger';

@Injectable()
export class ProfileService {
  constructor() {}

  getProfile(user: UserProfileResponse): UserProfileResponse {
    return user;
  }
}
