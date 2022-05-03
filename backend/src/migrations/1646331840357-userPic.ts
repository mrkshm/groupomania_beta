import {MigrationInterface, QueryRunner} from "typeorm";

export class userPic1646331840357 implements MigrationInterface {
    name = 'userPic1646331840357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "imageUrn" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "imageUrn"`);
    }

}
