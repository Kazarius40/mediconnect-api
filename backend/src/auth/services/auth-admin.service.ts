import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { AuthTokenService } from './auth-token.service';
import { ConfigService } from '@nestjs/config';
import { AuthRegisterDto } from '../dto/auth-register.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserRole } from 'src/shared/enums/user-role.enum';
import { SafeUser } from '../interfaces/safe-user.interface';
import { AuthLoginDto } from '../dto/auth-login.dto';
import { ITokens } from '../interfaces/tokens.interface';
import { AuthForgotPasswordDto } from '../dto/auth-forgot-password.dto';
import { AuthResetPasswordDto } from '../dto/auth-reset-password.dto';
import { findOrFail } from '../../shared/utils/typeorm/find-or-fail.util';
import { handleDb } from '../../shared/utils/db/handle-db.util';
import { AuthAdminUpdateUserDto } from '../dto/auth-admin-update-user.dto';
import { validateEntityUniqueness } from '../../shared/validators/validate-entity-uniqueness.util';

@Injectable()
export class AuthAdminService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokenService: AuthTokenService,
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

  // -------------------
  // Registration & Authentication
  // -------------------
  async register(dto: AuthRegisterDto): Promise<SafeUser> {
    await validateEntityUniqueness(this.userRepository, dto);

    const user = this.userRepository.create({
      ...dto,
      role: UserRole.PATIENT,
    });

    await handleDb(() => this.userRepository.save(user));
    return this.toSafeUser(user);
  }

  async login(dto: AuthLoginDto): Promise<ITokens> {
    const user = await this.validateUser(dto.email, dto.password);
    return await this.tokenService.generateAndSaveTokens(user);
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.userRepository.find();
    return users.map((user) => this.toSafeUser(user));
  }

  async findOne(id: number): Promise<SafeUser> {
    const user = await findOrFail(this.userRepository, id);
    return this.toSafeUser(user);
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

    const filteredUpdates = Object.fromEntries(
      Object.entries(dto).filter(([, value]) => value !== undefined),
    );

    Object.assign(user, filteredUpdates);

    await handleDb(() => this.userRepository.save(user));

    return this.toSafeUser(user);
  }

  async delete(id: number, currentUserId?: number): Promise<void> {
    if (id === currentUserId) {
      throw new ForbiddenException('Admin cannot delete their own account.');
    }

    const user = await this.findUserOrFail(id);

    await handleDb(() => this.userRepository.remove(user));
  }

  // -------------------
  // Password management
  // -------------------
  async forgotPassword(
    dto: AuthForgotPasswordDto,
  ): Promise<{ message: string } | void> {
    const { email } = dto;
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;

    await handleDb(() => this.userRepository.save(user));

    return {
      message:
        'If a user with that email exists, a password reset link has been sent.',
    };
  }

  async resetPassword(dto: AuthResetPasswordDto): Promise<{ message: string }> {
    const { token, password } = dto;

    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await handleDb(() => this.userRepository.save(user));

    return { message: 'Password has been successfully reset.' };
  }

  // -------------------
  // Helpers
  // -------------------
  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  private toSafeUser(user: User): SafeUser {
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
