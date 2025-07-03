import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1751402292891 implements MigrationInterface {
    name = 'Migrations1751402292891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('ADMIN', 'DOCTOR', 'PATIENT') NOT NULL DEFAULT 'patient'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('ADMIN', 'DOCTOR', 'PATIENT') NOT NULL DEFAULT 'PATIENT'`);
    }

}
