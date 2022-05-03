import {MigrationInterface, QueryRunner} from "typeorm";

export class userbody1646490457495 implements MigrationInterface {
    name = 'userbody1646490457495'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "body" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "body"`);
    }

}
