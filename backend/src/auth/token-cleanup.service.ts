import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TokenCleanupService {
  private readonly logger = new Logger(TokenCleanupService.name);

  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {
    const schedule = '0 * * * *';
    this.logger.log(`Заплановане очищення токенів: ${schedule}`);
  }

  @Cron('0 * * * *')
  async handleCron() {
    const now = new Date();

    const deleteResult = await this.tokenRepository
      .createQueryBuilder()
      .delete()
      .where('accessTokenExpiresAt <= :now OR isBlocked = :blocked', {
        now,
        blocked: true,
      })
      .execute();

    this.logger.log(`Видалено токенів: ${deleteResult.affected || 0}`);
  }
}
