import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ITokens } from './interfaces/tokens.interface';
import { SafeUser } from './interfaces/safe-user.interface';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService,
  ) {}

  async register(registerDto: RegisterDto): Promise<SafeUser> {
    const existingUser = await this.userRepository.findOneBy({
      email: registerDto.email,
    });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const user = this.userRepository.create(registerDto);
    await this.userRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    this.logger.log(`User registered: ${user.email}`);
    return safeUser;
  }

  async login(loginDto: LoginDto): Promise<ITokens> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const tokens = await this.tokenService.generateAndSaveTokens(user);

    this.logger.log(`User logged in: ${user.email}`);
    return tokens;
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
