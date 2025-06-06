import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1749169558801 implements MigrationInterface {
    name = 'FirstMigration1749169558801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('ADMIN', 'DOCTOR', 'PATIENT') NULL DEFAULT 'patient'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('ADMIN', 'DOCTOR', 'PATIENT') NULL DEFAULT 'PATIENT'`);
    }

}
