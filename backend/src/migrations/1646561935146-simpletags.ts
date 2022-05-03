import {MigrationInterface, QueryRunner} from "typeorm";

export class simpletags1646561935146 implements MigrationInterface {
    name = 'simpletags1646561935146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "imageUrn"`);
        await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "bannerUrn"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" ADD "bannerUrn" character varying`);
        await queryRunner.query(`ALTER TABLE "tags" ADD "imageUrn" character varying`);
        await queryRunner.query(`ALTER TABLE "tags" ADD "title" character varying NOT NULL`);
    }

}
