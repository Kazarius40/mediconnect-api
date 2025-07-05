import { Injectable, NotFoundException } from '@nestjs/common';
import { UserProfileResponse } from '../../swagger/responses/auth-response.swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { AuthUpdateProfileDto } from '../dto/auth-update-profile.dto';
import { SafeUser } from '../interfaces/safe-user.interface';
import { handleDb } from '../../shared/utils/db/handle-db.util';
import { validateEntityUniqueness } from '../../shared/validators/validate-entity-uniqueness.util';

@Injectable()
export class AuthProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getProfile(user: UserProfileResponse): UserProfileResponse {
    return user;
  }

  async updateProfile(
    id: number,
    dto: AuthUpdateProfileDto,
  ): Promise<SafeUser> {
    await validateEntityUniqueness(this.userRepository, dto, id);

    const user = await this.findUserOrFail(id);

    const filteredUpdates = Object.fromEntries(
      Object.entries(dto).filter(([, value]) => value !== undefined),
    );

    Object.assign(user, filteredUpdates);

    await handleDb(() => this.userRepository.save(user));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }

  private async findUserOrFail(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }
}
