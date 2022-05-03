import {MigrationInterface, QueryRunner} from "typeorm";

export class exposingPosts1647287301969 implements MigrationInterface {
    name = 'exposingPosts1647287301969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "username" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "username"`);
    }

}
