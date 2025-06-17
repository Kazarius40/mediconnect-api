import { MigrationInterface, QueryRunner } from 'typeorm';

export class вduoMigration1749170078944 implements MigrationInterface {
  name = ' вduoMigration1749170078944';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('ADMIN', 'DOCTOR', 'PATIENT') NULL DEFAULT 'patient'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('ADMIN', 'DOCTOR', 'PATIENT') NULL DEFAULT 'PATIENT'`,
    );
  }
}
