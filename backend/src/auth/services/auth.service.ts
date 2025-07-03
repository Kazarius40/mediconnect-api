import {
  BadRequestException,
  ConflictException,
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
import { TokenService } from './token.service';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from '../dto/register.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserRole } from 'src/users/user-role.enum';
import { SafeUser } from '../interfaces/safe-user.interface';
import { LoginDto } from '../dto/login.dto';
import { ITokens } from '../interfaces/tokens.interface';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { findOrFail } from '../../shared/utils/typeorm/find-or-fail.util';
import { handleDb } from '../../shared/utils/db/handle-db.util';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService,
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

    if (!adminEmail || !adminPassword) {
      return;
    }

    const tempDto = plainToInstance(RegisterDto, {
      email: adminEmail,
      password: adminPassword,
    });

    const errors = await validate(tempDto);
    if (errors.length > 0) {
      return;
    }

    const existingAdmin = await this.userRepository.findOneBy({
      role: UserRole.ADMIN,
    });
    if (!existingAdmin) {
      const adminUser = this.userRepository.create({
        email: adminEmail,
        password: adminPassword,
        role: UserRole.ADMIN,
      });
      await this.userRepository.save(adminUser);
    }
  }

  // -------------------
  // Registration & Authentication
  // -------------------
  async register(dto: RegisterDto): Promise<SafeUser> {
    const existingUser = await this.userRepository.findOneBy({
      email: dto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const user = this.userRepository.create({
      ...dto,
      role: UserRole.PATIENT,
    });

    await handleDb(() => this.userRepository.save(user));

    return this.toSafeUser(user);
  }

  async login(dto: LoginDto): Promise<ITokens> {
    const user = await this.validateUser(dto.email, dto.password);

    return await this.tokenService.generateAndSaveTokens(user);
  }

  // -------------------
  // User management
  // -------------------
  async updateUserRole(
    userId: number,
    newRole: UserRole,
    currentUserId?: number,
  ): Promise<SafeUser> {
    if (currentUserId === userId && newRole !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Admin cannot change their own role to a non-admin role.',
      );
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    user.role = newRole;
    await this.userRepository.save(user);

    return this.toSafeUser(user);
  }

  async findAllUsers(): Promise<SafeUser[]> {
    const users = await this.userRepository.find();
    return users.map((user) => this.toSafeUser(user));
  }

  async deleteUser(userId: number, currentUserId?: number): Promise<void> {
    if (userId === currentUserId) {
      throw new ForbiddenException('Admin cannot delete their own account.');
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    await handleDb(() => this.userRepository.remove(user));
  }

  // -------------------
  // Password management
  // -------------------
  async forgotPassword(
    dto: ForgotPasswordDto,
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

    await this.userRepository.save(user);

    return {
      message:
        'If a user with that email exists, a password reset link has been sent.',
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
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

  async findUserByIdOrFail(id: number): Promise<SafeUser> {
    const user = await findOrFail(this.userRepository, id);
    return this.toSafeUser(user);
  }

  private toSafeUser(user: User): SafeUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
