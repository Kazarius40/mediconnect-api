import { MigrationInterface, QueryRunner } from "typeorm";

export class  ÐdritteMigration1749171403412 implements MigrationInterface {
    name = ' ÐdritteMigration1749171403412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('ADMIN', 'DOCTOR', 'PATIENT') NULL DEFAULT 'patient'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('ADMIN', 'DOCTOR', 'PATIENT') NULL DEFAULT 'PATIENT'`);
    }

}
