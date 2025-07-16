import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../entities/token.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User } from '../entities/user.entity';

@Injectable()
export class TokenCleanupService {
  private readonly logger = new Logger(TokenCleanupService.name);

  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.logger.log(`Scheduled token cleanup: ${CronExpression.EVERY_HOUR}`);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    const now = new Date();

    const deleteResult = await this.tokenRepository
      .createQueryBuilder()
      .delete()
      .where('refreshTokenExpiresAt <= :now OR isBlocked = :blocked', {
        now,
        blocked: true,
      })
      .execute();

    this.logger.log(`Cleaned up tokens: ${deleteResult.affected || 0}`);

    const updateResult = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        resetPasswordToken: null,
        resetPasswordExpires: null,
      })
      .where('resetPasswordExpires <= :now', { now })
      .execute();

    this.logger.log(
      `Cleared expired reset password tokens: ${updateResult.affected || 0}`,
    );
  }
}
