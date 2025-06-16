import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
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
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserRole } from '../users/user-role.enum';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

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
    return safeUser;
  }

  async findAllUsers(): Promise<SafeUser[]> {
    const users = await this.userRepository.find();
    return users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safeUser } = user;
      return safeUser;
    });
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    await this.userRepository.remove(user);
  }

  async login(loginDto: LoginDto): Promise<ITokens> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    return await this.tokenService.generateAndSaveTokens(user);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto;
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;

    await this.userRepository.save(user);
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
      throw new BadRequestException('Invalid or expired password reset token');
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await this.userRepository.save(user);
  }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
