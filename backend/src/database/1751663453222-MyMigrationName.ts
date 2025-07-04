import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigrationName1751663453222 implements MigrationInterface {
    name = 'MyMigrationName1751663453222'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`clinic\` ADD UNIQUE INDEX \`IDX_b3df084998059e1f2f31bfd1e8\` (\`phone\`)`);
        await queryRunner.query(`ALTER TABLE \`clinic\` ADD UNIQUE INDEX \`IDX_050033b437380ba808c041fe73\` (\`email\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`clinic\` DROP INDEX \`IDX_050033b437380ba808c041fe73\``);
        await queryRunner.query(`ALTER TABLE \`clinic\` DROP INDEX \`IDX_b3df084998059e1f2f31bfd1e8\``);
    }

}
