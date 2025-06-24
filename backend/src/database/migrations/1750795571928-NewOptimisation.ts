import { MigrationInterface, QueryRunner } from "typeorm";

export class NewOptimisation1750795571928 implements MigrationInterface {
    name = 'NewOptimisation1750795571928'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('ADMIN', 'DOCTOR', 'PATIENT') NOT NULL DEFAULT 'patient'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('ADMIN', 'DOCTOR', 'PATIENT') NULL DEFAULT 'PATIENT'`);
    }

}
