import {MigrationInterface, QueryRunner} from "typeorm";

export class exposing1647287541500 implements MigrationInterface {
    name = 'exposing1647287541500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "username" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "username"`);
    }

}
