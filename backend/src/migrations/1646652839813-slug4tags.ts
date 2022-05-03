import {MigrationInterface, QueryRunner} from "typeorm";

export class slug4tags1646652839813 implements MigrationInterface {
    name = 'slug4tags1646652839813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" ADD "slug" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tags" ADD CONSTRAINT "UQ_b3aa10c29ea4e61a830362bd25a" UNIQUE ("slug")`);
        await queryRunner.query(`CREATE INDEX "IDX_b3aa10c29ea4e61a830362bd25" ON "tags" ("slug") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_b3aa10c29ea4e61a830362bd25"`);
        await queryRunner.query(`ALTER TABLE "tags" DROP CONSTRAINT "UQ_b3aa10c29ea4e61a830362bd25a"`);
        await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "slug"`);
    }

}
