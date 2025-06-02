import { Injectable } from '@nestjs/common';
import { UserRequest } from './interfaces/user-request.interface';

@Injectable()
export class ProfileService {
  constructor() {}

  getProfile(user: UserRequest['user']) {
    return user;
  }
}
