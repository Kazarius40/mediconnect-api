import { MigrationInterface, QueryRunner } from 'typeorm';

export class MyMigration21752573790992 implements MigrationInterface {
  name = 'MyMigration21752573790992';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`ALTER TABLE \`token\` DROP COLUMN \`accessToken\``);
    await queryRunner.query(
      `ALTER TABLE \`clinic\` ADD UNIQUE INDEX \`IDX_b3df084998059e1f2f31bfd1e8\` (\`phone\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clinic\` ADD UNIQUE INDEX \`IDX_050033b437380ba808c041fe73\` (\`email\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_8e1f623798118e629b46a9e629\` (\`phone\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP INDEX \`IDX_8e1f623798118e629b46a9e629\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`clinic\` DROP INDEX \`IDX_050033b437380ba808c041fe73\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`clinic\` DROP INDEX \`IDX_b3df084998059e1f2f31bfd1e8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`token\` ADD \`accessToken\` varchar(255) NOT NULL`,
    );
  }
}
