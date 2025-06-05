import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1749083014512 implements MigrationInterface {
    name = 'InitialMigration1749083014512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`clinic\` ADD \`phone\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`clinic\` ADD \`email\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`clinic\` CHANGE \`address\` \`address\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`service\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`service\` ADD \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`doctor\` CHANGE \`phone\` \`phone\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('ADMIN', 'DOCTOR', 'PATIENT') NULL DEFAULT 'patient'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('ADMIN', 'DOCTOR', 'PATIENT') NULL DEFAULT 'PATIENT'`);
        await queryRunner.query(`ALTER TABLE \`doctor\` CHANGE \`phone\` \`phone\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`service\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`service\` ADD \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`clinic\` CHANGE \`address\` \`address\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`clinic\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`clinic\` DROP COLUMN \`phone\``);
    }

}
