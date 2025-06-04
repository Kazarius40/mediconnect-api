import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ITokens } from './interfaces/tokens.interface';
import { SafeUser } from './interfaces/safe-user.interface';
import { TokenService } from './token.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserRole } from '../users/user-role.enum';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.createInitialAdmin();
  }

  private async createInitialAdmin(): Promise<void> {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    this.logger.debug(`[DEBUG] ADMIN_EMAIL from .env: '${adminEmail}'`);
    this.logger.debug(
      `[DEBUG] ADMIN_PASSWORD from .env: '${adminPassword}' (Length: ${adminPassword?.length})`,
    );

    if (!adminEmail || !adminPassword) {
      this.logger.warn(
        'ADMIN_EMAIL or ADMIN_PASSWORD not set in environment variables. Initial admin will not be created automatically.',
      );
      return;
    }

    const tempDto = plainToInstance(RegisterDto, {
      email: adminEmail,
      password: adminPassword,
    });

    const errors = await validate(tempDto);
    if (errors.length > 0) {
      this.logger.warn(
        'Initial admin was NOT created due to invalid ADMIN_EMAIL or ADMIN_PASSWORD format. Check your .env file.',
      );
      this.logger.debug(errors);
      return;
    }

    const existingAdmin = await this.userRepository.findOneBy({
      role: UserRole.ADMIN,
    });
    if (!existingAdmin) {
      this.logger.log('No admin user found. Creating initial admin...');
      const adminUser = this.userRepository.create({
        email: adminEmail,
        password: adminPassword,
        role: UserRole.ADMIN,
      });
      await this.userRepository.save(adminUser);
      this.logger.log(`Initial admin user created with email: ${adminEmail}`);
    } else {
      this.logger.log('Admin user already exists.');
    }
  }

  async register(registerDto: RegisterDto): Promise<SafeUser> {
    const existingUser = await this.userRepository.findOneBy({
      email: registerDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const user = this.userRepository.create({
      ...registerDto,
      role: UserRole.PATIENT,
    });

    await this.userRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    this.logger.log(`User registered: ${user.email}`);
    return safeUser;
  }

  async updateUserRole(userId: number, newRole: UserRole): Promise<SafeUser> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    user.role = newRole;
    await this.userRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    this.logger.log(`User role updated: ${user.email} to ${newRole}`);
    return safeUser;
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    await this.userRepository.remove(user);
    this.logger.log(`User with ID ${userId} deleted.`);
  }

  async login(loginDto: LoginDto): Promise<ITokens> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const tokens = await this.tokenService.generateAndSaveTokens(user);

    this.logger.log(`User logged in: ${user.email}`);
    return tokens;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto;
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      this.logger.warn(
        `Attempted password reset for non-existent email: ${email}`,
      );
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;

    await this.userRepository.save(user);

    this.logger.log(`Password reset token generated for user: ${email}`);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, password } = resetPasswordDto;

    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      this.logger.warn(`Invalid or expired password reset token: ${token}`);
      throw new BadRequestException('Invalid or expired password reset token');
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await this.userRepository.save(user);

    this.logger.log(`Password reset successfully for user: ${user.email}`);
  }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user || !(await user.validatePassword(password))) {
      this.logger.warn(`Failed login attempt for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
