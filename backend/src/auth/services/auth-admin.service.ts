import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthRegisterDto } from '../dto/auth-register.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserRole } from 'src/shared/enums/user-role.enum';
import { SafeUser } from '../interfaces/safe-user.interface';
import { findOrFail } from '../../shared/utils/typeorm/find-or-fail.util';
import { handleDb } from '../../shared/utils/db/handle-db.util';
import { AuthAdminUpdateUserDto } from '../dto/auth-admin-update-user.dto';
import { validateEntityUniqueness } from '../../shared/validators/validate-entity-uniqueness.util';
import { toSafeUser } from '../../shared/utils/entity/user.util';

@Injectable()
export class AuthAdminService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.createInitialAdmin();
  }

  // -------------------
  // Initialization
  // -------------------
  private async createInitialAdmin(): Promise<void> {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (!adminEmail || !adminPassword) return;

    const tempDto = plainToInstance(AuthRegisterDto, {
      email: adminEmail,
      password: adminPassword,
    });

    const errors = await validate(tempDto);
    if (errors.length > 0) return;

    const existingAdmin = await this.userRepository.findOneBy({
      role: UserRole.ADMIN,
    });
    if (!existingAdmin) {
      const adminUser = this.userRepository.create({
        email: adminEmail,
        password: adminPassword,
        role: UserRole.ADMIN,
      });
      await handleDb(() => this.userRepository.save(adminUser));
    }
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.userRepository.find();
    return users.map((user) => toSafeUser(user));
  }

  async findOne(id: number): Promise<SafeUser> {
    const user = await findOrFail(this.userRepository, id, {
      relations: ['tokens'],
    });
    return toSafeUser(user);
  }

  async update(
    id: number,
    dto: Partial<AuthAdminUpdateUserDto & { role?: UserRole }>,
    currentUserId?: number,
  ): Promise<SafeUser> {
    await validateEntityUniqueness(this.userRepository, dto, id);

    const user = await this.findUserOrFail(id);

    if (
      dto.role !== undefined &&
      currentUserId === id &&
      dto.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException(
        'Admin cannot change their own role to a non-admin role.',
      );
    }

    const updateKeys: Array<
      keyof (AuthAdminUpdateUserDto & { role?: UserRole })
    > = Object.keys(dto) as Array<
      keyof (AuthAdminUpdateUserDto & { role?: UserRole })
    >;

    for (const key of updateKeys) {
      let value = dto[key];

      if (value === undefined) continue;

      if (typeof value === 'string') {
        value = value.trim();
        if (value === '') continue;
      }

      if (key in user) {
        if (key === 'role') {
          user.role = value as UserRole;
        } else {
          user[key] = value;
        }
      }
    }

    await handleDb(() => this.userRepository.save(user));

    return toSafeUser(user);
  }

  async delete(id: number, currentUserId?: number): Promise<void> {
    if (id === currentUserId) {
      throw new ForbiddenException('Admin cannot delete their own account.');
    }

    const user = await this.findUserOrFail(id);

    await handleDb(() => this.userRepository.remove(user));
  }

  private async findUserOrFail(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }
}
