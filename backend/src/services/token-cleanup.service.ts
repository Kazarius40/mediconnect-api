import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../auth/entities/token.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TokenCleanupService {
  private readonly logger = new Logger(TokenCleanupService.name);

  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  @Cron('*/5 * * * *')
  // @Cron(CronExpression.EVERY_6_HOURS)
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

    this.logger.log(`Видалено токенів: ${deleteResult.affected || 0}`);
  }
}
