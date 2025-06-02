import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1748854187898 implements MigrationInterface {
    name = 'InitialSchema1748854187898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`clinic\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`address\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`service\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`doctor\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`email\` varchar(255) NULL, \`phone\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`accessToken\` varchar(255) NOT NULL, \`refreshToken\` varchar(255) NOT NULL, \`accessTokenExpiresAt\` datetime NOT NULL, \`refreshTokenExpiresAt\` datetime NOT NULL, \`isBlocked\` tinyint NOT NULL DEFAULT 0, \`jti\` varchar(255) NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` enum ('admin', 'doctor', 'patient') NULL DEFAULT 'patient', \`firstName\` varchar(255) NULL, \`lastName\` varchar(255) NULL, \`phone\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`clinic_doctors_doctor\` (\`clinicId\` int NOT NULL, \`doctorId\` int NOT NULL, INDEX \`IDX_9eb54900314b95fdf7b5cd601e\` (\`clinicId\`), INDEX \`IDX_16baca4a1d55c887b503004ade\` (\`doctorId\`), PRIMARY KEY (\`clinicId\`, \`doctorId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`doctor_services_service\` (\`doctorId\` int NOT NULL, \`serviceId\` int NOT NULL, INDEX \`IDX_6a33991fca20b84269dc0ca32d\` (\`doctorId\`), INDEX \`IDX_6ad06b4880e3af4c6f0d0cf693\` (\`serviceId\`), PRIMARY KEY (\`doctorId\`, \`serviceId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`token\` ADD CONSTRAINT \`FK_94f168faad896c0786646fa3d4a\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`clinic_doctors_doctor\` ADD CONSTRAINT \`FK_9eb54900314b95fdf7b5cd601e9\` FOREIGN KEY (\`clinicId\`) REFERENCES \`clinic\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`clinic_doctors_doctor\` ADD CONSTRAINT \`FK_16baca4a1d55c887b503004ade9\` FOREIGN KEY (\`doctorId\`) REFERENCES \`doctor\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doctor_services_service\` ADD CONSTRAINT \`FK_6a33991fca20b84269dc0ca32dd\` FOREIGN KEY (\`doctorId\`) REFERENCES \`doctor\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`doctor_services_service\` ADD CONSTRAINT \`FK_6ad06b4880e3af4c6f0d0cf6930\` FOREIGN KEY (\`serviceId\`) REFERENCES \`service\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`doctor_services_service\` DROP FOREIGN KEY \`FK_6ad06b4880e3af4c6f0d0cf6930\``);
        await queryRunner.query(`ALTER TABLE \`doctor_services_service\` DROP FOREIGN KEY \`FK_6a33991fca20b84269dc0ca32dd\``);
        await queryRunner.query(`ALTER TABLE \`clinic_doctors_doctor\` DROP FOREIGN KEY \`FK_16baca4a1d55c887b503004ade9\``);
        await queryRunner.query(`ALTER TABLE \`clinic_doctors_doctor\` DROP FOREIGN KEY \`FK_9eb54900314b95fdf7b5cd601e9\``);
        await queryRunner.query(`ALTER TABLE \`token\` DROP FOREIGN KEY \`FK_94f168faad896c0786646fa3d4a\``);
        await queryRunner.query(`DROP INDEX \`IDX_6ad06b4880e3af4c6f0d0cf693\` ON \`doctor_services_service\``);
        await queryRunner.query(`DROP INDEX \`IDX_6a33991fca20b84269dc0ca32d\` ON \`doctor_services_service\``);
        await queryRunner.query(`DROP TABLE \`doctor_services_service\``);
        await queryRunner.query(`DROP INDEX \`IDX_16baca4a1d55c887b503004ade\` ON \`clinic_doctors_doctor\``);
        await queryRunner.query(`DROP INDEX \`IDX_9eb54900314b95fdf7b5cd601e\` ON \`clinic_doctors_doctor\``);
        await queryRunner.query(`DROP TABLE \`clinic_doctors_doctor\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`token\``);
        await queryRunner.query(`DROP TABLE \`doctor\``);
        await queryRunner.query(`DROP TABLE \`service\``);
        await queryRunner.query(`DROP TABLE \`clinic\``);
    }

}
