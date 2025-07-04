import { Injectable, NotFoundException } from '@nestjs/common';
import { UserProfileResponse } from '../../swagger/responses/auth-response.swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { SafeUser } from '../interfaces/safe-user.interface';
import { handleDb } from '../../shared/utils/db/handle-db.util';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getProfile(user: UserProfileResponse): UserProfileResponse {
    return user;
  }

  async updateProfile(id: number, dto: UpdateProfileDto): Promise<SafeUser> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    Object.assign(user, dto);

    await handleDb(() => this.userRepository.save(user));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
